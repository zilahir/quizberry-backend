const mongoose = require('../../services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const { debug } = require('console');
const { resolve } = require('path');
const Answer = require('../../answer/model/answer.model');

const questionSchema = new Schema({
  question: String,
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }]
})

questionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
questionSchema.set('toJSON', {
  virtuals: true
});

Question = mongoose.model('Question', questionSchema);

exports.createQuestion = (questionData) => {
 const newQuestion = new Question(questionData)
 return newQuestion.save()
}

exports.QuestionSchema = mongoose.model('Question', questionSchema);

