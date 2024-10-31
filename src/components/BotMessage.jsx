import React, { useState, useEffect } from "react";

export default function BotMessage({ isLoading, message }) {
  return (
    <div className="message-container">
      <div className="bot-message">{isLoading ? "..." : message}</div>
    </div>
  );
}
