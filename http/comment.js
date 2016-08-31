var http = require('http')
var querystring = require('querystring')

var postData = querystring.stringify({
	'content':'test request',
	'cid':348
})

var options = {
	hostname:'www.imooc.com',
	port:80,
	path:'/course/documment',
	method:'POST',
	headers:{
		'Accept':'application/json, text/javascript, */*; q=0.01',
		'Accept-Encoding':'gzip, deflate',
		'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
		'Connection':'keep-alive',
		'Content-Length':postData.length,
		'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
		'Cookie':'PHPSESSID=amdaiholt3odqhccr1r0v2o2e4; imooc_uuid=80b9114e-427f-4b7a-a168-1189d5e988d5; imooc_isnew_ct=1471776546; loginstate=1; apsid=M2NjdjYmYyYWRiMTg0YWFiYjg4MWRjM2Y2NTE3YmIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjYyNDUxNgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1NTQzOTMzQHFxLmNvbQAAAAAAAAAAAAAAAAAAAAAAADYzYWQ2ZDRhYmQ2ZDg4M2IzOTkyOTVhNzk0OTIwYjQzYeW7V2Hlu1c%3DYj; last_login_username=5543933%40qq.com; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1471776548; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1471931746; imooc_isnew=2; cvde=57b987228d3c1-21',
		'Host':'www.imooc.com',
		'Origin':'http://www.imooc.com',
		'Referer':'http://www.imooc.com/video/8837',
		'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36',
		'X-Requested-With':'XMLHttpRequest'
	}
}

var req = http.request(options,function(res) {
	console.log('Status:' + res.statusCode)
	console.log('headers:' + JSON.stringify(res.headers))

	res.on('data',function(chunk) {
		console.log(Buffer.isBuffer(chunk))
		console.log(typeof chunk)
	})

	res.on('end',function(){
		console.log('评论完毕！')
	})
})

req.on('error',function(e){
	console.log('Error:'+e.messsage)
})

req.write(postData)
req.end()