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

module.exports = (s) => {
  s = encodeUTF8(s);
  return binaryArrayToHexString(calcSha256(stringToBinaryArray(s), s.length * charSize));
};