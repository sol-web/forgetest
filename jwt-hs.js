const jwt = require('jsonwebtoken') //서명 알고리즘 HMAC기반 서명 , npm install jsonwebtoken 설치 후 사용 / 대칭키 방식, 마스터키로 모두 처리, 공개X

const jsonData = {
  name: 'bclee',
  id: '1245324',
  sosok: 'djaisdgl',
  univ: 'joongbu',
} //서버가 기술하고 싶은 설정 추가 가능,
const masterkey = 'dfiasejgldjxf' //토큰 발급

// 1. 토큰 발급
let token = jwt.sign(jsonData, masterkey, {
  algorithm: 'HS512', //HS256, HS384, HS512
  expiresIn: '1y', //유효기간
  audience: 'joongbu univ', // 청중, 토큰을 사용하는 대상
  issuer: 'jbu', // 발급자
  subject: 'bclee', // 사용자명
}) //토큰 생성시 sign으로 생성, 총 3가지 나옴
console.log('1.토큰발급: ' + token) // 브라우저에게 전송, 브라우저에 저장

// 2. 토큰 검증
let result = jwt.verify(token, masterkey) //result 객체, 마스터키 들어간
console.log('2. 토큰 검증: ' + result.name) //result.((결과나오는 것, 네임은 이름 등)) //에러 : 키가 잘못 되었을 때, 잘못된 토큰이 들어왔을 때

// // 3. 에러 처리 포함한 토큰 검증
// try {
//   let result = jwt.verify(token, masterkey)
//   console.log('3. 토큰 검증: ' + result.name)
// } catch (error) {
//   console.error(error)
// }

// 4. 페이로드 내용 보기
let decoded = jwt.decode(token)
console.log('4. 페이로드 보기: ' + decoded.name)
