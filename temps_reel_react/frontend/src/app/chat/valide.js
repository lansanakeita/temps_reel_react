"use client";
import "./style.css";
import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import BaseButton from "./BaseButton";

/* les constantes Constantes */
const SERVER_URL = "http://localhost:4000";
const MESSAGE_EVENT = "message";
const socket = io(SERVER_URL, { autoConnect: false });

/* Composant principal */
const ChatComponent = () => {
  const [userId, setUserId] = useState();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  /* Gestion de la connexion et déconnexion du socket */
  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.on("connect", () => {
      console.log("Connecté au serveur");

      // Récupérer l'ID du client après la connexion
      setUserId(socket.id);
      console.log("setUserId", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /* Gestion des messages */
  useEffect(() => {
    socket.on(MESSAGE_EVENT, (newMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: newMessage.content,
          timestamp: newMessage.timestamp,
          userId: newMessage.client,
        },
      ]);
    });
  }, []);

  /* gestion de l'input de saisie*/
  const handleInputChange = useCallback((event) => {
    setInputMessage(event.target.value);
  }, []);

  /* Envoie de message pour traduire" */
  const handleTranslateButtonClick = useCallback((option, message) => {
    console.log("Message à traduire :", message);
    console.log("Langue sélectionnée :", option.value);
    const language = option.value;

    // Emit a translation message through the socket
    //const timestamp = new Date().toLocaleString();
    socket.emit(MESSAGE_EVENT, {
      content: message,
      language,
    });
  }, []);

  /* envoi du message */
  const sendMessage = useCallback(() => {
    if (inputMessage.trim() === "") {
      // Ne rien faire si le message est vide ou composé d'espaces
      return;
    }
    const timestamp = new Date().toLocaleString();
    socket.emit(MESSAGE_EVENT, {
      content: inputMessage,
      timestamp,
    });

    setInputMessage("");
  }, [inputMessage]);

  useEffect(() => {
    console.log({ messages });
  }, [messages]);

  /* Composant qui affiche le message */
  const Message = ({ content, clientId, timestamp }) => {
    const isSentByUser = clientId === userId;

    // Fonction pour gérer le clic sur le bouton "Traduire"
    const handleTranslateClick = (option) => {
      handleTranslateButtonClick(option, content);
    };

    return (
      <div>
        <div
          className={`flex h-full ${
            isSentByUser ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-md w-full mx-2 my-1 ${
              isSentByUser ? "bg-blue-300" : "bg-gray-300"
            } text-black rounded-lg p-4 relative message-container flex flex-col gap-y-2`}
          >
            <div>
              <p className="text-sm break-words">{content}</p>
              <p className="text-xs absolute bottom-0 right-0 mb-1 mr-1 text-gray-600">
                {timestamp}
              </p>
            </div>
            <div className="flex gap-2">
              <BaseButton
                theme={"primary"}
                className="hover:bg-green-600 p-10"
                splitMode="true"
                options={[
                  { label: "English", value: "en" },
                  { label: "French", value: "fr" },
                  { label: "Spanish", value: "es" },
                  { label: "German", value: "de" },
                  { label: "Italian", value: "it" },
                  { label: "Portuguese", value: "pt" },
                  { label: "Japanese", value: "ja" },
                  { label: "Chinese", value: "zh" },
                  { label: "Russian", value: "ru" },
                  { label: "Arabic", value: "ar" },
                ]}
                onClick={(option) => handleTranslateClick(option)}
              >
                Traduire
              </BaseButton>

              <button
                type="button"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-blue-600 dark:focus:ring-blue-500 rounded-lg px-3 py-0"
              >
                valider
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-800">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(({ content, timestamp, userId }, index) => (
          <Message
            key={`${content}-${timestamp}`}
            content={content}
            timestamp={timestamp}
            clientId={userId}
          />
        ))}
      </div>
      <div className="flex items-center p-4 border-t border-gray-700 dark:border-gray-600">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="Message..."
          className="flex-1 px-2 py-5 mr-2 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-blue-600"
        />
        <button
          type="button"
          onClick={sendMessage}
          className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-blue-600 dark:focus:ring-blue-600 rounded-lg px-4 py-2"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
