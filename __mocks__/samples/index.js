const fs = require('fs')
const path = require('path')

const getFileContent = fileName => fs.readFileSync(path.join(__dirname, `/${fileName}.txt`), 'utf8')
const getJsonFileContent = fileName => JSON.parse(fs.readFileSync(path.join(__dirname, `/${fileName}.json`), 'utf8'))

module.exports = {
  bob: {
    publicKey: getFileContent('bob_public_key'),
    privateKey: getFileContent('bob_private_key'),
    revocationKey: getFileContent('bob_revocation_key'),
    context: getJsonFileContent('bob_context_key'),
    email: 'bob@demo.com',
    name: 'Bob Doe',
    pass: 'ygx^dmxwGnjf4L^y^thP&ZmGY?rd+R'
  },
  alice: {
    publicKey: getFileContent('alice_public_key'),
    privateKey: getFileContent('alice_private_key'),
    revocationKey: getFileContent('alice_revocation_key'),
    context: getJsonFileContent('alice_context_key'),
    email: 'alice@demo.com',
    name: 'Alice Doe',
    pass: '4NsLxza_*Rfa9n*AS#7=Mu2Ndg6Rt8'
  }
}
