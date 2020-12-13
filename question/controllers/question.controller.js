const { resolve } = require('path')
const QuestionModel = require('../models/question.model')

exports.createNewQuestion = (req, res) => {
  QuestionModel.createQuestion(req.body)
    .then((result) => {
      res.status(200).send(result)
    })
}