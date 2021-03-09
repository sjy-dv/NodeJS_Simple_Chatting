import React from "react";
import axios from "axios";
//import socketio from "socket.io-client";
import store from "../store";
import { withRouter } from "react-router-dom";
//const socket = socketio.connect("http://localhost:8081/chat");

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      RoomList: [],
    };
  }

  getRoomList = async () => {
    /*
    await axios
      .get("http://localhost:8081/api/chat/roomlist")
      .then((res) => {
        this.setState({
          RoomList: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
      */
  };

  chat_in = () => {
    store.dispatch({
      type: "intoroom",
      chat_id: store.getState().chat_id,
      roomname: "1",
    });
    this.props.history.push("/chat");
  };

  create_room = async () => {};

  async componentDidMount() {
    await this.getRoomList();
  }

  render() {
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
            <th scope="col">입장하기</th>
          </thead>
          <tbody>
            <tr>
              <td className="align-middle">1</td>
              <td className="align-middle">테스트방</td>
              <td className="align-middle">
                <button className="btn btn-primary" onClick={this.chat_in}>
                  입장하기
                </button>
              </td>
            </tr>
          </tbody>
          {this.state.RoomList
            ? this.state.RoomList.map((k) => (
                <tbody>
                  <tr>
                    <td className="align-middle">{k.idx}</td>
                    <td className="align-middle">{k.roomname}</td>
                    <td className="align-middle">
                      <button
                        className="btn btn-primary"
                        onClick={this.chat_in(k.idx)}
                      >
                        입장하기
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))
            : ""}
        </table>
      </div>
    );
  }
}

export default withRouter(Room);
