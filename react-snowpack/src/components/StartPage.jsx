import React from "react";
import "./start.css";
import { withRouter } from "react-router-dom";
import store from "../store";

class StartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chat_id: "",
    };
  }

  TextChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  chatting = () => {
    if (this.state.chat_id === "") {
      alert("닉네임을 적어주세요.");
      return false;
    }
    store.dispatch({ type: "join", chat_id: this.state.chat_id });
    this.props.history.push("/room");
  };

  render() {
    return (
      <>
        <div className="login-box">
          <h2>Enter</h2>
          <form>
            <div className="user-box">
              <input
                type="text"
                name="chat_id"
                value={this.state.chat_id}
                onChange={this.TextChange}
                placeholder="채팅방에서 사용할 닉네임을 적어주세요."
                required
              />
              <label>Username</label>
            </div>
            <p onClick={this.chatting}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Enter to Room
            </p>
          </form>
        </div>
      </>
    );
  }
}

export default withRouter(StartPage);
