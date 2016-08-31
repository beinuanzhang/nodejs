var http = require('http')
var Promise = require('bluebird')
var cheerio = require('cheerio')
var baseUrl = 'http://www.imooc.com/learn/'
var videoIds = [348,259,197]

function filterChapters(html) {
	var $ = cheerio.load(html)
	var chapters = $('.chapter')
	var title = $('#main .hd .l').text()
	var number = parseInt($($('#main .statics .static-item .meta-value strong')[0]).text().trim(),10)

	// courseData = {
	// 	title: title,
	// 	number: number,
	// 	videos: [{
	// 		chapterTitle: '';
	// 		videos: [
	// 		title: '',
	// 		id: ''
	// 		]
	// 	}]
	// }l

	var courseData = {
		title: title,
		number: number,
		videos : []
	}
	chapters.each(function(item){
		var chapter = $(this)
		var chapterTitle = chapter.find('strong').text()
		var videos = chapter.find('.video').children('li')
		var chapterData = {
			chapterTitle: chapterTitle,
			videos: []
		}

		videos.each(function(item){
			var video = $(this).find('.studyvideo')
			var videoTitle = video.text()
			var id = video.attr('href').split('video/')[1]

			chapterData.videos.push({
				title: videoTitle,
				id: id
			})
		})

		courseData.videos.push(chapterData)
	})
	return courseData
}

function printCourseInfo(courseData) {
	courseData.forEach(function(courseData){
		console.log(courseData.number + '人学过' + courseData.title + '\n')
	})

	courseData.forEach(function(courseData) {
		console.log('###' + courseData.title + '\n')
		courseData.videos.forEach(function(item){
			var chapterTitle = item.chapterTitle
			console.log(chapterTitle + '\n')

			item.videos.forEach(function(video) {
				console.log('	【' + video.id + '】' + video.title + '\n')
			})
		})
	})
}

function getPageAsync(url) {
	return new Promise(function(resolve,reject){
		console.log('正在爬取'+url)

		http.get(url,function(res) {
			var html = ''
			res.on('data',function(data) {
				html += data
			})
			res.on('end',function() {
				resolve(html)
			})
		}).on('error',function(){
			reject(e)
			console.log('error')
		})
	})
}

var fetchCourseArray = []

videoIds.forEach(function(id){
	fetchCourseArray.push(getPageAsync(baseUrl + id))
})

Promise
	.all(fetchCourseArray)
	.then(function(pages) {
		var coursesData = []

		pages.forEach(function(html){
			var course = filterChapters(html);

			coursesData.push(course)
		})

		coursesData.sort(function(a,b){
			return a.number < b.number
		})

		printCourseInfo(coursesData)
	})

