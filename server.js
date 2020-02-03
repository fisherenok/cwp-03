const net = require('net');
const fs = require('fs');
const port = 8124;
const bad = 'DEC';
const good = 'ACK';
const log = fs.createWriteStream('clientLog.log');
const maxClients = process.env.MAX_NUMBER_OF_CLIENTS || 3;
const reqClient = 'QA';
let seed = 0;
let numOfClients = 0;

const server = net.createServer((client) => {
    if (++numOfClients > maxClients) {
        client.write(bad)
        console.log('Exceeded the number of customers!!!')
    }

    console.log(numOfClients + 'Clients connected');
    client.setEncoding('utf8');

    client.on('data', (data) => {
         if (data === reqClient) {
            client.id = Date.now() + seed++;
            log.write(`Client (${client.id}) - connected\n`);
            client.write(data === reqClient ? good : bad);
        } else if (data !== reqClient) {
            log.write(`Client (${client.id}) has asked: ${data}\n`);
            const answer = generateAns();
            log.write(`Server answer Client (${client.id}): ${answer}\n`);
            client.write(answer);
        }
    });

    client.on('end', () => {
        log.write(`Client (${client.id}) - disconnected\n`);
        console.log('Client disconnected\n');
    });
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});

function generateAns() {
    return Math.random() > 0.5 ? '1' : '0';
}
