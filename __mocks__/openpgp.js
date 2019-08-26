'use strict'

const openpgp = jest.genMockFromModule('openpgp')
const mocks = require('./samples')

openpgp.generateKey = jest.fn((opts) => {
  const userName = opts.userIds[0].email === 'alice@demo.com' ? 'alice' : 'bob'
  const userMocks = mocks[userName]
  const key = {
    privateKeyArmored: userMocks.privateKey,
    publicKeyArmored: userMocks.publicKey,
    revocationCertificate: userMocks.revocationKey,
    key: {
      keyPacket: userMocks.context
    }
  }
  return Promise.resolve(key)
})

module.exports = openpgp
