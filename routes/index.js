const router = require("express").Router();
const userAuth = require("./userAuth");

router.use("/userAuth", userAuth);

module.exports = router;
