const graphql = require('graphql')
const { v4: uuidv4 } = require('uuid')

const UserSchema = require('../../users/models/users.model')
const Quiz = require('../../quiz/models/quiz.model')
const Result = require('../../result/models/result.model')
const { mongoose } = require('../../services/mongoose.service')

const { ObjectId } = mongoose.Types
ObjectId.prototype.valueOf = function () {
	return this.toString()
}

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

const ResultType = new GraphQLObjectType({
	name: 'Resut',
	fields: () => ({
		id: { type: GraphQLID },
		result: { type: GraphQLNonNull(GraphQLString), },
		userId: { type: GraphQLString },
	})
})

const AnswerType = new GraphQLObjectType({
	name: 'Answer',
	fields: () => ({
		answer: { type: GraphQLString },
		isCorrect: { type: GraphQLBoolean },
		id: { type: GraphQLID },
	})
})

const QuestionType = new GraphQLObjectType({
	name: 'QuestionType',
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
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

const ResultInputType = new GraphQLInputObjectType({
	name: 'ResultInputType',
	fields: {
		userId: { type: GraphQLString },
		result: { type: new GraphQLNonNull(GraphQLString) },
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
		owner: { type: UserType },
		slug: { type: GraphQLString },
		createdAt: { type: GraphQLString },
		name: { type: GraphQLString },
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
		},
		quizBySlug: {
			type: QuizType,
			args: { slug: { type: GraphQLString }},
			resolve(parent, args) {
				return Quiz.findOne({
					slug: args.slug,
				}).populate('owner')
			},
		},
		quizzesByOwner: {
			type: new GraphQLList(QuizType),
			args: {
				owner: {
					type: GraphQLString
				}
			},
			resolve(parent, args) {
				return Quiz.find({ owner: args.owner })
			}
		}
	}
})

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		createResult: {
			type: ResultType,
			args: {
				userId: { type: GraphQLString },
				result: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parents, args) {
				const { result, userId } = args
				const newResult = new Result({
					userId,
					result,
				})
				return newResult.save()
			}
		},
		createQuiz: {
			type: QuizType,
			args: {
				owner: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: new GraphQLNonNull(GraphQLString) },
				questions: { type: new GraphQLList(QuestionInputType) }
			},
			resolve(parent, args) {
				const { name, questions, owner } = args
				const newQuiz = new Quiz({
					createdAt: new Date().toString(),
					name,
					questions,
					owner: owner.toString(),
					slug: uuidv4().split("-")[0].toString()
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
