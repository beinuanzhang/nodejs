var fs = require('fs')

fs.createReadStream(path).pipe(fs.createWriteStream(path))