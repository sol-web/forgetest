const forge = require('node-forge')
const ed25519 = forge.pki.ed25519

let plaintext =
  'Hello world Hello world 한글메시지 要推出大做出了回应 ポリコットント 新品未開封品 ماذا تريد؟'

// 1. 송신자 키생성
let keyPair = ed25519.generateKeyPair()
console.log(keyPair)
let publicKey = keyPair.publicKey
let privateKey = keyPair.privateKey
console.log('Public key: ', publicKey)
console.log('Private key: ', privateKey)

// 2. 송신자 서명생성 - 송신자 개인키 이용
let md1 = forge.md.sha256.create()
md1.update(plaintext, 'utf8')
let Signature1 = ed25519.sign({
  md: md1,
  privateKey: privateKey,
})
console.log('Signature1: ', forge.util.bytesToHex(Signature1))

// 송신자 -> 수신자: <plaintext, signature>

// 3. 수신자 서명검증 - 송신자 공개키 이용
let md2 = forge.md.sha256.create()
md2.update(plaintext, 'utf8')
let result2 = ed25519.verify({
  md: md2,
  signature: Signature1,
  publicKey: publicKey,
})
console.log('Result2: ', result2) //난수화 패딩 사용X, 원래는 서명값이 달라져야 한다...
