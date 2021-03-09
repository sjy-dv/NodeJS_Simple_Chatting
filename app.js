const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const socket_server = require("./services/socket");
const dotenv = require("dotenv");
const db = require("./models");
dotenv.config();

db.sequelize
  .authenticate()
  .then(async () => {
    console.log("DB Connecting ...");
    await db.sequelize.sync({ force: false });
  })
  .catch((err) => {
    console.log(`DB ERROR : ${err}`);
  });

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { PORT } = process.env;
const http_server = require("http")
  .createServer(app)
  .listen(PORT || 8081);

socket_server.io.attach(http_server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

socket_server.init();
