const admin = require("../database/models/admin");
const { compare, hash } = require("../utilities/password");
const validator = require("validator");
const { tokenGenerator, tokenDecoder } = require("../utilities/jwt");
const mail = require("../utilities/mailer");
const { ADMIN_CLIENT_URL } = require("../utilities/constants");

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
    admin
      .findOne({ email: data.email })
      .then((doc) => {
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
                if ((data.newPass + "").length < 8) {
                  errors.push("Use atleast 8 characters to create a password!");
                  res.send({
                    res: false,
                    errors,
                  });
                } else {
                  hash(data.newPass, next, (hashed) => {
                    doc.password = hashed;
                    doc.name = data.name;
                    doc
                      .save()
                      .then((userData) => {
                        const token = tokenGenerator(doc._id, userData.name);
                        res.send({
                          res: true,
                          userData,
                          token,
                        });
                      })
                      .catch(next);
                  });
                }
              } else {
                doc.name = data.name;
                doc
                  .save()
                  .then((userData) => {
                    const token = tokenGenerator(doc._id, userData.name);
                    res.send({
                      res: true,
                      userData,
                      token,
                    });
                  })
                  .catch(next);
              }
            }
          });
        }
      })
      .catch(next);
  }
});

router.post("/verifyuser", (req, res, next) => {
  const { email } = req.body;
  let errors = [];
  if (!email) {
    errors.push("Email required");
  } else if (!validator.isEmail(email)) {
    errors.push("Invalid email");
  }
  if (errors.length) {
    res.send({
      res: false,
      errors,
    });
  } else {
    admin
      .findOne({ email })
      .then((doc) => {
        if (doc.isVerified) {
          errors.push("Admin already verified");
        } else {
          const token = tokenGenerator(doc._id, doc.name);
          mail({
            to: doc.email,
            verifierlink: `${ADMIN_CLIENT_URL}/verifyuser/${token}`,
          });
          res.send({
            res: true,
            msg: "Mail sent to email.",
          });
        }
        if (errors.length) {
          res.send({
            res: false,
            errors,
          });
        }
      })
      .catch(next);
  }
});

router.post("/verified", (req, res, next) => {
  const data = req.body;
  let errors = [];
  tokenDecoder(data.token, (err, { _id }) => {
    if (err) next(err);
    admin
      .findById(_id)
      .then((doc) => {
        if (doc.isVerified) {
          errors.push("Admin already verified");
        } else {
          doc.isVerified = true;
          doc
            .save()
            .then((userData) => {
              res.send({
                res: true,
                userData,
              });
            })
            .catch(next);
        }
      })
      .catch(next);
  });
});

router.post("/details", (req, res, next) => {
  const data = req.body;
  let errors = [];
  if (!data.token) {
    errors.push("Token is required");
  }
  if (errors.length) {
    res.send({
      res: false,
      errors,
    });
  } else {
    tokenDecoder(data.token, (err, { _id }) => {
      if (err) next(err);
      admin
        .findById(_id)
        .then((doc) => {
          res.send({ res: true, userData: doc });
        })
        .catch(next);
    });
  }
});

module.exports = router;
