var Pet = {
	words: '...',
	speak: function(say){
		console.log(say + '' + this.words)
	}
}

// Pet.speak('Speak')

var dog = {
	words: 'wang'
}

Pet.speak.call(dog,'speak')