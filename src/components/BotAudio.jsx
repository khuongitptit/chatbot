import React from "react";
import ChatbotAvt from "./chatbotAvt.png";

export default function BotAudio({ isLoading, message }) {
  return (
    <div style={{ display: "flex", alignItems: "start" }}>
      <div style={{ width: "40px" }}>
        <img
          src={ChatbotAvt}
          alt=""
          style={{ width: "100%", borderRadius: "50%" }}
        />
      </div>

      <canvas id="bot-audio-visualizer"></canvas>
    </div>
  );
}
