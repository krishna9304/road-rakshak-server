const router = require("express").Router();
const userAuth = require("./userAuth");
const adminAuth = require("./adminAuth");
const report = require("./report");

router.use("/userAuth", userAuth);
router.use("/adminAuth", adminAuth);
router.use("/report", report);

module.exports = router;
