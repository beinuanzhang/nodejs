var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var User = require('./models/user')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var port = process.env.PORT || 3000
var app = express()
var dburl = 'mongodb://localhost/imooc'

mongoose.connect(dburl)

app.set('views','./views/pages')
app.set('view engine','jade')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(session({
	secret: 'imooc',
	store: new MongoStore({
		url: dburl,
		collection: 'sessions'
	})
}))
app.use(express.static(path.join(__dirname,'public')))
app.locals.moment = require('moment')
app.listen(port)

console.log('imooc started on port' + port)

// index
app.get('/',function(req, res){
	console.log('user in session:')
	console.log(req.session.user)
	Movie.fetch(function(err, movies){
		if (err) {
			console.log(err)
		}

		res.render('index',{
			title: 'imooc 首页',
			movies: movies
		})
	})
})

// signup
app.post('/user/signup', function(req, res) {
	var _user = req.body.user

	User.findOne({name: _user.name}, function(err, user) {

		if(err) {
			console.log(err)
		}

		if(user) {
			return res.redirect('/')
		}
		else {
			var user = new User(_user)

			user.save(function(err, user) {
				if(err) {
					console.log(err)
				}

				res.redirect('/admin/userlist')
			})
		}
	})
})

// signin
app.post('/user/signin', function(req, res) {
	var _user = req.body.user
	var name = _user.name
	var password = _user.password

	User.findOne({name: name}, function(err, user) {
		if (err) {
			console.log(err)
		}

		if(!user) {
			return res.redirect('/')
		}

		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				console.log(err)
			}

			if (isMatch) {
				req.session.user = user

				return res.redirect('/')
			}
			else {
				console.log('Password is not matched')
			}
		})
	})
})

// userlist page
app.get('/admin/userlist',function(req, res) {
	User.fetch(function(err, users){
		if (err) {
			console.log(err)
		}

		res.render('userlist',{
			title: 'imooc 用户列表页',
			users: users
		})
	})
})

// detail page
app.get('/movie/:id',function(req, res) {
	var id = req.params.id

	Movie.findById(id,function(err, movies) {
		res.render('detail',{
			title: 'imooc' + movies.title,
			movies: movies
		})
	})
})

// admin page
app.get('/admin/movie',function(req, res) {
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

// admin update movie
app.get('/admin/update/:id',function(req, res) {
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
app.post('/admin/movie/new',function(req, res) {
	var id = req.body.movies._id
	var movieObj = req.body.movies
	var _movie

	if (id !=='undefined') {
		Movie.findById(id, function(err,movies) {
			if(err) {
				console.log(err)
			}

			_movie = _.extend(movies,movieObj)
			_movie.save(function(err, movies) {
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

		_movie.save(function(err, movies) {
			if(err) {
				console.log(err)
			}

			res.redirect('/movie/' + movies._id)
		})
	}
})

// list page
app.get('/admin/list',function(req,res) {
	Movie.fetch(function(err, movies){
		if (err) {
			console.log(err)
		}

		res.render('list',{
			title: 'imooc 列表页',
			movies: movies
		})
	})
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