const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const User = require("../database/models/user");
const upload = require("../utilities/fileSaver");
const Report = require("../database/models/report");
const Admin = require("../database/models/admin");
const {
  isValidLatitude,
  isValidLongitude,
} = require("is-valid-geo-coordinates");

router.post("/createReport", upload.single("siteImage"), (req, res, next) => {
  let data = req.body;
  let errors = [];
  if (!data.siteImage) {
    data.siteImage = [];
  }
  if (!data.description) {
    errors.push("Description is required");
  }
  if (!data.address || (data.address + "").length < 20) {
    errors.push("Address is invalid");
  }
  if (!data.hurdleType) {
    errors.push("Hurdle Type is required");
  }
  if (errors.length) {
    res.send({
      res: false,
      errors,
    });
  } else {
    User.findById(data.reportedBy).then((doc) => {
      if (!doc) {
        errors.push("User not found!");
      } else if (!doc.isVerified) {
        errors.push("User not verified!");
      }
      if (errors.length) {
        res.send({
          res: false,
          errors,
        });
      } else {
        let reportId = uuidv4() + "";
        reportId = reportId.slice(reportId.length - 11, reportId.length - 1);
        let isDev = process.env.NODE_ENV !== "production";
        if (req.file) {
          const url =
            req.protocol +
            "://" +
            (isDev ? "localhost:8080" : "") +
            "/" +
            req.file.filename;
          data.siteImage = url;
        }
        let report = new Report({ ...data, reportId });
        report
          .save()
          .then((doc) => {
            res.send({
              res: true,
              msg: "Reported successfully!",
            });
          })
          .catch(next);
      }
    });
  }
});

router.post("/getReports", (req, res, next) => {
  let data = req.body;
  Admin.findById(data.requestedBy).then((doc) => {
    if (!doc) {
      res.send({
        res: false,
        msg: "Illegal request!",
      });
    } else if (!doc.isVerified) {
      res.send({
        res: false,
        msg: "You are not verified!",
      });
    } else {
      Report.find({})
        .then((docs) => {
          res.send({
            res: true,
            reports: docs,
          });
        })
        .catch(next);
    }
  });
});

router.post("/getreport", (req, res, next) => {
  const { id } = req.body;
  Report.findOne({ reportId: id })
    .then((doc) => {
      if (!doc) {
        res.send({
          res: false,
          errors: ["Report not found!"],
        });
      } else {
        res.send({
          res: true,
          report: doc,
        });
      }
    })
    .catch(next);
});

router.post("/updateReport", (req, res, next) => {
  let data = req.body;
  let errors = [];
  if (!data.coord.latitude) {
    errors.push("Enter correct latitude coordinate.");
  }
  if (!data.coord.longitude) {
    errors.push("Enter correct longitude coordinate.");
  }
  if (errors.length) {
    res.send({
      res: false,
      errors,
    });
  } else {
    Report.findOne({ reportId: data.reportId })
      .then((doc) => {
        doc.locationCoords = data.coord;
        if (!doc.isVerified) {
          if (data.checked) {
            doc.isVerified = true;
          }
        }
        doc
          .save()
          .then((doc) => {
            res.send({
              res: true,
              msg: "Report updated succesfully!",
            });
          })
          .catch(next);
      })
      .catch(next);
  }
});

router.post("/getVerified", (req, res, next) => {
  Report.find({ isVerified: true })
    .then((docs) => {
      res.send({
        res: true,
        reports: docs,
      });
    })
    .catch(next);
});

module.exports = router;
