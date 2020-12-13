const { Schema } = require("mongoose");
const mongoose = require('../../services/mongoose.service').mongoose;

const quizSchema = new Schema({
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }]
})

quizSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
quizSchema.set('toJSON', {
  virtuals: true
});

Quiz = mongoose.model('Quiz', quizSchema);

exports.QuizSchema = mongoose.model('Quiz', quizSchema);