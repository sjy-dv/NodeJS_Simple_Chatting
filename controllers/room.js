const { chat_room, chat_log } = require("../models");
module.exports = {
  RoomList: async (req, res) => {
    try {
      const list = await chat_room.findAll();
      res.status(200).send(list);
    } catch (error) {
      console.log(error);
    }
  },
  ChatLog: async (req, res) => {
    try {
      let { page } = req.query;
      let offset = 0;

      if (page > 1) {
        offset = 10 * (page - 1);
      }
      const result = await chat_log.findAndCountAll({
        offset: offset,
        limit: 10,
      });
      console.log(result.count);
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
    }
  },
};
