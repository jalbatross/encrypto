import React from "react";

const Input = props => {
  return (
    <textarea
      rows="4"
      cols="50"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    />
  );
};

export default Input;
