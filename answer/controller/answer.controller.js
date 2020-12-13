const AnswerModel = require('../model/answer.model')

exports.createNewAnser = (req, res) => {
  AnswerModel.createAnswer(req.body)
    .then(() => {
      res.status(200).send({
        isSuccess: true,
      })
    })
}