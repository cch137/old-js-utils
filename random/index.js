const MT = require('./MT');
const toSeed = require('./toSeed');
const { BASE10_CHARSET, BASE16_CHARSET, BASE64WEB_CHARSET } = require('../baseConverter');


const selfMT = MT();

const rand = (mt) => (mt || selfMT).random();

const randInt = (start, end, mt) => {
  if (!end) end = start, start = 0;
  return Math.floor(start + rand(mt) * end);
};

const choice = (array, mt) => array[randInt(0, array.length, mt)];
const choices = (array, amount=1, mt) => {
  const result = [];
  const options = [];
  for (let i = 0; i < amount; i++) {
    if (!options.length) options.push(...array);
    result.push(options.splice(randInt(0, options.length, mt), 1)[0]);
  };
  return result;
}

const shuffle = (array, mt) => choices(array, array.length, mt);

const charset = (charset, len=8, mt) => new Array(len).fill(0).map(l => choice(charset, mt)).join('');

const random = {
  rand, randInt, charset,
  base10: (len=6, mt) => charset(BASE10_CHARSET, len, mt),
  base16: (len, mt) => charset(BASE16_CHARSET, len, mt),
  base64: (len, mt) => charset(BASE64WEB_CHARSET, len, mt),
  choice, choices, shuffle,
  /** Linear Congruential Generator */
  lcg(seed) {
    seed = toSeed(seed);
    return () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  },
  MT, toSeed
}

module.exports = random;