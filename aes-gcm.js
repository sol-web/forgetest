const forge = require('node-forge') //읽기

const algo = 'AES-GCM' //GCM에서는 테그를 이용하여 비교,

// Modes: ECB, CBC, CFB, OFB, CTR, and GCM)
console.log('Algorithm-mode: ' + algo)

const plaintext =
  'Hello world Hello world 한글메시지 要推出大做出了回应 ポリコットント 新品未開封品 ماذا تريد؟' //평문

const authData = 'binary-encoded string' //인증 데이터

var someBytes = forge.util.encodeUtf8(plaintext) //미리 인코딩된 바이트로 만듬, 다른 언어 사용 가능하도록
console.log('Plaintext: ' + plaintext) // generate a random key and IV
// Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256

var key = forge.random.getBytesSync(16) // 16, 24, 32
var iv = forge.random.getBytesSync(16) // 16
console.log('Key: ' + forge.util.bytesToHex(key))
console.log('IV: ' + forge.util.bytesToHex(iv))

// encrypt some bytes using GCM mode  암호화 객체를 만듬
var cipher = forge.cipher.createCipher(algo, key)
cipher.start({
  iv: iv, // should be a 12-byte binary-encoded string or byte buffer
  additionalData: authData, // 'binary-encoded string', // optional
  tagLength: 128, // optional, defaults to 128 bits
})
cipher.update(forge.util.createBuffer(someBytes))
cipher.finish()
var encrypted = cipher.output
var tag = cipher.mode.tag
// outputs encrypted hex
console.log('Encrypted: ' + encrypted.toHex())
// outputs authentication tag
console.log('Tag: ' + tag.toHex()) // decrypt some bytes using GCM mode

var decipher = forge.cipher.createDecipher(algo, key)
decipher.start({
  iv: iv,
  additionalData: authData, // 'binary-encoded string', // optional  태그값(additionalData)이 맞지 않으면 복호화 안됨
  tagLength: 128, // optional, defaults to 128 bits
  tag: tag, // authentication tag from encryption
})
decipher.update(encrypted)
var pass = decipher.finish() //성공 여부 확인
// pass is false if there was a failure (eg: authentication tag didn't match)
if (pass) {
  // outputs decrypted hex  pass가 참일 때만 출력
  console.log('Deciphered: ' + decipher.output)
}
