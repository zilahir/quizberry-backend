const graphql = require('graphql');
const UserSchema = require('../../users/models/users.model')
const QuizSchema = require('../../quiz/models/quiz.model')

const { 
  GraphQLObjectType, GraphQLString, 
  GraphQLID, GraphQLInt,GraphQLSchema, 
  GraphQLList,GraphQLNonNull 
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  })
})

const AnswerType = new GraphQLObjectType({
  name: 'Answer',
  fields: () => ({
    id: { type: GraphQLID },
    answer: { type: GraphQLString }
  })
})

const QuestionType = new GraphQLObjectType({
  name: 'Question',
  fields: () => ({
    id: { type: GraphQLID },
    question: { type: GraphQLString },
    answers: {
      type: new GraphQLList(AnswerType)
    }
  })
})

const QuizType = new GraphQLObjectType({
  name: 'Quiz',
  fields: () => ({
    id: { type: GraphQLID },
    questions: {
      type: new GraphQLList(QuestionType)
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {id: { type: GraphQLID }},
      resolve(parent, args) {
        return UserSchema.UserSchema.findById(args.id)
      }
    },
    quizes: {
      type: new GraphQLList(QuizType),
      resolve() {
        return QuizSchema.QuizSchema.find({})
      }
    },
    quiz: {
      type: QuizType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return QuizSchema.QuizSchema.findById(args.id)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
})