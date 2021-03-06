import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import logoImg from "../../assets/logo.svg";
import { api } from "../../services/api";
import io from 'socket.io-client'

interface Message {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
    login: string;
  };
}

const socket = io('http://localhost:4000');

const messageQueue: Message[] = [];

socket.on('new_message', (newMessage: Message) => {
  messageQueue.push(newMessage);
});

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if(messageQueue.length > 0){
        setMessages(preveState => [
          messageQueue[0],
          preveState[0],
          preveState[1]
        ].filter(Boolean));

        messageQueue.shift();
      }
    }, 3000);
  }, []);

  useEffect(() => {
    api.get<Message[]>("messages/last3").then((response) => {
      setMessages(response.data);
    });
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />
      <ul className={styles.messageList}>
        {messages.map((message) => {
          return (
            <li key={message.id} className={styles.message}>
              <p className={styles.messageContent}>
                {message.text}
              </p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img
                    src={message.user.avatar_url}
                    alt={message.user.name || message.user.login}
                  />
                </div>
                <span>{message.user.name || message.user.login}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
