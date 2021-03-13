import React from "react";
import Moment from "react-moment";

class LogList extends React.Component {
  render() {
    return (
      <tbody>
        <td>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {this.props.idx}
        </td>
        <td>{this.props.chat_room}</td>
        <td>{this.props.chat_id}</td>
        <td>{this.props.chat_msg}</td>
        <td>
          <Moment format="YYYY 년 MM 월 DD 일 HH시 mm분">
            {this.props.createdAt}
          </Moment>
        </td>
      </tbody>
    );
  }
}

export default LogList;
