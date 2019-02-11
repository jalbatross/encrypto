import React from "react";

const Selector = props => {
  return (
    <select onChange={props.changeHandler} value={props.mode}>
      <option value="encrypt">Encrypt</option>
      <option value="decrypt">Decrypt</option>
    </select>
  );
};

export default Selector;
