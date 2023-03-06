const chee = require('../');
const MT = require('../random').mt;
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`~!@#$%^&*()=+\t[{]}|\\:;"\'<,>.?/ \n';

const caesar = {
  encryp: (text, cipher=chee.SECRET_KEY||'helloworld') => {
    const mt = MT.new(cipher);
    const shuffledOrder = MT.shuffle(charset, mt);
    const result = [];
    for (const i of text.split('')) {
      const k = charset.indexOf(i);
      result.push(k == -1 ? i : shuffledOrder[k]);
      shuffledOrder.push(shuffledOrder.shift());
    }
    return result.join('');
  },
  decryp: (text, cipher=chee.SECRET_KEY||'helloworld') => {
    const mt = MT.new(cipher);
    const shuffledOrder = MT.shuffle(charset, mt);
    const result = [];
    for (const i of text.split('')) {
      const k = shuffledOrder.indexOf(i);
      result.push(k == -1 ? i : charset[k]);
      shuffledOrder.push(shuffledOrder.shift());
    }
    return result.join('');
  }
}

module.exports = caesar;