import React from "react";
import Router from "./components";
import { Route } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <>
        <Route exact path="/" component={Router.StartPage} />
        <Route path="/room" component={Router.Room} />
        <Route path="/chat" component={Router.ChatLog} />
      </>
    );
  }
}

export default App;
