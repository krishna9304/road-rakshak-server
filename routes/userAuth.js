const router = require("express").Router();
const User = require("../database/models/user");
const validator = require("validator");
const { hash } = require("../utilities/password");
const { compare } = require("../utilities/password");
const { tokenGenerator } = require("../utilities/jwt");
const { tokenDecoder } = require("../utilities/jwt");

router.post("/signup", (req, res, next) => {
  let data = req.body;
  // email, name, password
  let errors = [];
  if (!data.email || !validator.isEmail(data.email + "")) {
    errors.push("Invalid Email!");
  }
  if (!data.name) {
    errors.push("Invalid Name!");
  }
  if ((data.password + "").length < 8 || !data.password) {
    errors.push("Invalid Password!");
  }
  User.exists({ email: data.email }, (err, result) => {
    if (err) next(err);
    if (result) {
      errors.push("Email already exists!!");
    }
    if (errors.length !== 0) {
      res.send({
        res: false,
        errors: errors,
      });
    } else {
      hash(data.password, next, (encPass) => {
        data.password = encPass;
        const user = new User(data);
        user
          .save()
          .then((doc) => {
            let token = tokenGenerator(doc._id, doc.name);
            res.send({
              res: true,
              userData: doc,
              jwt: token,
              msg: "User registered succesfully!!",
            });
          })
          .catch(next);
      });
    }
  });
});

router.post("/signIn", (req, res, next) => {
  let data = req.body;
  let errors = [];
  if (!data.email || !validator.isEmail(data.email + "")) {
    errors.push("Invalid Email!");
  }
  if ((data.password + "").length < 8 || !data.password) {
    errors.push("Invalid Password!");
  }
  User.exists({ email: data.email }, (err, result) => {
    if (err) next(err);
    if (result) {
      User.findOne({ email: data.email })
        .then((doc) => {
          compare(doc.password, data.password, next, (same) => {
            if (same) {
              let token = tokenGenerator(doc._id, doc.name);
              res.send({
                res: true,
                userData: doc,
                msg: "Login successful",
                jwt: token,
              });
            } else {
              errors.push("Wrong password!!");
            }
            if (errors.length) {
              res.send({
                res: false,
                errors: errors,
              });
            }
          });
        })
        .catch(next);
    } else {
      errors.push("This email doesn't exist!!");
      if (errors.length) {
        res.send({
          res: false,
          errors: errors,
        });
      }
    }
  });
});

router.post("/verifyToken", (req, res, next) => {
  let { token } = req.body;
  tokenDecoder(token, (err, decoded) => {
    if (err) next(err);
    if (decoded) {
      User.exists({ _id: decoded._id, name: decoded.name }, (err, result) => {
        if (err) next(err);
        if (result) {
          User.findById(decoded._id, (err, doc) => {
            if (err) next(err);
            const newToken = tokenGenerator(doc._id, doc.name);
            res.send({
              res: true,
              userData: doc,
              token: newToken,
              msg: "Token verified!",
            });
          });
        } else {
          res.send({
            res: false,
            msg: "User not found",
          });
        }
      });
    } else {
      res.send({
        res: false,
        msg: "Invalid Token",
      });
    }
  });
});

module.exports = router;
