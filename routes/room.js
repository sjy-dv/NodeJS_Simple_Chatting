const router = require("express").Router();
const { RoomList: controller } = require("../controllers");

router.get("/roomlist", controller.RoomList);
router.get("/list", controller.ChatLog);

module.exports = router;
