const fs = require('fs');
const path = require('path');


const isArray = (arg) => Array.isArray(arg);

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

chee.modules = {
  MersenneTwister: function MersenneTwister(seed) {
    if (seed === undefined) seed = new Date().getTime();
    this.seed = seed;
    this.N = 624;
    this.M = 397;
    this.MATRIX_A = 0x9908b0df;
    this.UPPER_MASK = 0x80000000;
    this.LOWER_MASK = 0x7fffffff;
    this.mt = new Array(this.N);
    this.mti = this.N + 1;
    this.init_seed = (s) => {
      this.mt[0] = s >>> 0;
      for (this.mti = 1; this.mti < this.N; this.mti++) {
        s = this.mt[this.mti-1] ^ (this.mt[this.mti - 1] >>> 30);
        this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
        + this.mti;
        this.mt[this.mti] >>>= 0;
      }
    }
    this.init_by_array = (init_key, key_length) => {
      let i, j, k;
      this.init_seed(19650218);
      i = 1; j = 0;
      k = (this.N > key_length ? this.N : key_length);
      for (; k; k--) {
        const s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
        this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
        + init_key[j] + j;
        this.mt[i] >>>= 0;
        i++; j++;
        if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
        if (j>=key_length) j=0;
      }
      for (k = this.N - 1; k; k--) {
        const s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
        this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i;
        this.mt[i] >>>= 0;
        i++;
        if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
      }
      this.mt[0] = 0x80000000;
    }
    this.random_int = () => {
      let y;
      const mag01 = new Array(0x0, this.MATRIX_A);
      if (this.mti >= this.N) {
        let kk;
        if (this.mti == this.N+1) this.init_seed(5489);
        for (kk = 0; kk < this.N - this.M; kk++) {
          y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
          this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
        }
        for (; kk < this.N-1; kk++) {
          y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
          this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
        }
        y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
        this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];
        this.mti = 0;
      }
      y = this.mt[this.mti++];
      y ^= (y >>> 11);
      y ^= (y << 7) & 0x9d2c5680;
      y ^= (y << 15) & 0xefc60000;
      y ^= (y >>> 18);
      return y >>> 0;
    }
    this.random_int31 = () => (this.random_int() >>> 1);
    this.random_incl = () => (this.random_int() * (1.0 / 4294967295.0));
    this.random = () => (this.random_int() * (1.0 / 4294967296.0));
    this.random_excl = () => (this.random_int() + 0.5) * (1.0 / 4294967296.0);
    this.random_long = () =>
      ((this.random_int() >>> 5) * 67108864 + (this.random_int() >>> 6)) * (1.0 / 9007199254740992.0);
    if (chee.isArray(seed)) this.init_by_array(seed, seed.length);
    else this.init_seed(seed);
    return this;
  },
  md5: (() => {
    const hexDigits = "0123456789abcdef".split("");
    const intArrayToHexString = (intArray) => intArray.map(i => intToHexString (i)).join('');
    const addUnsigned = (a, b) => (a + b) & 4294967295;
    const ff = (a, b, c, d, e, x, s, t) => mixFunc((c & d) | (~c & e), b, c, x, s, t, a);
    const gg = (a, b, c, d, e, x, s, t) => mixFunc((c & e) | (d & ~e), b, c, x, s, t, a);
    const hh = (a, b, c, d, e, x, s, t) => mixFunc(c ^ d ^ e, b, c, x, s, t, a);
    const ii = (a, b, c, d, e, x, s, t) => mixFunc(d ^ (c | ~e), b, c, x, s, t, a);
    const mixFunc = (a, b, c, d, e, f, g) => 
      ((a, b, c) => addUnsigned((a << b) | (a >>> (32 - b)), c))
      ((b = ((a, b, c, d) => (b = addUnsigned(addUnsigned(b, a),
      addUnsigned(c, d))))(a, b, d, f)), e, c);
    const intToHexString  = (num) => {
      let str = "";
      for (let c = 0; c < 4; c++) {
        str += hexDigits[(num >> (8 * c + 4)) & 15]
        + hexDigits[(num >> (8 * c)) & 15];
      }
      return str;
    };
    const strToWordArray  = (str) => {
      const wordArray = [];
      for (let c = 0; c < 64; c += 4) {
        wordArray[c >> 2] = str.charCodeAt(c)
        + (str.charCodeAt(c + 1) << 8)
        + (str.charCodeAt(c + 2) << 16)
        + (str.charCodeAt(c + 3) << 24);
      }
      return wordArray;
    };
    const md5 = (str) => {
      let i;
      const strLength = str.length;
      const result = [1732584193, -271733879, -1732584194, 271733878];
      for (i = 64; i <= strLength; i += 64) {
        mix(result, strToWordArray (str.substring(i - 64, i)), addUnsigned);
      }
      const extraWords = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const extraWordsLength = (str = str.substring(i - 64)).length;
      for (i = 0; i < extraWordsLength; i++) {
        extraWords[i >> 2] |= str.charCodeAt(i) << (i % 4 << 3);
      }
      if (((extraWords[i >> 2] |= 128 << (i % 4 << 3)), i > 55)) {
        for (mix(result, extraWords, addUnsigned), i = 16; i--;) extraWords[i] = 0;
      }
      extraWords[14] = 8 * strLength;
      mix(result, extraWords, addUnsigned)
      return result;
    };
    const mix = (a, b, c) => {
      void 0 === c && (c = addUnsigned);
      let d = a[0], e = a[1], f = a[2], g = a[3];
      const h = ff.bind(null, c);
      (d = h(d, e, f, g, b[0], 7, -680876936)),
      (g = h(g, d, e, f, b[1], 12, -389564586)),
      (f = h(f, g, d, e, b[2], 17, 606105819)),
      (e = h(e, f, g, d, b[3], 22, -1044525330)),
      (d = h(d, e, f, g, b[4], 7, -176418897)),
      (g = h(g, d, e, f, b[5], 12, 1200080426)),
      (f = h(f, g, d, e, b[6], 17, -1473231341)),
      (e = h(e, f, g, d, b[7], 22, -45705983)),
      (d = h(d, e, f, g, b[8], 7, 1770035416)),
      (g = h(g, d, e, f, b[9], 12, -1958414417)),
      (f = h(f, g, d, e, b[10], 17, -42063)),
      (e = h(e, f, g, d, b[11], 22, -1990404162)),
      (d = h(d, e, f, g, b[12], 7, 1804603682)),
      (g = h(g, d, e, f, b[13], 12, -40341101)),
      (f = h(f, g, d, e, b[14], 17, -1502002290)),
      (e = h(e, f, g, d, b[15], 22, 1236535329));
      const i = gg.bind(null, c);
      (d = i(d, e, f, g, b[1], 5, -165796510)),
      (g = i(g, d, e, f, b[6], 9, -1069501632)),
      (f = i(f, g, d, e, b[11], 14, 643717713)),
      (e = i(e, f, g, d, b[0], 20, -373897302)),
      (d = i(d, e, f, g, b[5], 5, -701558691)),
      (g = i(g, d, e, f, b[10], 9, 38016083)),
      (f = i(f, g, d, e, b[15], 14, -660478335)),
      (e = i(e, f, g, d, b[4], 20, -405537848)),
      (d = i(d, e, f, g, b[9], 5, 568446438)),
      (g = i(g, d, e, f, b[14], 9, -1019803690)),
      (f = i(f, g, d, e, b[3], 14, -187363961)),
      (e = i(e, f, g, d, b[8], 20, 1163531501)),
      (d = i(d, e, f, g, b[13], 5, -1444681467)),
      (g = i(g, d, e, f, b[2], 9, -51403784)),
      (f = i(f, g, d, e, b[7], 14, 1735328473)),
      (e = i(e, f, g, d, b[12], 20, -1926607734));
      const j = hh.bind(null, c);
      (d = j(d, e, f, g, b[5], 4, -378558)),
      (g = j(g, d, e, f, b[8], 11, -2022574463)),
      (f = j(f, g, d, e, b[11], 16, 1839030562)),
      (e = j(e, f, g, d, b[14], 23, -35309556)),
      (d = j(d, e, f, g, b[1], 4, -1530992060)),
      (g = j(g, d, e, f, b[4], 11, 1272893353)),
      (f = j(f, g, d, e, b[7], 16, -155497632)),
      (e = j(e, f, g, d, b[10], 23, -1094730640)),
      (d = j(d, e, f, g, b[13], 4, 681279174)),
      (g = j(g, d, e, f, b[0], 11, -358537222)),
      (f = j(f, g, d, e, b[3], 16, -722521979)),
      (e = j(e, f, g, d, b[6], 23, 76029189)),
      (d = j(d, e, f, g, b[9], 4, -640364487)),
      (g = j(g, d, e, f, b[12], 11, -421815835)),
      (f = j(f, g, d, e, b[15], 16, 530742520)),
      (e = j(e, f, g, d, b[2], 23, -995338651));
      const k = ii.bind(null, c);
      (d = k(d, e, f, g, b[0], 6, -198630844)),
      (g = k(g, d, e, f, b[7], 10, 1126891415)),
      (f = k(f, g, d, e, b[14], 15, -1416354905)),
      (e = k(e, f, g, d, b[5], 21, -57434055)),
      (d = k(d, e, f, g, b[12], 6, 1700485571)),
      (g = k(g, d, e, f, b[3], 10, -1894986606)),
      (f = k(f, g, d, e, b[10], 15, -1051523)),
      (e = k(e, f, g, d, b[1], 21, -2054922799)),
      (d = k(d, e, f, g, b[8], 6, 1873313359)),
      (g = k(g, d, e, f, b[15], 10, -30611744)),
      (f = k(f, g, d, e, b[6], 15, -1560198380)),
      (e = k(e, f, g, d, b[13], 21, 1309151649)),
      (d = k(d, e, f, g, b[4], 6, -145523070)),
      (g = k(g, d, e, f, b[11], 10, -1120210379)),
      (f = k(f, g, d, e, b[2], 15, 718787259)),
      (e = k(e, f, g, d, b[9], 21, -343485551)),
      (a[0] = c(d, a[0])),
      (a[1] = c(e, a[1])),
      (a[2] = c(f, a[2])),
      (a[3] = c(g, a[3]));
    };
    return (str) => intArrayToHexString(md5(str));
  })(),
  sha256: (() => {
    const hexDigits = '0123456789abcdef';
    const charSize = 8;
    const rightRoutate = (x, n) => (x >>> n) | (x << (32 - n));
    const shiftRotate = (x, n) => (x >>> n);
    const choose = (x, y, z) => ((x & y) ^ ((~x) & z));
    const majority = (x, y, z) => ((x & y) ^ (x & z) ^ (y & z));
    const sigma0 = (x) => (rightRoutate(x, 2) ^ rightRoutate(x, 13) ^ rightRoutate(x, 22));
    const sigma1 = (x) => (rightRoutate(x, 6) ^ rightRoutate(x, 11) ^ rightRoutate(x, 25));
    const gamma0 = (x) => (rightRoutate(x, 7) ^ rightRoutate(x, 18) ^ shiftRotate(x, 3));
    const gamma1 = (x) => (rightRoutate(x, 17) ^ rightRoutate(x, 19) ^ shiftRotate(x, 10));
    const add32 = (x, y) => {
      const lsw = (x & 0xFFFF) + (y & 0xFFFF);
      const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }
    const stringToBinaryArray = (str) => {
      const bin = [], mask = (1 << charSize) - 1;
      for (let i = 0; i < str.length * charSize; i += charSize) {
        bin[i >> 5] |= (str.charCodeAt(i / charSize) & mask) << (24 - i % 32);
      }
      return bin;
    }
    const binaryArrayToHexString = (binaryArray) => {
      let str = '';
      for (let i = 0; i < binaryArray.length * 4; i++) {
        str += hexDigits.charAt((binaryArray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF)
        + hexDigits.charAt((binaryArray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
      }
      return str;
    }
    const encodeUTF8 = (str) => {
      str = str.replace(/\r\n/g, '\n');
      let encodedString = '';
      for (let n = 0; n < str.length; n++) {
        const c = str.charCodeAt(n);
        if (c < 128) {
          encodedString += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          encodedString += String.fromCharCode((c >> 6) | 192)
          + String.fromCharCode((c & 63) | 128);
        } else {
          encodedString += String.fromCharCode((c >> 12) | 224)
          + String.fromCharCode(((c >> 6) & 63) | 128)
          + String.fromCharCode((c & 63) | 128);
        }
      }
      return encodedString;
    }
    const calcSha256 = (m, l) => {
      const initHashValues = [
        0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
        0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19
      ];
      const hashConstants = [
        0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
        0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
        0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
        0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
        0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC,
        0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
        0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
        0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967,
        0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
        0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
        0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
        0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
        0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
        0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
        0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 
        0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
      ];
      const W = new Array(64);
      let a, b, c, d, e, f, g, h, i, j, T1, T2;
      m[l >> 5] |= 0x80 << (24 - l % 32), m[((l + 64 >> 9) << 4) + 15] = l;
      for (i = 0; i < m.length; i += 16) {
        a = initHashValues[0], b = initHashValues[1], c = initHashValues[2], d = initHashValues[3],
        e = initHashValues[4], f = initHashValues[5], g = initHashValues[6], h = initHashValues[7];
        for (j = 0; j < 64; j++) {
          if (j < 16) W[j] = m[j + i];
          else W[j] = add32(add32(add32(gamma1(W[j - 2]), W[j - 7]), gamma0(W[j - 15])), W[j - 16]);
          T1 = add32(add32(add32(add32(h, sigma1(e)), choose(e, f, g)), hashConstants[j]), W[j]);
          T2 = add32(sigma0(a), majority(a, b, c));
          h = g,  g = f, f = e, e = add32(d, T1), d = c, c = b, b = a, a = add32(T1, T2);
        }
        initHashValues[0] = add32(a, initHashValues[0]);
        initHashValues[1] = add32(b, initHashValues[1]);
        initHashValues[2] = add32(c, initHashValues[2]);
        initHashValues[3] = add32(d, initHashValues[3]);
        initHashValues[4] = add32(e, initHashValues[4]);
        initHashValues[5] = add32(f, initHashValues[5]);
        initHashValues[6] = add32(g, initHashValues[6]);
        initHashValues[7] = add32(h, initHashValues[7]);
      }
      return initHashValues;
    }
    return (s) => {
      s = encodeUTF8(s);
      return binaryArrayToHexString(calcSha256(stringToBinaryArray(s), s.length * charSize));
    };
  })()
}

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

chee.isArray = isArray;

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
    new: (seed=undefined) => {
      if (seed === undefined) seed = Math.random() * 1000;
      return chee.modules.MersenneTwister(seed);
    },
    choices: (_array, amount=1, mt) => {
      if (!mt) mt = chee.modules.MersenneTwister();
      const result = [];
      let array = [];
      for (let i = 0; i < amount; i++) {
        if (!array.length) array = new Array(..._array);
        const item = array.splice(Math.floor(mt.random() * array.length), 1);
        result.push(item[0]);
      };
      return result;
    },
    choice: (array, mt) => {
      if (!mt) mt = chee.modules.MersenneTwister();
      return array[Math.floor(mt.random()*array.length)];
    },
    shuffle: (array, mt) => {
      if (!mt) mt = chee.modules.MersenneTwister();
      return chee.random.mt.choices(array, array.length, mt);
    }
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
    const seedGeneratorMT = chee.modules.MersenneTwister(MT.random()), _ = motherSeed % 3;
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
    md5: (str) => chee.modules.md5(str),
    sha256: (str) => chee.modules.sha256(str),
    encryp: (string) => {
      if (typeof string != 'string') string = string.toString();
      const seed1 = Math.round(new Date().getTime() * Math.random() / 137 / 137 / 137);
      const MT1 = chee.modules.MersenneTwister(seed1);
      const seed2 = generateNewSeed(seed1, MT1) * 1114111;
      const MT2 = chee.modules.MersenneTwister(seed2);
      const crypMaterial1 = Array.from(string, _ => Math.round(MT1.random() * 1114111));
      const crypMaterial2 = generateShuffledIndexes(MT2, string.length);
      const crypData = Array.from(string, _ => _.charCodeAt(0) + crypMaterial1.pop());
      const result = Array.from(crypMaterial2, i => crypData[i]);
      result.splice(Math.floor((result.length + 1) / 3), 0, seed1);
      return result;
    },
    decryp: (crypData) => {
      const seed1 = crypData.splice(Math.floor(crypData.length / 3), 1)[0];
      const MT1 = chee.modules.MersenneTwister(seed1);
      const seed2 = generateNewSeed(seed1, MT1) * 1114111;
      const MT2 = chee.modules.MersenneTwister(seed2);
      const crypMaterial1 = Array.from(crypData, _ => Math.round(MT1.random() * 1114111));
      const crypMaterial2 = generateShuffledIndexes(MT2, crypData.length);
      const result = Array.from(crypData, _ => null);
      for (const i of crypMaterial2) result[i] = crypData.shift();
      return Array.from(result, _ => String.fromCharCode(_ - crypMaterial1.pop())).join('');
    },
    caesar: {
      order: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`~!@#$%^&*()=+\t[{]}|\\:;"\'<,>.?/ \n',
      encryp: (text, cipher=chee.SECRET_KEY) => {
        const mt = chee.random.mt.new(cipher);
        const shuffledOrder = chee.random.mt.shuffle(chee.crypto.caesar.order, mt);
        const result = [];
        for (const i of text.split('')) {
          const k = chee.crypto.caesar.order.indexOf(i);
          result.push(k == -1 ? i : shuffledOrder[k]);
          shuffledOrder.push(shuffledOrder.shift());
        }
        return result.join('');
      },
      decryp: (text, cipher=chee.SECRET_KEY) => {
        const mt = chee.random.mt.new(cipher);
        const shuffledOrder = chee.random.mt.shuffle(chee.crypto.caesar.order, mt);
        const result = [];
        for (const i of text.split('')) {
          const k = shuffledOrder.indexOf(i);
          result.push(k == -1 ? i : chee.crypto.caesar.order[k]);
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
    crypto: chee.crypto,
    random: chee.random,
    modules: chee.modules,
    formatBytes: chee.formatBytes,
  }
}

module.exports = chee;