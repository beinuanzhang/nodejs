var mongoose = require('mongoose')
var Movie = mongoose.model('Movie')
var Category = mongoose.model('Category')
var Comment = require('../models/comment')
var multiparty = require('multiparty')
var _ = require('underscore')
var path = require('path')
var http = require('http');
var fs = require('fs')

// detail page
exports.detail = function(req, res) {
	var id = req.params.id

	Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
    if (err) {
      console.log(err)
    }
  })

	Movie.findById(id,function(err, movie) {
		Comment
			.find({movie: id})
			.populate('from','name')
			.populate('reqly.from reqly.to','name')
			.exec(function(err, comments) {
				res.render('detail',{
					title: 'imooc' + movie.title,
					movie: movie,
					comments: comments
				})
			})
	})
}

// admin new page
exports.new = function(req, res) {
	Category.find({}, function(err, categories) {
		res.render('admin',{
			title: 'imooc 后台录入页',
			categories: categories,
			movie: {}
		})
	})
}

// admin update movie
exports.update = function(req, res) {
	var id = req.params.id

	if (id) {
		Movie.findById(id, function(err, movie) {
			Category.find({}, function(err, categories) {
				res.render('admin', {
					title: 'imooc 后台更新页',
					movie: movie,
					categories: categories
				})
			})
		})
	}
}

// admin poster
exports.savePoster = function(req, res, next) {

  if (req.url === '/admin/movie' && req.method === 'POST') {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
      var posterData = files.uploadPoster
		  var filePath = files.uploadPoster[0].path
		  var originalFilename = files.uploadPoster[0].originalFilename
		  req.fields = fields

		  if (originalFilename) {
		    fs.readFile(filePath, function(err, data) {
		      var timestamp = Date.now()
		      // var type = posterData[0].headers.content-type.split('/')[1]
		      var type = 'jpeg'
		      var poster = timestamp + '.' + type
		      var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)

		      fs.writeFile(newPath, data, function(err) {
		        req.poster = poster
		        next()
		      })
		    })
		  }
		  else {
		    next()
		  }
    })
  }
}

// admin post movie
exports.save = function(req, res) {
	// console.log(req.fields)
	var id = req.fields.movieId
	var movieObj = req.fields
	var _movie

	console.log(id)
	console.log(movieObj)

	if(req.poster){
		movieObj.poster = req.poster
	}

	if (id) {
		Movie.findById(id, function(err,movie) {
			if(err) {
				console.log(err)
			}

			_movie = _.extend(movie,movieObj)
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err)
				}

				res.redirect('/movie/' + movie._id)
			})
		})
	}
	else {
		_movie = new Movie(movieObj)

		var categoryId = movieObj.category
		var categoryName = movieObj.categoryName


		_movie.save(function(err, movie) {
			if(err) {
				console.log(err)
			}

			if(categoryId) {
				Category.findById(categoryId, function(err, category) {
					category.movies.push(movie._id)

					category.save(function(err, category) {
						res.redirect('/movie/' + movie._id)
					})
				})
			}
			else if (categoryName) {
				var category = new Category({
          name: categoryName,
          movies: [movie._id]
        })

        category.save(function(err, category) {
          movie.category = category._id
          movie.save(function(err, movie) {
            res.redirect('/movie/' + movie._id)
          })
        })
			}
		})
	}
}

// list page
exports.list = function(req,res) {
	Movie.fetch(function(err, movies){
		if (err) {
			console.log(err)
		}

		res.render('list',{
			title: 'imooc 列表页',
			movies: movies
		})
	})
}

// list delete movie
exports.del = function(req, res) {
	var id = req.query.id

	if (id) {
		Movie.remove({_id: id}, function(err, movie) {
			if (err) {
				console.log(err)
				res.json({success: 0})
			}
			else {
				res.json({success: 1})
			}
		})
	}
}