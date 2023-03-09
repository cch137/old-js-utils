const isArray = (arg) => Array.isArray(arg);


const ceil = (num, digits=0) => Math.ceil(num * (10 ** digits)) / (10 ** digits);
const round = (num, digits=0) => Math.round(num * (10 ** digits)) / (10 ** digits);
const floor = (num, digits=0) => Math.floor(num * (10 ** digits)) / (10 ** digits);

const chee = {
  assign: (tar, src) => Object.assign(tar, src),
  unique: (arr) => [...new Set(arr)],
  isIterable: (obj) => typeof obj[Symbol?.iterator] === 'function',
  isArray,
  /** @param {Number|Number[]} numbers */
  sum: (...numbers) => {
    numbers = numbers.flat();
    return numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  },
  /** @param {Number|Number[]} numbers */
  avg: (...numbers) => {
    numbers = numbers.flat();
    return chee.sum(numbers) / numbers.length;
  },
  /** @param {Number} a @param {Number} [b] @param {Number} [c] */
  range(a, b, c) {
    const numbers = [];
    switch (arguments.length) {
      case 1:
        for (let i = 0; i < a; i++) numbers.push(i);
        break;
      case 2:
        for (let i = a; i < b; i++) numbers.push(i);
        break;
      case 3:
        for (let i = a; i < b; i+=c) numbers.push(i);
        break;
    }
    return numbers;
  },
  str: (v) => `${v}`,
  lower: (s) => `${s}`.toLowerCase(),
  upper: (s) => `${s}`.toUpperCase(),
  ceil, round, floor,
  trimObj(obj) {
    if (isArray(obj)) {
      for (let i = 0; i < obj.length; i++) if (typeof obj === 'object') obj[i] = trimObj(obj[i]);
    } else {
      for (const i in obj) {
        if (obj[i] === undefined || obj[i] === null || obj[i] === NaN) delete obj[i];
      }
    }
    return obj;
  },
  safeStringify: (obj) => {
    const loadedObj = new Set();
    const reviver = (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (loadedObj.has(value)) return undefined;
        loadedObj.add(value);
      }
      return value;
    };
    return JSON.stringify(obj, reviver);
  },
  SECRET_KEY: '#31|02u()27I>',
  escapeString: (str) => JSON.stringify(str).slice(1, -1),
  formatBytes(fileSizeByte=0, toFix=2, spaceBfrUnit=true) {
    const d = parseInt(Math.log(fileSizeByte) / Math.log(1024)) || 0;
    return `${(fileSizeByte/Math.pow(1024, d>5?5:d)).toFixed(toFix)}${spaceBfrUnit?' ':''}${['','K','M','G','T','P'][d>5?5:d]}B`;
  },
};

module.exports = chee;