const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const dotenv = require("dotenv");
const http_server = require("http")
  .createServer(app)
  .listen(PORT || 8081);
const socket_server = require("./services/socket");
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

const Router = require("./routes");

app.use("/api/room", Router.room);

const { PORT } = process.env;

socket_server.io.attach(http_server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

socket_server.init();
