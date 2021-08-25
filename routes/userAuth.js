const router = require("express").Router();
const User = require("../database/models/user");
const validator = require("validator");
const { hash } = require("../utilities/password");
const { compare } = require("../utilities/password");
const { tokenGenerator } = require("../utilities/jwt");

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

module.exports = router;
