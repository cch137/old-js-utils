const path = require('path');
const fs = require('fs');
const chee = require('../index');
const serialize = require('serialize-javascript');

console.log('This is a test.');

const script = `const chee = ${serialize(chee.frontendPack())};window.chee = chee;export default chee;`;
fs.writeFileSync(path.join(__dirname, './main.js'), script);

console.log(chee.crypto.caesar.decryp(chee.crypto.caesar.encryp('Hello World!', '1234'), '1234'));