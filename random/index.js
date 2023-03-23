const { range } = require('../');
const MT = require('./MT');
const toSeed = require('./toSeed');
const { BASE10_CHARSET, BASE16_CHARSET, BASE64WEB_CHARSET,convert } = require('../baseConverter');


const selfMT = MT();

const rand = (mt) => (mt || selfMT).random();

const randInt = (start, end, mt) => {
  if (!end) end = start, start = 0;
  return Math.floor(start + rand(mt) * end);
};

const random = {
  rand, randInt,
  charset: (charset, len=8, mt) => new Array(len).fill(0).map(l => random.choice(charset, mt)).join(''),
  base10: (len=6, mt) => random.charset(BASE10_CHARSET, len, mt),
  base16: (len, mt) => random.charset(BASE16_CHARSET, len, mt),
  base64: (len, mt) => random.charset(BASE64WEB_CHARSET, len, mt),
  choice: (array, mt) => array[randInt(0, array.length, mt)],
  shuffle: (array, mt) => random.choices(array, array.length, mt),
  /** @param {String} string */
  mask(string, charset=16, level=1) {
    const seed = randInt(0, charset);
    const result = [
      convert(seed, 10, charset),
      ...random.shuffle(range(string.length), MT(seed)).map(i => string[i])
    ];
    if (--level < 1) return result.join('');
    return random.mask(result, charset, level);
  },
  /** @param {String} string */
  unmask(string, charset=16, level=1) {
    if (typeof string === 'string') string = string.split('');
    const seed = +convert(string[0], charset, 10);
    const characters = string.slice(1, string.length).reverse();
    const len = characters.length;
    const shuffleOrder = random.shuffle(range(len), MT(seed));
    const result = Array.from({ length: len });
    for (const i of shuffleOrder) result[i] = characters.pop();
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