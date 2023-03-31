const { round, floor } = require('../');


const MONTHS_1Y   = 12;
const MS_1Sec     = 1e3;
const MS_1Min     = 60 * MS_1Sec;
const MS_1Hour    = 60 * MS_1Min;
const MS_1Day     = 24 * MS_1Hour;
const MS_1Week    = 7 * MS_1Day;
const EPOCH_DATE  = '1970-01-01';
const DATE_REGEX  = /^(0{0,}[0-9]{1,})(?:-(0?[1-9]|1[012]))(?:-(0[1-9]|[12][0-9]|3[01]))$/;
const TIME_REGEX  = /^([01]?\d|[0-3]):([0-5]?\d)(?::([0-5]?\d)(?:\.(\d{0,}))?)?$/;
// const DEMO_DATE   = new Date();

/**
 * @param {SuperDate} date
 */
// const correction = date => date.addMs(DEMO_DATE.getTimezoneOffset() * MS_1Min);
const correction = date => date;

/**
  * `SuperDate` extends the native `Date` object in JavaScript,
  * you can declare a SuperDate object just like declaring a `Date` object.
  * 
  * There are some differences between creating a SuperDate and a Date:
  * - You can directly pass a string in time format,
  *   such as `new SuperDate('08:30:01');`
  *   This will create a `Date` object of `"1970-01-01 08:30:01"`.
  */
class SuperDate extends Date {
  constructor(...args) {
    if (args.length === 1) {
      if (args[0] instanceof SuperDate) {
        return super(args[0].toMs());
      }
      if (typeof args[0] === 'string') {
        const dateMatch = TIME_REGEX.exec(args[0]);
        if (dateMatch) {
          const y = dateMatch[1];
          const m = dateMatch[2] || '1';
          const d = dateMatch[3] || '1';
          super(`${y}-${m}-${d} 0:0`);
          return correction(this);
        }
        const timeMatch = TIME_REGEX.exec(args[0]);
        if (timeMatch) {
          const h = timeMatch[1];
          const m = timeMatch[2];
          const s = timeMatch[3] || '0';
          const ms = timeMatch[4] || '0';
          super(`${EPOCH_DATE} ${h}:${m}:${s}.${ms}`);
          return correction(this);
        }
      }
    }
    super(...args);
    return correction(this);
  }
  
  static Date = Date;

  /**
   * Get timestamp.
   */
  static stamp = () => SuperDate.now();

  /**
   * Create a SuperDate object.
   */
  static $ = function create(...args) {return new SuperDate(...args)}

  /**
   * Returns a formatted date string of now.
   * @param {String|undefined} format
   * @param {Boolean|undefined} isUTC
   */
  static format = (format, isUTC) => SuperDate.prototype.f.call(this.$(), format, isUTC);
  static f = this.format;
}

/**
 * Returns the number of milliseconds since January 1, 1970, 00:00:00 UTC.
 * @returns {number} The number of milliseconds since January 1, 1970, 00:00:00 UTC.
 */
SuperDate.prototype.toMs = function() {return this.getTime()}

/**
 * Returns the number of seconds elapsed since January 1, 1970, 00:00:00 UTC.
 * @returns {number} The number of seconds elapsed since January 1, 1970, 00:00:00 UTC.
 */
SuperDate.prototype.toSecs = function() {return this.toMs() / MS_1Sec}

/**
 * Returns the number of minutes elapsed since January 1, 1970, 00:00:00 UTC.
 * @returns {number} The number of minutes elapsed since January 1, 1970, 00:00:00 UTC.
 */
SuperDate.prototype.toMins = function() {return this.toMs() / MS_1Min}

/**
 * Returns the number of hours elapsed since January 1, 1970, 00:00:00 UTC.
 * @returns {number} The number of hours elapsed since January 1, 1970, 00:00:00 UTC.
 */
SuperDate.prototype.toHours = function() {return this.toMs() / MS_1Hour}

/**
 * Returns the number of days elapsed since January 1, 1970, 00:00:00 UTC.
 * @returns {number} The number of days elapsed since January 1, 1970, 00:00:00 UTC.
 */
SuperDate.prototype.toDays = function() {return this.toMs() / MS_1Day}

/**
 * Returns the number of weeks elapsed since January 1, 1970, 00:00:00 UTC.
 * @returns {number} The number of weeks elapsed since January 1, 1970, 00:00:00 UTC.
 */
SuperDate.prototype.toWeeks = function() {return this.toMs() / MS_1Week}

/**
 * Returns the number of months elapsed since January 1, 1970, 00:00:00 UTC.
 * @returns {number} The number of months elapsed since January 1, 1970, 00:00:00 UTC.
 */
SuperDate.prototype.toMonths = function() {return this.toYears() * MONTHS_1Y}

/**
 * Returns the number of years elapsed since January 1, 1970, 00:00:00 UTC.
 * @returns {number} The number of years elapsed since January 1, 1970, 00:00:00 UTC.
 */
SuperDate.prototype.toYears = function() {
  const thisYear = this.getFullYear();
  const thisYearMs = $(`${thisYear}-01-01`).toMs();
  return thisYear - $(0).getFullYear() + ((this.toMs() - thisYearMs) / ($(`${thisYear + 1}-01-01`).toMs() - thisYearMs));
}

/**
 * Add a value that can be parsed as a date to the current date.
 * @param  {...any} date
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.add = function(...date) {return this.addMs($(...date).toMs())}

/**
 * Add milliseconds to the current date.
 * @param  {Number} ms
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.addMs = function(ms) {return this.setMs(this.getMs() + ms)}

/**
 * Add seconds to the current date.
 * @param  {Number} secs
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.addSecs = function(secs) {return this.addMs(secs * MS_1Sec)}

/**
 * Add minutes to the current date.
 * @param  {Number} min
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.addMins = function(min) {return this.addMs(min * MS_1Min)}

/**
 * Add hours to the current date.
 * @param  {Number} hours
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.addHours = function(hours) {return this.addMs(hours * MS_1Hour)}

/**
 * Add days to the current date.
 * @param  {Number} days
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.addDays = function(days) {return this.addMs(days * MS_1Day)}

/**
 * Add weeks to the current date.
 * @param  {Number} weeks
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.addWeeks = function(weeks) {return this.addMs(weeks * MS_1Week)}

/**
 * Add months to the current date.
 * @param  {Number} months
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.addMonths = function(months) {this.setMonth(this.getMonth() + months);return this}

/**
 * Add years to the current date.
 * @param  {Number} years
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.addYears = function(years) {return this.addMonths(years * MONTHS_1Y)}

/**
 * Diff a value that can be parsed as a date from the current date.
 * @param  {...any} date
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.diff = function(...date) {return this.diffMs($(...date).toMs())}

/**
 * Subtract milliseconds from the current date.
 * @param  {Number} milliseconds
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.diffMs = function(ms) {return this.setMs(this.getMs() - ms)}

/**
 * Subtract seconds from the current date.
 * @param  {Number} secs
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.diffSecs = function(secs) {return this.diffMs(secs * MS_1Sec)}

/**
 * Subtract minutes from the current date.
 * @param  {Number} min
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.diffMins = function(min) {return this.diffMs(min * MS_1Min)}

/**
 * Subtract hours from the current date.
 * @param  {Number} hours
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.diffHours = function(hours) {return this.diffMs(hours * MS_1Hour)}

/**
 * Subtract days from the current date.
 * @param  {Number} days
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.diffDays = function(days) {return this.diffMs(days * MS_1Day)}

/**
 * Subtract weeks from the current date.
 * @param  {Number} weeks
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.diffWeeks = function(weeks) {return this.diffMs(weeks * MS_1Week)}

/**
 * Subtract months from the current date.
 * @param  {Number} months
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.diffMonths = function(months) {this.setMonth(this.getMonth() - months);return this}

/**
 * Subtract years from the current date.
 * @param  {Number} years
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.diffYears = function(years) {return this.diffMonths(years * MONTHS_1Y)}

/**
 * Determines whether the current year is leap year.
 * @returns {Boolean}
 */
SuperDate.prototype.isLeapYear = function() {
  const year = y.getFullYear();
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Determines whether the current date is between given dates.
 * @param  {SuperDate|Date|Number|undefined} date
 * @returns {Boolean}
 */
SuperDate.prototype.isBetween = function(date1, date2) {
  date1 = $(date1), date2 = $(date2);
  if (date1 > date2) [date1, date2] = [date2, date1];
  return Boolean(this > date1 && this < date2);
}

/**
 * Determines whether the current date is before another date.
 * @param  {SuperDate|Date|Number|undefined} date
 * @returns {Boolean}
 */
SuperDate.prototype.isBefore = function(date) {return Boolean(this < $(date))}

/**
 * Determines whether the current date is after another date.
 * @param  {SuperDate|Date|Number|undefined} date
 * @returns {Boolean}
 */
SuperDate.prototype.isAfter = function(date) {return Boolean(this > $(date))}

/**
 * Determines whether the current date is equal to another date.
 * @param  {SuperDate|Date|Number|undefined} date
 * @returns {Boolean}
 */
SuperDate.prototype.isEqual = function(date) {return Boolean(this.toMs() === $(date).toMs())}

/**
 * Determines whether the current date is equal or before to another date.
 * @param  {SuperDate|Date|Number|undefined} date
 * @returns {Boolean}
 */
SuperDate.prototype.isEqualOrBefore = function(date) {return Boolean(this <= $(date))}

/**
 * Determines whether the current date is equal or after to another date.
 * @param  {SuperDate|Date|Number|undefined} date
 * @returns {Boolean}
 */
SuperDate.prototype.isEqualOrAfter = function(date) {return Boolean(this >= $(date))}

/**
 * Determines whether the current date is daytime.
 * @returns {Boolean}
 */
SuperDate.prototype.isDaytime = function() {
  const h = this.getHours();
  return Boolean(h > 6 && h < 20);
}

/**
 * Determines whether the current date is night.
 * @returns {Boolean}
 */
SuperDate.prototype.isNight = function(date) {
  const h = this.getHours();
  return Boolean(h < 7 && h > 19);
}

/**
 * Gets the milliseconds of a Date, using local time.
 * @returns {Number}
 */
SuperDate.prototype.getMs = function() {return this.getMilliseconds()}

/**
 * Gets the seconds of a SuperDate object, using local time.
 * @returns {Number}
 */
SuperDate.prototype.getSecs = function() {return this.getSeconds()}

/**
 * Gets the minutes of a SuperDate object, using local time.
 * @returns {Number}
 */
SuperDate.prototype.getMins = function() {return this.getMinutes()}

const setHours = Date.prototype.setHours;
const setDate = Date.prototype.setDate;
const setMonth = Date.prototype.setMonth;
const setFullYear = Date.prototype.setFullYear;

/**
 * Reset the value of the SuperDate object.
 * @param  {...any} date 
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.set = function(...date) {return this.diff(this).add(...date)}

/**
 * Sets the milliseconds value in the SuperDate object using local time.
 * @param ms — A numeric value equal to the millisecond value.
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.setMs = function(ms) {this.setMilliseconds(ms);return this}

/**
 * Sets the milliseconds value in the SuperDate object using local time.
 * @param ms — A numeric value equal to the millisecond value.
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.setSecs = function(sec, ms) {this.setSeconds(sec, ms);return this}

/**
 * Sets the minutes value in the SuperDate object using local time.
 * @param min — A numeric value equal to the minutes value.
 * @param sec — A numeric value equal to the seconds value.
 * @param ms — A numeric value equal to the milliseconds value.
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.setMins = function(min, sec, ms) {this.setMinutes(min, sec, ms);return this}

/**
 * Sets the hour value in the SuperDate object using local time.
 * @param hours — A numeric value equal to the hours value.
 * @param min — A numeric value equal to the minutes value.
 * @param sec — A numeric value equal to the seconds value.
 * @param ms — A numeric value equal to the milliseconds value.
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.setHours = function(hours, min, sec, ms) {setHours.call(this, hours, min, sec, ms);return this}

/**
 * Sets the numeric day-of-the-month value of the SuperDate object using local time.
 * @returns {SuperDate} The updated SuperDate Object.
 * @param date — A numeric value equal to the day of the month.
 */
SuperDate.prototype.setDate = function(date) {setDate.call(this, date);return this}

/**
 * Sets the month value in the SuperDate object using local time.
 * @param month — A numeric value equal to the month. The value for January is 0, and other month values follow consecutively.
 * @param date — A numeric value representing the day of the month. If this value is not supplied, the value from a call to the getDate method is used.
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.setMonth = function(month, date) {setMonth.call(this, month, date);return this}

/**
 * Sets the year of the SuperDate object using local time.
 * @param {Number} year — A numeric value for the year.
 * @param month — A zero-based numeric value for the month (0 for January, 11 for December). Must be specified if numDate is specified.
 * @param date — A numeric value equal for the day of the month.
 * @returns {SuperDate} The updated SuperDate Object.
 */
SuperDate.prototype.setFullYear = function(year, month, date) {setFullYear.call(this, year, month, date);return this}

/**
 * Set milliseconds to 0.
 * @returns {SuperDate} The Updated SuperDate Object.
 */
SuperDate.prototype.startOfSec = function() {return this.setMs(0)}

/**
 * Set seconds and milliseconds to 0.
 * @returns {SuperDate} The Updated SuperDate Object.
 */
SuperDate.prototype.startOfMin = function() {return this.setSecs(0, 0)}

/**
 * Set minutes, seconds and milliseconds to 0.
 * @returns {SuperDate} The Updated SuperDate Object.
 */
SuperDate.prototype.startOfHour = function() {return this.setMins(0, 0, 0)}

/**
 * Set hours, minutes, seconds and milliseconds to 0.
 * @returns {SuperDate} The Updated SuperDate Object.
 */
SuperDate.prototype.startOfDay = function() {this.setHours(0, 0, 0, 0);return this}

/**
 * Set the date to the first day of the week (Sunday) and set hours, minutes, seconds and milliseconds to 0.
 * @returns {SuperDate} The Updated SuperDate Object.
 */ 
SuperDate.prototype.startOfWeek = function() {this.diffDays(this.getDay()).setHours(0, 0, 0, 0);return this}

/**
 * Set the date to the first day of the month and set hours, minutes, seconds and milliseconds to 0.
 * @returns {SuperDate} The Updated SuperDate Object.
 */
SuperDate.prototype.startOfMonth = function() {this.setDate(1);return this.startOfDay()}

/**
 * Set the date to the first day of the year and set hours, minutes, seconds and milliseconds to 0.
 * @returns {SuperDate} The Updated SuperDate Object.
 */
SuperDate.prototype.startOfYear = function() {this.setMonth(0, 1);return this.startOfDay()}

/**
 * Sets the date to the end of the second.
 * @returns {SuperDate} The updated SuperDate object.
 */
SuperDate.prototype.endOfSec = function() {
  return this.setMs(999);
}

/**
 * Sets the date to the end of the minute.
 * @returns {SuperDate} The updated SuperDate object.
 */
SuperDate.prototype.endOfMin = function() {
  return this.setSecs(59, 999);
}

/**
 * Sets the date to the end of the hour.
 * @returns {SuperDate} The updated SuperDate object.
 */
SuperDate.prototype.endOfHour = function() {
  return this.setMins(59, 59, 999);
}

/**
 * Sets the date to the end of the day.
 * @returns {SuperDate} The updated SuperDate object.
 */
SuperDate.prototype.endOfDay = function() {
  this.setHours(23, 59, 59, 999);
  return this;
}

/**
 * Sets the date to the end of the week, which is Saturday.
 * @returns {SuperDate} The updated SuperDate object.
 */
SuperDate.prototype.endOfWeek = function() {
  this.addDays(6 - this.getDay()).setHours(23, 59, 59, 999);
  return this;
}

/**
 * Sets the date to the end of the month.
 * @returns {SuperDate} The updated SuperDate object.
 */
SuperDate.prototype.endOfMonth = function() {
  return this.addMonths(1).startOfMonth().diffDays(1).endOfDay();
}

/**
 * Sets the date to the end of the year.
 * @returns {SuperDate} The updated SuperDate object.
 */
SuperDate.prototype.endOfYear = function() {
  this.setMonth(11, 31);
  return this.endOfDay();
}

/**
 * Returns a relative time string, for example, the relative time of 2023-01-01 to 2023-02-01 is "1 month ago"
 * @param {SuperDate|Date|Number|undefined} date The date to be compared 
 * @param {'year'|'month'|'week'|'day'|'hour'|'minute'|'second'|undefined} unit Specify the unit of relative time
 * @return {String}
 * @eg const t1 = new Date(); const t2 = new Date('2020-01-01'); console.log(t1.relative(t2));
 */
SuperDate.prototype.relative = function(date, unit) {
  const diffDate = $((date ? $() : $(date)).toMs() - this.toMs());
  const isPast = diffDate.toMs() < 0;
  const s = diffDate.toSecs(), m = diffDate.toMins(), h = diffDate.toHours(), d = diffDate.toDays(),
  w = diffDate.toWeeks(), M = diffDate.toMonths(), y = diffDate.toYears();
  let value;
  if (y >= 1 && (!unit || unit === 'year')) {
    value = y, unit = 'year';
  } else if (M >= 1 && (!unit || unit === 'month')) {
    value = M, unit = 'month';
  } else if (w >= 1 && (!unit || unit === 'week')) {
    value = w, unit = 'week';
  } else if (d >= 1 && (!unit || unit === 'day')) {
    value = d, unit = 'day';
  } else if (h >= 1 && (!unit || unit === 'hour')) {
    value = h, unit = 'hour';
  } else if (m >= 1 && (!unit || unit === 'minute')) {
    value = m, unit = 'minute';
  } else if (s >= 1 && (!unit || unit === 'second')) {
    value = s, unit = 'second';
  } else if (unit) return this.relative(date, 0);
  else return 'Just now';
  value = unit === 'day' ? round(value) : floor(value);
  value = `${value} ${unit}${value > 1 ? 's' : ''}`;
  return isPast ? `${value} ago` : `In ${value}`;
}

/**
 * Returns a formatted date string.
 * @param {String|undefined} format
 * @param {Boolean|undefined} isUTC
 */
SuperDate.prototype.format = function (format='yyyy-MM-dd HH:mm:ss', isUTC=false) { 
  const addLeadingZeros = (val, len = 2) => val.toString().padStart(len, '0');
  const dateProperties = isUTC
  ? {
    y: this.getUTCFullYear(), M: this.getUTCMonth() + 1, d: this.getUTCDate(),
    w: this.getUTCDay(), H: this.getUTCHours(), m: this.getUTCMinutes(),
    s: this.getUTCSeconds(), f: this.getUTCMilliseconds()
  }
  : {
    y: this.getFullYear(), M: this.getMonth() + 1, d: this.getDate(),
    w: this.getDay(), H: this.getHours(), m: this.getMinutes(),
    s: this.getSeconds(), f: this.getMilliseconds()
  };
  const T = dateProperties.H < 12 ? 'AM' : 'PM', h = dateProperties.H % 12 || 12;
  return format
  .replace(/yyyy/g, dateProperties.y)
  .replace(/yy/g, `${dateProperties.y}`.substring(2, 4))
  .replace(/y/g, dateProperties.y)
  .replace(/HH/g, addLeadingZeros(dateProperties.H))
  .replace(/H/g, dateProperties.H)
  .replace(/hh/g, addLeadingZeros(h))
  .replace(/h/g, h)
  .replace(/mm/g, addLeadingZeros(dateProperties.m))
  .replace(/m/g, dateProperties.m)
  .replace(/ss/g, addLeadingZeros(dateProperties.s))
  .replace(/s/g, dateProperties.s)
  .replace(/fff/g, round(dateProperties.f))
  .replace(/ff/g, round(dateProperties.f / 10))
  .replace(/f/g, round(dateProperties.f / 100))
  .replace(/TT/gi, T)
  .replace(/T/gi, T.charAt(0))
  .replace(/MMMM/g, ['January','February','March','April','May','June',
    'July','August','September','October','November','December'][dateProperties.M - 1])
  .replace(/MMM/g, ['Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'][dateProperties.M - 1])
  .replace(/^MM$/g, addLeadingZeros(dateProperties.M))
  .replace(/^M$/g, dateProperties.M)
  .replace(/dddd/g, ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dateProperties.w])
  .replace(/ddd/g, ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dateProperties.w])
  .replace(/^dd$/g, addLeadingZeros(dateProperties.d))
  .replace(/^d$/g, dateProperties.d);
}

SuperDate.prototype.f = SuperDate.prototype.format;

const $ = SuperDate.$;

module.exports = SuperDate;