// var Pet = {
// 	words:'...',
// 	speak: function() {
// 		console.log(this.words);
// 		console.log(this === Pet);
// 	}
// }

// Pet.speak()


// function Pet(words) {
// 	this.words = words
// 	console.log(this.words);
// 	console.log(this === global);
// }

// Pet('...')


function Pet(words) {
	this.words = words
	this.speak = function() {
		console.log(this.words)
		console.log(this);
	}
}

var cat = new Pet('Miao')

cat.speak()