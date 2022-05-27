const fs = require('fs');
const path = require('path');
const process = require('process');
const {loadConfig} = require('use-config-json');

const defaultConfig = {
  INPUT_FILE: null
};

const config = loadConfig(defaultConfig);

/**
  Ignore default config
**/
if (!config.INPUT_FILE) {
  throw new Error('Please check your .env file');
}

const file = fs.readFileSync(config.INPUT_FILE, { encoding: 'utf8' });
const parsed = file.split(/\r?\n/).map(f => f.replace(',', '')).map(f => new URL(f).host.split(':')[0]);

/**
  Since multi-ping doesn't support tor connections yet, build a list to exclude onion outputs
**/

const parsed_withOnion = parsed.filter(p => p.includes('.onion') === true);
const parsed_withoutOnion = parsed.filter(p => p.includes('.onion') === false);

fs.writeFileSync(path.join(process.cwd(), `${config.INPUT_FILE.split('.')[0]}_parsed.txt`), parsed_withoutOnion.join(',\n'), { encoding: 'utf8' });
if (parsed_withOnion.length > 0) {
  fs.writeFileSync(path.join(process.cwd(), `${config.INPUT_FILE.split('.')[0]}_parsed_onion.txt`), parsed_withOnion.join(',\n'), { encoding: 'utf8' });
}
console.log(`Wrote parsed output to ${config.INPUT_FILE.split('.')[0]}_parsed.txt`);
