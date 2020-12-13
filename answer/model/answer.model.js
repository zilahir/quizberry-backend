const mongoose = require('../../services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  answer: String
})

answerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
answerSchema.set('toJSON', {
  virtuals: true
});

Answer = mongoose.model('Answer', answerSchema);

exports.createAnswer = (answerData) => {
  const newAnswer = new Answer(answerData)
  return newAnswer.save()
}

exports.AnswerSchema = mongoose.model('Answers', answerSchema);