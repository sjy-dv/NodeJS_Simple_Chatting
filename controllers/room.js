const db = require("../models");
const chat_room = db.chat_room;

module.exports = {
  RoomList: async (req, res) => {
    try {
      const list = await chat_room.findAll();
      res.status(200).send(list);
    } catch (error) {
      console.log(error);
    }
  },
};
