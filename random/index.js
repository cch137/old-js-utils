const MT = require('./MT');
const toSeed = require('./toSeed');
const { b10_b16, b10_b64w } = require('../baseConverter');


const selfMT = MT();

const randInt = (start, end) => {
  if (!end) end = start, start = 0;
  return Math.floor(start + selfMT.random() * end);
};

const random = {
  randInt,
  rand: () => selfMT.random(),
  base10: (len=6) => `${randInt(len ** 10)}`.padStart(len, '0'),
  base16: (len=8) => b10_b16(randInt(len ** 16), len),
  base64: (len=8) => b10_b64w(randInt(len ** 64), len),
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