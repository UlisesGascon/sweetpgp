const openpgp = require('openpgp')
const sweetPgp = require('../lib')
const { alice, bob } = require('../__mocks__/samples')

afterEach(() => {
  openpgp.generateKey.mockClear()
})

function validateKeyGeneration (key, user) {
  const { publicKey, privateKey, revocationKey, context } = key
  expect(publicKey).toBe(user.publicKey)
  expect(privateKey).toBe(user.privateKey)
  expect(revocationKey).toBe(user.revocationKey)
  expect(context).toStrictEqual(user.context)
}

function validateOpenpgpCalls (expectedArgument) {
  expect(openpgp.generateKey).toHaveBeenCalled()
  expect(openpgp.generateKey.mock.calls.length).toBe(1)
  expect(openpgp.generateKey.mock.calls[0][0]).toStrictEqual(expectedArgument)
  expect(openpgp.generateKey.mock.calls[0][1]).toBe(undefined)
}
describe('Should generate a new key pair', () => {
  test('should generate a key pair using promises', (done) => {
    const { email, name, pass } = alice
    const data = { email, name, pass }
    sweetPgp
      .genKey(data)
      .then(key => {
        validateKeyGeneration(key, alice)
        validateOpenpgpCalls({
          userIds: [{ name, email }],
          passphrase: pass
        })
        done()
      }).catch(done)
  })
  test('should generate a key pair using callbacks', (done) => {
    const { email, name, pass } = bob
    const data = { email, name, pass }

    sweetPgp.genKey(data, (err, key) => {
      if (err) done(err)
      validateKeyGeneration(key, bob)
      validateOpenpgpCalls({
        userIds: [{ name, email }],
        passphrase: pass
      })
      done()
    })
  })
})

describe('Should not create a new key pair if user information is missing with Callbacks', () => {
  test('should not generate a key pair if email is missing', (done) => {
    const { name, pass } = bob
    const data = { name, pass }
    sweetPgp.genKey(data, (err, key) => {
      expect(err).toStrictEqual('Missing email')
      expect(key).toBe(undefined)
      expect(openpgp.generateKey).not.toHaveBeenCalled()
      done()
    })
  })
  test('should not generate a key pair if name is missing', (done) => {
    const { email, pass } = bob
    const data = { email, pass }
    sweetPgp.genKey(data, (err, key) => {
      expect(err).toStrictEqual('Missing name')
      expect(key).toBe(undefined)
      expect(openpgp.generateKey).not.toHaveBeenCalled()
      done()
    })
  })
  test('should not generate a key pair if passphrase is missing', (done) => {
    const { name, email } = bob
    const data = { name, email }
    sweetPgp.genKey(data, (err, key) => {
      expect(err).toStrictEqual('Missing pass')
      expect(key).toBe(undefined)
      expect(openpgp.generateKey).not.toHaveBeenCalled()
      done()
    })
  })
})

describe('Should not create a new key pair if user information is missing with Promises', () => {
  test('should not generate a key pair if email is missing', () => {
    const { name, pass } = alice
    const data = { name, pass }
    expect(openpgp.generateKey).not.toHaveBeenCalled()
    return expect(sweetPgp.genKey(data)).rejects.toMatch('Missing email')
  })
  test('should not generate a key pair if name is missing', () => {
    const { email, pass } = alice
    const data = { email, pass }
    expect(openpgp.generateKey).not.toHaveBeenCalled()
    return expect(sweetPgp.genKey(data)).rejects.toMatch('Missing name')
  })
  test('should not generate a key pair if passphrase is missing', () => {
    const { email, name } = alice
    const data = { email, name }
    expect(openpgp.generateKey).not.toHaveBeenCalled()
    return expect(sweetPgp.genKey(data)).rejects.toMatch('Missing pass')
  })
})

describe('Should generate a new key pair wtesth custom number of bits for RSA keys', () => {
  test('Should generate a key pair with 4096 bits', (done) => {
    const { email, name, pass } = alice
    const data = { email, name, pass, numBits: 4096 }
    sweetPgp
      .genKey(data)
      .then(key => {
        validateKeyGeneration(key, alice)
        validateOpenpgpCalls({
          userIds: [{ name, email }],
          passphrase: pass,
          numBits: 4096
        })
        done()
      }).catch(done)
  })

  test('should generate a key pair with 2048 if number of bits provided is worng', (done) => {
    const { email, name, pass } = alice
    const data = { email, name, pass, numBits: 500 }
    sweetPgp
      .genKey(data)
      .then(key => {
        validateKeyGeneration(key, alice)
        validateOpenpgpCalls({
          userIds: [{ name, email }],
          passphrase: pass,
          numBits: 2048
        })
        done()
      }).catch(done)
  })
})

describe('Should generate a new key pair with custom elliptic curve for ECC keys', () => {
  test('Should generate a key pair with curve secp256k1', (done) => {
    const { email, name, pass } = alice
    const data = { email, name, pass, curve: 'secp256k1' }
    sweetPgp
      .genKey(data)
      .then(key => {
        validateKeyGeneration(key, alice)
        validateOpenpgpCalls({
          userIds: [{ name, email }],
          passphrase: pass,
          curve: 'secp256k1'
        })
        done()
      }).catch(done)
  })
  test('should not generate a key pair with curve curve25519 if curve provided is worng', (done) => {
    const { email, name, pass } = alice
    const data = { email, name, pass, curve: 'INVENTED' }
    sweetPgp
      .genKey(data)
      .then(key => {
        validateKeyGeneration(key, alice)
        validateOpenpgpCalls({
          userIds: [{ name, email }],
          passphrase: pass,
          curve: 'curve25519'
        })
        done()
      }).catch(done)
  })
})
