const openpgp = require('openpgp')
const { stimateNumBites, stimateCurve, asyncErrorHandler } = require('./utils')

/**
 * All the data generated for the keys' context.
 * @typedef {Object}  keyDataContext
 * @see: https://openpgpjs.org/openpgpjs/doc/module-key.Key.html
 * @type {Object}
 * @property {String} created Creation date in full ISO format
 * @property {Number} version Creation version
 * @property {String} algorithm Algorithm used for creation
 * @property {Boolean} isEncrypted Key is encrypted
 */

/**
 * All the data generated for the keys.
 * @typedef {Object} keyData
 * @see: https://openpgpjs.org/openpgpjs/doc/module-key.Key.html
 * @property {String} privateKey Private Key
 * @property {String} publicKey Public key
 * @property {String} revocationKey Revocation Key
 * @property {keyDataContext} context Key context
 */

/**
 * Generates a new PGP key pair. Supports RSA and ECC keys. Primary and subkey will be of same type.
 * @function genKey
 * @see https://openpgpjs.org/openpgpjs/doc/openpgp.js.html#line115
 * @param {Object} data Information about the new pair of keys.
 * @param {String} data.name Public name to use for keys creation.
 * @param {String} data.email Public email to use for keys creation.
 * @param {String} data.pass Secret password to generate the private key.
 * @param {Number} [data.numBits=2048] Define the RSA key size used for generate the private key. Posibble values (4096 or 2048).
 * @param {String} [data.curve='curve25519'] Define the curve used for generate the private key. Posibble values (curve25519, p256, p384, p521, secp256k1, brainpoolP256r1, brainpoolP384r1, brainpoolP512r1).
 * @param {function(err, key)} [callback] - A callback to run the error and new key
 * @returns {Promise<keyData|Error>} A promise for the user's keys
 */

module.exports = (data, callback) => {
  const errorHandler = asyncErrorHandler(callback)

  const { name, email, pass, numBits, curve } = data
  const options = {
    userIds: [{ name, email }],
    passphrase: pass
  }

  if (numBits) {
    options.numBits = stimateNumBites(numBits)
  }

  if (curve) {
    options.curve = stimateCurve(curve)
  }

  if (!email) return errorHandler('Missing email')
  if (!name) return errorHandler('Missing name')
  if (!pass) return errorHandler('Missing pass')

  return openpgp.generateKey(options)
    .then(key => {
      const { privateKeyArmored: privateKey, publicKeyArmored: publicKey, revocationCertificate: revocationKey } = key
      const keyPacket = key.key.keyPacket
      const { created, version, algorithm, isEncrypted } = keyPacket
      const context = { created, version, algorithm, isEncrypted }
      const data = { privateKey, publicKey, revocationKey, context }
      if (callback) return callback(null, data)
      return data
    })
    .catch(errorHandler)
}
