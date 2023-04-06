/**
 * @param {Function} callback 
 * @returns {Promise<*>}
 */
const TryPromise = (callback) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await callback());
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = TryPromise;