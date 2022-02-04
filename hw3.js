const fs = require('fs');
const readLine = require('readline');

const ACCESS_LOG = './access.log';
const IP1_LOG = 'logs/89.123.1.41_requests.log';
const IP2_LOG = 'logs/34.48.240.111_requests.log';

const readStream = fs.createReadStream(ACCESS_LOG, 'utf8');
const writeStreamIP1 = fs.createWriteStream(IP1_LOG, 'utf8');
const writeStreamIP2 = fs.createWriteStream(IP2_LOG, 'utf8');

let numStr = 0;

const rl = readLine.createInterface({
    input: readStream,
    output: true
});

rl.on('line', (line) => {

    if (/89\.123\.1\.41/.test(line)) {
        writeStreamIP1.write("\n");
        writeStreamIP1.write(line);
    }

    if (/34\.48\.240\.111/.test(line)) {
        writeStreamIP2.write("\n");
        writeStreamIP2.write(line);
    }

    console.clear();
    console.log('Обработано ' + ++numStr + ' строк');

});