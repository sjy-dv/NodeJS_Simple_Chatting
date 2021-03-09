let io = require("socket.io")();
const redisAdapter = require("socket.io-redis");
const redis = require("redis");
const dotenv = require("dotenv");
const db = require("../models");
dotenv.config();
const chat_log = db.chat_log;
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
      socket.on("intoroom", async (roomname) => {
        await socket.join(roomname);
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
          nickname: "[서버]",
          message: `${userinfo.chat_id}님이 방을 나갔습니다.`,
        });
        await socket.leave(userinfo.roomname);
      });

      socket.on("disconnect", () => {
        //접속 종료시 다른 소켓에세 퇴장했다는 응답을준다.
      });
    });
  },
};
