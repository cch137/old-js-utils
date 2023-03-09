const BASE2_CHARSET = '01',
BASE10_CHARSET = '0123456789',
BASE16_CHARSET = '0123456789abcdef',
BASE36_CHARSET = '0123456789abcdefghijklmnopqrstuvwxyz',
BASE62_CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
BASE64_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
BASE64WEB_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

const smallBases = new Set(['2', '10', '16', '36', 2, 10, 16, 36]);

/** @param {Number|String} radix */
const getCharset = (radix) => {
  if (typeof radix != 'string') radix = `${radix}`.toLowerCase();
  switch (radix) {
    case '2': return BASE2_CHARSET;
    case '10': return BASE10_CHARSET;
    case '16': return BASE16_CHARSET;
    case '36': return BASE36_CHARSET;
    case '62': return BASE62_CHARSET;
    case '64': return BASE64_CHARSET;
    case '64web': case '64w': return BASE64WEB_CHARSET;
    default: return radix;
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
  if (smallBases.has(fromCharset)) {
    if (fromCharset < 37) decimalValue = parseInt(value, fromCharset);
  }
  if (!decimalValue) {
    fromCharset = getCharset(fromCharset);
    const baseFrom = fromCharset.length;
    for (let i = 0; i < value.length; i++) {
      decimalValue += fromCharset.indexOf(value[i]) * Math.pow(baseFrom, value.length - 1 - i);
    }
  }
  let result = '';
  if (smallBases.has(toCharset)) {
    if (toCharset < 37) {
      result = decimalValue.toString(toCharset);
      if (minLen <= 1) return result;
    }
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
  BASE64_CHARSET, BASE64WEB_CHARSET, convert,
  /** @param {String} value */
  b2_b10: (value, minLen) => convert(value, 2, 10, minLen),
  /** @param {String} value */
  b2_b16: (value, minLen) => convert(value, 2, 16, minLen),
  /** @param {String} value */
  b2_b36: (value, minLen) => convert(value, 2, 36, minLen),
  /** @param {String} value */
  b2_b62: (value, minLen) => convert(value, 2, 62, minLen),
  /** @param {String} value */
  b2_b64w: (value, minLen) => convert(value, 2, '64w', minLen),
  /** @param {String} value */
  b2_b64: (value, minLen) => convert(value, 2, 64, minLen),
  /** @param {String} value */
  b10_b2: (value, minLen) => convert(value, 10, 2, minLen),
  /** @param {String} value */
  b10_b16: (value, minLen) => convert(value, 10, 16, minLen),
  /** @param {String} value */
  b10_b36: (value, minLen) => convert(value, 10, 36, minLen),
  /** @param {String} value */
  b10_b62: (value, minLen) => convert(value, 10, 62, minLen),
  /** @param {String} value */
  b10_b64w: (value, minLen) => convert(value, 10, '64w', minLen),
  /** @param {String} value */
  b10_b64:(value, minLen) => convert(value, 10, 64, minLen),
  /** @param {String} value */
  b16_b2: (value, minLen) => convert(value, 16, 2, minLen),
  /** @param {String} value */
  b16_b10: (value, minLen) => convert(value, 16, 10, minLen),
  /** @param {String} value */
  b16_b36: (value, minLen) => convert(value, 16, 36, minLen),
  /** @param {String} value */
  b16_b62: (value, minLen) => convert(value, 16, 62, minLen),
  /** @param {String} value */
  b16_b64w: (value, minLen) => convert(value, 16, '64w', minLen),
  /** @param {String} value */
  b16_b64: (value, minLen) => convert(value, 16, 64, minLen),
  /** @param {String} value */
  b36_b2: (value, minLen) => convert(value, 36, 2, minLen),
  /** @param {String} value */
  b36_b10: (value, minLen) => convert(value, 36, 10, minLen),
  /** @param {String} value */
  b36_b16: (value, minLen) => convert(value, 36, 16, minLen),
  /** @param {String} value */
  b36_b62: (value, minLen) => convert(value, 36, 62, minLen),
  /** @param {String} value */
  b36_b64w: (value, minLen) => convert(value, 36, '64w', minLen),
  /** @param {String} value */
  b36_b64: (value, minLen) => convert(value, 36, 64, minLen),
  /** @param {String} value */
  b62_b2: (value, minLen) => convert(value, 62, 2, minLen),
  /** @param {String} value */
  b62_b10: (value, minLen) => convert(value, 62, 10, minLen),
  /** @param {String} value */
  b62_b16: (value, minLen) => convert(value, 62, 16, minLen),
  /** @param {String} value */
  b62_b36: (value, minLen) => convert(value, 62, 36, minLen),
  /** @param {String} value */
  b62_b64w: (value, minLen) => convert(value, 62, '64w', minLen),
  /** @param {String} value */
  b62_b64:(value, minLen) => convert(value, 62, 64, minLen),
  /** @param {String} value */
  b64w_b2: (value, minLen) => convert(value, '64w', 2, minLen),
  /** @param {String} value */
  b64w_b10: (value, minLen) => convert(value, '64w', 10, minLen),
  /** @param {String} value */
  b64w_b16: (value, minLen) => convert(value, '64w', 16, minLen),
  /** @param {String} value */
  b64w_b36: (value, minLen) => convert(value, '64w', 36, minLen),
  /** @param {String} value */
  b64w_b62: (value, minLen) => convert(value, '64w', 62, minLen),
  /** @param {String} value */
  b64w_b64: (value, minLen) => convert(value, '64w', 64, minLen),
  /** @param {String} value */
  b64_b2: (value, minLen) => convert(value, 64, 2, minLen),
  /** @param {String} value */
  b64_b10: (value, minLen) => convert(value, 64, 10, minLen),
  /** @param {String} value */
  b64_b16: (value, minLen) => convert(value, 64, 16, minLen),
  /** @param {String} value */
  b64_b36: (value, minLen) => convert(value, 64, 36, minLen),
  /** @param {String} value */
  b64_b62: (value, minLen) => convert(value, 64, 62, minLen),
  /** @param {String} value */
  b64_b64w: (value, minLen) => convert(value, 64, '64w', minLen),
}

module.exports = baseConverter;