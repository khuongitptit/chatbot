import React from "react";

export default function Header({ sendMessage }) {
  const handleRestart = () => {
    sendMessage("", "/restart");
  };
  return (
    <div className="header">
      <p>Tư vấn tiểu đường</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        style={{ width: "24px", cursor: "pointer" }}
        onClick={handleRestart}
      >
        <path
          fill="#ffffff"
          d="M386.3 160L336 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"
        />
      </svg>
    </div>
  );
}
