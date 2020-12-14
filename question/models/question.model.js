const mongoose = require('../../services/mongoose.service').mongoose
const Schema = mongoose.Schema

const questionSchema = new Schema({
	question: String,
})

questionSchema.virtual('id').get(function () {
	return this._id.toHexString()
})

questionSchema.set('toJSON', {
	virtuals: true
})


module.exports = mongoose.model('Question', questionSchema)

