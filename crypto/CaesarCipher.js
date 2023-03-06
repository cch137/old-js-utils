const chee = require('../');
const { MT, shuffle } = require('../random').mt;
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`~!@#$%^&*()=+\t[{]}|\\:;"\'<,>.?/ \n';

const caesar = {
  /**
   * @param {String} text 
   * @param  {...Number} ciphers 
   */
  encryp: (text, ...ciphers) => {
    ciphers = ciphers.flat();
    /** @type {undefined|String[]} */
    let finalResult;
    ciphers.forEach(cipher => {
      const charList = finalResult || text.split('');
      const mt = MT(cipher);
      const shuffledOrder = shuffle(charList, mt);
      const result = [];
      for (const i of text.split('')) {
        const k = charList.indexOf(i);
        result.push(k == -1 ? i : shuffledOrder[k]);
        shuffledOrder.push(shuffledOrder.shift());
      }
      finalResult = result;
    });
    return finalResult.join('');
  },
  /**
   * @param {String} text 
   * @param  {...Number} ciphers 
   */
  decryp: (text, ...ciphers) => {
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