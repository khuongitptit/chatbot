import React from "react";

export default function Button({ text, onClick }) {
  return (
    <div className="button-container" onClick={onClick}>
      <div className="button-message">{text}</div>
    </div>
  );
}
