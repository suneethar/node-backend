const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

signUp = (req, res) => {
    const { userName, email, password, roles } = req;
    const user = new User({
        userName: userName,
        email: email,
        password: bcrypt.hashSync(password, 8)
    });

    user.save((err, user) => {
        if (err) {
            return res.status(500).send({message: err});
        }

        if (roles) {
            // Check roles given in req body are corret or not
            Role.find(
                {
                  name: { $in: req.body.roles }
                },
                (err, roles) => {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }
        
                  user.roles = roles.map(role => role._id);
                  user.save(err => {
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    }
        
                    res.send({ message: "User was registered successfully!" });
                  });
                }
            );
        } else {
            // No role then add role as user
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
        
                user.roles = [role._id];
                user.save(err => {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }
        
                  res.send({ message: "User was registered successfully!" });
                });
            });
        }
    })
}

signIn = (req, res) => {
    User.findOne({
        userName: req.body.userName
    }).exec((err, user) => {
        if (err) {
            return res.status(500).send({message: err})
        }

        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        // validate password
        const isValidPassword = bcrypt.compareSync(req.body.password, user.password);

        if (!isValidPassword) {
            return res.status(401).send({accessToken: null, message: 'Invalid password'});
        }

        const jwttoken  = jwt.sign({id: user._id}, config.secret, { expiresIn: 86400 });

        res.status(200).send({
            userName: user.userName,
            id: user._id,
            email: user.email,
            accessToken: jwttoken
        })
    })
}

module.exports = { signUp, signIn }