let io = require("socket.io")();
const redisAdapter = require("socket.io-redis");
const redis = require("redis");
const dotenv = require("dotenv");
const db = require("../models");
dotenv.config();
const chat_log = db.chat_log;
const chat_room = db.chat_room;
const { REDIS_HOST, REDIS_PORT } = process.env;
const redis_client = redis.createClient(REDIS_PORT, REDIS_HOST);
redis_client.on("error", (err) => {
  console.log("Redis Error" + err);
});

io.adapter(redisAdapter({ host: REDIS_HOST, port: REDIS_PORT }));
let chat_socket = io.of("/chat");
module.exports = {
  io: io,
  redisSetValue: async (key, value) => {
    return new Promise((resolve, reject) => {
      redis_client.set(key, value, function (err, reply) {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(reply);
      });
    });
  },
  redisGetValue: async (key) => {
    return new Promise((resolve, reject) => {
      redis_client.get(key, (err, reply) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(reply);
      });
    });
  },
  init: async () => {
    chat_socket.on("connection", (socket) => {
      socket.on("intoroom", async (roominfo) => {
        console.log(roominfo);
        const update_room = await chat_room.update(
          { count: roominfo.count + 1 },
          {
            where: {
              chat_room: roominfo.roomname,
            },
          }
        );
        if (!update_room) console.log("update error");
        await socket.join(roominfo.roomname);
        await socket.broadcast.to(roominfo.roomname).emit("server_msg", {
          chat_id: "[서버]",
          message: `${roominfo.chat_id}님이 들어왔습니다. 환영해주세요~ ^^`,
        });
      });
      socket.on("create_room", async (roominfo) => {
        const create_room = await chat_room.create({
          chat_room: roominfo.roomname,
          chat_group_member: roominfo.chat_id,
          chat_group_count: 1,
        });
        if (!create_room) console.log("create error");
        await socket.join(roominfo.roomname);
      });
      socket.on("chatmsg", async (chatmsg) => {
        const write_chat_log = await chat_log.create({
          chat_room: chatmsg.roomname,
          chat_id: chatmsg.chat_id,
          chat_msg: chatmsg.message,
        });
        if (!write_chat_log) console.log("db error");
        await chat_socket.to(chatmsg.roomname).emit("chatmsg", chatmsg);
      });

      socket.on("leaveroom", async (userinfo) => {
        console.log("방 나가기");
        await socket.broadcast.to(userinfo.roomname).emit("leavemsg", {
          chat_id: "[서버]",
          message: `${userinfo.chat_id}님이 방을 나갔습니다.`,
        });
        await socket.leave(userinfo.roomname);
      });

      socket.on("disconnect", async () => {
        //접속 종료시 다른 소켓에세 퇴장했다는 응답을준다.
        try {
          await chat_room.destroy({
            where: {},
          });
        } catch (error) {
          console.log(error);
        }
      });
    });
  },
};
