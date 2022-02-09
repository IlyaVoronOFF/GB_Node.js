#!/usr/local/bin/node

const fs = require('fs/promises');
const { lstatSync } = require('fs');
const fsStream = require('fs');
const readLine = require('readline');
const path = require('path');
const inquirer = require('inquirer');

const IP1_LOG = 'logs/89.123.1.41_requests.log';
const IP2_LOG = 'logs/34.48.240.111_requests.log';
const IP1_REG = /89\.123\.1\.41/;
const IP2_REG = /34\.48\.240\.111/;


let executionDir = process.cwd();

const rlQuestion = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = async(query) => new Promise(resolve => rlQuestion.question(query, resolve));
(async() => {
    const filePath = await question('Для перехода в другую директорию укажите путь или пропустите, чтобы перейти в текущую: ');
    executionDir = path.resolve(executionDir, filePath);

    rlQuestion.close();
    run();
})();

class ListItem {
    constructor(path, fileName) {
        this.path = path;
        this.fileName = fileName;
    }

    get isDir() {
        return lstatSync(this.path).isDirectory();
    }
}

const run = async() => {

    const list = await fs.readdir(executionDir);
    const items = list.map(fileName =>
        new ListItem(path.join(executionDir, fileName), fileName));

    const item = await inquirer.prompt([{
        name: 'fileName',
        type: 'list',
        message: `Путь: ${executionDir}`,
        choices: items.map(item => ({ name: item.fileName, value: item }))
    }]).then(answer => answer.fileName);

    if (item.isDir) {
        executionDir = item.path;
        return await run();
    } else {
        const data = await fs.readFile(item.path, 'utf-8');

        if (IP1_REG.test(data) || IP2_REG.test(data)) {
            let numAll = 0;

            const rl = readLine.createInterface({
                input: fsStream.createReadStream(item.path, 'utf8'),
                output: true
            });

            rl.on('line', (line) => {
                if (!fsStream.existsSync('logs')) {
                    fs.mkdir('logs');
                }

                if (IP1_REG.test(line)) {
                    const writeStreamIP1 = fsStream.createWriteStream(IP1_LOG, { flags: 'a', encoding: 'utf8' });
                    writeStreamIP1.write("\n" + line);
                }

                if (IP2_REG.test(line)) {
                    const writeStreamIP2 = fsStream.createWriteStream(IP2_LOG, { flags: 'a', encoding: 'utf8' });
                    writeStreamIP2.write("\n" + line);
                }

                console.clear();
                console.log('Обработано ' + ++numAll + ' строк');
            });
        } else {
            console.log(data);
        }
    }
}