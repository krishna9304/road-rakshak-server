const user = require("../database/models/user");
const { compare, hash } = require("../utilities/password");
const validator = require("validator");
const { tokenGenerator } = require("../utilities/jwt");

const router = require("express").Router();

router.post("/changeprofile", (req, res, next) => {
  let data = req.body;
  let errors = [];

  if (data.name.length < 8 || !data.name) {
    errors.push("Invalid name. Name must be atleast 8 characters");
  }
  if (!data.email) {
    errors.push("Email is required");
  } else if (!validator.isEmail(data.email)) {
    errors.push("Invalid Email");
  }
  if (!data.password) {
    errors.push("Password is required");
  }
  if (errors.length) {
    res.send({
      res: false,
      errors,
    });
  } else {
    user.findOne({ email: data.email }).then((doc) => {
      if (!doc) {
        errors.push("User not found");
        res.send({
          res: false,
          errors,
        });
      } else {
        compare(doc.password, data.password, next, (same) => {
          if (!same) {
            errors.push("Wrong Password");
            res.send({
              res: false,
              errors,
            });
          } else {
            if (data.newPass) {
              hash(data.newPass, next, (hashed) => {
                doc.password = hashed;
                doc.name = data.name;
                doc.save().then((userData) => {
                  const token = tokenGenerator(doc._id, userData.name);
                  res.send({
                    res: true,
                    userData,
                    token,
                  });
                });
              });
            } else {
              doc.name = data.name;
              doc.save().then((userData) => {
                const token = tokenGenerator(doc._id, userData.name);
                res.send({
                  res: true,
                  userData,
                  token,
                });
              });
            }
          }
        });
      }
    });
  }
});

module.exports = router;
