const forge = require('node-forge')
let messege = 'Hello world - 헬로월드'
let key = 'dlsajeidnvdk;saisdjkgdmdfl;caikfl'
console.log('messege: ' + messege)
console.log('key: ' + key)

let hmac = forge.hmac.create()
hmac.start('md5', key) //첫번째 파라메타는 해시 알고리즘
hmac.update(messege)
let result = hmac.digest().toHex()
console.log(result)
console.log('HMAC -HD5: ' + result)

let hmac1 = forge.hmac.create()
hmac1.start('sha1', key)
hmac1.update(messege)
let result1 = hmac1.digest().toHex()
console.log(result1)
console.log('HMAC -sha1: ' + result1)

let hmac2 = forge.hmac.create()
hmac2.start('sha512', key)
hmac2.update(messege)
let result2 = hmac2.digest().toHex()
console.log(result2)
console.log('HMAC -sha512: ' + result2)

let hmac3 = forge.hmac.create()
hmac3.start('sha256', key)
hmac3.update(messege)
let result3 = hmac3.digest().toHex()
console.log(result3)
console.log('HMAC -sha256: ' + result3)

let hmac4 = forge.hmac.create()
hmac4.start('sha384', key)
hmac4.update(messege)
let result4 = hmac4.digest().toHex()
console.log(result4)
console.log('HMAC -sha384: ' + result4)
