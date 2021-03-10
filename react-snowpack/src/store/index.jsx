import { createStore } from "redux";

export default createStore(function (state, action) {
  if (state === undefined || 0 || "") {
    return { chat_id: "", roomname: "", mode: 0, count: 0 };
  }
  if (action.type === "join") {
    return { ...state, chat_id: action.chat_id };
  }
  if (action.type === "intoroom") {
    return {
      ...state,
      chat_id: action.chat_id,
      roomname: action.roomname,
      count: action.count,
    };
  }
  if (action.type === "create") {
    return {
      ...state,
      chat_id: action.chat_id,
      roomname: action.roomname,
      mode: action.mode,
    };
  }
});
