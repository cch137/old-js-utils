/**
 * @param {String} str 
 * @param {Number} minLen 
 * @param {Number} maxLen 
 * @param {RegExp} regexp 
 * @param {String} [name] 
 * @param {Boolean} [throwInvalidChars] 
 */
const testStringFormat = (str, minLen, maxLen, regexp, name='item', throwInvalidChars=true) => {
  const _name = validations.capitalize(name);
  if (!str) throw `${_name} cannot be empty.`;
  if (str.length < minLen) throw `${_name} must have at least ${minLen} characters.`;
  if (str.length > maxLen) throw `The length of the ${name} cannot be greater than ${maxLen}.`;
  const result = str.match(regexp);
  if (result != null) return true;
  if (!throwInvalidChars) throw `${_name} does not conform to the format.`;
  try {
    const negatedRegex = new RegExp('[^' + regexp.source.slice(2, -3) + ']', 'g');
    const invalidChars = [...new Set([...str.match(negatedRegex)])];
    throw `The ${name} cannot contain the following characters:\n${JSON.stringify(invalidChars).slice(1, -1)}`;
  } catch {
    throw `${_name} does not conform to the format.`;
  }
}

/**
 * @param {String} str
 * @param {() => Boolean} testFunc
 */
const isStringFormat = (str, testFunc) => {
  try {
    return testFunc(str);
  } catch {
    return false;
  }
}

const validations = {
  /** @param {String} str */
  capitalize: (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`,

  /** @param {String} str */
  testEmail: (str) => testStringFormat(`${str}`.toLowerCase(), 5, 320, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'email address', false),

  /** @param {String} str */
  testUsername: (str) => testStringFormat(str, 5, 32, /^[a-zA-Z0-9_]+$/, 'username'),

  /** @param {String} str */
  testPasswd: (str) => testStringFormat(str, 8, 64, /^[a-zA-Z0-9`~!@#$%^&*()-_=+[{\]}|;:'",<.>/?]+$/, 'password'),

  /** @param {String} str @param {Number} [minLen] @param {Number} [maxLen] */
  testBase64: (str, minLen=0, maxLen='') => new RegExp(`^[A-Za-z0-9\\-\\_]{${minLen},${maxLen}}$`).test(str),

  /** @param {String} str */
  isEmail: (str) => isStringFormat(str, validations.testEmail),

  /** @param {String} str */
  isUsername: (str) => isStringFormat(str, validations.testUsername),

  /** @param {String} str */
  isPasswd: (str) => isStringFormat(str, validations.testPasswd),

  /** @param {String} str */
  isBase64: (str) => isStringFormat(str, validations.testBase64),

  /** @param {String} str */
  filterAsciiChars(str) {
    const asciiStr = [];
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) < 128) asciiStr.push(str.charAt(i));
    }
    return asciiStr.join('');
  },

  /** @param {String} url */
  formatYTUrl: (url='') => {
    const videoIdRegExp = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})|(?:^|\W)([\w-]{11})(?:$|\W)/;
    const match = url.match(videoIdRegExp);
    if (!match) return null;
    return `https://youtu.be/${ match[1] || match[2] }`;
  }
}

module.exports = validations;