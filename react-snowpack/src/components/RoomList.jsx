import React from "react";
import store from "../store";
import { withRouter } from "react-router-dom";
class RoomList extends React.Component {
  chat_in = (count, chatroom) => {
    store.dispatch({
      type: "intoroom",
      chat_id: store.getState().chat_id,
      roomname: chatroom,
      count: Number(count),
    });
    this.props.history.push("/chat");
  };

  render() {
    return (
      <>
        <tbody>
          <tr>
            <td className="align-middle">{this.props.idx}</td>
            <td className="align-middle">{this.props.chat_room}</td>
            <td className="align-middle">{this.props.chat_group_count}</td>
            <td className="align-middle">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  this.chat_in(
                    this.props.chat_group_count,
                    this.props.chat_room
                  );
                }}
              >
                입장하기
              </button>
            </td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default withRouter(RoomList);
