const fileUpload = require('express-fileupload')

const QuizImageController = require('./controllers/quizImage.controller')

module.exports.routesConfig = app => {
	app.post('/quizimage', [	
		fileUpload(),
		QuizImageController.uploadImage
	])
}