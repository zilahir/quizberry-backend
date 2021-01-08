const { Schema } = require("mongoose")

const mongoose = require('../../services/mongoose.service').mongoose
const { ObjectId } = require('../../services/mongoose.service').mongoose.Types

ObjectId.prototype.valueOf = function () {
	return this._id.toHexString()
}

const quizSchema = new Schema({
	name: String,
	slug: String,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	createdAt: String,
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