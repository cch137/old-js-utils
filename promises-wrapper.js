class PromisesWrapper extends Set {
  all() {
    return Promise.all([...this]);
  }
}

module.exports = (iterable) => new PromisesWrapper(iterable);