const jwtSecret = require('../../common/config/env.config.js').jwt_secret,
    jwt = require('jsonwebtoken');
const crypto = require('crypto');
const uuid = require('uuid');

exports.login = (req, res) => {
    try {
        console.log('req', req)
        let refreshId = req.body.userId + jwtSecret;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
        req.body.refreshKey = salt;
        let token = jwt.sign(req.body, jwtSecret);
        let b = new Buffer(hash);
        let refresh_token = b.toString('base64');
        res.status(201).send({
            accessToken: token,
            refreshToken: refresh_token,
            userId: req.body.userId,
            email: req.body.email,
            username: req.body.username,
            isSuccess: true,
        });
    } catch (err) {
        res.status(500).send({errors: err});
    }
};

exports.createJWTtoken = (req, res) => {
    const token = jwt.sign(req.body, jwtSecret);
    res.status(200).send({
        token
    })
}

exports.refresh_token = (req, res) => {
    try {
        req.body = req.jwt;
        let token = jwt.sign(req.body, jwtSecret);
        res.status(201).send({id: token});
    } catch (err) {
        res.status(500).send({errors: err});
    }
};

exports.checkPassword = (req, res) => {
    res.status(200).send({
        isSuccess: true
    })
}