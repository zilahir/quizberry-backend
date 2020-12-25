const graphql = require('graphql')
const { v4: uuidv4 } = require('uuid')

const UserSchema = require('../../users/models/users.model')
const Quiz = require('../../quiz/models/quiz.model')

const { 
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
	GraphQLInputObjectType,
	GraphQLBoolean
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
		answer: { type: GraphQLString },
		isCorrect: { type: GraphQLBoolean }
	})
})

const QuestionType = new GraphQLObjectType({
	name: 'QuestionType',
	fields: () => ({
		question: { type: new GraphQLNonNull(GraphQLString) },
		answers: { type: new GraphQLList(AnswerType) }
	})
})

const AnswerInputType = new GraphQLInputObjectType({
	name: 'AnswerInputType',
	fields: {
		answer: { type: new GraphQLNonNull(GraphQLString) },
		isCorrect: { type: new GraphQLNonNull(GraphQLBoolean) }
	}
})

const QuestionInputType = new GraphQLInputObjectType({
	name: 'QuestionInputType',
	fields: {
		question: { type: new GraphQLNonNull(GraphQLString) },
		answers: { type: new GraphQLList(AnswerInputType) }
	}
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
			args: { id: { type: GraphQLString }},
			resolve(parent, args) {
				return Quiz.findById(args.id)
			}
		}
	}
})

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		createQuiz: {
			type: QuizType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				questions: { type: new GraphQLList(QuestionInputType) }
			},
			resolve(parent, args) {
				const { name, questions } = args
				const newQuiz = new Quiz({
					name,
					questions,
					slug: uuidv4().split("-")[0]
				})
				
				return newQuiz.save()
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})
