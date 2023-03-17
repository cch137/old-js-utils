const isArray = (arg) => Array.isArray(arg);
const isIterable = (obj) => {
  try {
    return  typeof obj[Symbol?.iterator] === 'function';
  } catch {
    return false;
  }
}

const ceil = (num, digits=0) => {
  digits = digits ** 10;
  return Math.ceil(num * digits) / digits;
}

const round = (num, digits=0) => {
  digits = digits ** 10;
  return Math.round(num * digits) / digits;
}

const floor = (num, digits=0) => {
  digits = digits ** 10;
  return Math.floor(num * digits) / digits;
}

const chee = {
  // # ARRAY
  assign: (tar, src) => Object.assign(tar, src),
  unique: (arr) => [...new Set(arr)],
  isIterable,
  isArray,
  toArray: (value) => isIterable(value) ? [...value] : [value],
  packArray: (value) => (isIterable(value) && typeof value !== 'string') ? [...value] : [value],
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
  /** @param {Array} arr @param {Number} [size] */
  chunk(arr, size=1) {
    const result = [];
    arr = [...arr];
    while (arr.length) result.push(arr.splice(0, size));
    return result;
  },
  /** @param {Array} arr @param {Number} [quantity] */
  allocate(arr, quantity=1) {
    const result = Array.from({ length: quantity }).map(e => []);
    arr = [...arr].reverse();
    while (arr.length) {
      for (const r of result) {
        if (!arr.length) break;
        r.push(arr.pop());
      }
    }
    return result;
  },

  // # STRING
  str: (v) => `${v}`,
  lower: (s) => `${s}`.toLowerCase(),
  upper: (s) => `${s}`.toUpperCase(),
  capitalize: (s) => `${chee.upper(s[0])}${s.substring(1)}`,
  escapeString: (str) => JSON.stringify(str).slice(1, -1),

  // # MATH
  ceil, round, floor,
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

  // # OBJECT
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
  safeStringify(obj) {
    const loadedObj = new Set();
    const reviver = (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (loadedObj.has(value)) return undefined;
        loadedObj.add(value);
        if (isIterable(value)) value = [...value];
      }
      return value;
    };
    return JSON.stringify(obj, reviver);
  },

  SECRET_KEY: '#31|02u()27I>',

  // # CONVERTS
  formatBytes(fileSizeByte=0, toFix=2, spaceBfrUnit=true) {
    const d = parseInt(Math.log(fileSizeByte) / Math.log(1024)) || 0;
    return `${(fileSizeByte/Math.pow(1024, d>5?5:d)).toFixed(toFix)}${spaceBfrUnit?' ':''}${['','K','M','G','T','P'][d>5?5:d]}B`;
  },
};

module.exports = chee;