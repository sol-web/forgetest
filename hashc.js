let inputText = 'Hash input, 해시함수 테스트 입력' //입력값이 같으면 해시 값도 같다
console.log('해시함수 입력:' + inputText)
document.write('해시함수 입력:' + inputText + '<br>')

let md = forge.md.md5.create()
md.update(inputText) //해시함수를 만들수 있는 함수
md.update(inputText + '1')
md.update(inputText + '1')
let result = md.digest().toHex()
console.log('md5 해시 출력:' + result)
document.write('md5 해시 출력:' + result)
document.getElementById('result').innerHTML = result

let md1 = forge.md.sha1.create()
md.update(inputText)
let result1 = md1.digest().toHex()
console.log('sha245 해시 출력:' + result1)
document.write('sha245 해시 출력:' + result1 + '<br>')

let md2 = forge.md.sha1.create()
md.update(inputText)
let result2 = md2.digest().toHex()
console.log('md5 해시 출력:' + result2)
document.write('md5 해시 출력:' + result2 + '<br>')

let md3 = forge.md.sha1.create()
md.update(inputText)
let result3 = md3.digest().toHex()
console.log('sha245 해시 출력:' + result1)
document.write('sha245 해시 출력:' + result3 + '<br>')
