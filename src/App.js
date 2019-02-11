import React, { Component } from "react";
import "./App.css";
import Wrapper from "./components/wrapper/index";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

library.add(faEye);

class App extends Component {
  render() {
    return (
      <div className="App">
        <Wrapper />
      </div>
    );
  }
}

export default App;
