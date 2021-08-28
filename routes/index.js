const router = require("express").Router();
const userAuth = require("./userAuth");
const adminAuth = require("./adminAuth");
const report = require("./report");
const user = require("./user");
const news = require("./news");

router.use("/userAuth", userAuth);
router.use("/adminAuth", adminAuth);
router.use("/user", user);
router.use("/report", report);
router.use("/news", news);

module.exports = router;
