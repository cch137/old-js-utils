class PromisesSet extends Set {
  all() {
    return Promise.all([...this]);
  }
}

module.exports = (iterable) => new PromisesSet(iterable);