class PromisesSet extends Set {
  all() {
    return Promise.all([...this]);
  }
}

const promisesSet = (iterable) => new PromisesSet(iterable);
promisesSet.PromisesSet = PromisesSet;

module.exports = promisesSet;