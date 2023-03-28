const { mask, unmask } = require('./masker');
const { textToBase64, base64ToText, secureBase64 } = require('../baseConverter');
const { safeStringify, str } = require('..');


const base64Crypto = {
  /**
   * Encode 加密
   * @param {*} input 
   * @param {Number} maskLevel 
   * @returns {String}
   */
  e(input, maskLevel=1) {
    if (typeof input === 'object') input = safeStringify(input);
    if (typeof input !== 'string') input = str(input);
    return mask(secureBase64(textToBase64(input)), 64, maskLevel);
  },
  /**
   * Decode 解密
   * @param {String} input 
   * @param {Number} maskLevel 
   * @param {Boolean} tryParseJSON 
   * @returns 
   */
  d(input, maskLevel=1, tryParseJSON=true) {
    input = base64ToText(unmask(input, 64, maskLevel));
    if (!tryParseJSON) return input;
    try { return JSON.parse(input); }
    catch (err) { return input; }
  },
}

module.exports = base64Crypto;