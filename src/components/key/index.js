import React from "react";

const Key = props => {
  return (
    <input
      type={props.secure ? "password" : "input"}
      value={props.key}
      onChange={props.onChange}
      onKeyPress={props.onKeyPress}
      placeholder="key"
    />
  );
};

export default Key;
