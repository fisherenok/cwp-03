const net = require('net');
const fs = require('fs');
const path = require('path')
const strFile = 'FILE'
const port = 8124;
const bad = 'DEC';
const good = 'ACK';
const directories = process.argv.slice(2);
let files = [];
let idx = -1;

const client = new net.Socket();
client.setEncoding('utf8');

client.connect(port, function () {
    client.write(strFile);
    console.log('Connect');
});

client.on("data", function(data) {
    if (data === good) {
        directories.forEach((value) => {
            ReadFilesInDirectory(value);
        });
        sendFilesToServer();
    }
    if (data === bad) {
        client.destroy();
    }
    if (data === "ФАЙЛ ПРИНЯЛ" && files.length !== 0) {
        sendFilesToServer();
    }
    if (files.length === 0) {
        client.end();
    }
})

client.on("close", function() {
    console.log("Connection closed");
})

function ReadFilesInDirectory(dirPath) {
    fs.readdirSync(dirPath).forEach((value) => {
        let filePath = path.normalize(dirPath + path.sep + value);
        if(fs.statSync(filePath).isFile()) {
            files.push(filePath);
        } else {
            ReadFilesInDirectory(filePath);
        }
    })
}
function sendFilesToServer() {
    let file = files.shift();
    console.log(file);
    console.log(fs.readFileSync(file));
    console.log("--------------");
    client.write(fs.readFileSync(file));
}