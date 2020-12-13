const UserModel = require('../models/users.model');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

exports.insert = (req, res) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
    // req.body.permissionLevel = 1;
    req.body.userId = uuidv4();
    UserModel.createUser(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    UserModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    UserModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};
exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }

    UserModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(200).send({
                success: true
            });
        });

};

exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then((result) => {
            res.status(200).send({
                success: true,
            });
        });
};

exports.patchPasswordRecovery = (req, res) => {
    UserModel.setPasswordRecoveryToUsed(req.params.slug)
        .then(result => {
            res.status(200).send({
                success: true,
            })
        })
}

exports.patchByEmail = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }
    UserModel.resetPassword(req.params.email, req.body.password)
        .then(result => {
            res.status(200).send({
                success: true,
            })
        })
}

exports.patchByEmail = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }
    UserModel.resetPassword(req.params.email, req.body.password)
        .then(result => {
            res.status(200).send({
                success: true,
            })
        })
}

exports.createPasswordRecovery = (req, res) => {
    UserModel.createNewPasswordRecovery({
        email: req.body.email,
        slug: req.body.slug,
        isUsed: false,
        expiresAt: new Date().setMinutes(new Date().getMinutes() + 30)
    }).then(result => {
        res.status(200).send({
            success: true
        })
    })
}

exports.getPasswordRecovery = (req, res) => {
    UserModel.findPasswordRecovery(req.params.slug).then(result => {
        res.status(200).send(
            result
        )
    })
}