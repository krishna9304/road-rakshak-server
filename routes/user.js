const user = require("../database/models/user");
const { compare, hash } = require("../utilities/password");
const validator = require("validator");
const { tokenGenerator, tokenDecoder } = require("../utilities/jwt");
const mail = require("../utilities/mailer");
const { ISDEV } = require("../index");

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
    user
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
    user
      .findOne({ email })
      .then((doc) => {
        if (doc.isVerified) {
          errors.push("User already verified");
        } else {
          const token = tokenGenerator(doc._id, doc.name);
          mail({
            to: doc.email,
            verifierlink: `${
              ISDEV
                ? "http://localhost:3000"
                : "https://road-rakshak.vercel.app"
            }/verifyuser/${token}`,
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
    user
      .findById(_id)
      .then((doc) => {
        if (doc.isVerified) {
          errors.push("User already verified");
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

router.post("/getuser", (req, res, next) => {
  const { id } = req.body;
  user.findById(id).then((userData) => {
    if (!userData) {
      res.send({ res: false, errors: ["User not found"] });
    } else {
      res.send({
        res: true,
        userData,
      });
    }
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
      user
        .findById(_id)
        .then((doc) => {
          res.send({ res: true, userData: doc });
        })
        .catch(next);
    });
  }
});

module.exports = router;
