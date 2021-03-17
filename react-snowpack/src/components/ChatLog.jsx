import React from "react";
import socketio from "socket.io-client";
import store from "../store";
import { withRouter } from "react-router-dom";
const socket = socketio.connect("http://localhost:8081/chat");

class ChatLog extends React.Component {
  constructor() {
    super();
    this.state = {
      logs: [],
      chatmsg: "",
      room_user : []
    };
  }

  async componentDidMount() {
    if (store.getState().mode === 1) {
      await socket.emit("create_room", {
        roomname: store.getState().roomname,
        chat_id: store.getState().chat_id,
      });
    }
    await socket.emit("intoroom", {
      roomname: store.getState().roomname,
      chat_id : store.getState().chat_id,
      count: Number(store.getState().count) + 1,
    });
    await socket.on("server_msg", async (obj) => {
      console.log(obj);
      console.log(this.state.logs);
      const logs2 = this.state.logs;
      console.log(logs2);
      obj.key = "key_" + (this.state.logs.length + 1);
      console.log(obj.key);
      logs2.unshift(obj);
      this.setState({ logs: logs2 });
    });
    await socket.emit("chat_room_list", store.getState().roomname);
    await socket.on("chat_room_list", (obj) => {
      this.setState({
        room_user : obj,
      });
      console.log(this.state.room_user);
    });
    await socket.on("chatmsg", (obj) => {
      const logs2 = this.state.logs;
      obj.key = "key_" + (this.state.logs.length + 1);
      logs2.unshift(obj);
      this.setState({ logs: logs2 });
    });
  }
  chatmsgChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  send = async (e) => {
    e.preventDefault();
    await socket.emit("chatmsg", {
      roomname: store.getState().roomname,
      chat_id: store.getState().chat_id,
      message: this.state.chatmsg,
    });
    this.setState({ chatmsg: "" });
  };

  leave = async () => {
    await socket.emit("leaveroom", {
      roomname: store.getState().roomname,
      chat_id: store.getState().chat_id,
    });
    await socket.on("leavemsg", async (obj) => {
      console.log(obj);
      console.log(this.state.logs);
      const logs2 = this.state.logs;
      console.log(logs2);
      obj.key = "key_" + (this.state.logs.length + 1);
      console.log(obj.key);
      logs2.unshift(obj);
      this.setState({ logs: logs2 });
    });
    this.props.history.push("/room");
  };
  render() {
    let userobj = this.state.room_user;
    let user_length = this.state.room_user.length;
    const messages = this.state.logs.map((k) => (
      <div key={k.key}>
        <p>
          &nbsp;{k.chat_id} : {k.message}
        </p>
      </div>
    ));
    return (
      <>
        <div
          className="container"
          style={{ textAlign: "center", marginTop: "10%" }}
        >
          {messages.reverse()}
          <input
            type="text"
            name="chatmsg"
            value={this.state.chatmsg}
            onChange={this.chatmsgChange}
            placeholder="채팅을 입력하세요."
          />
          <button className="btn btn-primary" onClick={this.send}>
            보내기
          </button>
          <br />
          <br />
          <br />
          <br />
          <br />
          <button className="btn btn-warning" onClick={this.leave}>
            방나가기
          </button>
          <div className="container">
          <p>참여중인 유저 리스트</p>
          {(function () {
            let tagarray = [];
            for (let i = 0; i < user_length; i++) {
              let tag = <span>{userobj[i]}&nbsp;&nbsp;&nbsp;&nbsp;</span>;
              tagarray.push(tag);
            }
            return tagarray;
          })()}
        </div>
        </div>
      </>
    );
  }
}

export default withRouter(ChatLog);
