const chalk = require("chalk");
let mongoose = require("mongoose");
const { MONGO_URI } = require("../utilities/constants");

const uri = MONGO_URI;
console.log(chalk.bgRedBright(uri));

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;

db.on("open", () => {
  console.log("Connected to the database successfully");
});

db.once("error", () => {
  console.error("There was some problem connecting to the database");
});
