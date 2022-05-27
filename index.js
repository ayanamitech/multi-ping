const fs   = require('fs');
const ping = require('tcp-ping');
const dns = require('dns');
const dnsPromises = dns.promises;
const {loadConfig} = require('use-config-json');

const defaultConfig = {
  INPUT_FILE: null,
  PORT: null
};

const config = loadConfig(defaultConfig);

/**
  Ignore default config
**/
if (!config.INPUT_FILE || !config.PORT) {
  throw new Error('Please check your .env file');
}

const queryHost = async (host) => {
  try {
    const { address: ip } = await dnsPromises.lookup(host);
    const { port, average } = await ping.pingAsync({address: ip, port: config.PORT, attempts: 3});
    console.log(ip, Math.floor(average) + 'ms');
    return {
      host,
      ip,
      port,
      average: Math.floor(average)
    };
  } catch (e) {
    console.error(e);
    return;
  }
};

const run = async () => {
  let result = [];
  let hosts = fs.readFileSync(config.INPUT_FILE, {encoding: 'utf8'}).toString().replace(/\r\n/g,'\n').split('\n');
  // remove empty line from array;
  hosts = hosts.filter(h => h);
  for (const host of hosts) {
    const query = await queryHost(host);
    result.push(query);
  }
  // remove failed results from array;
  result = result.filter(r => r);
  // sort servers by latency.
  result = result.sort((a, b) => parseFloat(a.average) - parseFloat(b.average));
  // return sorted list of addresses by the average latency.
  result.map(({ ip }) => {
    console.log(ip + ':' + config.PORT);
  });
};
run();
