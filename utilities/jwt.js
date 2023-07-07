const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./constants");

const tokenGenerator = (_id, name) => {
  let token = jwt.sign(
    {
      _id,
      name,
    },
    JWT_SECRET,
    {
      expiresIn: "100h",
    }
  );
  return token;
};

const tokenDecoder = (token, cb) => {
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    let finalDecoded;
    try {
      finalDecoded = {
        _id: decoded._id,
        name: decoded.name,
      };
      cb(err, finalDecoded);
    } catch (error) {
      cb(err, finalDecoded);
    }
  });
};
module.exports.tokenGenerator = tokenGenerator;
module.exports.tokenDecoder = tokenDecoder;
