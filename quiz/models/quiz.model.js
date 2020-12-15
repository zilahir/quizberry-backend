const { Schema } = require("mongoose")

const mongoose = require('../../services/mongoose.service').mongoose


const quizSchema = new Schema({
	name: String,
	questions: [{
		question: String,
		answers: [{
			answer: String,
			isCorrect: Boolean,
		}]
	}]
})

quizSchema.set('toJSON', {
	virtuals: true
})

quizSchema.virtual('id').get(function () {
	return this._id.toHexString()
})

module.exports = mongoose.model('Quiz', quizSchema)