class DataHandler {
  #data;
  get data() {return this.#data}
  set data(value) {return this.#data = value, this.onchange(value), value}
  constructor(data) {
    this.#data = data;
  }
  has(key) {return key in this.data}
  get(key) {return this.data[key]}
  set(key, value) {return this.data[key] = value, this.onchange(value), value}
  remove(key) {return delete this.data[key]}
  keys() {return Object.keys(this.data)}
  values() {return Object.values(this.data)}
  json() {return JSON.stringify(this.data)}
  /** This method can be overridden.
   * @param {*} currentValue
   */
  onchange(currentValue) {}
}

module.exports = DataHandler;