const { Schema } = require("mongoose")

const mongoose = require('../../services/mongoose.service').mongoose

const resultSchema = new Schema({
	result: String,
	userId: String,
	quizId: String,
})

resultSchema.set('toJSON', {
	virtuals: true
})

module.exports = mongoose.model('Results', resultSchema)