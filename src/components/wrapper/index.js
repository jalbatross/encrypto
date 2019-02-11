import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorMessage from "../error-message/index";
import Selector from "../selector/index";
import Key from "../key/index";
import Input from "../input/index";
import * as aes from "aes-js";
import utf8 from "utf8";

export default class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "encrypt",
      key: "",
      secure: true,
      input: ""
    };

    this.placeholder = "input text to be encrypted or decrypted";
  }

  updateMode = e => {
    this.setState({
      mode: e.target.value
    });
  };

  onInputChange = e => {
    this.setState({
      input: e.target.value
    });
  };

  onKeyChange = e => {
    this.setState({
      key: e.target.value
    });
  };

  toggleReveal = () => {
    this.setState({
      secure: !this.state.secure
    });
  };

  processKey = key => {
    key = aes.utils.utf8.toBytes(key);
    if (key.length < 16) {
      key = this.padUint8Array(key, 16);
    } else if (key.length > 16 && key.length < 24) {
      key = this.padUint8Array(key, 24);
    } else if (key.length > 24 && key.length < 32) {
      key = this.padUint8Array(key, 32);
    } else if (key.length > 33) {
      throw new Error("Key was too large.");
    }
    return key;
  };

  padUint8Array(uint8Arr, length) {
    let arr = Array.from(uint8Arr);
    while (arr.length < length) {
      arr.push(0);
    }

    return Uint8Array.from(arr);
  }
  encrypt = () => {
    try {
      // Convert the key to utf8 bytes
      const key = this.processKey(this.state.key);

      // Convert input string to bytes
      const inputBytes = aes.utils.utf8.toBytes(this.state.input);

      // Encrypt with ctr
      let aesCtr = new aes.ModeOfOperation.ctr(key);
      let encryptedBytes = aesCtr.encrypt(inputBytes);
      this.setState({
        input: aes.utils.hex.fromBytes(encryptedBytes)
      });
    } catch (e) {
      this.setState({
        error: true,
        errorMessage:
          "Encryption failed. Make sure you have a valid key and input"
      });
    }
  };

  decrypt = () => {
    try {
      // Convert the key to utf8 bytes
      const key = this.processKey(this.state.key);

      // Convert input hex to bytes
      let inputBytes = aes.utils.hex.toBytes(this.state.input);

      // Decrypt with ctr
      let aesCtr = new aes.ModeOfOperation.ctr(key);
      let decryptedBytes = aesCtr.decrypt(inputBytes);

      this.setState({
        input: aes.utils.utf8.fromBytes(decryptedBytes)
      });
    } catch (e) {
      this.setState({
        error: true,
        errorMessage: "Decryption failed. Make sure the input is a hex string."
      });
    }
  };

  validateKey = () => {
    let encodedKey = utf8.encode(this.state.key);

    if (!encodedKey.length) {
      this.setState({
        error: true,
        errorMessage: "A key must be provided."
      });

      return false;
    }

    if (encodedKey.length > 32) {
      this.setState({
        error: true,
        errorMessage: "The key was too long."
      });

      return false;
    }

    this.setState({
      error: false
    });

    return true;
  };

  onSubmit = () => {
    if (!this.validateKey()) {
      return;
    }

    if (this.state.mode === "encrypt") {
      this.encrypt();
    } else {
      this.decrypt();
    }
  };

  handleKeypress = e => {
    if (e.key === "Enter") {
      this.onSubmit();
    }
  };
  render() {
    return (
      <div>
        <div>
          <Selector changeHandler={this.updateMode} mode={this.state.mode} />
          <br />
          <Key
            secure={this.state.secure}
            value={this.state.key}
            onChange={this.onKeyChange}
            onKeyPress={this.handleKeypress}
          />
          <FontAwesomeIcon icon="eye" onClick={this.toggleReveal} />
          <button onClick={this.onSubmit}>Go</button>
        </div>
        {this.state.error && <ErrorMessage text={this.state.errorMessage} />}

        <Input
          value={this.state.input}
          onChange={this.onInputChange}
          placeholder={this.placeholder}
        />
      </div>
    );
  }
}
