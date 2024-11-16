import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import BotMessage from "./components/BotMessage";
import UserMessage from "./components/UserMessage";
import Messages from "./components/Messages";
import Input from "./components/Input";

import API from "./ChatbotAPI";

import "./styles.css";
import Header from "./components/Header";
import axios from "axios";
import Button from "./components/Button";
import BotAudio from "./components/BotAudio";
import UserAudio from "./components/UserAudio";
// import {v4 as uuid} from "uuid";

function generateUUID() {
  // UUID v4 format is: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // '4' at the 13th character indicates the version, and the 17th character should start with 8, 9, A, or B.

  const hexDigits = "0123456789abcdef";
  let uuid = "";

  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += "-";
    } else if (i === 14) {
      uuid += "4"; // Set the version to 4
    } else if (i === 19) {
      uuid += hexDigits[(Math.random() * 4) | 8]; // Set the variant to 8, 9, A, or B
    } else {
      uuid += hexDigits[Math.floor(Math.random() * 16)];
    }
  }

  return uuid;
}

const senderId = generateUUID();

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isVoiceChat, setIsVoiceChat] = useState(false);
  const isVoiceChatRef = useRef(false);

  const startVoiceChat = () => {
    setIsVoiceChat(true);
    isVoiceChatRef.current = true;
  };

  useEffect(() => {
    if (isVoiceChat) {
      handleVoice();
      speak("");
    }
  }, [isVoiceChat]);

  const exitVoiceChat = () => {
    setIsVoiceChat(false);
    isVoiceChatRef.current = false;
  };

  const handleVoice = () => {
    const canvas = document.getElementById("user-audio-visualizer");
    const canvasCtx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = 150; // Adjust for visualization height

    if (!("webkitSpeechRecognition" in window)) {
      alert("Sorry, your browser does not support Speech Recognition.");
    } else {
      const recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition)();

      // Configure recognition
      recognition.lang = "vi-VN"; // Set language to Vietnamese
      recognition.interimResults = false; // Use final results only
      recognition.continuous = false; // Stop after a single result

      // Web Audio API setup for visualization
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      let analyser, dataArray, source;

      const setupAudioVisualization = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        source = audioContext.createMediaStreamSource(stream);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048; // Controls resolution of visualization
        const bufferLength = analyser.fftSize;
        dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);
        draw();
      };

      const draw = () => {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = "#7ac7fd";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "#ffffff";
        canvasCtx.beginPath();

        const sliceWidth = canvas.width / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();

        requestAnimationFrame(draw);
      };

      // Start visualization and speech recognition
      setupAudioVisualization();
      recognition.start();

      // Handle recognition result
      let message = "";
      recognition.onresult = function (event) {
        message = event.results[0][0].transcript;
        console.log("Recognized Speech:", message);
      };

      // Handle recognition errors
      recognition.onerror = function (event) {
        console.error("Speech recognition error:", event.error);
      };

      // Handle recognition end
      recognition.onend = function () {
        console.log("Speech recognition ended.");
        audioContext.close(); // Stop audio context to end visualization
        send(message);
      };
    }
  };

  const speak = (text, isLastBotMessage) => {
    if (!isVoiceChatRef.current) return;

    // Create a SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";

    // Select a voice
    const voices = window.speechSynthesis.getVoices();
    console.log(
      "Voices:",
      voices.map((v) => v.lang)
    );
    utterance.voice = voices.find((voice) => voice.lang === "vi-VN");

    // Set up canvas for visualization
    const canvas = document.getElementById("bot-audio-visualizer");
    const canvasCtx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = 150;

    // Create variables for visualization animation
    let animationFrameId;

    const drawVisualizer = () => {
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      // Simulate activity: randomize waveform-like visuals
      const sliceWidth = canvas.width / 100; // Divide canvas into 100 slices
      let x = 0;

      canvasCtx.fillStyle = "#ffffff";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "#000000";
      canvasCtx.beginPath();

      for (let i = 0; i < 100; i++) {
        const v = Math.random() * 0.5 + 0.5; // Randomize amplitude
        const y = v * canvas.height * 0.8; // Scale to canvas height

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();

      // Continue visualizer as long as speech is active
      if (speechSynthesis.speaking) {
        animationFrameId = requestAnimationFrame(drawVisualizer);
      } else {
        // Draw a straight line when speaking stops
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous visuals

        // Draw a straight horizontal line
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "#000000";
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, canvas.height / 2); // Start at the middle-left
        canvasCtx.lineTo(canvas.width, canvas.height / 2); // End at the middle-right
        canvasCtx.stroke();

        // Stop animation
        cancelAnimationFrame(animationFrameId);
      }
    };

    // Speech synthesis starts
    utterance.onstart = () => {
      console.log("Speech synthesis started.");
      drawVisualizer(); // Start the visualizer
    };

    // Speech synthesis ends
    utterance.onend = () => {
      console.log("Speech synthesis ended.");
      if (isLastBotMessage) handleVoice(); // Call handleVoice
    };

    // Speak the text
    speechSynthesis.speak(utterance);
  };

  const send = async (text, payload) => {
    if (!text && !payload) return;
    setMessages((prevMessages) => {
      if (prevMessages[prevMessages.length - 1]?.type === "div") {
        prevMessages.pop();
      }
      return prevMessages;
    });
    setMessages((prevMessages) =>
      prevMessages.concat(
        text ? <UserMessage key={generateUUID()} text={text} /> : undefined,
        <BotMessage key={generateUUID()} isLoading={true} />
      )
    );
    axios
      .post(process.env.REACT_APP_RASA_SERVER, {
        message: payload ?? text,
        sender: senderId,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.length === 0) {
          // return setMessages((prevMessages) => {
          //   const newMessages = [...prevMessages];
          //   newMessages.pop();
          //   return newMessages.concat(
          //     <BotMessage
          //       key={generateUUID()}
          //       message="Xin lỗi, tôi chưa hiểu ý bạn lắm"
          //     />
          //   );
          // });
          return setMessages([]);
        }
        const texts = response.data.map((message) => message.text);

        const buttons = response.data
          .map((message) => message.buttons)
          .flat()
          .filter(Boolean);
        const buttonsWithOrder = buttons
          .map((b) => b.title)
          .map((title, index) => `${index + 1}. ${title}`);
        const allTexts = [...texts, ...buttonsWithOrder];

        allTexts.forEach((text, index) => {
          speak(text, index === allTexts.length - 1);
        });
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages.pop();
          const receivedMessageComponents = response.data.map(
            (message, index) => (
              <BotMessage key={generateUUID()} message={message.text} />
            )
          );
          console.log(
            "response.data.map(message => message.buttons).flat()",
            response.data.map((message) => message.buttons).flat()
          );

          const buttonComponents = buttons ? (
            <div className="btn-container">
              {buttons.map((button, index) => (
                <Button
                  key={generateUUID()}
                  text={button.title}
                  onClick={() => {
                    send(button.title, button.payload);
                  }}
                />
              ))}
            </div>
          ) : (
            []
          );
          return newMessages.concat(
            receivedMessageComponents,
            buttonComponents
          );
        });
      });
  };
  useEffect(() => {
    async function loadWelcomeMessage() {
      send("", "/greet");
    }
    loadWelcomeMessage();
  }, []);

  return (
    <div className="chatbot">
      <Header sendMessage={send} />
      {isVoiceChat ? (
        <div className="voice-container">
          <div className="voice-audios">
            <BotAudio message={"aaaaaa"} isLoading={false} />
            <UserAudio text={"aaa"} />
          </div>
          <button className="exit-voice-btn" onClick={exitVoiceChat}>
            Exit voice chat
          </button>
        </div>
      ) : (
        <div className="container">
          <Messages messages={messages} />
          <Input
            onSend={send}
            text={text}
            setText={setText}
            isVoiceChat={isVoiceChat}
            startVoiceChat={startVoiceChat}
          />
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Chatbot />, rootElement);
