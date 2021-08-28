const router = require("express").Router();
const uuid = require("uuid").v4;

router.post("/new", (req, res, next) => {
  console.log(uuid());
  let data = req.body;
  let errors = [];
  if (!data.siteImages) {
    data.siteImages = [];
  }
  if (!data.description) {
    errors.push("Description is required");
  }
  if (!data.address) {
    errors.push("Address is required");
  }
  if (!data.hurdleType) {
    errors.push("Hurdle Type is required");
  }
});

module.exports = router;
