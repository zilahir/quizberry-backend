const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')

const UserModel = require('../models/users.model')

module.exports.insert = (req, res) => {
	let salt = crypto.randomBytes(16).toString('base64')
	let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64")
	req.body.password = salt + "$" + hash
	// req.body.permissionLevel = 1;
	req.body.userId = uuidv4()
	UserModel.createUser(req.body)
		.then(result => {
			res.status(201).send({ id: result._id })
		})
}

module.exports.list = (req, res) => {
	let limit = req.query.limit && req.query.limit <= 100 ? Number.parseInt(req.query.limit) : 10
	let page = 0
	if (req.query) {
		if (req.query.page) {
			req.query.page = Number.parseInt(req.query.page)
			page = Number.isInteger(req.query.page) ? req.query.page : 0
		}
	}
	UserModel.list(limit, page)
		.then(result => {
			res.status(200).send(result)
		})
}

module.exports.getById = (req, res) => {
	UserModel.findById(req.params.userId)
		.then(result => {
			res.status(200).send(result)
		})
}
module.exports.patchById = (req, res) => {
	if (req.body.password) {
		let salt = crypto.randomBytes(16).toString('base64')
		let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64")
		req.body.password = salt + "$" + hash
	}

	UserModel.patchUser(req.params.userId, req.body)
		.then(() => {
			res.status(200).send({
				success: true
			})
		})

}

module.exports.removeById = (req, res) => {
	UserModel.removeById(req.params.userId)
		.then(() => {
			res.status(200).send({
				success: true,
			})
		})
}

module.exports.patchPasswordRecovery = (req, res) => {
	UserModel.setPasswordRecoveryToUsed(req.params.slug)
		.then(() => {
			res.status(200).send({
				isSuccess: true,
			})
		})
}

module.exports.patchByEmail = (req, res) => {
	if (req.body.password) {
		let salt = crypto.randomBytes(16).toString('base64')
		let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64")
		req.body.password = salt + "$" + hash
	}
	UserModel.resetPassword(req.params.email, req.body.password)
		.then(() => {
			res.status(200).send({
				isSuccess: true,
			})
		})
}

module.exports.patchByEmail = (req, res) => {
	if (req.body.password) {
		let salt = crypto.randomBytes(16).toString('base64')
		let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64")
		req.body.password = salt + "$" + hash
	}
	UserModel.resetPassword(req.params.email, req.body.password)
		.then(() => {
			res.status(200).send({
				success: true,
			})
		})
}

module.exports.createPasswordRecovery = (req, res) => {
	UserModel.createNewPasswordRecovery({
		email: req.body.email,
		slug: req.body.slug,
		isUsed: false,
		expiresAt: new Date().setMinutes(new Date().getMinutes() + 30)
	}).then(() => {
		res.status(200).send({
			success: true
		})
	})
}

module.exports.getPasswordRecovery = (req, res) => {
	UserModel.findPasswordRecovery(req.params.slug).then(result => {
		res.status(200).send(
			result
		)
	})
}

module.exports.handleFaceBookLogin = (req, res, next) => {
	UserModel.findByEmail(req.body.email).then(result => {
		if (!result) {
			UserModel.createUser({
				email: req.body.email,
				username: req.body.username,
				userId: req.body.userId
			}, true).then(result => {
				req.body.userId = result._id
				next()
			})
		} else {
			req.body.userId = result._id
			next()
		}
	})
}