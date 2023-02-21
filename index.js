const fs = require('fs');
const path = require('path');
const MersenneTwister = require('mersenne-twister');
const crypto = require('crypto');


const { isArray } = Array;

let CONFIG_PATH;

const chee = {
  SECRET_KEY: 'https://github.com/cch137/chee',
  get CONFIG_PATH() {
    return CONFIG_PATH;
  },
  set CONFIG_PATH(v) {
    CONFIG_PATH = v;
    chee.config = require(v);
    chee.saveConfig = () => {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(chee.config, null, 4), {encoding: 'utf8'});
    }
  }
};

class Cookies {
  constructor(cookiesString='') {
    const cookiesArray = cookiesString.split(';');
    this.toString = () => cookiesString;
    cookiesArray.forEach(cookieItem => {
      const [key, value] = cookieItem.trim().split('=');
      this[decodeURIComponent(key)] = decodeURIComponent(value);
    });
  }
}

chee.cookies = (str) => new Cookies(str);

chee.valid = {
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  __testStr(str, minLength, maxLength, validReg, name, throwInvalidChars=true) {
    name = name.toLowerCase() || 'string';
    const _name = chee.valid.capitalize(name);
    if (!str) throw `${_name} cannot be empty.`;
    if (str.length < minLength) throw `${_name} must have at least ${minLength} characters.`;
    if (str.length > maxLength) throw `The length of the ${name} cannot be greater than ${maxLength}.`;
    const regex = validReg;
    const result = str.match(regex);
    if (result != null) return true;
    if (!throwInvalidChars) throw `${_name} does not conform to the format.`;
    const negatedRegex = new RegExp('[^' + regex.source.slice(1, -1) + ']', 'g');
    const invalidChars = chee.valid.unique(str.match(negatedRegex));
    throw `The ${name} cannot contain the following characters:\n${invalidChars.join(', ')}`;
  },
  __isStrType: (str, testFunc) => {
    try {return testFunc(str)} catch {return false}
  },
  testEmail: (str) => chee.valid.__testStr(String(str).toLowerCase(), 5, 320, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'email address', false),
  testUsername: (str) => chee.valid.__testStr(str, 5, 32, /^[a-zA-Z0-9_]+$/, 'username'),
  testPasswd: (str) => chee.valid.__testStr(str, 8, 64, /^[a-zA-Z0-9`~!@#$%^&*()-_=+[{\]}|;:'",<.>/?]+$/, 'password'),
  isEmail: (str) => chee.valid.__isStrType(str, chee.valid.testEmail),
  isUsername: (str) =>chee.valid. __isStrType(str, chee.valid.testUsername),
  isPasswd: (str) => chee.valid.__isStrType(str, chee.valid.testPasswd),
  base64: (str, minLen=0, maxLen='') => new RegExp(`^[A-Za-z0-9\\-\\_]{${minLen},${maxLen}}$`).test(str),
  formatYTUrl: (url='') => {
    const videoIdRegExp = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})|(?:^|\W)([\w-]{11})(?:$|\W)/;
    const match = url.match(videoIdRegExp);
    if (!match) return null;
    return `https://youtu.be/${ match[1] || match[2] }`;
  }
};

chee.unique = (arr) => [...new Set(arr)];

chee.isIterable = (obj) => typeof obj[Symbol.iterator] === 'function';

chee.isArray = (arg) => Array.isArray(arg);

chee.range = (a=null, b=null, c=null) => {
  const numbers = [];
  if      (!(a===null) &&  (b===null) &&  (c===null)) for (let i = 0; i < a; i++) numbers.push(i);  // 只有 a
  else if (!(a===null) && !(b===null) &&  (c===null)) for (let i = a; i < b; i++) numbers.push(i);  // 只有 a 和 b
  else if (!(a===null) && !(b===null) && !(c===null)) for (let i = a; i < b; i+=c) numbers.push(i); // 有 a b c
  return numbers;
};

chee.walkdir = (_dir, type=1) => {
  _dir = path.resolve(_dir);
  const filepathList = [];
  for (const f of fs.readdirSync(_dir)) {
    const itemPath = path.join(_dir, f);
    const isDir = fs.statSync(itemPath).isDirectory();
    switch (type) {
      case 1: // files only
        if (isDir) filepathList.push(...chee.walkdir(itemPath));
        else filepathList.push(itemPath);
        break;
      case 0: // files and dirs
        if (isDir) filepathList.push(...chee.walkdir(itemPath));
        filepathList.push(itemPath);
        break;
      case 2: // dirs only
        if (isDir) filepathList.push(itemPath);
        else continue;
        break;
    }
  };
  return filepathList;
};

chee.trimObj = (obj) => {
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; i++) if (typeof obj === 'object') obj[i] = trimObj(obj[i]);
  } else {
    for (const i in obj) {
      if (obj[i] === undefined || obj[i] === null || obj[i] === NaN) delete obj[i];
    }
  }
  return obj;
};

chee.escapeString = (str) => JSON.stringify(str).slice(1, -1);

chee.formatBytes = (fileSizeByte=0, toFix=2) => {
  const d = parseInt(Math.log(fileSizeByte) / Math.log(1024))||0;
  return `${(fileSizeByte/Math.pow(1024, d>5?5:d)).toFixed(toFix)} ${['','K','M','G','T','P'][d>5?5:d]}B`;
};

chee.base = {
  chars: {
    '2': '01',
    '10': '0123456789',
    '16': '0123456789abcdef',
    '36': '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '64': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  },
  __b10toBx(number, base) {
    const result = [], baseChars = chee.base.chars[base];
    number = Math.round(number);
    while (number / base > 0) {
      const n = number % base;
      number = (number - n) / base;
      result.push(baseChars[n]);
    }
    return result.reverse().join('') || baseChars[0];
  },
  b10toB64: (number) => chee.base.__b10toBx(number, 64),
  b64toB10: (string) => {
    let result = 0;
    string = string.split('').reverse().join('');
    for (let i = 0; i < string.length;) {
      result += (chee.base.chars['64'].indexOf(string[i])) * Math.pow(64, i++);
    }
    return result;
  }
};

chee.random = {
  int: (start, end) => {
    if (!end) end = start, start = 0;
    return Math.floor(start + Math.random() * (end + 1));
  },
  _base: (len, base) => {
    const arr = [];
    for (let i = 0; i < len; i ++) arr.push(chee.base.chars[`${base}`][Math.floor(Math.random()*base)]);
    return arr.join('');
  },
  base2: (len = 16) => chee.random._base(len, 2),
  base10: (len = 6) => chee.random._base(len, 10),
  base16: (len = 8) => chee.random._base(len, 16),
  base64: (len = 8) => chee.random._base(len, 64),
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
    return chee.random.choices(array, array.length);
  }
}

chee.random.mt = {
  new: (seed=undefined) => {
    if (seed === undefined) seed = Math.random() * 1000;
    return new MersenneTwister(seed);
  },
  choices: (_array, amount=1, mt=chee.random.mt.tempMT) => {
    const result = [];
    let array = [];
    for (let i = 0; i < amount; i++) {
      if (!array.length) array = new Array(..._array);
      const item = array.splice(Math.floor(mt.random() * array.length), 1);
      result.push(item[0]);
    };
    return result;
  },
  get tempMT() {return chee.random.mt.new()},
  choice: (array, mt=chee.random.mt.tempMT) => array[Math.floor(mt.random()*array.length)],
  shuffle: (array, mt=chee.random.mt.tempMT) => {
    return chee.random.mt.choices(array, array.length, mt);
  }
}

chee.time = {
  new: () => {
    return new Date();
  },
  stamp() {
    return new Date().getTime();
  },
  format: (date, format='yyyy/MM/dd HH:mm:ss', utc) => { 
    if (!(date instanceof Date)) date = date ? new Date(date) : new Date();
    if (!format) format;
    const addLeadingZeros = (val, len = 2) => val.toString().padStart(len, '0');
    const dateProperties = utc ?
      {
        y: date.getUTCFullYear(),
        M: date.getUTCMonth() + 1,
        d: date.getUTCDate(),
        w: date.getUTCDay(),
        H: date.getUTCHours(),
        m: date.getUTCMinutes(),
        s: date.getUTCSeconds(),
        f: date.getUTCMilliseconds()
      } :
      {
        y: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        w: date.getDay(),
        H: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
        f: date.getMilliseconds()
      };
    const T = dateProperties.H < 12 ? 'AM' : 'PM';
    const h = dateProperties.H % 12 || 12;
    return format
      .replace(/yyyy/g, dateProperties.y)
      .replace(/yy/g, dateProperties.y.toString().substr(2, 2))
      .replace(/y/g, dateProperties.y)
      .replace(/MMMM/g, ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'][dateProperties.M - 1])
      .replace(/MMMM/g, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][dateProperties.M - 1])
      .replace(/MM/g, addLeadingZeros(dateProperties.M))
      .replace(/M/g, dateProperties.M)
      .replace(/dddd/g, ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'][dateProperties.w])
      .replace(/ddd/g, ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateProperties.w])
      .replace(/dd/g, addLeadingZeros(dateProperties.d))
      .replace(/d/g, dateProperties.d)
      .replace(/HH/g, addLeadingZeros(dateProperties.H))
      .replace(/H/g, dateProperties.H)
      .replace(/hh/g, addLeadingZeros(h))
      .replace(/h/g, h)
      .replace(/mm/g, addLeadingZeros(dateProperties.m))
      .replace(/m/g, dateProperties.m)
      .replace(/ss/g, addLeadingZeros(dateProperties.s))
      .replace(/s/g, dateProperties.s)
      .replace(/fff/g, addLeadingZeros(dateProperties.f, 3))
      .replace(/ff/g, addLeadingZeros(Math.round(dateProperties.f / 10)))
      .replace(/f/g, Math.round(dateProperties.f / 100))
      .replace(/TT/g, T)
      .replace(/T/g, T.charAt(0));
  }
}

chee.crypto = (() => {
  const generateNewSeed = (motherSeed, MT) => {
    const seedGeneratorMT = new MersenneTwister(MT.random()), _ = motherSeed % 3;
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
  return {
    get MT() {return MersenneTwister},
    md5: (str, _digest='hex') => crypto.createHash('md5').update(str).digest(_digest),
    sha256: (str, _digest='hex') => crypto.createHash('sha256', chee.SECRET_KEY).update(str).digest(_digest),
    encryp: (string) => {
      if (typeof string != 'string') string = string.toString();
      const seed1 = Math.round(new Date().getTime() * Math.random() / 137 / 137 / 137);
      const MT1 = new chee.crypto.MT(seed1);
      const seed2 = generateNewSeed(seed1, MT1) * 1114111;
      const MT2 = new chee.crypto.MT(seed2);
      const crypMaterial1 = Array.from(string, _ => Math.round(MT1.random() * 1114111));
      const crypMaterial2 = generateShuffledIndexes(MT2, string.length);
      const crypData = Array.from(string, _ => _.charCodeAt(0) + crypMaterial1.pop());
      const result = Array.from(crypMaterial2, i => crypData[i]);
      result.splice(Math.floor((result.length + 1) / 3), 0, seed1);
      return result;
    },
    decryp: (crypData) => {
      const seed1 = crypData.splice(Math.floor(crypData.length / 3), 1)[0];
      const MT1 = new chee.crypto.MT(seed1);
      const seed2 = generateNewSeed(seed1, MT1) * 1114111;
      const MT2 = new chee.crypto.MT(seed2);
      const crypMaterial1 = Array.from(crypData, _ => Math.round(MT1.random() * 1114111));
      const crypMaterial2 = generateShuffledIndexes(MT2, crypData.length);
      const result = Array.from(crypData, _ => null);
      for (const i of crypMaterial2) result[i] = crypData.shift();
      return Array.from(result, _ => String.fromCharCode(_ - crypMaterial1.pop())).join('');
    },
    caesarCipher: {
      get order() {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`~!@#$%^&*()=+\t[{]}|\\:;"\'<,>.?/ \n';
      },
      encryp: (text, cipher) => {
        const mt = chee.random.mt.new(cipher);
        const shuffledOrder = chee.random.mt.shuffle(chee.crypto.caesarCipher.order, mt);
        const result = [];
        for (const i of text.split('')) {
          const k = chee.crypto.caesarCipher.order.indexOf(i);
          result.push(k == -1 ? i : shuffledOrder[k]);
          shuffledOrder.push(shuffledOrder.shift());
        }
        return result.join('');
      },
      decryp: (text, cipher) => {
        const mt = chee.random.mt.new(cipher);
        const shuffledOrder = chee.random.mt.shuffle(chee.crypto.caesarCipher.order, mt);
        const result = [];
        for (const i of text.split('')) {
          const k = shuffledOrder.indexOf(i);
          result.push(k == -1 ? i : chee.crypto.caesarCipher.order[k]);
          shuffledOrder.push(shuffledOrder.shift());
        }
        return result.join('');
      }
    }
  };
})();

chee.frontendPack = () => {
  return {
    config: chee.config,
    valid: chee.valid,
    isArray: chee.isArray,
    isIterable: chee.isIterable,
    unique: chee.unique,
    range: chee.range,
    time: chee.time,
    escapeString: chee.escapeString,
    trimObj: chee.trimObj,
    base: chee.base,
    random: {
      ...chee.random,
      mt: null
    },
    formatBytes: chee.formatBytes,
  }
}

module.exports = chee;