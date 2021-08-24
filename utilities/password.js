const bcrypt = require("bcrypt");

let hash = (password, next, cb) => {
  let hashed = "";
  bcrypt.hash(password, 10, (err, enc_pass) => {
    if (err) next(err);
    hashed = enc_pass;
    cb(hashed);
  });
};

const compare = (hashed, password, next, cb) => {
  bcrypt.compare(password, hashed, (err, same) => {
    if (err) next(err);
    cb(same);
  });
};
module.exports.compare = compare;
module.exports.hash = hash;
