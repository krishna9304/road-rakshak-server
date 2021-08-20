require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const chalk = require("chalk");
const Socket = require("socket.io");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 8080;
const ISDEV = process.env.NODE_ENV!=="production";

const app = express();

const server = app.listen(PORT, ()=>{
    console.clear();
    console.log(chalk.cyanBright(`Server started on PORT ${PORT} at ${Date()} as ${ISDEV?"DEV":"PRODUCTION"}`))
})

const io = Socket(server);

io.sockets.on('connection', (soc)=>{
    console.log(chalk.greenBright(`User ${soc.id} joined`));
    soc.on('disconnect', ()=>{
        console.log(chalk.redBright(`User ${soc.id} left`));
    })
})