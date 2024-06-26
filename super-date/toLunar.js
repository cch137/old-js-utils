const { floor } = require('../');


/**
 * Algorithm for converting the Gregorian calendar to the lunar calendar.
 * Reference: https://github.com/jjonline/calendar.js
 */
const getLunarData = (() => {
  const lunarSolarTermsChart = [
    19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970, //1900-1909
    19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450, 38320, 84343, //1910-1919
    18800, 42160, 46261, 27216, 27968, 109396, 11104, 38256, 21234, 18800, //1920-1929
    25958, 54432, 59984, 92821, 23248, 11104, 100067, 37600, 116951, 51536, //1930-1939
    54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344, 46423, //1940-1949
    27808, 46416, 86869, 19872, 42416, 83315, 21168, 43432, 59728, 27296, //1950-1959
    44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176, //1960-1969
    38608, 19925, 19152, 42192, 54484, 53840, 54616, 46400, 46752, 103846, //1970-1979
    38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256, //1980-1989
    19189, 18800, 25776, 29859, 59984, 27480, 23232, 43872, 38613, 37600, //1990-1999
    51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893, //2000-2009
    43344, 46240, 47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312, //2010-2019
    31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576, //2020-2029
    23200, 30371, 38608, 19195, 19152, 42192, 118966, 53840, 54560, 56645, //2030-2039
    46496, 22224, 21938, 18864, 42359, 42160, 43600, 111189, 27936, 44448, //2040-2049
    84835, 37744, 18936, 18800, 25776, 92326, 59984, 27424, 108228, 43744, //2050-2059
    37600, 53987, 51552, 54615, 54432, 55888, 23893, 22176, 42704, 21972, //2060-2069
    21200, 43448, 43344, 46240, 46758, 44368, 21920, 43940, 42416, 21168, //2070-2079
    45683, 26928, 29495, 27296, 44368, 84821, 19296, 42352, 21732, 53600, //2080-2089
    59752, 54560, 55968, 92838, 22224, 19168, 43476, 41680, 53584, 62034, 54560 //2090-2100
  ];
  const k01='97783',k02='97bd0',k03='97c36',k04='b0b6f',k05='c9274',k06='c91aa',k07='97b6b',k08='97bd1',
  k09='9801e',k10='c9210',k11='c965c',k12='c920e',k13='97bcf',k14='97c35',k15='98082',k16='c95f8',
  k17='c920f',k18='b06bd',k19='b0722',k20='e1cfc',k21='b0270',k22='9801d',k23='c8dc2',k24='7f595',
  k25='7f530',k26='b0b0b',k27='7f0e3',k28='7f148',k29='7f531',k30='7f0e4',k31='b0723',k32='b0b70',
  k33='b0721',k34='7f0e2',k35='b0787',k36='7f149',k37='7f07e',k38='b02d5',k39='7ec96',k40='66aa8',
  k41='98083',k42='6665b',k43='665f6',k44='66a44',
  st01=k01+k02+k03+k04+k05+k06,st02=k07+k08+k09+k10+k11+k12,st03=k13+k14+k15+k16+k11+k17,st04=k02+k18+k19+k11+k20+k17,
  st05=k21+k02+k03+k04+k05+k06,st06=k13+k14+k09+k16+k11+k17,st07=k01+k08+k09+k10+k11+k12,st08=k07+k08+k09+k16+k11+k17,
  st09=k02+k22+k15+k16+k20+k17,st10=k02+k02+k03+k04+k10+k23,st11=k01+k08+k03+k10+k05+k06,st12=k07+k08+k09+k16+k11+k12,
  st13=k01+k02+k03+k10+k05+k06,st14=k13+k14+k15+k16+k20+k17,st15=k02+k02+k14+k04+k17+k19,st16=k02+k02+k24+k04+k17+k19,
  st17=k01+k02+k03+k04+k10+k23,st18=k01+k08+k09+k10+k05+k12,st19=k02+k25+k24+k26+k17+k19,st20=k27+k02+k03+k04+k10+k23,
  st21=k01+k02+k03+k10+k05+k12,st22=k02+k28+k24+k26+k17+k19,st23=k13+k28+k24+k26+k04+k19,st24=k27+k02+k14+k04+k17+k19,
  st25=k13+k28+k29+k26+k04+k19,st26=k27+k02+k24+k04+k17+k19,st27=k07+k08+k09+k10+k05+k12,st28=k13+k30+k29+k26+k04+k19,
  st29=k27+k02+k24+k26+k17+k19,st30=k01+k02+k03+k04+k10+k06,st31=k07+k08+k03+k10+k05+k12,st32=k07+k30+k29+k31+k04+k19,
  st33=k27+k25+k24+k26+k17+k19,st34=k01+k02+k03+k32+k05+k06,st35=k07+k30+k29+k31+k04+k33,st36=k27+k28+k24+k26+k04+k19,
  st37=k27+k02+k14+k04+k10+k23,st38=k34+k28+k24+k26+k04+k19,st39=k34+k28+k29+k26+k04+k19,st40=k07+k30+k29+k31+k35+k33,
  st41=k34+k30+k29+k26+k04+k19,st42=k07+k30+k36+k31+k35+k33,st43=k34+k30+k29+k31+k04+k19,st44=k01+k27+k36+k31+k35+k33,
  st45=k37+k30+k29+k31+k04+k19,st46=k01+k27+k36+k15+k35+k33,st47=k37+k30+k29+k31+k04+k33,st48=k01+k27+k36+k15+k35+k18,
  st49=k37+k30+k36+k31+k35+k33,st50=k01+k27+k36+k15+k31+k18,st51=k37+k27+k36+k31+k35+k33,st52=k01+k27+k28+k15+k31+k38,
  st53=k39+k27+k36+k15+k35+k33,st54=k27+k27+k28+k15+k31+k38,st55=k27+k28+k29+k26+k04+k19,st56=k39+k27+k36+k15+k35+k18,
  st57=k27+k27+k28+k15+k19+k14,st58=k27+k27+k40+k09+k19+k14,st59=k39+k27+k36+k15+k31+k18,st60=k37+k27+k36+k41+k35+k33,
  st61=k39+k27+k28+k15+k31+k38,st62=k37+k27+k36+k15+k35+k33,st63=k27+k42+k40+k09+k15+k14,st64=k43+k27+k28+k15+k31+k38,
  st65=k27+k42+k44+k09+k15+k14,st66=k43+k27+k28+k15+k19+k14,st67=k34+k42+k44+k09+k15+k14,st68=k43+k27+k28+k09+k19+k14;
  const solarTermsChart = [
    st01,st02,st03,st04,st05,st02,st06,st04,st05,st02,st06,st04,st05,st07,st08,st09,
    st10,st11,st12,st09,st10,st13,st12,st14,st10,st13,st02,st03,st15,st01,st02,st03,
    st15,st01,st02,st06,st15,st01,st02,st06,st15,st01,st02,st06,st16,st17,st18,st08,
    st19,st20,st21,st08,st19,st20,st13,st02,st22,st20,st01,st02,st23,st24,st01,st02,
    st23,st24,st01,st02,st25,st24,st01,st02,st25,st26,st01,st27,st28,st29,st30,st31,
    st28,st29,st17,st21,st32,st33,st20,st34,st35,st36,st37,st01,st35,st38,st24,st01,
    st35,st39,st24,st01,st35,st39,st24,st01,st35,st39,st29,st01,st40,st41,st29,st30,
    st42,st43,st29,st17,st44,st45,st33,st37,st46,st47,st36,st37,st48,st47,st39,st24,
    st48,st47,st39,st24,st48,st47,st39,st29,st48,st47,st39,st29,st48,st49,st41,st29,
    st50,st51,st43,st29,st52,st53,st45,st36,st54,st53,st45,st55,st54,st56,st47,st55,
    st57,st56,st47,st39,st57,st56,st47,st39,st58,st56,st49,st39,st58,st59,st49,st43,
    st58,st59,st60,st43,st58,st61,st62,st45,st63,st64,st53,st45,st65,st64,st56,st47,
    st65,st66,st56,st47,st67,st68,st56,st47,st39
  ];
  const tianGan = '甲乙丙丁戊己庚辛壬癸';
  const diZhi = '子丑寅卯辰巳午未申酉戌亥';
  const zodiacs = '鼠牛虎兔龍蛇馬羊猴雞狗豬';
  const solarTerms = '小寒大寒立春雨水驚蟄春分清明穀雨立夏小滿芒種夏至小暑大暑立秋處暑白露秋分寒露霜降立冬小雪大雪冬至';
  const zodiacSigns = '摩羯水瓶雙魚白羊金牛雙子巨蟹獅子處女天秤天蠍射手摩羯';
  const nStr1 = '日一二三四五六七八九十';
  const nStr2 = '初十廿卅';
  const nStr3 = '正二三四五六七八九十冬腊';
  const getLunarYearDays = (y) => {
    let i, sum = 348;
    for (i = 32768; i > 8; i >>= 1) sum += lunarSolarTermsChart[y - 1900] & i ? 1 : 0;
    return sum + getLeapDays(y);
  };
  const getLeapMonth = (y) => lunarSolarTermsChart[y - 1900] & 15;
  const getLeapDays = (y) => getLeapMonth(y) ? (lunarSolarTermsChart[y - 1900] & 65536 ? 30 : 29) : 0;
  const getMonthDays = (y, m) => (m > 12 || m < 1) ? -1 : lunarSolarTermsChart[y - 1900] & (65536 >> m) ? 30 : 29;
  const toGanZhiYear = (lYear) => {
    let ganKey = (lYear - 3) % 10;
    let zhiKey = (lYear - 3) % 12;
    if (ganKey === 0) ganKey = 10;
    if (zhiKey === 0) zhiKey = 12;
    return tianGan[ganKey - 1] + diZhi[zhiKey - 1];
  };
  const toZodiacSign = (cMonth, cDay) => {
    const arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
    return zodiacSigns.substr(cMonth * 2 - (cDay < arr[cMonth - 1] ? 2 : 0), 2);
  };
  const toGanZhi = (offset) => tianGan[offset % 10] + diZhi[offset % 12];
  const getSolarTerm = (y, n) => {
    if (y < 1900 || y > 2100 || n < 1 || n > 24) return -1;
    const _table = solarTermsChart[y - 1900];
    const _calcDay = [];
    for (let index = 0; index < _table.length; index += 5) {
      const chunk = parseInt(`0x${_table.substr(index, 5)}`).toString();
      _calcDay.push(chunk[0], chunk.substr(1, 2), chunk[3], chunk.substr(4, 2));
    }
    return parseInt(_calcDay[n - 1]);
  };
  const toLunarMonth = (m) => (m > 12 || m < 1) ? -1 : `${nStr3[m - 1]}月`;
  const toLunarDay = (d) => {
    let s;
    switch (d) {
      case 10: s = '初十'; break;
      case 20: s = '二十'; break;
      case 30: s = '三十'; break;
      default: s = `${nStr2[floor(d / 10)]}${nStr1[d % 10]}`;
    }
    return s;
  };
  const getShengXiao = (y) => zodiacs[(y - 4) % 12];
  /**
   * @param {Date} date 
   * Returns an object containing data about lunar dates.
   */
  return function getLunarData(date) {
    let y = date.getFullYear(),
    m = date.getMonth() + 1,
    d = date.getDate();
    if (y < 1900 || y > 2100) return;
    if (y === 1900 && m === 1 && d < 31) return;
    let i, leap = 0, temp = 0,
    offset = (Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 31)) / MS_1Day;
    for (i = 1900; i < 2101 && offset > 0; i++) temp = getLunarYearDays(i), offset -= temp;
    if (offset < 0) offset += temp, i--;
    const year = i;
    leap = getLeapMonth(i);
    let isLeap = false;
    for (i = 1; i < 13 && offset > 0; i++) {
      if (leap > 0 && i === leap + 1 && isLeap === false)
      --i, isLeap = true, temp = getLeapDays(year);
      else temp = getMonthDays(year, i);
      if (isLeap === true && i === leap + 1) isLeap = false;
      offset -= temp;
    }
    if (offset === 0 && leap > 0 && i === leap + 1)  isLeap = isLeap ? false : (--i, true);
    else if (offset < 0) offset += temp, --i;
    let solarTerm;
    const firstNode = getSolarTerm(y, m * 2 - 1);
    const secondNode = getSolarTerm(y, m * 2);
    if (firstNode === d) solarTerm = solarTerms.substr(m * 4 - 4, 2);
    if (secondNode === d) solarTerm = solarTerms.substr(m * 4 - 2, 2);
    return {
      shengXiao: getShengXiao(year),
      month: (isLeap ? '閏' : '') + toLunarMonth(i),
      day: toLunarDay(offset + 1) || '',
      gzYear: toGanZhiYear(year) || '',
      gzMonth: (d >= firstNode
        ? toGanZhi((y - 1900) * 12 + m + 12)
        : toGanZhi((y - 1900) * 12 + m + 11)) || '',
      gzDay: toGanZhi((Date.UTC(y, m - 1, 1, 0, 0, 0, 0) / MS_1Day + 25567 + 10) + d - 1) || '',
      solarTerm: solarTerm || '',
      zodiacSign: toZodiacSign(m, d) || ''
    };
  }
})();

/**
 * @param {Date} date 
 * Returns the date string of the lunar calendar.
 */
const toLunar = (date) => {
  const d = getLunarData(date);
  return `${d.gzYear?d.gzYear+'年':''}${d.month}${d.day}`||'未知農曆日期';
}

toLunar.getLunarData = getLunarData;

module.exports = toLunar;