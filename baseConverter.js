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

const baseConverter = {
  BASE2_CHARSET, BASE10_CHARSET, BASE16_CHARSET, BASE36_CHARSET, BASE62_CHARSET,
  BASE64_CHARSET, BASE64WEB_CHARSET, convert
}

module.exports = baseConverter;