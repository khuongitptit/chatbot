import React, { useState, useEffect } from "react";
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
  const send = async (text, payload) => {
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
          const buttons = response.data
            .map((message) => message.buttons)
            .flat()
            .filter(Boolean);
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
      <div className="container">
        <Messages messages={messages} />
        <Input onSend={send} />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Chatbot />, rootElement);
