const forge = require('node-forge') //var는 덮어 쓸수 있는 것
const fs = require('fs') //파일 시스템 불러옴, fs: 내장 패키지(설치X, npminstall X)
const pki = forge.pki
const rsa = forge.pki.rsa

// 1. RSA 키쌍 생성
const keypair = pki.rsa.generateKeyPair(1024) //keypair에 키쌍이 들어가 있음
//console.log(keyPair)
const publicKey = keypair.publicKey //개인키
const privateKey = keypair.privateKey //공개키  -- 오브젝트가 필요 / 공유시 팸 이용
// console.log(pki.privateKeyToPem(privateKey)) //저장시 pem이용 ^
// console.log(pki.publicKeyToPem(publicKey))

// 2. 인증서 객체 생성
const cert = pki.createCertificate()

// 3. 각종 필드 정보 입력
cert.publicKey = publicKey
cert.serialNumber = '001' // DB 등에 일련번호 관리 필요
cert.validity.notBefore = new Date() // 발급시간, 현재시간
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 2) // 유효기간을 1년인 notAfter
// 사용자 정보 설정: 루트인증기관
let attrs = [
  //필드 이름이 정해져 있음, 오타시 오류
  {
    shortName: 'CN', //name: 'commonName', //사용자명
    value: 'example.org',
  },
  {
    // name: 'countryName', //국가명
    shortName: 'C',
    value: 'KR',
  },
  {
    // name: 'stateOrProvinceName', //주, 지역
    shortName: 'ST',
    value: 'Gyeonggi-do',
  },
  {
    // name: 'localityName', // 도시명
    shortName: 'L',
    value: 'Goyang-si',
  },
  {
    // name: 'organizationName', // 기관명
    shortName: 'O',
    value: 'Joongbu univ',
  },
  {
    // name: 'organizationalUnitName', //부서명
    shortName: 'OU',
    value: 'Information Security',
  },
]
cert.setSubject(attrs) // 인증서 사용자(주체)로 설정
cert.setIssuer(attrs) // 발급자로 설정 (자체서명인증서인 경우 동일)

// 확장영역 정보
let exts = [
  {
    name: 'basicConstraints',
    cA: true, // 인증기관의 인증서임을 나타냄  --유저에게는 true로 주면 안됨
  },
  {
    name: 'keyUsage', // 키용도 설정
    keyCertSign: true, //생성
    digitalSignature: true, //전자서명
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true,
  },
  {
    name: 'extKeyUsage', // 확장 키용도 설정
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true,
  },
  {
    name: 'nsCertType', // 인증서 타입
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true,
  },
  {
    name: 'subjectAltName', // 주체 별도 정보
    altNames: [
      {
        type: 6, // URI
        value: 'http://example.org/webid#me',
      },
      {
        type: 7, // IP
        ip: '127.0.0.1',
      },
    ],
  },
  {
    // 주체 키 식별자
    name: 'subjectKeyIdentifier',
  },
]
cert.setExtensions(exts)

// 4. 인증서 객체를 개인키로 서명
cert.sign(privateKey)
// console.log(cert) //객체로 상세하게 설명 - 저장할 때는 팸 형식으로

// 5. 인증서를 PEM 형식으로 출력
let certPem = pki.certificateToPem(cert)
console.log(certPem)

// 6. 인증서 유효성 검증 --각각의 클라이언트가 함(root인증기관) / 무조건 신뢰X, 검증(해당 공개키로(인증서안에 있는))
let result = cert.verify(cert) //public은 인증서에 있기에 cert.verify 사용
console.log('인증서 유효성: ', result)

// 7. 인증서와 개인키를 파일로 저장하기
fs.writeFile(
  //1. 파일이름, 2. 데이터, 3. 콜백
  'rootPublicKey.pem', //공개키를 파일로 저장
  pki.publicKeyToPem(publicKey), //실제 데이터   --to from 다름 오브젝트를 팸으로 읽어서 사용하는지 다르게 하는지 차이
  function (err) {
    //콜백함수
    if (err) {
      return console.log(err) //err처리
    }
  }
)
fs.writeFile(
  'rootPrivateKey.pem', //개인키를 파일로 저장
  pki.privateKeyToPem(privateKey),
  function (err) {
    if (err) {
      return console.log(err)
    }
  }
)
fs.writeFile('rootCert.pem', pki.certificateToPem(cert), function (err) {
  if (err) {
    return console.log(err)
  }
}) //인증서를 저장  --3개를 저장 -> 다음에 읽어서 사용 /현재는 한 컴퓨터에서 시뮬레이션 함, 원래는 개인키: 클라이언트에 저장, 인증서 발급: 서버가 발급 후 보내줌
//인증서 발급, 불러오기
