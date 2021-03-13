import React from "react";
import axios from "axios";
import socketio from "socket.io-client";
import store from "../store";
import { withRouter } from "react-router-dom";
import RoomList from "./RoomList";
import { Modal } from "antd";
const socket = socketio.connect("http://localhost:8081/room");

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      RoomList: [],
      isModalVisible: false,
      r_name: "",
      online_user: [],
    };
  }

  getRoomList = async () => {
    await axios
      .get("http://localhost:8081/api/room/roomlist")
      .then((res) => {
        console.log(res.data);
        this.setState({
          RoomList: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  create_room = async () => {
    this.setState({
      isModalVisible: true,
    });
  };

  async componentDidMount() {
    await socket.emit("online", store.getState().chat_id);
    await socket.emit("online_user_list", {});
    await socket.on("online_user_list", (obj) => {
      this.setState({
        online_user: obj,
      });
      console.log(this.state.online_user);
    });
    await this.getRoomList();
  }

  TextChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  handleOk = async () => {
    store.dispatch({
      type: "create",
      chat_id: store.getState().chat_id,
      roomname: this.state.r_name,
      mode: 1,
    });
    this.props.history.push("/chat");
  };

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  render() {
    let userobj = this.state.online_user;
    let user_length = this.state.online_user.length;

    return (
      <div className="container">
        <br />
        <h1>채팅방 리스트</h1>
        <br />
        <button className="btn btn-primary" onClick={this.create_room}>
          방 만들기
        </button>
        <br />
        <br />
        <table className="table">
          <thead className="thead-dark">
            <th scope="col">채팅방 번호</th>
            <th scope="col">채팅방 이름</th>
            <th scope="col">채팅방 인원</th>
            <th scope="col">입장하기</th>
          </thead>
          {this.state.RoomList
            ? this.state.RoomList.map((k) => (
                <RoomList
                  key={k.idx}
                  idx={k.idx}
                  chat_room={k.chat_room}
                  chat_group_count={k.chat_group_count}
                />
              ))
            : ""}
        </table>
        <div className="container">
          <p>접속중인 유저 리스트</p>
          {(function () {
            let tagarray = [];
            for (let i = 0; i < user_length; i++) {
              let tag = <span>{userobj[i]}&nbsp;&nbsp;&nbsp;&nbsp;</span>;
              tagarray.push(tag);
            }
            return tagarray;
          })()}
        </div>
        <Modal
          title="방 만들기"
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>방이름을 입력해주세요.</p>
          <input
            type="text"
            value={this.state.r_name}
            name="r_name"
            onChange={this.TextChange}
          />
        </Modal>
      </div>
    );
  }
}

export default withRouter(Room);
