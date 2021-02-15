const QuizImageModel = require('../models/quizImage.model')

module.exports.uploadImage = (req, res) => {
	QuizImageModel.uploadImage(req)
		.then(result => {
			res.status(200).send(result)
		})
}