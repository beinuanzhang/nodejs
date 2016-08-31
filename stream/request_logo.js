var http = require('http')
var fs = require('fs')
var request = require('request')

http
	.createServer(function(req,res){
		// fs.readFile('./buffer/logo.png',function(err,data){
		// 	if(err) {
		// 		res.end('file not exist!')
		// 	}
		// 	else {
		// 		res.writeHeader(200,{'Context-Type':'text/html'})
		// 		res.end(data)
		// 	}
		// })

		// fs.createReadStream('../buffer/logo.jpg').pipe(res);

		request('http://e.jikexueyuan.com/headerandfooter/images/logo.png').pipe(res)
	})
	.listen(8090)