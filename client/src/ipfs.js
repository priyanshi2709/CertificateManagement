// const Ipfs = require("ipfs-api");
// const ip = new Ipfs({ host: "ipfs.infura.io", port: 5001, protocol: "https" });
// export default ip;

import { create } from 'ipfs-http-client';

/* Create an instance of the client */
const client = create('https://ipfs.infura.io:5001/api/v0');

export default client;