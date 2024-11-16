import React from "react";
import UserAvt from "./userAvt.png";

export default function UserAudio({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "start", marginTop: "50px" }}>
      <canvas id="user-audio-visualizer"></canvas>
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
