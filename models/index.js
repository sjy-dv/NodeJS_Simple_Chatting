const { Sequelize, DataTypes, Op, QueryTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const {
  MYSQL_DB,
  MYSQL_DB_USER,
  MYSQL_DB_PASSWORD,
  MYSQL_DB_HOST,
} = process.env;

const sequelize = new Sequelize(MYSQL_DB, MYSQL_DB_USER, MYSQL_DB_PASSWORD, {
  host: MYSQL_DB_HOST,
  dialect: "mysql",
  operatorsAliases: 0,

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

let db = [];

db.chat_log = require("./chat_log.js")(sequelize, DataTypes);

db.sequelize = sequelize;
db.Op = Op;
db.QueryTypes = QueryTypes;

module.exports = db;
