const forge = require('node-forge')
const rsa = forge.pki.rsa //forge.{} 중괄호...?

let plaintext =
  'RSA test 한글 要推出大做出了回应 ポリコットント 新品未開封品 ماذا تريد؟' //한글 안됨
let plaintextUtf8 = forge.util.encodeUtf8(plaintext) //한글 포함 다른 언어도 되도록, 비트 차이로 인식불가 때문에 따로 처리(내부에서 encode시 정리, 처리)   ---암호화시 비트로 처리, en or de code시 추가 처리 필요

// 1. 키생성
let keyPair = rsa.generateKeyPair({ bits: 2048 }) //동기식, 비동기식 가능, 비어놓을 시 디폴드 값으로  : 2048bit를 만듬
//console.log('key pair: ', keyPair)
let publickey = keyPair.publicKey //코드가 길어지기 때문에 한 함수(이름)로 정의
let privatekey = keyPair.privateKey
console.log('Public key: ', publickey)
console.log('Private key: ', privatekey)
console.log('Public key: \n', forge.pki.publicKeyToPem(publickey))
console.log('Private key: \n', forge.pki.privateKeyToPem(privatekey))
//console.log('p=' + privatekey.p) //  , 대신 +: 인위적으로 스트립트로 만듬
//console.log('q=' + privatekey.q)
//console.log('n=p*q=' + privatekey.n)
//console.log('e=' + privatekey.e) //정해진 공개키
//console.log('d=' + privatekey.d) //d 개인키    //다시 실행하면 다른 암호문이 나옴, 랜덤하게 나오기 때문

// 2. RSA
let encrypted = publickey.encrypt(plaintextUtf8, 'RSA-OAEP', {
  md: forge.md.sha256.create(),
  mgf1: {
    md: forge.md.sha1.create(),
  },
}) // 'RSAES-PKCS1-V1_5' : 기본, 옵션으로 넣어도 그냥 해도 같은 결과,   --- 암호화시 빼고 복호화시 넣어도 암호문 나온다. --RSA-OAEP는 불가능
console.log('암호문1: ' + forge.util.bytesToHex(encrypted))

// 3. 복호화
let decrypted = privatekey.decrypt(encrypted, 'RSA-OAEP', {
  md: forge.md.sha256.create(),
  mgf1: {
    md: forge.md.sha1.create(),
  },
})
console.log('복호화 평문1: ' + forge.util.decodeUtf8(decrypted))

// // 2-1. RSA
// let encrypted1 = publickey.encrypt(plaintextUtf8, 'RSA-OAEP')
// console.log('암호문2: ' + forge.util.bytesToHex(encrypted1)) ///똑같은 평문을 암호화 할 때 결과가 다름 -

// // 3-1. 복호화
// let decrypted1 = privatekey.decrypt(encrypted1, 'RSA-OAEP')
// console.log('복호화 평문2: ' + forge.util.decodeUtf8(decrypted1))
