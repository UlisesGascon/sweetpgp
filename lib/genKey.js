const openpgp = require('openpgp')
const { stimateNumBites, stimateCurve, asyncErrorHandler } = require('./utils')

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
