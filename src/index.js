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
import {v4 as uuid} from "uuid";
const senderId = uuid();
//generate a fixed long uuid for the sender
// const senderId = "123e4567-e89b-12d3-a456-426614174000";

function Chatbot() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function loadWelcomeMessage() {
      setMessages([
        <BotMessage
          key="0"
          fetchMessage={async () => await API.GetChatbotResponse("hi")}
        />
      ]);
    }
    loadWelcomeMessage();
  }, []);

  const send = async (text,payload) => {
    console.log('text:', text, payload);
    setMessages(prevMessages =>  prevMessages.concat(
      <UserMessage key={uuid()} text={text} />,
      <BotMessage
        key={uuid()}
        isLoading={true}
      />
    ));
    axios.post(process.env.REACT_APP_RASA_SERVER, {message: payload ?? text, sender: senderId}).then(response => {
      console.log(response.data);
      if(response.data.length === 0) {
        return setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages.pop();
          return newMessages.concat(
            <BotMessage
              key={uuid()}
              message="I'm sorry, I don't understand that."
            />
          );
        })
      }
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        newMessages.pop();
        const receivedMessageComponents = response.data.map((message, index) => (
          <BotMessage
            key={uuid()}
            message={message.text}
          />
        ));
        console.log("response.data.map(message => message.buttons).flat()",response.data.map(message => message.buttons).flat());
        const buttons = response.data.map(message => message.buttons).flat().filter(Boolean)
        const buttonComponents = buttons?.map((button, index) => (
          <Button key={uuid()} text={button.title}
           onClick={() => send(button.title, button.payload)} 
            />
        )) ?? []
        return newMessages.concat(
          receivedMessageComponents,
          buttonComponents
        )
      })
    })
  };

  return (
    <div className="chatbot">
      <Header />
      <Messages messages={messages} />
      <Input onSend={send} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Chatbot />, rootElement);
