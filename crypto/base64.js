const { mask, unmask } = require('../random');
const { textToBase64, base64ToText, secureBase64 } = require('../baseConverter');
const { safeStringify, str } = require('..');


const base64Crypto = {
  e(input, maskLevel=1) { // 加密
    if (typeof input === 'object') input = safeStringify(input);
    if (typeof input === 'string') input = str(input);
    return mask(secureBase64(textToBase64(input)), 64, maskLevel);
  },
  d(input, maskLevel=1, tryParseJSON=true) { // 解密
    input = base64ToText(unmask(input, 64, maskLevel));
    if (!tryParseJSON) return input;
    try { return JSON.parse(input); }
    catch (err) { return input; }
  },
}

module.exports = base64Crypto;