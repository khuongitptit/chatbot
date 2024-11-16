import React from "react";

export default function Input({
  onSend,
  text,
  setText,
  isVoiceChat,
  startVoiceChat,
}) {
  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleSend = (e) => {
    e.preventDefault();
    onSend(text);
    setText("");
  };

  return (
    <div className="input">
      <form onSubmit={handleSend}>
        <input
          id="message-input"
          type="text"
          onChange={handleInputChange}
          value={text}
          placeholder="Nhập tin nhắn ..."
        />
        {!isVoiceChat && (
          <button className="voice-btn" type="button" onClick={startVoiceChat}>
            <svg
              fill="#03a9f4"
              height="20px"
              width="20px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 271.99 271.99"
              xmlSpace="preserve"
            >
              <g>
                <path
                  d="M211.591,164.335c-4.782-1.35-9.757,1.429-11.11,6.211c-7.297,25.798-29.432,44.598-55.486,48.164v-10.078
		c27.722-4.337,49-28.378,49-57.298V58c0-31.981-26.019-58-58-58s-58,26.019-58,58v93.333c0,28.92,21.278,52.961,49,57.298v10.078
		c-26.053-3.565-48.188-22.365-55.486-48.164c-1.353-4.782-6.328-7.563-11.11-6.21c-4.783,1.353-7.563,6.327-6.21,11.11
		c9.482,33.52,38.713,57.723,72.806,61.387v17.157h-9.056c-4.971,0-9,4.029-9,9s4.029,9,9,9h36.112c4.971,0,9-4.029,9-9
		s-4.029-9-9-9h-9.056v-17.157c34.093-3.665,63.325-27.868,72.806-61.389C219.154,170.662,216.374,165.688,211.591,164.335z
		 M95.995,151.333V58c0-22.056,17.944-40,40-40s40,17.944,40,40v93.333c0,22.056-17.944,40-40,40S95.995,173.389,95.995,151.333z"
                />
              </g>
            </svg>
          </button>
        )}
        <button className="send-btn">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 500 500"
          >
            <g>
              <g>
                <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75" />
              </g>
            </g>
          </svg>
        </button>
      </form>
    </div>
  );
}
