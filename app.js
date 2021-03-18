const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const dotenv = require("dotenv");
const createError = require("http-errors");
const morgan = require("morgan");
const { logger, stream } = require("./config/winston");
const socket_server = require("./services/socket");
const db = require("./models");

dotenv.config();

const { PORT } = process.env;
const http_server = require("http")
  .createServer(app)
  .listen(PORT || 8081);

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
app.use(morgan("combined", { stream }));
app.use((req, res, next) => {
  next(createError(404));
});
app.use((err, req, res, next) => {
  let apiError = err;

  if (!err.status) {
    apiError = createError(err);
  }

  if (process.env.NODE_ENV === "test") {
    const errObj = {
      req: {
        headers: req.headers,
        query: req.query,
        body: req.body,
        route: req.route,
      },
      error: {
        message: apiError.message,
        stack: apiError.stack,
        status: apiError.status,
      },
    };
    logger.error(`${Date.now()} : ${errObj}`);
  } else {
    res.locals.message = apiError.message;
    res.locals.error = apiError;
  }

  return response(
    res,
    {
      message: apiError.message,
    },
    apiError.status
  );
});
const Router = require("./routes");
const { response } = require("express");

app.use("/api/room", Router.room);

socket_server.io.attach(http_server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

socket_server.init();
