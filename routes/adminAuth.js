const router = require("express").Router();
const Admin = require("../database/models/admin");
const validator = require("validator");
const { hash } = require("../utilities/password");
const { compare } = require("../utilities/password");
const { tokenGenerator } = require("../utilities/jwt");
const { tokenDecoder } = require("../utilities/jwt");

router.post("/signUp", (req, res, next) => {
  let data = req.body;
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
  if ((data.phone + "").length !== 10 || !data.phone) {
    errors.push("Invalid phone number!");
  }
  Admin.exists({ email: data.email, phone: data.phone }, (err, result) => {
    if (err) next(err);
    if (result) {
      errors.push("Email or phone number already exists!!");
    }
    if (errors.length !== 0) {
      res.send({
        res: false,
        errors: errors,
      });
    } else {
      hash(data.password, next, (encPass) => {
        data.password = encPass;
        const admin = new Admin(data);
        admin
          .save()
          .then((doc) => {
            let token = tokenGenerator(doc._id, doc.name);
            res.send({
              res: true,
              userData: doc,
              jwt: token,
              msg: "Admin registered succesfully!!",
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
  Admin.exists({ email: data.email }, (err, result) => {
    if (err) next(err);
    if (result) {
      Admin.findOne({ email: data.email })
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
          });
        })
        .catch(next);
    } else {
      errors.push("This email doesn't exist!!");
    }
    if (errors.length !== 0) {
      res.send({
        res: false,
        errors: errors,
      });
    }
  });
});

router.post("/verifyToken", (req, res, next) => {
  let token = req.body.token;
  tokenDecoder(token, (err, decoded) => {
    if (err) next(err);
    if (decoded) {
      Admin.exists({ _id: decoded._id, name: decoded.name }, (err, result) => {
        if (err) next(err);
        if (result) {
          Admin.findById(decoded._id, (err, doc) => {
            if (err) next(err);
            res.send({
              res: true,
              userData: doc,
              msg: "Token verified!",
            });
          });
        } else {
          res.send({
            res: false,
            msg: "Admin not found in the database",
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
