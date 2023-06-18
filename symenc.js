const forge = require('node-forge')

//0. 송신자
let plaintex = 'hello world....dmlfajekdnkvnjk 한글메시지' //16bit가 되면 ciphertext가 2배 정도 늘어남, 패딩을 넣기 때문
// let key = '1234567890123456'   //--쉽게 추측 가능
let key = forge.random.getBytesSync(32) //랜덤난수.동기식(128비트)  AES-128 => 16, AES-192 => 24, AES-256 => 32
let iv1 = forge.random.getBytesSync(16) // 128-bit block size => 16
console.log('Plaintext: ' + plaintex)
console.log('key: ' + forge.util.bytesToHex(key))
console.log('IV: ' + forge.util.bytesToHex(iv1))

//1. 송신자  암호화
let cipher = forge.cipher.createCipher('AES-ECB', key) //송신자 수신자 암호 맞출 것
cipher.start({ iv: iv1 }) //자바스크립트 오브젝트  앞iv 들어가야 하는 키값, 뒤iv 앞의 값
cipher.update(forge.util.createBuffer(plaintex, 'utf8')) // utf8 : 영문 외의 언어도 사용 가능하도록
cipher.finish()
let encrypted = cipher.output
console.log('Ciphertext: ' + encrypted.toHex())

// thdtlswk --> tntlswk : { iv, encrypted}
let sendMessage = {
  iv: iv1,
  ciphertext: encrypted,
}
let sendMessageString = JSON.stringify(sendMessage)
console.log(sendMessageString)
//key는 공개키암호화하여 전송

//2. 수신자 복호화
let decipher = forge.cipher.createDecipher('AES-ECB', key)
decipher.start({ iv: iv1 }) //cbc모드에선 iv를 적지 않을 시 오류, des에서는 적지 않아도 가능
decipher.update(encrypted)
let result = decipher.finish()
console.log('Result: ' + result)
console.log('Decrypted: ' + decipher.output)
