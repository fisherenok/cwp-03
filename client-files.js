const net = require('net');
const fs = require('fs');
const shuffle = require('shuffle-array');
const strFile = 'FILE'
const port = 8124;
const bad = 'DEC';
const good = 'ACK';
const reqClient = 'QA';
let qa = [];
let idx = -1;

const client = new net.Socket();
client.setEncoding('utf8');

client.connect(port, function () {
    client.write(strFile);
    console.log('Connect');
});

