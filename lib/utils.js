const stimateCurve = curve => {
  const validCurves = ['curve25519', 'p256', 'p384', 'p521', 'secp256k1', 'brainpoolP256r1', 'brainpoolP384r1', 'brainpoolP512r1']
  return validCurves.includes(curve) ? curve : 'curve25519'
}

const stimateNumBites = numBits => {
  return numBits === 4096 ? 4096 : 2048
}

const asyncErrorHandler = callback => {
  callback = typeof (callback) === 'function' ? callback : false
  return err => {
    if (callback) {
      return callback(err)
    }
    return Promise.reject(err)
  }
}

module.exports = { stimateNumBites, stimateCurve, asyncErrorHandler }
