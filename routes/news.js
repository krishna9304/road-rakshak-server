const router = require("express").Router();
const News = require("../database/models/news");
const upload = require("../utilities/fileSaver");
const Admin = require("../database/models/admin");
const { SERVER_URL } = require("../utilities/constants");

router.post("/createNews", upload.single("picture"), (req, res, next) => {
  let isDev = process.env.NODE_ENV !== "production";
  let data = req.body;
  let errors = [];
  data.references = data.references.split(",");
  data.references = data.references.map((ref) => {
    return ref.trim();
  });
  // console.log(data);
  Admin.findById(data.postedBy).then((doc) => {
    if (!doc) {
      errors.push("User not found!!");
    } else if (!doc.isVerified) {
      errors.push("User not verified");
    }
    if (errors.length) {
      res.send({
        res: false,
        errors,
      });
    } else {
      if (req.file) {
        const url = req.protocol + "://" + `${SERVER_URL}/` + req.file.filename;
        data.picture = url;
      }
      let news = new News(data);
      news
        .save()
        .then((doc) => {
          res.send({
            res: true,
            news: doc,
            msg: "News posted successfully!",
          });
        })
        .catch(next);
    }
  });
});

router.get("/getNews", (req, res, next) => {
  News.find({})
    .then((docs) => {
      res.send({
        res: true,
        news: docs,
        msg: "News returned successfully!",
      });
    })
    .catch(next);
});

module.exports = router;
