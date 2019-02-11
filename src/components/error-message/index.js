import React from "react";

export default function ErrorMessage(props) {
  return <div style={{ color: "red", fontSize: "12px" }}>{props.text}</div>;
}
