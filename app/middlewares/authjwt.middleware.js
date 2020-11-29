const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;

varifyjwtToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decode) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    })
}

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({message: err});
        }

        Role.find(
            {
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    return res.status(500).send({ message: err });
                  }
          
                  for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                      next();
                      return;
                    }
                  }
          
                return res.status(403).send({ message: "Require Admin Role!" });
            }
        )
    })
}

const authJwt = { varifyjwtToken, isAdmin }
module.exports = authJwt;