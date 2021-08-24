const chalk = require("chalk");
let mongoose = require("mongoose");

const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASS}@cluster0.fo7rn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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
