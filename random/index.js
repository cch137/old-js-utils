const MT = require('./MT');
const toSeed = require('./toSeed');
const { BASE10_CHARSET, BASE16_CHARSET, BASE64WEB_CHARSET } = require('../baseConverter');


const selfMT = MT();

const randInt = (start, end) => {
  if (!end) end = start, start = 0;
  return Math.floor(start + selfMT.random() * end);
};

const random = {
  randInt,
  rand: () => selfMT.random(),
  charset: (charset, len=8) => new Array(len).fill(0).map(l => random.choice(charset)).join(''),
  base10: (len=6) => random.charset(BASE10_CHARSET, len),
  base16: (len) => random.charset(BASE16_CHARSET, len),
  base64: (len) => random.charset(BASE64WEB_CHARSET, len),
  choice: (array) => array[randInt(array.length)],
  shuffle: (array) => random.choices(array, array.length),
  choices(array, amount=1) {
    const result = [];
    const options = [];
    for (let i = 0; i < amount; i++) {
      if (!options.length) options.push(...array);
      result.push(options.splice(randInt(options.length), 1)[0]);
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