const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;

validateUser = (req, res, next) => {
    // Check for user
    User.findOne({
        userName: req.body.userName
    }).exec((err, user) => {
        if (err) {
            return res.status(500).send({message: err});
        }

        if (user) {
            return res.status(400).send({message: "userName already exist!"});
        }

        // Email check
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                return res.status(500).send({message: err});
            }

            if (user) {
                return res.status(400).send({message: "emailid already exist!"});
            }
            next();
        });
    });
}

validateRole = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
              return res.status(400).send({
                message: `Failed! Role ${req.body.roles[i]} does not exist!`
              });
            }
        }
    }
    next();
}

const validation = { validateUser, validateRole }

module.exports = validation;