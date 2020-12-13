const QuestionController = require('./controllers/question.controller')

exports.routesConfig = app => {
  app.post('/question', [
    QuestionController.createNewQuestion
  ])
}