/**
 * @param {Function} callback 
 * @returns {Promise<*>}
 */
const tryPromise = (callback) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await callback());
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = tryPromise;