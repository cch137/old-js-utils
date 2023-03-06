const BASE2_CHARSET = '01',
BASE10_CHARSET = '0123456789',
BASE16_CHARSET = '0123456789abcdef',
BASE36_CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
BASE62_CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
BASE64_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
BASE64WEB_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/** @param {String} value @param {String} fromCharset @param {String} toCharset */
const convertBase = (value, fromCharset, toCharset) => {
  if (typeof value !== 'string') value = value.toString();
  const baseFrom = fromCharset.length;
  const baseTo = toCharset.length;
  let decimalValue = 0;
  for (let i = 0; i < value.length; i++) {
    decimalValue += fromCharset.indexOf(value[i]) * Math.pow(baseFrom, value.length - 1 - i);
  }
  let result = '';
  while (decimalValue > 0) {
    result = toCharset.charAt(decimalValue % baseTo) + result;
    decimalValue = Math.floor(decimalValue / baseTo);
  }
  return result || toCharset.charAt(0);
}

/** @param {String} value */
const lowerCase = (value) => value.toString().toLowerCase();
/** @param {String} value */
const upperCase = (value) => value.toString().toUpperCase();

const baseConverter = {
  BASE2_CHARSET, BASE10_CHARSET, BASE16_CHARSET, BASE36_CHARSET, BASE62_CHARSET,
  BASE64_CHARSET, BASE64WEB_CHARSET, convertBase,
  /** @param {String} value */
  b2_b10: (value) => convertBase(value, BASE2_CHARSET, BASE10_CHARSET),
  /** @param {String} value */
  b2_b16: (value) => convertBase(value, BASE2_CHARSET, BASE16_CHARSET),
  /** @param {String} value */
  b2_b36: (value) => convertBase(value, BASE2_CHARSET, BASE36_CHARSET),
  /** @param {String} value */
  b2_b62: (value) => convertBase(value, BASE2_CHARSET, BASE62_CHARSET),
  /** @param {String} value */
  b2_b64w: (value) => convertBase(value, BASE2_CHARSET, BASE64WEB_CHARSET),
  /** @param {String} value */
  b2_b64: (value) => convertBase(value, BASE2_CHARSET, BASE64_CHARSET),
  /** @param {String} value */
  b10_b2: (value) => convertBase(value, BASE10_CHARSET, BASE2_CHARSET),
  /** @param {String} value */
  b10_b16: (value) => convertBase(value, BASE10_CHARSET, BASE16_CHARSET),
  /** @param {String} value */
  b10_b36: (value) => convertBase(value, BASE10_CHARSET, BASE36_CHARSET),
  /** @param {String} value */
  b10_b62: (value) => convertBase(value, BASE10_CHARSET, BASE62_CHARSET),
  /** @param {String} value */
  b10_b64w: (value) => convertBase(value, BASE10_CHARSET, BASE64WEB_CHARSET),
  /** @param {String} value */
  b10_b64:(value) => convertBase(value, BASE10_CHARSET, BASE64_CHARSET),
  /** @param {String} value */
  b16_b2: (value) => convertBase(lowerCase(value), BASE16_CHARSET, BASE2_CHARSET),
  /** @param {String} value */
  b16_b10: (value) => convertBase(lowerCase(value), BASE16_CHARSET, BASE10_CHARSET),
  /** @param {String} value */
  b16_b36: (value) => convertBase(lowerCase(value), BASE16_CHARSET, BASE36_CHARSET),
  /** @param {String} value */
  b16_b62: (value) => convertBase(lowerCase(value), BASE16_CHARSET, BASE62_CHARSET),
  /** @param {String} value */
  b16_b64w: (value) => convertBase(lowerCase(value), BASE16_CHARSET, BASE64WEB_CHARSET),
  /** @param {String} value */
  b16_b64: (value) => convertBase(lowerCase(value), BASE16_CHARSET, BASE64_CHARSET),
  /** @param {String} value */
  b36_b2: (value) => convertBase(upperCase(value), BASE36_CHARSET, BASE2_CHARSET),
  /** @param {String} value */
  b36_b10: (value) => convertBase(upperCase(value), BASE36_CHARSET, BASE10_CHARSET),
  /** @param {String} value */
  b36_b16: (value) => convertBase(upperCase(value), BASE36_CHARSET, BASE16_CHARSET),
  /** @param {String} value */
  b36_b62: (value) => convertBase(upperCase(value), BASE36_CHARSET, BASE62_CHARSET),
  /** @param {String} value */
  b36_b64w: (value) => convertBase(upperCase(value), BASE36_CHARSET, BASE64WEB_CHARSET),
  /** @param {String} value */
  b36_b64: (value) => convertBase(upperCase(value), BASE36_CHARSET, BASE64_CHARSET),
  /** @param {String} value */
  b62_b2: (value) => convertBase(value, BASE62_CHARSET, BASE2_CHARSET),
  /** @param {String} value */
  b62_b10: (value) => convertBase(value, BASE62_CHARSET, BASE10_CHARSET),
  /** @param {String} value */
  b62_b16: (value) => convertBase(value, BASE62_CHARSET, BASE16_CHARSET),
  /** @param {String} value */
  b62_b36: (value) => convertBase(value, BASE62_CHARSET, BASE36_CHARSET),
  /** @param {String} value */
  b62_b64w: (value) => convertBase(value, BASE62_CHARSET, BASE64WEB_CHARSET),
  /** @param {String} value */
  b62_b64:(value) => convertBase(value, BASE62_CHARSET, BASE64_CHARSET),
  /** @param {String} value */
  b64w_b2: (value) => convertBase(value, BASE64WEB_CHARSET, BASE2_CHARSET),
  /** @param {String} value */
  b64w_b10: (value) => convertBase(value, BASE64WEB_CHARSET, BASE10_CHARSET),
  /** @param {String} value */
  b64w_b16: (value) => convertBase(value, BASE64WEB_CHARSET, BASE16_CHARSET),
  /** @param {String} value */
  b64w_b36: (value) => convertBase(value, BASE64WEB_CHARSET, BASE36_CHARSET),
  /** @param {String} value */
  b64w_b62: (value) => convertBase(value, BASE64WEB_CHARSET, BASE62_CHARSET),
  /** @param {String} value */
  b64w_b64: (value) => convertBase(value, BASE64WEB_CHARSET, BASE64_CHARSET),
  /** @param {String} value */
  b64_b2: (value) => convertBase(value, BASE64_CHARSET, BASE2_CHARSET),
  /** @param {String} value */
  b64_b10: (value) => convertBase(value, BASE64_CHARSET, BASE10_CHARSET),
  /** @param {String} value */
  b64_b16: (value) => convertBase(value, BASE64_CHARSET, BASE16_CHARSET),
  /** @param {String} value */
  b64_b36: (value) => convertBase(value, BASE64_CHARSET, BASE36_CHARSET),
  /** @param {String} value */
  b64_b62: (value) => convertBase(value, BASE64_CHARSET, BASE62_CHARSET),
  /** @param {String} value */
  b64_b64w: (value) => convertBase(value, BASE64_CHARSET, BASE64WEB_CHARSET),
}

module.exports = baseConverter;