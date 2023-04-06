/**
 * @param {Function} callback 
 * @returns {Promise<*>}
 */
module.exports = (callback) => new Promise(async (resolve, reject) => {
  try {
    resolve(await callback());
  } catch (err) {
    reject(err);
  }
});