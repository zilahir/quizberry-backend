const { Schema } = require("mongoose")
const AWS = require('aws-sdk')

const mongoose = require('../../services/mongoose.service').mongoose
const { ObjectId } = require('../../services/mongoose.service').mongoose.Types

ObjectId.prototype.valueOf = function () {
	return this._id.toHexString()
}

const QuizImageSchema = new Schema({
	url: String,
	quizId: String,
})

QuizImageSchema.set('toJSON', {
	virtuals: true
})

QuizImageSchema.virtual('id').get(function () {
	return this._id.toHexString()
})

const QuizImage = mongoose.model('QuizImage', QuizImageSchema)

module.exports.insertQuizImage = quizImage => {
	const newQuizImage = new QuizImage(quizImage)
	return newQuizImage.save()
}

module.exports.uploadImage = req => {
	return new Promise(resolve => {
		const s3 = new AWS.S3({
			accessKeyId: process.env.AWS_ACCESS,
			secretAccessKey: process.env.AWS_SECRET,
		})

		const params = {
			Bucket: process.env.AWS_BUCKET,
			Key: req.files.image.name,
			Body: req.files.image.data,
			ACL: 'public-read'
		}
		
		s3.upload(params, (err, data) => {
			if(err) {
				throw err
			} else {
				// eslint-disable-next-line no-console
				console.debug(`success: ${data.Location}`)
				this.insertQuizImage({
					url: data.Location,
					quizId: req.body.quizId
				})
			}
		})
		
		resolve(true)
	})
}

