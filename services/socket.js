const io = require("socket.io")();
const redisAdapter = require("socket.io-redis");
const redis = require("redis");
const dotenv = require("dotenv");
const { chat_room, chat_log } = require("../models");
const { on } = require("nodemon");

dotenv.config();
const { REDIS_HOST, REDIS_PORT } = process.env;
const redis_client = redis.createClient(REDIS_PORT, REDIS_HOST);
redis_client.on("error", (err) => {
  console.log(`Redis Error${err}`);
});

io.adapter(redisAdapter({ host: REDIS_HOST, port: REDIS_PORT }));
const chat_socket = io.of("/chat");
const online_socket = io.of("/room");
module.exports = {
  io,
  chat_socket,
  online_socket,
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
  init: async (app) => {
    online_socket.on("connection", (socket) => {
      socket.on("online", async (chat_id) => {
        try {
          await redis_client.get("online_group_list", async (err, reply) => {
            if (err) console.log(err);
            const obj = [reply];
            obj.push(chat_id);
            const online_group = await redis_client.set(
              "online_group_list",
              obj.toString()
            );
            if (!online_group) console.log("online_group_error");
          });
        } catch (e) {}
      });
      socket.on("online_user_list", async () => {
        try {
          await redis_client.get("online_group_list", async (err, reply) => {
            if (err) throw console.log(err);
            console.log(reply);
            const online_group_list = reply.split(",");
            const online_group = online_group_list.filter((item) => {
              return item !== null && item !== undefined && item !== "";
            });
            await online_socket.emit("online_user_list", online_group);
          });
          // eslint-disable-next-line no-empty
        } catch (e) {}
      });
    });
    chat_socket.on("connection", (socket) => {
      socket.on("intoroom", async (roominfo) => {
        try {
          var count = 0;
          await redis_client.get(
            `${roominfo.roomname}_room_list`,
            async (err, reply) => {
              if (err) throw console.log(err);
              const before_redis = reply.split(",");
              before_redis.push(roominfo.chat_id);
              count = before_redis.length - 1;
              console.log(count);
              await redis_client.set(
                `${roominfo.roomname}_room_list`,
                before_redis.toString()
              );
            }
          );
          const update_room = await chat_room.update(
            { count: count },
            {
              where: {
                chat_room: roominfo.roomname,
              },
            }
          );
          if (!update_room) console.log("update error");
          await socket.join(roominfo.roomname);
          await socket.to(roominfo.roomname).emit("server_msg", {
            chat_id: "[서버]",
            message: `${roominfo.chat_id}님이 들어왔습니다. 환영해주세요~ ^^`,
          });
        } catch (e) {}
      });
      socket.on("create_room", async (roominfo) => {
        try {
          await redis_client.set(
            `${roominfo.roomname}_room_list`,
            roominfo.chat_id
          );
          const create_room = await chat_room.create({
            chat_room: roominfo.roomname,
            chat_group_member: roominfo.chat_id,
            chat_group_count: 1,
          });
          if (!create_room) console.log("create error");
          await socket.join(roominfo.roomname);
        } catch (e) {}
      });
      socket.on("chatmsg", async (chatmsg) => {
        try {
          const write_chat_log = await chat_log.create({
            chat_room: chatmsg.roomname,
            chat_id: chatmsg.chat_id,
            chat_msg: chatmsg.message,
          });
          if (!write_chat_log) console.log("db error");
          await chat_socket.to(chatmsg.roomname).emit("chatmsg", chatmsg);
        } catch (e) {}
      });
      socket.on("chat_room_list", async (roomname) => {
        try {
          redis_client.get(`${roomname}_room_list`, async (err, reply) => {
            if (err) throw console.log(err);
            console.log(reply);
            const chat_room_list = reply.split(",");
            const chat_room_group = chat_room_list.filter((item) => {
              return item !== null && item !== undefined && item !== "";
            });
            await chat_socket.emit("chat_room_list", chat_room_group);
          });
        } catch (e) {}
      });
      socket.on("leaveroom", async (userinfo) => {
        try {
          console.log("방 나가기");
          await socket.broadcast.to(userinfo.roomname).emit("leavemsg", {
            chat_id: "[서버]",
            message: `${userinfo.chat_id}님이 방을 나갔습니다.`,
          });
          await socket.leave(userinfo.roomname);
        } catch (e) {}
      });

      socket.on("disconnect", async () => {
        // 접속 종료시 다른 소켓에세 퇴장했다는 응답을준다.
        try {
          redis_client.flushall();
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
