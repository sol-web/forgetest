const fs = require('fs')
const { pki } = require('node-forge')

// // 비동기식 읽어오기
// fs.readFile('rootCert.pem', 'utf8', function (err, data) {
//   //인증서 불러오기 1. 파일이름, 2. ,3. 콜백함수
//   if (err) {
//     return console.log(err)
//   }
//   console.log(data) //읽어와서
//   let caCert = pki.certificateFromPem(data) //인증서 객체로
//   let publicKey = caCert.publicKey
//   console.log(publicKey)
// })

// 동기식 읽어오기
let caCertPem = fs.readFileSync('rootCert.pem', 'utf8')
console.log(caCertPem) //인증서를 pem으로 읽어옴
let caCert = pki.certificateFromPem(caCertPem)
let publicKey = caCert.publicKey

let privateKeyPem = fs.readFileSync('rootPrivateKey.pem', 'utf8') //'' 오타시 에러
let privateKey = pki.privateKeyFromPem(privateKeyPem)

let publicKeyPem = fs.readFileSync('rootPublicKey.pem', 'utf8')
let publicKey1 = pki.publicKeyFromPem(publicKeyPem)

// 개인키에서 공개키 추출하기
let publicKey2 = pki.setRsaPublicKey(privateKey.n, privateKey.e) //privatekey는 가지고 있음, .e는 공개키로
console.log(publicKey2)
