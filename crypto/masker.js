const { MT, shuffle, randInt } = require('../random');
const { convert, getCharset } = require('../baseConverter');


const maskingCharsetGenerator = (charset, mt) => {
  charset = shuffle(charset, mt);
  return () => {
    charset.push(charset.shift());
    return charset;
  }
}

/** @param {String} string @returns {String} */
const mask = (string, charset=16, level=1) => {
  const realCharset = getCharset(charset);
  const seed1 = randInt(0, charset);
  const mt1 = MT(seed1);
  const generator = maskingCharsetGenerator(realCharset, MT(randInt(0, 1000000, mt1)));
  const characters = typeof string === 'string' ? string.split('') : string;
  const result = [
    convert(seed1, 10, charset),
    ...characters.map(char => generator()[realCharset.indexOf(char)])
  ];
  if (--level < 1) return result.join('');
  return mask(result, charset, level);
}

/** @param {String} string @returns {String} */
const unmask = (string, charset=16, level=1) => {
  const realCharset = getCharset(charset);
  const seed = +convert(string[0], charset, 10);
  const mt1 = MT(seed);
  const generator = maskingCharsetGenerator(realCharset, MT(randInt(0, 1000000, mt1)));
  const characters = (typeof string === 'string' ? string.split('') : string).slice(1, string.length);
  const result = characters.map(char => realCharset[generator().indexOf(char)]);
  if (--level < 1) return result.join('');
  return unmask(result, charset, level);
}

module.exports = { mask, unmask };