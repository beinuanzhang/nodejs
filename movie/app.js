var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost/imooc')


app.set('views','./views/pages')
app.set('view engine','jade')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.locals.moment = require('moment')
app.listen(port)

console.log('imooc started on port' + port)

// index
app.get('/',function(req,res){
	Movie.fetch(function(err, movies){
		if (err) {
			console.log(err)
		}

		res.render('index',{
			title: 'imooc 首页',
			movies: movies
		})
	})
	// res.render('index',{
	// 	title: 'imooc首页',
	// 	movies: [{
	// 		title: '机械战警',
	// 		_id: 1,
	// 		poster: 'http://i2.letvimg.com/lc07_isvrs/201608/26/15/26/26c12c89-5bc1-4658-965f-3f3d137714e2.jpg'
	// 	},{
	// 		title: '机械战警',
	// 		_id: 2,
	// 		poster: 'http://i2.letvimg.com/lc07_isvrs/201608/26/15/26/26c12c89-5bc1-4658-965f-3f3d137714e2.jpg'
	// 	},{
	// 		title: '机械战警',
	// 		_id: 3,
	// 		poster: 'http://i2.letvimg.com/lc07_isvrs/201608/26/15/26/26c12c89-5bc1-4658-965f-3f3d137714e2.jpg'
	// 	},{
	// 		title: '机械战警',
	// 		_id: 4,
	// 		poster: 'http://i2.letvimg.com/lc07_isvrs/201608/26/15/26/26c12c89-5bc1-4658-965f-3f3d137714e2.jpg'
	// 	},{
	// 		title: '机械战警',
	// 		_id: 5,
	// 		poster: 'http://i2.letvimg.com/lc07_isvrs/201608/26/15/26/26c12c89-5bc1-4658-965f-3f3d137714e2.jpg'
	// 	},{
	// 		title: '机械战警',
	// 		_id: 6,
	// 		poster: 'http://i2.letvimg.com/lc07_isvrs/201608/26/15/26/26c12c89-5bc1-4658-965f-3f3d137714e2.jpg'
	// 	}]
	// })
})

//detail page
app.get('/movie/:id',function(req, res){
	var id = req.params.id

	Movie.findById(id,function(err,movies){
		res.render('detail',{
			title: 'imooc' + movies.title,
			movies: movies
		})
	})
	// res.render('detail',{
	// 	title: 'imooc详情页',
	// 	movie: [{
	// 		doctor: '何塞 帕迪里亚',
	// 		country: '美国',
	// 		title: '机械战警',
	// 		year: 2014,
	// 		poster: 'http://i2.letvimg.com/lc07_isvrs/201608/26/15/26/26c12c89-5bc1-4658-965f-3f3d137714e2.jpg',
	// 		language: '国语',
	// 		summary: '这是电景简介。'
	// 	}]
	// })
})

//admin page
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title: 'imooc 后台录入页',
		movies: [{
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			summary: '',
			language: ''
		}]
	})
})

//admin update movie
app.get('/admin/update/:id',function(req, res){
	var id = req.params.id

	if (id) {
		Movie.findById(id, function(err, movies) {
			res.render('admin', {
				title: 'imooc 后台更新页',
				movies: movies
			})
		})
	}
})

// admin post movie
app.post('/admin/movie/new',function(req, res){
	var id = req.body.movies._id
	var movieObj = req.body.movies
	var _movie

	if (id !=='undefined') {
		Movie.findById(id, function(err,movies){
			if(err) {
				console.log(err)
			}

			_movie = _.extend(movies,movieObj)
			_movie.save(function(err, movies){
				if (err) {
					console.log(err)
				}

				res.redirect('/movie/' + movies._id)
			})
		})
	}
	else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})

		_movie.save(function(err, movies){
			if(err) {
				console.log(err)
			}

			res.redirect('/movie/' + movies._id)
		})
	}
})

//list page
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err, movies){
		if (err) {
			console.log(err)
		}

		res.render('list',{
			title: 'imooc 列表页',
			movies: movies
		})
	})

	// res.render('list',{
	// 	title: 'imooc列表页',
	// 	movies: [{
	// 		title: '机械战警',
	// 		_id: 1,
	// 		doctor: '何塞 帕迪里亚',
	// 		country: '美国',
	// 		year: 2014,
	// 		flash: 'http://i2.letvimg.com/lc07_isvrs/201608/26/15/26/26c12c89-5bc1-4658-965f-3f3d137714e2.jpg',
	// 		language: '国语',
	// 		summary: '这是电景简介。'
	// 	}]
	// })
})

// list delete movie
app.delete('/admin/list',function(req, res) {
	var id = req.query.id

	if (id) {
		Movie.remove({_id: id}, function(err, movies) {
			if (err) {
				console.log(err)
			}
			else {
				res.json({success: 1})
			}
		})
	}
})