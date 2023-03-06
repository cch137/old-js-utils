const baseConverter = require('../baseConverter');
const MT = require('./MersenneTwister');


const bases = {
  2: baseConverter.BASE2_CHARSET,
  10: baseConverter.BASE10_CHARSET,
  16: baseConverter.BASE16_CHARSET,
  36: baseConverter.BASE36_CHARSET,
  62: baseConverter.BASE62_CHARSET,
  '64w': baseConverter.BASE64WEB_CHARSET,
  64: baseConverter.BASE64_CHARSET,
}

const defaultMT = MT();

const random = {
  int: (start, end) => {
    if (!end) end = start, start = 0;
    return Math.floor(start + Math.random() * (end + 1));
  },
  _base: (len, base) => {
    const arr = [];
    for (let i = 0; i < len; i ++) arr.push(bases[`${base}`][Math.floor(Math.random()*base)]);
    return arr.join('');
  },
  base2: (len = 16) => random._base(len, 2),
  base10: (len = 6) => random._base(len, 10),
  base16: (len = 8) => random._base(len, 16),
  base64: (len = 8) => random._base(len, 64),
  choices: (_array, amount=1) => {
    const result = [];
    let array = [];
    for (let i = 0; i < amount; i++) {
      if (!array.length) array = new Array(..._array);
      const item = array.splice(Math.floor(Math.random() * array.length), 1);
      result.push(item[0]);
    };
    return result;
  },
  choice: (array) => array[Math.floor(Math.random()*array.length)],
  shuffle: (array) => {
    return random.choices(array, array.length);
  },
  generator: (seed) => {
    const g = () => {
      this.x = (this.x * 1664525 + 1013904223) % 4294967296;
      return this.x / 4294967296;
    }
    g.x = seed;
    return g;
  },
  mt: {
    MT,
    defaultMT,
    choices: (_array, amount=1, mt=defaultMT) => {
      const result = [];
      let array = [];
      for (let i = 0; i < amount; i++) {
        if (!array.length) array = new Array(..._array);
        const item = array.splice(Math.floor(mt.random() * array.length), 1);
        result.push(item[0]);
      };
      return result;
    },
    choice: (array, mt=defaultMT) => array[Math.floor(mt.random()*array.length)],
    shuffle: (array, mt=defaultMT) => random.mt.choices(array, array.length, mt)
  }
}

module.exports = random;