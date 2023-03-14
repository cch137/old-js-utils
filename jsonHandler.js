const { readFileSync, writeFileSync, writeFile, statSync } = require('fs');
const DataHandler = require('./dataHandler');


const prototype = DataHandler.prototype;

class JSONHandler extends DataHandler {
  #data = {};
  #lastModified = 0;
  get data() {
    const mtimeMs = statSync(this.filepath).mtimeMs;
    if (this.#lastModified < mtimeMs) {
      const data = JSON.parse(readFileSync(this.filepath, 'utf8'));
      this.#lastModified = mtimeMs;
      for (const k of this.keys()) this.remove(k);
      for (const k in data) this.set(k, data[k]);
      return this.#data = data;
    } else {
      return this.#data;
    }
  }
  set data(value) {return this.#data = value, this.onchange(value), value}
  filepath;
  constructor(filepath) {
    super();
    this.filepath = filepath;
    this.data;
  }
  set(key, value) {return prototype.set.call(this, key, value), this}
  remove(key) {return prototype.remove.call(this, key), this}
  save() {return new Promise((resolve, reject) => {
    writeFile(this.filepath, this.json(), (err) => {
      if (err) reject(err);
      else resolve();
    });
  })}
  saveSync() {return writeFileSync(this.filepath, this.json())}
}

module.exports = JSONHandler;