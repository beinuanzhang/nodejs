var fs = require('fs')

var readStream = fs.createReadStream('steam_copy_logo.jpg');
var writeStream = fs.createWriteStream('steam_copy_logo2.jpg');

readStream.on('data',function(chunk){
	if (writeStream.write(chunk) === false){
		console.log('still cached')
		readStream.pause()
	}
})

readStream.on('end',function(){
	writeStream.end()
})

writeStream.on('drain',function(){
	console.log('still drains')
	readStream.resume()
})