const { range } = require('../');
const MT = require('./MT');
const toSeed = require('./toSeed');
const { BASE10_CHARSET, BASE16_CHARSET, BASE64WEB_CHARSET,
  convert, getCharset } = require('../baseConverter');


const selfMT = MT();

const rand = (mt) => (mt || selfMT).random();

const randInt = (start, end, mt) => {
  if (!end) end = start, start = 0;
  return Math.floor(start + rand(mt) * end);
};

const maskingCharsetGenerator = (charset, mt) => {
  return () => {
    charset = random.shuffle(charset, mt);
    return charset.join('');
  }
}

const random = {
  rand, randInt,
  charset: (charset, len=8, mt) => new Array(len).fill(0).map(l => random.choice(charset, mt)).join(''),
  base10: (len=6, mt) => random.charset(BASE10_CHARSET, len, mt),
  base16: (len, mt) => random.charset(BASE16_CHARSET, len, mt),
  base64: (len, mt) => random.charset(BASE64WEB_CHARSET, len, mt),
  choice: (array, mt) => array[randInt(0, array.length, mt)],
  shuffle: (array, mt) => random.choices(array, array.length, mt),
  /** @param {String} string @returns {String} */
  mask(string, charset=16, level=1) {
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
    return random.mask(result, charset, level);
  },
  /** @param {String} string @returns {String} */
  unmask(string, charset=16, level=1) {
    const realCharset = getCharset(charset);
    const seed = +convert(string[0], charset, 10);
    const mt1 = MT(seed);
    const generator = maskingCharsetGenerator(realCharset, MT(randInt(0, 1000000, mt1)));
    const characters = (typeof string === 'string' ? string.split('') : string).slice(1, string.length);
    const result = characters.map(char => realCharset[generator().indexOf(char)]);
    if (--level < 1) return result.join('');
    return random.unmask(result, charset, level);
  },
  choices(array, amount=1, mt) {
    const result = [];
    const options = [];
    for (let i = 0; i < amount; i++) {
      if (!options.length) options.push(...array);
      result.push(options.splice(randInt(0, options.length, mt), 1)[0]);
    };
    return result;
  },
  /** Linear Congruential Generator */
  lcg(seed) {
    seed = toSeed(seed);
    return () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  },
  MT, toSeed
}

module.exports = random;