const isArray = (arg) => Array.isArray(arg);

const chee = {
  SECRET_KEY: 'HelloWorldCCH137',
  assign: (tar, src) => Object.assign(tar, src),
  unique: (arr) => [...new Set(arr)],
  isIterable(obj) {
    try {
      return typeof obj[Symbol.iterator] === 'function';
    } catch {
      return false;
    }
  },
  isArray,
  /** @param {Number} a @param {Number} [b] @param {Number} [c] */
  range(a, b, c) {
    const numbers = [];
    switch (isArgumentsObject.length) {
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
  escapeString: (str) => JSON.stringify(str).slice(1, -1),
  formatBytes(fileSizeByte=0, toFix=2, spaceBfrUnit=true) {
    const d = parseInt(Math.log(fileSizeByte) / Math.log(1024)) || 0;
    return `${(fileSizeByte/Math.pow(1024, d>5?5:d)).toFixed(toFix)}${spaceBfrUnit?' ':''}${['','K','M','G','T','P'][d>5?5:d]}B`;
  }
};

module.exports = chee;