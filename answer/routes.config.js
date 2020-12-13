const AnswerController = require('./controller/answer.controller')

exports.routesConfig = app => {
  app.post('/answer', [
    AnswerController.createNewAnser
  ])
}