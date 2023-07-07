const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const User = require("../database/models/user");
const upload = require("../utilities/fileSaver");
const Report = require("../database/models/report");
const Admin = require("../database/models/admin");
const { distanceBtw, arrange } = require("../utilities/maputilities");
const { SERVER_URL } = require("../utilities/constants");

router.post("/createReport", upload.single("siteImage"), (req, res, next) => {
  let data = req.body;
  let errors = [];
  if (!data.siteImage) {
    data.siteImage = [];
  }
  if (!data.description) {
    errors.push("Description is required");
  }
  if (!data.address || !(data.address + "").length) {
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
        if (req.file) {
          const url =
            req.protocol + "://" + SERVER_URL + "/" + req.file.filename;
          data.siteImage = url;
        }
        let locationCoords = {
          latitude: data.latitude,
          longitude: data.longitude,
        };
        let report = new Report({ ...data, reportId, locationCoords });
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
    .then((hurdles) => {
      res.send({
        res: true,
        hurdles,
      });
    })
    .catch(next);
});

router.post("/getonpath", (req, res, next) => {
  const { coords, origin } = req.body;
  const hurdles = [];
  const threshold = 200;
  Report.find({ isVerified: true })
    .then((docs) => {
      for (let hurdle of docs) {
        const c1 = [
          hurdle.locationCoords.longitude,
          hurdle.locationCoords.latitude,
        ];
        for (let coord of coords) {
          const d = distanceBtw(c1, coord);
          if (d < threshold) {
            hurdles.push(hurdle);
            break;
          }
        }
      }
      res.send({
        res: true,
        hurdles: !origin ? hurdles : arrange(hurdles, origin),
      });
    })
    .catch(next);
});
router.post("/delete", (req, res, next) => {
  const data = req.body;
  const errors = [];
  Admin.findById(data.admin)
    .then((doc) => {
      if (!doc) {
        errors.push(`Admin not found`);
        res.send({
          res: false,
          errors,
        });
      } else if (!doc.isVerified) {
        errors.push(`Admin not Verified`);
        res.send({
          res: false,
          errors,
        });
      } else {
        Report.exists({ _id: data.report }).then((reportExists) => {
          if (reportExists) {
            Report.findByIdAndDelete(data.report)
              .then((reportDoc) => {
                res.send({
                  res: true,
                  report: reportDoc,
                  msg: "Report deleted successfully",
                });
              })
              .catch(next);
          } else {
            errors.push(`Report not found`);
            res.send({
              res: false,
              errors,
            });
          }
        });
      }
    })
    .catch(next);
});

module.exports = router;
