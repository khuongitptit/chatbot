import React from "react";
import ChatbotAvt from "./chatbotAvt.png";

export default function BotMessage({ isLoading, message }) {
  return (
    <div style={{ display: "flex", alignItems: "start" }}>
      <div style={{ width: "40px" }}>
        <img
          src={ChatbotAvt}
          alt=""
          style={{ width: "100%", borderRadius: "50%" }}
        />
      </div>

      <div className="message-container">
        <div className="bot-message">
          {isLoading ? (
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <div>{message}</div>
          )}
        </div>
      </div>
    </div>
  );
}
