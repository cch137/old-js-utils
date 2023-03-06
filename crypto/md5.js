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

module.exports = (str) => intArrayToHexString(md5(str));