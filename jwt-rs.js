const jwt = require('jsonwebtoken')
const forge = require('node-forge')

const pki = forge.pki
const rsa = forge.pki.rsa

// 1. 키쌍 생성
const keypair = rsa.generateKeyPair({ bits: 2048 })
const publicKey = keypair.publicKey
const privateKey = keypair.privateKey //pem 형식으로 넣어야 함
const publicKeyPem = pki.publicKeyToPem(publicKey)
const privateKeyPem = pki.privateKeyToPem(privateKey)
console.log(publicKeyPem)
console.log(privateKeyPem)

// 2. 토큰 발급  --1오브젝트필요
const jsonData = {
  name: 'bclee',
  id: '1245324',
  sosok: 'djaisdgl',
  univ: 'joongbu',
}
const option = {
  algorithm: 'RS256', //RS256, RS384, R512  --> hs는 오류 // 패딩은 ps,해시 PS256, PS384, PS512  --> node-forge의 타원곡선 암호, dwt사이트에선 호환X인 듯
  expiresIn: '1y', //유효기간
  audience: 'joongbu univ', // 청중, 토큰을 사용하는 대상
  issuer: 'jbu', // 발급자
  subject: 'bclee', // 사용자명
}
let token = jwt.sign(jsonData, privateKeyPem, option) //개인키로 통하여 연다
console.log('1. 토큰 발급: ' + token)

// 3. 토큰 검증
jwt.verify(token, publicKeyPem, function (err, result) {
  if (err) {
    console.error(err)
  } else {
    console.log(result)
  }
})

// 4. 페이로드 출력
let decoded = jwt.decode(token)
console.log(decoded)
