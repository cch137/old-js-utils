const { sum, safeStringify } = require('../');
const sha256 = require('../crypto/sha256');


const binaryStrRegex = /0b[0-1]+/i;

/** @param {*} [seed] @returns {Number} */
const toSeed = (seed) => {
  if (typeof seed === 'number') return Math.round(seed);
  if (seed instanceof Object) seed = safeStringify(seed);
  else if (typeof seed === 'string') {
    if (binaryStrRegex.test(seed)) {
      return parseInt(seed.substring(2, seed.length - 1), 2);
    }
    const num = parseInt(seed);
    if (Number.isNaN(num)) {
      return num;
    } else {
      return sum(parseInt(sha256(seed), 16));
    }
  } else {
    seed = Date.now();
  }
  return seed;
}

module.exports = toSeed;