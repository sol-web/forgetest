const forge = require('node-forge')

let password = 'goeisdnvnsdlskaienglkdl'
let it = 1000
let keySize = 16 //AES-128, SEA-192, AES-256
let salt = forge.random.getBytesSync(16)
let derivedkey = forge.pkcs5.pbkdf2(password, salt, it, keySize)

console.log('password: ' + password)
console.log('salt: ' + forge.util.bytesToHex(salt))
console.log('key-sync: ' + forge.util.bytesToHex(derivedkey))

//비동기식 키생성 함수
forge.pkcs5.pbkdf2(password, salt, it, 32, function (err, derivedkey) {
  if (derivedkey) console.log('key-async: ' + forge.util.bytesToHex(derivedkey))
})
