const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const jwtSecret = require('../../common/config/env.config.js').jwt_secret

module.exports.login = (req, res) => {
	try {
		let refreshId = req.body.userId + jwtSecret
		let salt = crypto.randomBytes(16).toString('base64')
		let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64")
		req.body.refreshKey = salt
		let token = jwt.sign(req.body, jwtSecret)
		let b = Buffer.from(hash)
		let refresh_token = b.toString('base64')
		res.status(201).send({
			accessToken: token,
			refreshToken: refresh_token,
			userId: req.body.userId,
			email: req.body.email,
			username: req.body.username,
			isLoggedIn: true,
			lastLogin: new Date(),
		})
	} catch (error) {
		res.status(500).send({ errors: error })
	}
}

module.exports.createJWTtoken = (req, res) => {
	const token = jwt.sign(req.body, jwtSecret)
	res.status(200).send({
		token
	})
}

module.exports.refresh_token = (req, res) => {
	try {
		req.body = req.jwt
		let token = jwt.sign(req.body, jwtSecret)
		res.status(201).send({ id: token })
	} catch (error) {
		res.status(500).send({ errors: error })
	}
}

module.exports.checkPassword = (req, res) => {
	res.status(200).send({
		isSuccess: true
	})
}