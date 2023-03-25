const BASE2_CHARSET = '01',
BASE10_CHARSET = '0123456789',
BASE16_CHARSET = '0123456789abcdef',
BASE36_CHARSET = '0123456789abcdefghijklmnopqrstuvwxyz',
BASE62_CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
BASE64_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
BASE64WEB_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';


/** @param {Number|String} radix */
const getCharset = (radix) => {
  if (typeof radix != 'string') radix = `${radix}`.toLowerCase();
  switch (radix) {
    case 2:
      return BASE2_CHARSET;
    case 10:
      return BASE10_CHARSET;
    case 16:
      return BASE16_CHARSET;
    case 36:
      return BASE36_CHARSET;
    case 62:
      return BASE62_CHARSET;
    case 64:
      return BASE64_CHARSET;
    case '64w':
    case '64+':
      return BASE64WEB_CHARSET;
    default:
      return radix;
  }
}

/**
 * @param {String} value
 * @param {String|Number} fromCharset
 * @param {String|Number} toCharset
 * @param {Number} [minLen]
 * @returns {String}
 */
const convert = (value, fromCharset, toCharset, minLen=0) => {
  if (typeof value !== 'string') value = `${value}`;
  let decimalValue = 0;
  if (fromCharset == 10) decimalValue = +new Number(value);
  else if (fromCharset < 37) decimalValue = parseInt(value, fromCharset);
  else {
    fromCharset = getCharset(fromCharset);
    const baseFrom = fromCharset.length;
    for (let i = 0; i < value.length; i++) {
      decimalValue += fromCharset.indexOf(value[i]) * Math.pow(baseFrom, value.length - 1 - i);
    }
  }
  let result = '';
  if (toCharset < 37) {
    result = decimalValue.toString(toCharset);
    if (minLen <= 1) return result;
  }
  toCharset = getCharset(toCharset);
  if (!result) {
    const baseTo = toCharset.length;
    while (decimalValue > 0) {
      result = toCharset.charAt(decimalValue % baseTo) + result;
      decimalValue = Math.floor(decimalValue / baseTo);
    }
  }
  return (result || toCharset.charAt(0)).padStart(minLen, toCharset[0]);
}

const textToBase64 = (text) => {
  /** @type {String[]} */
  const input = text.split('').map(c => c.charCodeAt(0)), output = [];
  let i = 0;
  while (i < input.length) {
    const [char1, char2=0, char3=0] = input.slice(i, i += 3);
    const triplet = (char1 << 16) + (char2 << 8) + char3;
    const char4 = triplet >> 18;
    const char5 = (triplet >> 12) & 63;
    const char6 = (triplet >> 6) & 63;
    const char7 = triplet & 63;
    output.push(BASE64_CHARSET[char4], BASE64_CHARSET[char5], BASE64_CHARSET[char6], BASE64_CHARSET[char7]);
  }
  const paddingLength = input.length % 3;
  return output.join('').slice(0, output.length - paddingLength)
    + (paddingLength === 2 ? '==' : paddingLength === 1 ? '=' : '');
}

const secureBase64RegEx = /[^A-Za-z0-9\+\/]/g
const secureBase64 = (str) => str.replace(secureBase64RegEx, '');
const fromCharCode = (str) => String.fromCharCode(str);

/** @param {String[]} str */
const base64ToText = (str) => {
  /** @type {String[]} */
  const input = secureBase64(str).split(''), output = [];
  let i = 0;
  while (i < input.length) {
    const [char1, char2, char3, char4] = input.slice(i, i++ + (i += 3)).map(l => BASE64_CHARSET.indexOf(l));
    output.push(fromCharCode((char1 << 2) | (char2 >> 4)));
    if (char3 != 64) output.push(fromCharCode(((char2 & 15) << 4) | (char3 >> 2)));
    if (char4 != 64) output.push(fromCharCode(((char3 & 3) << 6) | char4));
  }
  return output.join('');
}

const baseConverter = {
  BASE2_CHARSET, BASE10_CHARSET, BASE16_CHARSET, BASE36_CHARSET, BASE62_CHARSET,
  BASE64_CHARSET, BASE64WEB_CHARSET, convert, secureBase64, textToBase64, base64ToText
}

module.exports = baseConverter;