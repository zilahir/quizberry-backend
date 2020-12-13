const mongoose = require('../../services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  answer: String
})

answerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

answerSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Answer', answerSchema);