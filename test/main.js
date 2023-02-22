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
  },"b10toB64":(number) => chee.base.__b10toBx(number, 64),"b64toB10":(string) => {
    let result = 0;
    string = string.split('').reverse().join('');
    for (let i = 0; i < string.length;) {
      result += (chee.base.chars['64'].indexOf(string[i])) * Math.pow(64, i++);
    }
    return result;
  }},"crypto":{"MT":function MersenneTwister(seed) {
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
  },"md5":(str) => chee.modules.md5(str),"sha256":(str) => chee.modules.sha256(str),"encryp":(string) => {
      if (typeof string != 'string') string = string.toString();
      const seed1 = Math.round(new Date().getTime() * Math.random() / 137 / 137 / 137);
      const MT1 = chee.crypto.MT(seed1);
      const seed2 = generateNewSeed(seed1, MT1) * 1114111;
      const MT2 = chee.crypto.MT(seed2);
      const crypMaterial1 = Array.from(string, _ => Math.round(MT1.random() * 1114111));
      const crypMaterial2 = generateShuffledIndexes(MT2, string.length);
      const crypData = Array.from(string, _ => _.charCodeAt(0) + crypMaterial1.pop());
      const result = Array.from(crypMaterial2, i => crypData[i]);
      result.splice(Math.floor((result.length + 1) / 3), 0, seed1);
      return result;
    },"decryp":(crypData) => {
      const seed1 = crypData.splice(Math.floor(crypData.length / 3), 1)[0];
      const MT1 = chee.crypto.MT(seed1);
      const seed2 = generateNewSeed(seed1, MT1) * 1114111;
      const MT2 = chee.crypto.MT(seed2);
      const crypMaterial1 = Array.from(crypData, _ => Math.round(MT1.random() * 1114111));
      const crypMaterial2 = generateShuffledIndexes(MT2, crypData.length);
      const result = Array.from(crypData, _ => null);
      for (const i of crypMaterial2) result[i] = crypData.shift();
      return Array.from(result, _ => String.fromCharCode(_ - crypMaterial1.pop())).join('');
    },"caesar":{"order":"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`~!@#$%^&*()=+\t[{]}|\\:;\"'\u003C,\u003E.?\u002F \n","encryp":(text, cipher=chee.SECRET_KEY) => {
        const mt = chee.random.mt.new(cipher);
        const shuffledOrder = chee.random.mt.shuffle(chee.crypto.caesar.order, mt);
        const result = [];
        for (const i of text.split('')) {
          const k = chee.crypto.caesar.order.indexOf(i);
          result.push(k == -1 ? i : shuffledOrder[k]);
          shuffledOrder.push(shuffledOrder.shift());
        }
        return result.join('');
      },"decryp":(text, cipher=chee.SECRET_KEY) => {
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
  },"mt":{"new":(seed=undefined) => {
      if (seed === undefined) seed = Math.random() * 1000;
      return chee.modules.MersenneTwister(seed);
    },"choices":(_array, amount=1, mt) => {
      if (!mt) mt = chee.modules.MersenneTwister();
      const result = [];
      let array = [];
      for (let i = 0; i < amount; i++) {
        if (!array.length) array = new Array(..._array);
        const item = array.splice(Math.floor(mt.random() * array.length), 1);
        result.push(item[0]);
      };
      return result;
    },"tempMT":{"MersenneTwister":function MersenneTwister(seed) {
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
  },"md5":(str) => intArrayToHexString(md5(str)),"sha256":(s) => {
      s = encodeUTF8(s);
      return binaryArrayToHexString(calcSha256(stringToBinaryArray(s), s.length * charSize));
    },"seed":411.47963432356073,"N":624,"M":397,"MATRIX_A":2567483615,"UPPER_MASK":2147483648,"LOWER_MASK":2147483647,"mt":[411,1880724776,1258932783,3343999529,2546611350,4176867945,816405976,2264047167,605164313,4178110950,116577379,1143719450,554081203,1456683180,3546607951,352902923,3374965351,678024581,2275961483,1546934560,3225473817,1212298071,2666612484,1297955701,4207249628,2017941268,3746732131,4190207483,663251700,1991951969,3094979582,2896400011,1435340077,3986243197,2639861208,1372408101,1377705816,3960995650,1675132363,3896556249,1501454890,3297951264,211468025,235903336,4145557044,3838225120,67757757,4019072448,501901599,865472620,2884781774,2114788015,3778323674,334244562,47531792,4070349191,1754019148,955399322,3124122364,4140477553,2740783926,2099265473,1578559230,1168153050,61859495,1499881252,1146181339,3548900933,1057912802,1040924271,132253969,2122231036,695772441,4238509094,3721981923,2920645547,395404025,3676458378,3133532251,2145078380,3764812881,1597304491,574694244,2271181511,4173454605,3609900251,3498635662,2787557880,284119546,1998594555,2545037820,3154159505,519358555,340311876,3656047154,1271090868,3961514697,3770924051,1364050610,2277809154,202214500,137750489,4182153731,1464124007,2465417382,1482124573,1873152118,1447691870,3912653543,3310477409,621803800,457383655,4183150739,3211286849,281350881,2231491640,4130139478,2215583742,1643739874,1248196358,2694722875,2306179318,2483713214,2176625319,1833214101,2853080801,2389367565,2966189162,969774472,1239009065,9960266,2826354357,1844063671,3084152659,1838761083,2591248041,4014247167,1080196085,1859943374,1911005238,2057348415,109142019,2978053309,1360097002,2091484743,463958063,1767991837,1811667359,4247022058,2372565634,537974038,3292977221,3415919158,230368386,1760360932,2826773748,1021393834,3882910895,3071829114,2846612471,1228334409,3897818633,3327956116,2452385590,1836495912,4015916498,367797531,1841502030,2895804883,1155131678,999526629,201701380,2245508672,1321034423,3850721404,3916489162,2061280765,1740986653,3444581566,2708644932,302925394,1199677711,3837200700,81943954,945818962,2588156947,2091275375,3889180193,2025874982,3651415328,3118631565,2960142890,3862114952,1040995480,2219489466,3680328027,302798972,1973241265,3106385718,64418891,3734472031,1571412501,1078181550,2794382038,3515806320,1380594476,2397324943,4088154992,3950989359,3428199981,1744361208,487002640,2061807908,1393144174,2698012833,2595062822,2938660620,1937319775,544200432,3333832075,4220260228,2470600736,2542805064,120215569,290248853,3142332586,3752925994,310880528,1215251508,1490634446,2554771345,4113111270,30171201,585876366,864888304,697133211,1375877395,3001624327,2298548967,3234595400,4056157063,1293824005,2495026822,4108617479,1267100040,1765864706,1087653413,1212477739,3093864586,2196250273,2020495945,763821923,4104371723,3078898213,1906702689,4203725791,4119659212,3201033132,84603560,1539679563,3077886262,2373410441,3950883037,2857342621,4217013443,1023484105,1568440663,1420824057,2729917412,3970087115,3733843958,2937899448,2053513586,1616297584,1329241255,4034831505,3221688494,4218497622,3349164447,2818838435,3479065757,1137832303,503979904,559541915,862525251,1824393612,1492204223,4073577493,1117363150,296042700,997440926,1014324857,1261176801,4021681285,1721391108,2552391712,2688239762,2905125369,3660221489,3308131045,4287925226,1943659802,4165982165,3772493469,3044045702,2613786693,3057398837,3207793126,883551272,193172733,3297783303,2812169419,3188383109,3448219260,3491211349,2764402985,3886197299,1469109805,2046168218,2265902438,4088016308,2828794228,2554565328,3623440413,2047781658,320337388,2760069986,4144907815,925299068,2214372149,4035302653,2126182273,3535218380,2310019064,2938388720,1588404937,1432601144,1859855054,1237222397,4172279743,584659584,1563913685,3782265338,3747934612,2000560363,3917887403,1532288674,1310069418,1163911635,1936423735,886145964,533987387,3898649511,1266318613,802098758,2537429249,3656874643,2301258805,4213645849,3999686569,758888826,1495824523,1497328092,1186400924,1630549597,1906356153,1081527558,2445845554,2706798688,2419585563,22079055,1884562846,1957556271,392847771,980514461,1099485800,544486885,334746066,2939759444,823730281,2161641,3811710314,1377215723,3147189201,2275727039,1444863762,2635345665,1395927218,1581308707,986294255,2281122257,313158854,316465574,3648052743,4067671326,4289274620,3933095719,2744145601,1773508477,1461330299,3146743986,2420897537,2587758785,3402234242,1455192697,254708461,2922423831,681952480,2715979256,1983041339,4119317884,3188067254,1989276576,2019379490,753309549,1040061600,2124924096,2378361542,1491436790,3178669590,960248712,3512157773,540048492,2628445251,3982088269,2337674863,2750558123,3819782232,2974292115,1586383842,1274375485,2616014427,2132480973,1037761837,2166225267,2036851784,2301043585,1258757988,3781128591,692042227,4199311767,4155628829,2622704784,4040513877,3931457194,1360286570,1234578933,2558768899,367902245,2962281306,296057722,1572078309,2446141880,3982230055,560864762,1750245225,2613022160,1849055139,1304708788,54117428,2100706896,1308029122,3264895421,4246607813,637688046,386299319,4136395269,2617369649,1363367155,2191787855,28973111,585236106,3794225226,86874022,2662247512,3281791837,2539940850,2884765581,3849421897,463129873,2202534549,451729012,727757222,3217157729,3100314099,2181293818,1391253950,3285314,2824958706,4186229401,67525292,129749959,1340149359,3246756179,2376476286,713657563,2728576855,2520261498,3882432586,4053878720,3730681059,379131477,1336692351,4067321773,4174186398,1396836330,2327241905,1601243034,3186029859,624189698,883055048,2056353255,1959107518,2827529052,4180864024,1781439402,996077435,2868531340,2243938316,3340463501,576010510,2659844751,4121655467,3704652883,323159452,1857402009,4219312646,3256709896,561793127,664318388,574845462,54774465,2290567481,674068828,1365712738,3979370278,2902677681,4256091064,387610081,1806494944,1814355937,91960701,1269236079,2863231109,163751523,1435214384,2503620727,4016170316,1853866319,670827499,3824373981,56080317,85632185,3535339558,3239304643,3737272043,1856306100,800992662,596067420,376911483,177034167,1234172004,2021527307,2702068517,3001845655,3170057470,2994597282,3476644439,2542715228,576690767,1165306469,1940209583,889733090,1839147111,2402519164,4140976629,3091584590,4283447869,1770269368,2467356224,4167500878,3154962854,2912744442,3376675615,1995968596,4277072082,886824383,681751974,452035274,2882319871,185807903,642853258,3892723650,215773814,4118040800,274884322,1208978302,608305776,4066961542,1064692688,1466456936,553010118,769111416,478139059,3977571835,3731070261,552136364,3126081595,719303133,3111875474,662481458,178383389,2062935253,3427057161,3407369816,3880634190,3497187529,3638141979,2740361186,1871760843,1523076382,841287336,2814610102,2420903795],"mti":624,"init_seed":(s) => {
      this.mt[0] = s >>> 0;
      for (this.mti = 1; this.mti < this.N; this.mti++) {
        s = this.mt[this.mti-1] ^ (this.mt[this.mti - 1] >>> 30);
        this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
        + this.mti;
        this.mt[this.mti] >>>= 0;
      }
    },"init_by_array":(init_key, key_length) => {
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
    },"random_int":() => {
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
    },"random_int31":() => (this.random_int() >>> 1),"random_incl":() => (this.random_int() * (1.0 / 4294967295.0)),"random":() => (this.random_int() * (1.0 / 4294967296.0)),"random_excl":() => (this.random_int() + 0.5) * (1.0 / 4294967296.0),"random_long":() =>
      ((this.random_int() >>> 5) * 67108864 + (this.random_int() >>> 6)) * (1.0 / 9007199254740992.0)},"choice":(array, mt) => {
      if (!mt) mt = chee.modules.MersenneTwister();
      return array[Math.floor(mt.random()*array.length)];
    },"shuffle":(array, mt) => {
      if (!mt) mt = chee.modules.MersenneTwister();
      return chee.random.mt.choices(array, array.length, mt);
    }}},"modules":{"MersenneTwister":function MersenneTwister(seed) {
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
  },"md5":(str) => intArrayToHexString(md5(str)),"sha256":(s) => {
      s = encodeUTF8(s);
      return binaryArrayToHexString(calcSha256(stringToBinaryArray(s), s.length * charSize));
    },"seed":411.47963432356073,"N":624,"M":397,"MATRIX_A":2567483615,"UPPER_MASK":2147483648,"LOWER_MASK":2147483647,"mt":[411,1880724776,1258932783,3343999529,2546611350,4176867945,816405976,2264047167,605164313,4178110950,116577379,1143719450,554081203,1456683180,3546607951,352902923,3374965351,678024581,2275961483,1546934560,3225473817,1212298071,2666612484,1297955701,4207249628,2017941268,3746732131,4190207483,663251700,1991951969,3094979582,2896400011,1435340077,3986243197,2639861208,1372408101,1377705816,3960995650,1675132363,3896556249,1501454890,3297951264,211468025,235903336,4145557044,3838225120,67757757,4019072448,501901599,865472620,2884781774,2114788015,3778323674,334244562,47531792,4070349191,1754019148,955399322,3124122364,4140477553,2740783926,2099265473,1578559230,1168153050,61859495,1499881252,1146181339,3548900933,1057912802,1040924271,132253969,2122231036,695772441,4238509094,3721981923,2920645547,395404025,3676458378,3133532251,2145078380,3764812881,1597304491,574694244,2271181511,4173454605,3609900251,3498635662,2787557880,284119546,1998594555,2545037820,3154159505,519358555,340311876,3656047154,1271090868,3961514697,3770924051,1364050610,2277809154,202214500,137750489,4182153731,1464124007,2465417382,1482124573,1873152118,1447691870,3912653543,3310477409,621803800,457383655,4183150739,3211286849,281350881,2231491640,4130139478,2215583742,1643739874,1248196358,2694722875,2306179318,2483713214,2176625319,1833214101,2853080801,2389367565,2966189162,969774472,1239009065,9960266,2826354357,1844063671,3084152659,1838761083,2591248041,4014247167,1080196085,1859943374,1911005238,2057348415,109142019,2978053309,1360097002,2091484743,463958063,1767991837,1811667359,4247022058,2372565634,537974038,3292977221,3415919158,230368386,1760360932,2826773748,1021393834,3882910895,3071829114,2846612471,1228334409,3897818633,3327956116,2452385590,1836495912,4015916498,367797531,1841502030,2895804883,1155131678,999526629,201701380,2245508672,1321034423,3850721404,3916489162,2061280765,1740986653,3444581566,2708644932,302925394,1199677711,3837200700,81943954,945818962,2588156947,2091275375,3889180193,2025874982,3651415328,3118631565,2960142890,3862114952,1040995480,2219489466,3680328027,302798972,1973241265,3106385718,64418891,3734472031,1571412501,1078181550,2794382038,3515806320,1380594476,2397324943,4088154992,3950989359,3428199981,1744361208,487002640,2061807908,1393144174,2698012833,2595062822,2938660620,1937319775,544200432,3333832075,4220260228,2470600736,2542805064,120215569,290248853,3142332586,3752925994,310880528,1215251508,1490634446,2554771345,4113111270,30171201,585876366,864888304,697133211,1375877395,3001624327,2298548967,3234595400,4056157063,1293824005,2495026822,4108617479,1267100040,1765864706,1087653413,1212477739,3093864586,2196250273,2020495945,763821923,4104371723,3078898213,1906702689,4203725791,4119659212,3201033132,84603560,1539679563,3077886262,2373410441,3950883037,2857342621,4217013443,1023484105,1568440663,1420824057,2729917412,3970087115,3733843958,2937899448,2053513586,1616297584,1329241255,4034831505,3221688494,4218497622,3349164447,2818838435,3479065757,1137832303,503979904,559541915,862525251,1824393612,1492204223,4073577493,1117363150,296042700,997440926,1014324857,1261176801,4021681285,1721391108,2552391712,2688239762,2905125369,3660221489,3308131045,4287925226,1943659802,4165982165,3772493469,3044045702,2613786693,3057398837,3207793126,883551272,193172733,3297783303,2812169419,3188383109,3448219260,3491211349,2764402985,3886197299,1469109805,2046168218,2265902438,4088016308,2828794228,2554565328,3623440413,2047781658,320337388,2760069986,4144907815,925299068,2214372149,4035302653,2126182273,3535218380,2310019064,2938388720,1588404937,1432601144,1859855054,1237222397,4172279743,584659584,1563913685,3782265338,3747934612,2000560363,3917887403,1532288674,1310069418,1163911635,1936423735,886145964,533987387,3898649511,1266318613,802098758,2537429249,3656874643,2301258805,4213645849,3999686569,758888826,1495824523,1497328092,1186400924,1630549597,1906356153,1081527558,2445845554,2706798688,2419585563,22079055,1884562846,1957556271,392847771,980514461,1099485800,544486885,334746066,2939759444,823730281,2161641,3811710314,1377215723,3147189201,2275727039,1444863762,2635345665,1395927218,1581308707,986294255,2281122257,313158854,316465574,3648052743,4067671326,4289274620,3933095719,2744145601,1773508477,1461330299,3146743986,2420897537,2587758785,3402234242,1455192697,254708461,2922423831,681952480,2715979256,1983041339,4119317884,3188067254,1989276576,2019379490,753309549,1040061600,2124924096,2378361542,1491436790,3178669590,960248712,3512157773,540048492,2628445251,3982088269,2337674863,2750558123,3819782232,2974292115,1586383842,1274375485,2616014427,2132480973,1037761837,2166225267,2036851784,2301043585,1258757988,3781128591,692042227,4199311767,4155628829,2622704784,4040513877,3931457194,1360286570,1234578933,2558768899,367902245,2962281306,296057722,1572078309,2446141880,3982230055,560864762,1750245225,2613022160,1849055139,1304708788,54117428,2100706896,1308029122,3264895421,4246607813,637688046,386299319,4136395269,2617369649,1363367155,2191787855,28973111,585236106,3794225226,86874022,2662247512,3281791837,2539940850,2884765581,3849421897,463129873,2202534549,451729012,727757222,3217157729,3100314099,2181293818,1391253950,3285314,2824958706,4186229401,67525292,129749959,1340149359,3246756179,2376476286,713657563,2728576855,2520261498,3882432586,4053878720,3730681059,379131477,1336692351,4067321773,4174186398,1396836330,2327241905,1601243034,3186029859,624189698,883055048,2056353255,1959107518,2827529052,4180864024,1781439402,996077435,2868531340,2243938316,3340463501,576010510,2659844751,4121655467,3704652883,323159452,1857402009,4219312646,3256709896,561793127,664318388,574845462,54774465,2290567481,674068828,1365712738,3979370278,2902677681,4256091064,387610081,1806494944,1814355937,91960701,1269236079,2863231109,163751523,1435214384,2503620727,4016170316,1853866319,670827499,3824373981,56080317,85632185,3535339558,3239304643,3737272043,1856306100,800992662,596067420,376911483,177034167,1234172004,2021527307,2702068517,3001845655,3170057470,2994597282,3476644439,2542715228,576690767,1165306469,1940209583,889733090,1839147111,2402519164,4140976629,3091584590,4283447869,1770269368,2467356224,4167500878,3154962854,2912744442,3376675615,1995968596,4277072082,886824383,681751974,452035274,2882319871,185807903,642853258,3892723650,215773814,4118040800,274884322,1208978302,608305776,4066961542,1064692688,1466456936,553010118,769111416,478139059,3977571835,3731070261,552136364,3126081595,719303133,3111875474,662481458,178383389,2062935253,3427057161,3407369816,3880634190,3497187529,3638141979,2740361186,1871760843,1523076382,841287336,2814610102,2420903795],"mti":624,"init_seed":(s) => {
      this.mt[0] = s >>> 0;
      for (this.mti = 1; this.mti < this.N; this.mti++) {
        s = this.mt[this.mti-1] ^ (this.mt[this.mti - 1] >>> 30);
        this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
        + this.mti;
        this.mt[this.mti] >>>= 0;
      }
    },"init_by_array":(init_key, key_length) => {
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
    },"random_int":() => {
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
    },"random_int31":() => (this.random_int() >>> 1),"random_incl":() => (this.random_int() * (1.0 / 4294967295.0)),"random":() => (this.random_int() * (1.0 / 4294967296.0)),"random_excl":() => (this.random_int() + 0.5) * (1.0 / 4294967296.0),"random_long":() =>
      ((this.random_int() >>> 5) * 67108864 + (this.random_int() >>> 6)) * (1.0 / 9007199254740992.0)},"formatBytes":(fileSizeByte=0, toFix=2) => {
  const d = parseInt(Math.log(fileSizeByte) / Math.log(1024))||0;
  return `${(fileSizeByte/Math.pow(1024, d>5?5:d)).toFixed(toFix)} ${['','K','M','G','T','P'][d>5?5:d]}B`;
}};window.chee = chee;export default chee;