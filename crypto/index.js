const MT = require('../random/MT');
const md5 = require('./md5');
const sha256 = require('./sha256');
const { convert } = require('../baseConverter');


const generateNewSeed = (motherSeed, mt) => {
  const seedGeneratorMT = MT(mt.random()), _ = motherSeed % 3;
  let i = 0;
  while (i++ < _) seedGeneratorMT.random();
  return seedGeneratorMT.random();
};

const generateShuffledIndexes = (MT, len) => {
  const arrayIndexs = Array.from({length: len}, (v, i) => i++);
  const result = [];
  while (arrayIndexs.length > 0) {
    const index = Math.floor(MT.random() * arrayIndexs.length);
    result.push(arrayIndexs.splice(index, 1)[0]);
  }
  return result;
};

const crypto = {
  md5, sha256,
  e: (str) => {
    if (typeof str != 'string') str = str.toString();
    const seed1 = Math.round(new Date().getTime() * Math.random() / 137 / 137 / 137);
    const MT1 = MT(seed1);
    const seed2 = generateNewSeed(seed1, MT1) * 1114111;
    const MT2 = MT(seed2);
    const crypMaterial1 = Array.from(str, _ => Math.round(MT1.random() * 1114111));
    const crypMaterial2 = generateShuffledIndexes(MT2, str.length);
    const crypData = Array.from(str, _ => _.charCodeAt(0) + crypMaterial1.pop());
    const result = Array.from(crypMaterial2, i => crypData[i]);
    result.splice(Math.floor((result.length + 1) / 3), 0, seed1);
    return result.map(r => convert(r, 10, 64)).join('-');
  },
  d: (str) => {
    str = str.split('-').map(d => +convert(d, 64, 10));
    const seed1 = str.splice(Math.floor(str.length / 3), 1)[0];
    const MT1 = MT(seed1);
    const seed2 = generateNewSeed(seed1, MT1) * 1114111;
    const MT2 = MT(seed2);
    const crypMaterial1 = Array.from(str, _ => Math.round(MT1.random() * 1114111));
    const crypMaterial2 = generateShuffledIndexes(MT2, str.length);
    const result = Array.from(str, _ => null);
    for (const i of crypMaterial2) result[i] = str.shift();
    return Array.from(result, _ => String.fromCharCode(_ - crypMaterial1.pop())).join('');
  },
};

module.exports = crypto;