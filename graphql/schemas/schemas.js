const graphql = require('graphql')

const UserSchema = require('../../users/models/users.model')
const Quiz = require('../../quiz/models/quiz.model')
const Answer = require('../../answer/model/answer.model')
const Question = require('../../question/models/question.model')

const { 
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = graphql


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
		id: { type: GraphQLID },
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
			args: { id: { type: GraphQLID }},
			resolve(parent, args) {
				return UserSchema.UserSchema.findById(args.id)
			}
		},
		quizes: {
			type: new GraphQLList(QuizType),
			resolve() {
				return Quiz.find({})
			}
		},
		quiz: {
			type: QuizType,
			args: { id: { type: GraphQLID }},
			resolve(parent, args) {
				return Quiz.findById(args.id)
			}
		}
	}
})

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		createAnswer: {
			type: AnswerType,
			args: {
				answer: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parent, args) {
				const { answer } = args
				const newAnswer = new Answer({
					answer
				})
				return newAnswer.save()
			}
		},

		createQuestion: {
			type: QuestionType,
			args: {
				question: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, args) {
				const { question } = args
				const newQuestion = new Question({
					question
				})
				return newQuestion.save()
			}
		},

		createQuiz: {
			type: QuizType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				questions: {
					type: GraphQLList(QuestionType)
				}
			},
			resolve(parent, args) {
				return `${parent} ${args}`
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})