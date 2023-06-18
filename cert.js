// 인증기관이 사용자에게 인증서를 발급

const forge = require('node-forge') //var는 덮어 쓸수 있는 것
const fs = require('fs') //파일 시스템 불러옴, fs: 내장 패키지(설치X, npminstall X)
const pki = forge.pki
const rsa = forge.pki.rsa
const user = 'userC'

// 1. 인증기관 설정: CA인증서와 개인키를 파일에서 읽어오기
const caCertPem = fs.readFileSync('rootCert.pem', 'utf8')
const caPrivatekeyPem = fs.readFileSync('rootPrivateKey.pem', 'utf8')
const caCert = pki.certificateFromPem(caCertPem)
const caPrivateKey = pki.privateKeyFromPem(caPrivatekeyPem)

// 2. 사용자의 RSA 키쌍 생성
const keyPair = rsa.generateKeyPair(2048)
const privateKey = keyPair.privateKey
const publicKey = keyPair.publicKey

// 3. 사용자의 개인키를 파일로 저장
const privateKeyPem = pki.privateKeyToPem(privateKey)
fs.writeFileSync(user + 'PrivateKey.pem', privateKeyPem)

// 4. 사용자 인증서 객체 생성
const cert = pki.createCertificate()

// 5. 사용자 인증서 필드 정보 입력
cert.publicKey = publicKey
cert.serialNumber = '10001'
cert.validity.notBefore = new Date()
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 2)

//사용자 정보
let attrs = [
  {
    name: 'commonName', // 사용자명
    shortName: 'CN',
    value: user,
  },
  {
    name: 'countryName', // 국가
    shortName: 'C',
    value: 'KR',
  },
  {
    name: 'stateOrProvinceName', // 주, 지역
    shortName: 'RT',
    value: 'Gyeonggi-do',
  },
  {
    name: 'localityName', // 도시명
    shortName: 'L',
    value: 'Goyang-si',
  },
  {
    name: 'organizationName', // 기관명
    shortName: 'O',
    value: 'Joongbu Univ.',
  },
  {
    name: 'organizationalUnitName', // 부서명
    shortName: 'OU',
    value: 'Dept. of Information Security',
  },
]
cert.setSubject(attrs)

// 6. 발급자(인증기관)
let caAttrs = [
  {
    name: 'commonName',
    shortName: 'CN',
    value: caCert.subject.getField('CN').value,
  },
  {
    name: 'countryName',
    shortName: 'C',
    value: caCert.subject.getField('C').value,
  },
  {
    name: 'stateOrProvinceName',
    shortName: 'ST',
    value: caCert.subject.getField('ST').value,
  },
  {
    name: 'localityName',
    shortName: 'L',
    value: caCert.subject.getField('L').value,
  },
  {
    name: 'organizationName',
    shortName: 'O',
    value: caCert.subject.getField('O').value,
  },
  {
    name: 'organizationalUnitName',
    shortName: 'OU',
    value: caCert.subject.getField('OU').value,
  },
]
cert.setIssuer(caAttrs)

// 7. 확장영역 설정
cert.setExtensions([
  {
    name: 'basicConstraints',
    cA: false, //인증기관의 인증서임을 나타냄--일반 사용자에게는 X
  },
  {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true,
  },
  {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true,
  },
  {
    name: 'nsCertType',
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true,
  },
  {
    name: 'subjectAltName',
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
    name: 'subjectKeyIdentifier',
  },
])

// 8. 사용자의 인증서 객체를 CA의 개인키로 서명
cert.sign(caPrivateKey) // CA 개인키로 서명

// 9. 사용자 인증서 객체를 PEM 형식으로 출력
let certPem = pki.certificateToPem(cert)
console.log('tkdydwk dlswmdtj: ' + certPem)

// 10. 사용자 인증서의 유효성 검증: 인증기관의 인증서를 이용
let resultUser = caCert.verify(cert)
console.log('사용자 인증서 유효성: ', resultUser)

// 11. 사용자 인증서를 파일로 저장하기
fs.writeFileSync(user + 'Cert.Pem', pki.certificateToPem(cert))
console.log('사용자 인증서가 저장되었습니다:' + user + 'Cert.pem')
