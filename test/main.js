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
  }},"crypto":{"order":"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`~!@#$%^&*()=+\t[{]}|\\:;\"'\u003C,\u003E.?\u002F \n","encryp":(text, cipher=chee.SECRET_KEY) => {
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
      }},"random":{"int":(start, end) => {
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
    },"seed":833.7579843068668,"N":624,"M":397,"MATRIX_A":2567483615,"UPPER_MASK":2147483648,"LOWER_MASK":2147483647,"mt":[833,2223378854,3016866230,839620615,253737415,4200647304,3261156317,2098117789,839116180,2289157997,10950101,560830996,2118024688,1571072290,1953461725,2668641243,2690497965,1934064924,1693704579,1517587037,2794050144,2393141951,661875111,2879655418,2231057136,2655503251,1592770895,4096524769,1200402502,1254656800,2373618979,784815908,3024332116,528826639,3670848013,2758655401,3984152475,635954973,2633479063,1105696496,3166471741,2582752772,1554308744,2850168120,1282380302,798467864,2699609254,2643286243,662403573,1504590554,2671340441,3782895450,3590874961,1540990351,626609980,38231779,1948576455,2275317335,1482149059,1216715461,132445072,211560461,526762591,1019446970,3277042082,2709208518,168379030,73632625,2096921817,4166310269,2085633276,1664513304,148214821,1905147874,1887743961,1432090755,2295635350,2202165169,1883999469,648865131,854181511,2469040788,576199552,1945786835,3365196334,2188116246,3099337018,411571055,3693023779,2010466041,4209489970,3025462448,3971972246,625665062,263084380,3206512043,4249552141,531594471,1214572165,2361890423,3547724173,1257927531,2088321848,3814721252,3169147019,2057060214,3990665565,2967105665,66682651,4096891156,3323966849,4046663353,1279850962,4282481584,2783811857,3509424114,2224604041,230132044,1928779634,3704916950,2374183041,1694635816,3864466599,987949359,3734578951,2305394961,1954758653,1156193003,3978942674,272720886,3959756432,2031850370,3597094451,1122601333,316559178,3442074297,116522474,3888211931,3871903938,3286197680,544533291,4062694276,1515162577,3320084895,2071754524,3517219842,3365117431,1668343255,929313794,3194722143,335445319,1969450138,3784690879,332292805,313222483,3760022874,2017762745,461484597,2113711239,749586301,3502021105,2523479835,4026091135,1366633359,4033555882,3243734354,1988141723,33198441,629903381,1287525874,509785225,2337115064,3212094222,3051677801,3265132005,305404525,3316499121,1704792811,1652404484,309691564,1561420944,4070917866,1787210659,577333665,3431257661,3401692463,747964182,3509621353,1063943822,1621093571,102382408,1896541223,4005134782,3184088402,3024517458,3890851155,169947476,2345298665,2323706493,3692995554,2767262093,3832182068,2134617725,944780215,3243398911,116207161,4175347275,4155349815,3455651924,3009610276,3644862416,1655687698,2365842771,695784138,16729224,1075499647,2393668238,24462869,475587619,3256729002,4225385865,1260014159,2739212196,3576234845,3415057142,3955845258,1999015919,4240385993,1379650966,3317623928,2352881773,1256666034,902246791,533252652,362631238,1894785673,1659922580,1759772854,2673293345,3613974974,89798017,1170220502,368049605,585141420,1452510416,608790634,750578888,2595779551,668073001,1189703206,1562137949,190835271,757624319,164224408,325240310,3013787917,2481992427,2573322222,3741658398,972706420,118398152,1143137261,1496398114,3690219222,1293611025,646530905,717670439,781899630,2355289458,2576502333,2589038313,3496038086,2364441033,1847318824,2488442687,3531307300,3801984119,1890262745,4276929614,579971192,3521622128,620439928,3264255346,3843780528,2759777723,3871636506,580737019,671484454,1423595550,3492174940,1093290397,710379439,367931439,1141582512,2836894203,1564072292,1257034497,291127337,839926359,4165713022,1630225277,2777873689,1278103509,1976169427,3471217930,3858341566,1687799491,1129790909,1100544096,1961683066,691965117,1412017352,124239237,3137139634,235230634,1922615117,2080525880,1481924282,2065200133,2195188435,3281026741,3133891855,3400389731,1272720163,1189099438,1309384784,2442697275,1598839492,219561473,788267182,3532350448,3911220010,98077049,4266589962,1625649371,299905361,2366558021,850773844,749705590,2493625057,3569094627,2177967285,1495952521,965319423,674602739,1809629752,228074199,1871433518,1381098983,2678180635,2855568187,3816835036,1932243803,2997808611,2306360359,300790012,1835118800,1893833946,4092663501,3405004461,3869891086,1494154634,3144051777,4180513498,1115689481,2758108821,2718517761,811257758,37845190,3269500303,1975653806,3203806846,3887062112,1342697348,2062724591,2320825949,406991859,4019227480,303542113,2279218112,3962947334,2245800822,4287980098,3813379620,1928525283,1889465771,4023707540,2551197462,1629505640,3747333106,1118259355,3322941513,1729366202,2226161232,365224420,1355555967,1199822146,3707305980,53835817,1988451004,1465316129,592055601,2510122727,3954724588,2659060959,2460506566,416370666,3049177833,1124051791,3635238239,1687481062,1086803390,3950372087,800451041,2115350627,2225146441,1847079991,2566357231,1344255011,3637921037,48217642,3392176695,977089578,3761639481,1301901962,2174981504,2669318132,3024057273,538230131,1941326604,3195048655,3767837072,2485152687,3089437170,986285410,126948189,1663330917,3003744041,1442459821,3027583379,3914365165,3556316575,1427768390,2440999102,1488213992,898720170,1397064656,3568229428,3059176051,2561212758,632257510,852752769,3165551273,1328081468,1143607511,628436021,223727537,2295835550,3912315478,2427148884,2269948858,3140303205,308332145,595051876,2896127556,3163083119,1342764755,3076375725,3137946079,3354477318,4029685711,1922349395,1964507442,2541864440,452716412,413643207,1220387935,1448749299,2283383640,373933665,2666278693,3598416708,111256549,901658684,3653782928,1083131876,3108236351,2732841720,2833985674,897249169,2628525855,39439708,1775780664,1624967274,3436746533,3831560685,1032125142,2475523679,2684199331,838266744,148616268,272551921,1638335755,1138579689,2302688640,231790659,1693855593,3226951171,902174716,836850793,3740369003,2513916679,3129241593,1779073800,3615786383,2845089343,2147226901,1766328041,628417422,1975961357,1497757124,2105763266,3802235641,3852892333,1711586482,1975467948,2269296207,2298225520,177209354,1931173891,2285630684,801401769,867888321,1455010618,1657490269,2769090915,3443150429,4169349935,1956963958,3315965454,1783059005,2831781833,134635573,2440254472,2663351314,2074848369,2702375506,1285657523,3584526686,4045863126,2841455407,3625459688,772168927,776928548,2795382110,870775671,720693023,1747437672,684803227,1552156246,131862915,2647066080,1121535580,3471542756,3909814615,2326045785,2976288029,3470018162,3431548365,4180003455,1588150566,682988958,4228355986,3490867058,1890929363,542042393,3851377181,1738186263,959719152,3405369075,2900170484,3980244819,1671636182,1408604698,706429423,3566398612,2863999197,2121365830,3785153103,4224241225,2829385600,2858640025,2134367351,3846120159,4287921950,57126340,1145140392,1910536706,2834350213,3048552090,1222501456,3908136782,2733383867,2512055384,2310106078,146557993,2552954763,3564512364,3743729963,423741225,3903293071,787284895,2278262559,1818613206,3497946937,1845358153,766217424,1824120953,566086082,1025994229,2551808277,3821420416,4123601949,2110552133],"mti":624,"init_seed":(s) => {
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
    },"seed":833.7579843068668,"N":624,"M":397,"MATRIX_A":2567483615,"UPPER_MASK":2147483648,"LOWER_MASK":2147483647,"mt":[833,2223378854,3016866230,839620615,253737415,4200647304,3261156317,2098117789,839116180,2289157997,10950101,560830996,2118024688,1571072290,1953461725,2668641243,2690497965,1934064924,1693704579,1517587037,2794050144,2393141951,661875111,2879655418,2231057136,2655503251,1592770895,4096524769,1200402502,1254656800,2373618979,784815908,3024332116,528826639,3670848013,2758655401,3984152475,635954973,2633479063,1105696496,3166471741,2582752772,1554308744,2850168120,1282380302,798467864,2699609254,2643286243,662403573,1504590554,2671340441,3782895450,3590874961,1540990351,626609980,38231779,1948576455,2275317335,1482149059,1216715461,132445072,211560461,526762591,1019446970,3277042082,2709208518,168379030,73632625,2096921817,4166310269,2085633276,1664513304,148214821,1905147874,1887743961,1432090755,2295635350,2202165169,1883999469,648865131,854181511,2469040788,576199552,1945786835,3365196334,2188116246,3099337018,411571055,3693023779,2010466041,4209489970,3025462448,3971972246,625665062,263084380,3206512043,4249552141,531594471,1214572165,2361890423,3547724173,1257927531,2088321848,3814721252,3169147019,2057060214,3990665565,2967105665,66682651,4096891156,3323966849,4046663353,1279850962,4282481584,2783811857,3509424114,2224604041,230132044,1928779634,3704916950,2374183041,1694635816,3864466599,987949359,3734578951,2305394961,1954758653,1156193003,3978942674,272720886,3959756432,2031850370,3597094451,1122601333,316559178,3442074297,116522474,3888211931,3871903938,3286197680,544533291,4062694276,1515162577,3320084895,2071754524,3517219842,3365117431,1668343255,929313794,3194722143,335445319,1969450138,3784690879,332292805,313222483,3760022874,2017762745,461484597,2113711239,749586301,3502021105,2523479835,4026091135,1366633359,4033555882,3243734354,1988141723,33198441,629903381,1287525874,509785225,2337115064,3212094222,3051677801,3265132005,305404525,3316499121,1704792811,1652404484,309691564,1561420944,4070917866,1787210659,577333665,3431257661,3401692463,747964182,3509621353,1063943822,1621093571,102382408,1896541223,4005134782,3184088402,3024517458,3890851155,169947476,2345298665,2323706493,3692995554,2767262093,3832182068,2134617725,944780215,3243398911,116207161,4175347275,4155349815,3455651924,3009610276,3644862416,1655687698,2365842771,695784138,16729224,1075499647,2393668238,24462869,475587619,3256729002,4225385865,1260014159,2739212196,3576234845,3415057142,3955845258,1999015919,4240385993,1379650966,3317623928,2352881773,1256666034,902246791,533252652,362631238,1894785673,1659922580,1759772854,2673293345,3613974974,89798017,1170220502,368049605,585141420,1452510416,608790634,750578888,2595779551,668073001,1189703206,1562137949,190835271,757624319,164224408,325240310,3013787917,2481992427,2573322222,3741658398,972706420,118398152,1143137261,1496398114,3690219222,1293611025,646530905,717670439,781899630,2355289458,2576502333,2589038313,3496038086,2364441033,1847318824,2488442687,3531307300,3801984119,1890262745,4276929614,579971192,3521622128,620439928,3264255346,3843780528,2759777723,3871636506,580737019,671484454,1423595550,3492174940,1093290397,710379439,367931439,1141582512,2836894203,1564072292,1257034497,291127337,839926359,4165713022,1630225277,2777873689,1278103509,1976169427,3471217930,3858341566,1687799491,1129790909,1100544096,1961683066,691965117,1412017352,124239237,3137139634,235230634,1922615117,2080525880,1481924282,2065200133,2195188435,3281026741,3133891855,3400389731,1272720163,1189099438,1309384784,2442697275,1598839492,219561473,788267182,3532350448,3911220010,98077049,4266589962,1625649371,299905361,2366558021,850773844,749705590,2493625057,3569094627,2177967285,1495952521,965319423,674602739,1809629752,228074199,1871433518,1381098983,2678180635,2855568187,3816835036,1932243803,2997808611,2306360359,300790012,1835118800,1893833946,4092663501,3405004461,3869891086,1494154634,3144051777,4180513498,1115689481,2758108821,2718517761,811257758,37845190,3269500303,1975653806,3203806846,3887062112,1342697348,2062724591,2320825949,406991859,4019227480,303542113,2279218112,3962947334,2245800822,4287980098,3813379620,1928525283,1889465771,4023707540,2551197462,1629505640,3747333106,1118259355,3322941513,1729366202,2226161232,365224420,1355555967,1199822146,3707305980,53835817,1988451004,1465316129,592055601,2510122727,3954724588,2659060959,2460506566,416370666,3049177833,1124051791,3635238239,1687481062,1086803390,3950372087,800451041,2115350627,2225146441,1847079991,2566357231,1344255011,3637921037,48217642,3392176695,977089578,3761639481,1301901962,2174981504,2669318132,3024057273,538230131,1941326604,3195048655,3767837072,2485152687,3089437170,986285410,126948189,1663330917,3003744041,1442459821,3027583379,3914365165,3556316575,1427768390,2440999102,1488213992,898720170,1397064656,3568229428,3059176051,2561212758,632257510,852752769,3165551273,1328081468,1143607511,628436021,223727537,2295835550,3912315478,2427148884,2269948858,3140303205,308332145,595051876,2896127556,3163083119,1342764755,3076375725,3137946079,3354477318,4029685711,1922349395,1964507442,2541864440,452716412,413643207,1220387935,1448749299,2283383640,373933665,2666278693,3598416708,111256549,901658684,3653782928,1083131876,3108236351,2732841720,2833985674,897249169,2628525855,39439708,1775780664,1624967274,3436746533,3831560685,1032125142,2475523679,2684199331,838266744,148616268,272551921,1638335755,1138579689,2302688640,231790659,1693855593,3226951171,902174716,836850793,3740369003,2513916679,3129241593,1779073800,3615786383,2845089343,2147226901,1766328041,628417422,1975961357,1497757124,2105763266,3802235641,3852892333,1711586482,1975467948,2269296207,2298225520,177209354,1931173891,2285630684,801401769,867888321,1455010618,1657490269,2769090915,3443150429,4169349935,1956963958,3315965454,1783059005,2831781833,134635573,2440254472,2663351314,2074848369,2702375506,1285657523,3584526686,4045863126,2841455407,3625459688,772168927,776928548,2795382110,870775671,720693023,1747437672,684803227,1552156246,131862915,2647066080,1121535580,3471542756,3909814615,2326045785,2976288029,3470018162,3431548365,4180003455,1588150566,682988958,4228355986,3490867058,1890929363,542042393,3851377181,1738186263,959719152,3405369075,2900170484,3980244819,1671636182,1408604698,706429423,3566398612,2863999197,2121365830,3785153103,4224241225,2829385600,2858640025,2134367351,3846120159,4287921950,57126340,1145140392,1910536706,2834350213,3048552090,1222501456,3908136782,2733383867,2512055384,2310106078,146557993,2552954763,3564512364,3743729963,423741225,3903293071,787284895,2278262559,1818613206,3497946937,1845358153,766217424,1824120953,566086082,1025994229,2551808277,3821420416,4123601949,2110552133],"mti":624,"init_seed":(s) => {
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