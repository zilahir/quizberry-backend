const crypto = require('crypto')

const UserModel = require('../../users/models/users.model')

module.exports.hasAuthValidFields = (req, res, next) => {
	let errors = []

	if (req.body) {
		if (!req.body.email) {
			errors.push('Missing email field')
		}
		if (!req.body.password) {
			errors.push('Missing password field')
		}

		return errors.length > 0 ? res.status(200).send({
			errors: errors.join(','),
			isSuccess: false,
		}) : next()
	} else {
		return res.status(400).send({ errors: 'Missing email and password fields' })
	}
}

module.exports.isPasswordAndUserMatch = (req, res, next) => {
	UserModel.findByEmail(req.body.email)
		.then(user => {
			if(!user){ //TODO: if user is facebook user, the L#36 fails
				res.status(200).send({
					isSuccess: false,
					error: 'No user with this email',
					reason: 404,
				})
			} else {
				let passwordFields = user.password.split('$')
				let salt = passwordFields[0]
				let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64")
				if (hash === passwordFields[1]) {
					req.body = {
						userId: user._id,
						email: user.email,
						permissionLevel: user.permissionLevel,
						provider: 'email',
						username: user.username,
					}
					return next()
				} else {
					return res.status(200).send({
						isSuccess: false, 
						error: 'Invalid e-mail or password',
						reason: 401,
					})
				}
			}
		})
}
