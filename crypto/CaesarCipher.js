const { MT, shuffle } = require('../random');


const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`~!@#$%^&*()=+\t[{]}|\\:;"\'<,>.?/ \n';

const caesar = {
  /** @param {String} text @param  {...Number} ciphers */
  e: (text, ...ciphers) => { // 加密
    ciphers = ciphers.flat();
    /** @type {undefined|String[]} */
    let finalResult;
    ciphers.forEach(cipher => {
      const charList = finalResult || text.split('');
      const mt = MT(cipher);
      const shuffledOrder = shuffle(charset, mt);
      const result = [];
      for (const i of charList) {
        const k = charset.indexOf(i);
        result.push(k == -1 ? i : shuffledOrder[k]);
        shuffledOrder.push(shuffledOrder.shift());
      }
      finalResult = result;
    });
    return finalResult.join('');
  },
  /** @param {String} text @param  {...Number} ciphers */
  d: (text, ...ciphers) => { // 解密
    ciphers = ciphers.flat().reverse();
    /** @type {undefined|String[]} */
    let finalResult;
    ciphers.forEach(cipher => {
      const charList = finalResult || text.split('');
      const mt = MT(cipher);
      const shuffledOrder = shuffle(charset, mt);
      const result = [];
      for (const i of charList) {
        const k = shuffledOrder.indexOf(i);
        result.push(k == -1 ? i : charset[k]);
        shuffledOrder.push(shuffledOrder.shift());
      }
      finalResult = result;
    });
    return finalResult.join('');
  }
}

module.exports = caesar;