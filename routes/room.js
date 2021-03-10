const router = require("express").Router();
const { RoomList: controller } = require("../controllers");

router.get("/roomlist", controller.RoomList);

module.exports = router;
