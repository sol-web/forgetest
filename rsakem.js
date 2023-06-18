const forge = require('node-forge')
const rsa = forge.pki.rsa

// 1. RSA 키생성 - 수신자
const keyPair = rsa.generateKeyPair({ bits: 2048 })
let publickey = keyPair.publicKey
let privatekey = keyPair.privateKey
console.log('Public key: \n', forge.pki.publicKeyToPem(publickey))
console.log('Private key: \n', forge.pki.privateKeyToPem(privatekey))

// 2. 키 캡슐화 - 수신자
var kdf1 = new forge.kem.kdf1(forge.md.sha1.create()) //let md____ 를 한 줄로 줄인 것  , 키생성
var kem = forge.kem.rsa.create(kdf1)
var result = kem.encrypt(keyPair.publicKey, 32) //(순서가 다름, 약간 보편적인 것과 다른 방식 코드)
// result.encapsulation //암호화된 대칭키 : 수신자의 공개키로 암호화한 대칭키  --2048 공개키
// result.key  // 생성된 대칭키

// 3. 대칭키 암호화
var iv = forge.random.getBytesSync(12)
var Plaintext = 'hello world! 한글' //한글처리 1  someBytes --> plaintext
var someBytes = forge.util.encodeUtf8(Plaintext) //한글처리 2 (추가)
var cipher = forge.cipher.createCipher('AES-GCM', result.key)
cipher.start({ iv: iv })
cipher.update(forge.util.createBuffer(someBytes))
cipher.finish()
var encrypted = cipher.output.getBytes() //cipher.output에 암호문이 있음
var tag = cipher.mode.tag.getBytes()

console.log('Plaintext: ' + someBytes)
console.log('Key: ' + forge.util.bytesToHex(result.key)) //화면에 출력 -bytesToHex
console.log()
console.log('Ciphertext: ' + forge.util.bytesToHex(encrypted))
console.log('IV: ' + forge.util.bytesToHex(iv))
console.log('Tag: ' + forge.util.bytesToHex(tag)) //gcm모드면 Tag가 만들어 짐
console.log('Encapsulation: ' + forge.util.bytesToHex(result.encapsulation))
console.log('<Ciphertext, IV, Tag, Encapsulation>을 수신자에게 전송')
console.log()

// 4. 수신자
var kdf1 = new forge.kem.kdf1(forge.md.sha1.create())
var kem = forge.kem.rsa.create(kdf1)
// 캡슐화된 키로부터 개인키로 복호화하여 대칭키 복구
var key = kem.decrypt(privatekey, result.encapsulation, 32) //개인 수신자는 privatekey를 가지고 있음
console.log('Key: ' + forge.util.bytesToHex(key))

// 5. 대칭키 복호화
var decipher = forge.cipher.createDecipher('AES-GCM', key)
decipher.start({ iv: iv, tag: tag })
decipher.update(forge.util.createBuffer(encrypted))
var pass = decipher.finish()
// pass is false if there was a failure (eg: authentication tag didn't match)
if (pass) {
  // outputs 'hello world!'
  console.log(
    'Deciphered: ' + forge.util.decodeUtf8(decipher.output.getBytes()) //한글처리 3
  )
}
