const mongoose = require('../../services/mongoose.service').mongoose
const Schema = mongoose.Schema

const userSchema = new Schema({
	email: String,
	password: String,
	username: String,
	userId: String,
	isFaceBook: Boolean,
})

userSchema.virtual('id').get(function () {
	return String(this._id).toString()
})

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
	virtuals: true
})

userSchema.findById = function (cb) {
	return this.model('User').find({ id: this.id }, cb)
}

const User = mongoose.model('User', userSchema)

module.exports.UserSchema = mongoose.model('User', userSchema)

module.exports.findByEmail = email => {
	return User.findOne({ email: email })
}
module.exports.findById = id => {
	return User.findById(id)
		.then(result => {
			result = result.toJSON()
			delete result._id
			delete result.__v
			return result
		})
}

module.exports.createUser = (userData, isFaceBook = false) => {
	const user = new User({
		...userData,
		isFaceBook
	})
	return user.save()
}

module.exports.list = (perPage, page) => {
	return new Promise((resolve, reject) => {
		User.find()
			.limit(perPage)
			.skip(perPage * page)
			.exec(function (err, users) {
				if (err) {
					reject(err)
				} else {
					resolve(users)
				}
			})
	})
}

module.exports.patchUser = (id, userData) => {
	return new Promise((resolve, reject) => {
		User.findById(id, function (err, user) {
			if (err) reject(err)
			for (let i in userData) {
				user[i] = userData[i]
			}
			user.save(function (err, updatedUser) {
				if (err) return reject(err)
				resolve(updatedUser)
			})
		})
	})
}

module.exports.removeById = userId => {
	return new Promise((resolve, reject) => {
		User.remove({ _id: userId }, err => {
			if (err) {
				reject(err)
			} else {
				resolve(err)
			}
		})
	})
}

const passwordRecoverySchema = new Schema({
	slug: String,
	email: String,
	isUsed: Boolean,
	expiresAt: String
})

const PasswordRecovery = mongoose.model('PasswordRecovery', passwordRecoverySchema)

module.exports.createNewPasswordRecovery = passwordRecovery => {
	const newPwRecovery = new PasswordRecovery(passwordRecovery)
	return newPwRecovery.save()
}

module.exports.setPasswordRecoveryToUsed = slug => {
	return new Promise((resolve, reject) => {
		PasswordRecovery.findOne({
			slug,
		}, function(err, passwordRecovery) {
			if(err) reject(err)
			passwordRecovery.isUsed = true
			passwordRecovery.save(function(err, updatedPasswordRecovery) {
				if (err) return reject(err)
				resolve(updatedPasswordRecovery)
			})
		})
	})
}

module.exports.findPasswordRecovery = slug => {
	return new Promise((resolve, reject) => {
		PasswordRecovery.findOne({
			slug
		}, function(err, passwordRecovery) {
			if(err) reject(err)
			resolve(passwordRecovery)
		})
	})
}

module.exports.resetPassword = (email, password) => {
	return new Promise((resolve, reject) => {
		User.findOne({
			email,
		}, function (err, user) {
			if (err) reject(err)
			user.password = password
			user.save(function (err, updatedUser) {
				if (err) return reject(err)
				resolve(updatedUser)
			})
		})
	})
}
