class ParsedCookies {
  constructor(cookiesString='') {
    const cookiesArray = cookiesString.split(';');
    this.toString = () => cookiesString;
    cookiesArray.forEach(cookieItem => {
      const [key, value] = cookieItem.trim().split('=');
      this[decodeURIComponent(key)] = decodeURIComponent(value);
    });
  }
}

module.exports = (str) => new ParsedCookies(str);