require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const chalk = require("chalk");
const Socket = require("socket.io");
const bodyParser = require("body-parser");
const { greenBright, blackBright, black, redBright } = require("chalk");
const routes = require("./routes");

const PORT = process.env.PORT || 8080;
const ISDEV = process.env.NODE_ENV !== "production";
module.exports.ISDEV = ISDEV;

//all the middlewares
require("./database");
const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.use("/api/v1", routes);

// error handler

app.get("/", (req, res, next) => {
  res.send({
    res: true,
    msg: "Server running",
  });
});

const server = app.listen(PORT, () => {
  console.clear();
  console.log(
    chalk.bgCyanBright(
      black(
        ` Server started on PORT ${PORT} at ${Date()} as ${
          ISDEV ? "DEV" : "PRODUCTION"
        }\n`
      )
    )
  );
});

const io = Socket(server);

let clients = [];

const getClientById = (id) => {
  for (const client of clients) {
    if (client.id === id) {
      return client;
    }
  }
};

const addClient = (client) => {
  clients.push(client);
  console.log(greenBright(`USER ${client.id} joined!`));
};

const removeClient = (client) => {
  clients.splice(clients.indexOf(client), 1);
  console.log(chalk.redBright(`User ${client.id} left`));
};

io.sockets.on("connection", (soc) => {
  addClient(soc);
  soc.on("disconnect", () => {
    removeClient(soc);
  });

  addEvents(soc);
});

const addEvents = (client) => {
  client.on("log", console.log);
};

app.use(function (err, req, res, next) {
  console.log(redBright(err.stack));
  res
    .send({
      msg: ISDEV ? err.message : "Contact Developer",
      stack: ISDEV ? err.stack : "Error stack not visible on production",
    })
    .status(500);
});
