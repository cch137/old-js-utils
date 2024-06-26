const { MT, shuffle, randInt, toSeed } = require('../random');
const { convert, getCharset } = require('../baseConverter');


const maskingCharsetGenerator = (charset, mt) => {
  charset = shuffle(charset, mt);
  return () => {
    charset.push(charset.shift());
    return charset;
  }
}

/** @param {String} string @returns {String} */
const mask = (string, charset=16, level=1, seed) => {
  const realCharset = getCharset(charset);
  const seed1 = toSeed(seed != undefined ? seed : randInt(0, charset));
  const mt1 = MT(seed1);
  const generator = maskingCharsetGenerator(realCharset, MT(randInt(0, 1000000, mt1)));
  const characters = typeof string === 'string' ? string.split('') : string;
  const result = [
    seed != undefined ? realCharset[randInt(0, charset)] : convert(seed1, 10, charset),
    ...characters.map(char => generator()[realCharset.indexOf(char)])
  ];
  if (--level < 1) return result.join('');
  return mask(result, charset, level, seed);
}

/** @param {String} string @returns {String} */
const unmask = (string, charset=16, level=1, seed) => {
  const realCharset = getCharset(charset);
  const seed1 = toSeed(seed != undefined ? seed : +convert(string[0], charset, 10));
  const mt1 = MT(seed1);
  const generator = maskingCharsetGenerator(realCharset, MT(randInt(0, 1000000, mt1)));
  const characters = (typeof string === 'string' ? string.split('') : string).slice(1, string.length);
  const result = characters.map(char => realCharset[generator().indexOf(char)]);
  if (--level < 1) return result.join('');
  return unmask(result, charset, level, seed);
}

module.exports = { mask, unmask };