const forge = require('node-forge')
const plaintext =
  'Hello world Hello world 한글메시지 要推出大做出了回应 ポリコットント 新品未開封品 ماذا تريد؟'

const rsa = forge.pki.rsa

// 1. 키생성
let keyPair = rsa.generateKeyPair({ bits: 2048 }) //동기식, 비동기식 가능, 비어놓을 시 디폴드 값으로  : 2048bit를 만듬
console.log('key pair: ', keyPair)
let publickey = keyPair.publicKey //코드가 길어지기 때문에 한 함수(이름)로 정의
let privatekey = keyPair.privateKey
console.log('Public key: \n', forge.pki.publicKeyToPem(publickey))
console.log('Private key: \n', forge.pki.privateKeyToPem(privatekey))

// 2. 서명생성 - 송신자가 송신자의 개인키로 서명
let md1 = forge.md.sha256.create()
md1.update(plaintext, 'utf8')
let sig1 = privatekey.sign(md1) //개인키 : 서명, 디크립트만 가능
console.log('sig1: ' + forge.util.bytesToHex(sig1)) // =console.log('sig1: ', forge.util.bytesToHex(sig1))

// 송신자가 수신자에게 전송: <plaintext, sig1>

// 3. 서명검증 - 수신자가 송신자의 공개키로 검증
let md2 = forge.md.sha256.create() //같은 파일에서 시뮬레이션- 이름 다르게
md2.update(plaintext, 'utf8')
let result1 = publickey.verify(md2.digest().bytes(), sig1)
console.log('Result1: ', result1)

// 2. 서명생성 - 송신자가 송신자의 개인키로 서명
let md3 = forge.md.sha256.create()
md3.update(plaintext, 'utf8')
let sig3 = privatekey.sign(md3) //개인키 : 서명, 디크립트만 가능
console.log('sig3: ' + forge.util.bytesToHex(sig3)) // =console.log('sig1: ', forge.util.bytesToHex(sig1))

// 송신자가 수신자에게 전송: <plaintext, sig1>

// 3. 서명검증 - 수신자가 송신자의 공개키로 검증
let md4 = forge.md.sha256.create() //같은 파일에서 시뮬레이션- 이름 다르게
md4.update(plaintext, 'utf8')
let result4 = publickey.verify(md4.digest().bytes(), sig3)
console.log('Result4: ', result4)
