# multi-ping

Simple TCP latency measurement tool using [tcp-ping](https://github.com/mtrusczyk/tcp-ping) with asynchronous Node.js script. Supports examing latency from multiple list of servers from `servers.txt`.

## Install

Install Node.js on your computer, hosted script tested with Node.js 12.x and 14.x. LTS version of Node.js is recommended.

```bash
# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

If completed, clone the repository using `git clone --depth 1` or download the archive file, locate to the cloned directory using `cd multi-ping` and fetch node.js libraries.

```
npm i
```

## Configure & Run

`run.js` script will auto ping nodes from `servers.txt`, and filter nodes with latency measurements & tcp ports defined on the script.

Default port is set to `18080` and default server list is set to `servers.txt` so if you need to ping different port from servers make sure to change this value from `.env` file.

```js
INPUT_FILE="servers.txt"
PORT=18080
```

The script will automatically convert domain addresses to A record, so if you need raw results with domain defined make sure to comment the following code.

```js
const ip = await lookupHost(host);
const { port, average } = await pingServers(ip);
}
```

Run the following command to start

```bash
npm start
```

Script will log ip addresses of the nodes, and finally give the list of nodes with `ip:port` format sorted by the tested latency.

If you need alternative format, make sure to change the last line of the code to the format you want.

```js
console.log(ip + ":" + PORT);
```
