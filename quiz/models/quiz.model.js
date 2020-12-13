const { Schema } = require("mongoose")

const mongoose = require('../../services/mongoose.service').mongoose

const quizSchema = new Schema({
	name: String,
	questions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	}]
})

quizSchema.virtual('id').get(function () {
	return this._id.toHexString()
})

quizSchema.set('toJSON', {
	virtuals: true
})

module.exports = mongoose.model('Quiz', quizSchema)