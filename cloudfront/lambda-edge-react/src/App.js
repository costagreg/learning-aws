import React, { Component } from "react";
import asyncComponent from "./asyncComponent";
import { withAuthenticator } from 'aws-amplify-react';
import { Link, Route, HashRouter } from "react-router-dom";
import "./App.css";
import Public from "./Public";

const AsyncProtected = asyncComponent(() =>
  /* webpackChunkName: "protected/a" */ import("./Protected")
);

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>React Authentication with JWT and AWS Cognito!</h1>
        <HashRouter>
          <div>
            <Link to="/">Public</Link>, <Link to="/protected">Protected</Link>
            <Route path="/" exact component={Public} />
            <Route path="/protected" component={withAuthenticator(AsyncProtected)} />
          </div>
        </HashRouter>
      </div>
    );
  }
}

export default App;
