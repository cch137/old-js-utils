const chee = require('../index');

console.log('This is a test.');

console.log(chee.crypto.caesar.encryp('Hello World!'));
console.log(chee.crypto.caesar.decryp(chee.crypto.caesar.encryp('Hello World!')));