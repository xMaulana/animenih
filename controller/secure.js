const crypto = require("crypto")


module.exports = {
    getRandomHex: () => crypto.randomBytes(30).toString('hex')
}