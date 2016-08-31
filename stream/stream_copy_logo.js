var fs = require('fs')

var source = fs.readFileSync('../buffer/logo.jpg')

fs.writeFileSync('steam_copy_logo.jpg', source)