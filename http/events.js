var EventEmitter = require('events').EventEmitter

var life = new EventEmitter()

//addEventListener

function water(){
	console.log('给' + who + '洗衣服')
}

life.on('求安慰',water)

life.on('求安慰',function(who){
	console.log('给' + who + '...2')
})

life.on('求安慰',function(who){
	console.log('给' + who + '...3')
})

life.on('求安慰',function(who){
	console.log('给' + who + '...4')
})

life.on('求安慰',function(who){
	console.log('给' + who + '...5')
})

life.on('求安慰',function(who){
	console.log('给' + who + '...6')
})

life.on('求安慰',function(who){
	console.log('给' + who + '...7')
})

life.on('求安慰',function(who){
	console.log('给' + who + '...8')
})

life.on('求安慰',function(who){
	console.log('给' + who + '...9')
})

life.on('求安慰',function(who){
	console.log('给' + who + '...10')
})

life.on('求安慰',function(who){
	console.log('给' + who + '你想累死我呀！')
})

life.on('求溺爱',function(who){
	console.log('给' + who + '买衣服')
})

life.on('求溺爱',function(who){
	console.log('给' + who + '交工资')
})

life.removeListener('求安慰', water);
life.removeAllListeners('求安慰');

var hasConforlistener = life.emit('求安慰','汉子')
var hasLovedlistener = life.emit('求溺爱','妹子')
// var hasPlayedlistener = life.emit('求玩坏','汉子')

console.log(life.listeners().length)
console.log(EventEmitter.listenerCount(life,'求安慰'))

// console.log(hasConforlistener)
// console.log(hasLovedlistener)
// console.log(hasPlayedlistener)