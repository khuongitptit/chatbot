import React from "react";
import UserAvt from "./userAvt.png";

export default function UserMessage({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "start" }}>
      <div className="message-container">
        <div className="user-message">{text}</div>
      </div>
      <div style={{ width: "40px" }}>
        <img
          src={UserAvt}
          alt=""
          style={{ width: "100%", borderRadius: "50%" }}
        />
      </div>
    </div>
  );
}
