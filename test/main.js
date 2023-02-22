const chee = {"config":undefined,"valid":{"capitalize":function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },"__testStr":function(str, minLength, maxLength, validReg, name, throwInvalidChars=true) {
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
  },"__isStrType":(str, testFunc) => {
    try {return testFunc(str)} catch {return false}
  },"testEmail":(str) => chee.valid.__testStr(String(str).toLowerCase(), 5, 320, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'email address', false),"testUsername":(str) => chee.valid.__testStr(str, 5, 32, /^[a-zA-Z0-9_]+$/, 'username'),"testPasswd":(str) => chee.valid.__testStr(str, 8, 64, /^[a-zA-Z0-9`~!@#$%^&*()-_=+[{\]}|;:'",<.>/?]+$/, 'password'),"isEmail":(str) => chee.valid.__isStrType(str, chee.valid.testEmail),"isUsername":(str) =>chee.valid. __isStrType(str, chee.valid.testUsername),"isPasswd":(str) => chee.valid.__isStrType(str, chee.valid.testPasswd),"base64":(str, minLen=0, maxLen='') => new RegExp(`^[A-Za-z0-9\\-\\_]{${minLen},${maxLen}}$`).test(str),"formatYTUrl":(url='') => {
    const videoIdRegExp = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})|(?:^|\W)([\w-]{11})(?:$|\W)/;
    const match = url.match(videoIdRegExp);
    if (!match) return null;
    return `https://youtu.be/${ match[1] || match[2] }`;
  }},"isArray":(arg) => Array.isArray(arg),"isIterable":(obj) => typeof obj[Symbol.iterator] === 'function',"unique":(arr) => [...new Set(arr)],"range":(a=null, b=null, c=null) => {
  const numbers = [];
  if      (!(a===null) &&  (b===null) &&  (c===null)) for (let i = 0; i < a; i++) numbers.push(i);  // 只有 a
  else if (!(a===null) && !(b===null) &&  (c===null)) for (let i = a; i < b; i++) numbers.push(i);  // 只有 a 和 b
  else if (!(a===null) && !(b===null) && !(c===null)) for (let i = a; i < b; i+=c) numbers.push(i); // 有 a b c
  return numbers;
},"time":{"new":() => {
    return new Date();
  },"stamp":function() {
    return new Date().getTime();
  },"format":(date, format='yyyy/MM/dd HH:mm:ss', utc) => { 
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
  }},"escapeString":(str) => JSON.stringify(str).slice(1, -1),"trimObj":(obj) => {
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; i++) if (typeof obj === 'object') obj[i] = trimObj(obj[i]);
  } else {
    for (const i in obj) {
      if (obj[i] === undefined || obj[i] === null || obj[i] === NaN) delete obj[i];
    }
  }
  return obj;
},"base":{"chars":{"2":"01","10":"0123456789","16":"0123456789abcdef","36":"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ","64":"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"},"__b10toBx":function(number, base) {
    const result = [], baseChars = chee.base.chars[base];
    number = Math.round(number);
    while (number / base > 0) {
      const n = number % base;
      number = (number - n) / base;
      result.push(baseChars[n]);
    }
    return result.reverse().join('') || baseChars[0];
  },"b10toB64":(number) => chee.base.__b10toBx(number, 64),"b64toB10":function(string, b64Chars) {
    let result = 0;
    string = string.split('').reverse().join('');
    for (let i = 0; i < string.length;) {
      result += ((b64Chars || chee.base.chars['64']).indexOf(string[i])) * Math.pow(64, i++);
    }
    return result;
  },"b64toB10_":function(string) {
    return chee.base.b64toB10(string, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/');
  },"onlyAsciiChars":function(str) {
    let asciiStr = '';
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) <= 127) {
        asciiStr += str.charAt(i);
      }
    }
    return asciiStr;
  }},"crypto":{"md5":(str) => chee.modules.md5(str),"sha256":(str) => chee.modules.sha256(str),"encryp":(string) => {
      if (typeof string != 'string') string = string.toString();
      const seed1 = Math.round(new Date().getTime() * Math.random() / 137 / 137 / 137);
      const MT1 = chee.modules.MT(seed1);
      const seed2 = generateNewSeed(seed1, MT1) * 1114111;
      const MT2 = chee.modules.MT(seed2);
      const crypMaterial1 = Array.from(string, _ => Math.round(MT1.random() * 1114111));
      const crypMaterial2 = generateShuffledIndexes(MT2, string.length);
      const crypData = Array.from(string, _ => _.charCodeAt(0) + crypMaterial1.pop());
      const result = Array.from(crypMaterial2, i => crypData[i]);
      result.splice(Math.floor((result.length + 1) / 3), 0, seed1);
      return result;
    },"decryp":(crypData) => {
      const seed1 = crypData.splice(Math.floor(crypData.length / 3), 1)[0];
      const MT1 = chee.modules.MT(seed1);
      const seed2 = generateNewSeed(seed1, MT1) * 1114111;
      const MT2 = chee.modules.MT(seed2);
      const crypMaterial1 = Array.from(crypData, _ => Math.round(MT1.random() * 1114111));
      const crypMaterial2 = generateShuffledIndexes(MT2, crypData.length);
      const result = Array.from(crypData, _ => null);
      for (const i of crypMaterial2) result[i] = crypData.shift();
      return Array.from(result, _ => String.fromCharCode(_ - crypMaterial1.pop())).join('');
    },"caesar":{"order":"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`~!@#$%^&*()=+\t[{]}|\\:;\"'\u003C,\u003E.?\u002F \n","encryp":(text, cipher=chee.SECRET_KEY||'helloworld') => {
        const mt = chee.random.mt.new(cipher);
        const shuffledOrder = chee.random.mt.shuffle(chee.crypto.caesar.order, mt);
        const result = [];
        for (const i of text.split('')) {
          const k = chee.crypto.caesar.order.indexOf(i);
          result.push(k == -1 ? i : shuffledOrder[k]);
          shuffledOrder.push(shuffledOrder.shift());
        }
        return result.join('');
      },"decryp":(text, cipher=chee.SECRET_KEY||'helloworld') => {
        const mt = chee.random.mt.new(cipher);
        const shuffledOrder = chee.random.mt.shuffle(chee.crypto.caesar.order, mt);
        const result = [];
        for (const i of text.split('')) {
          const k = shuffledOrder.indexOf(i);
          result.push(k == -1 ? i : chee.crypto.caesar.order[k]);
          shuffledOrder.push(shuffledOrder.shift());
        }
        return result.join('');
      }}},"random":{"int":(start, end) => {
    if (!end) end = start, start = 0;
    return Math.floor(start + Math.random() * (end + 1));
  },"_base":(len, base) => {
    const arr = [];
    for (let i = 0; i < len; i ++) arr.push(chee.base.chars[`${base}`][Math.floor(Math.random()*base)]);
    return arr.join('');
  },"base2":(len = 16) => chee.random._base(len, 2),"base10":(len = 6) => chee.random._base(len, 10),"base16":(len = 8) => chee.random._base(len, 16),"base64":(len = 8) => chee.random._base(len, 64),"choices":(_array, amount=1) => {
    const result = [];
    let array = [];
    for (let i = 0; i < amount; i++) {
      if (!array.length) array = new Array(..._array);
      const item = array.splice(Math.floor(Math.random() * array.length), 1);
      result.push(item[0]);
    };
    return result;
  },"choice":(array) => array[Math.floor(Math.random()*array.length)],"shuffle":(array) => {
    return chee.random.choices(array, array.length);
  },"generator":(seed) => {
    const g = () => {
      this.x = (this.x * 1664525 + 1013904223) % 4294967296;
      return this.x / 4294967296;
    }
    g.x = seed;
    return g;
  },"mt":{"new":(seed) => chee.modules.MT(seed),"choices":(_array, amount=1, mt) => {
      if (!mt) mt = chee.modules.MT();
      const result = [];
      let array = [];
      for (let i = 0; i < amount; i++) {
        if (!array.length) array = new Array(..._array);
        const item = array.splice(Math.floor(mt.random() * array.length), 1);
        result.push(item[0]);
      };
      return result;
    },"choice":(array, mt) => {
      if (!mt) mt = chee.modules.MT();
      return array[Math.floor(mt.random()*array.length)];
    },"shuffle":(array, mt) => {
      if (!mt) mt = chee.modules.MT();
      return chee.random.mt.choices(array, array.length, mt);
    }}},"modules":{"MT":function MersenneTwister(seed) {
    if (seed === undefined) {
      seed = new Date().getTime();
    } else if (typeof seed !== 'number') {
      if (Number.isNaN(+seed)) seed = chee.base.b64toB10_(atob(chee.base.onlyAsciiChars(seed.toString())));
      else seed = +seed;
    }
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
  },"md5":(str) => intArrayToHexString(md5(str)),"sha256":(s) => {
      s = encodeUTF8(s);
      return binaryArrayToHexString(calcSha256(stringToBinaryArray(s), s.length * charSize));
    }},"formatBytes":(fileSizeByte=0, toFix=2) => {
  const d = parseInt(Math.log(fileSizeByte) / Math.log(1024))||0;
  return `${(fileSizeByte/Math.pow(1024, d>5?5:d)).toFixed(toFix)} ${['','K','M','G','T','P'][d>5?5:d]}B`;
}};window.chee = chee;export default chee;