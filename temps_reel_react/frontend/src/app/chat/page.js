"use client";
import "./style.css";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import BaseButton from "./BaseButton";
import { Modal } from "antd";

/* les constantes Constantes */
const SERVER_URL = "http://localhost:4000";
const MESSAGE_EVENT = "message";
const socket = io(SERVER_URL, { autoConnect: false });

/* Composant principal */
const ChatComponent = () => {
  const [userId, setUserId] = useState();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [modalContent, setModalContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleModale, setTitleModale] = useState("");
  const [selectedMessages, setSelectedMessages] = useState([]);

  /**
   * Gestion de la modale
   */
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /**
   * Gestion de la connexion et déconnexion du socket
   */
  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.on("connect", () => {
      console.log("Connecté au serveur");

      setUserId(socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /**
   * Affichage des messages et réponses pour la traduction, validation
   */
  useEffect(() => {
    socket.on(MESSAGE_EVENT, (newMessage) => {
      // Ne pas ajouter le message à la liste affichée s'il s'agit d'une traduction ou vérification
      if (!newMessage.isTranslation && !newMessage.isValidate) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            content: newMessage.content,
            timestamp: newMessage.timestamp,
            userId: newMessage.client,
          },
        ]);
      }

      if (newMessage.isTranslation) {
        translateMessage(newMessage.content);
      }
      if (newMessage.isValidate) {
        validateMessage(newMessage.content);
      }
    });
  }, []);

  /**
   * gestion de l'évènement sur l 'input de saisie
   * @param {*} event
   */
  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  /**
   * envoie du message saisie dans l'input
   * @returns
   */
  const sendMessage = () => {
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
  };

  /**
   * Envoie le message pour la traduction
   * @param {*} option correspond à la langue de traduction
   * @param {*} message correspond au message a truire
   */
  const handleTranslateButtonClick = (option, message) => {
    const language = option.value;

    socket.emit(MESSAGE_EVENT, {
      content: message,
      language,
      isTranslation: true,
    });
  };

  // useEffect(() => {
  //   console.log({ messages });
  // }, [messages]);

  /**
   * Récupère le message qui sera dans la modale après une traduction
   * @param {*} message
   */
  const translateMessage = (message) => {
    setModalContent(message);
    setTitleModale("Traduction");
    showModal();
  };

  /**
   * Envoie le contenu du message pour une valider
   * @param {*} message
   */
  const isValidCkick = (message) => {
    socket.emit(MESSAGE_EVENT, {
      content: message,
      isValidate: true,
    });
  };

  /**
   * récupérer le message qui sera dans la modale pour une validate
   * @param {*} message
   */
  const validateMessage = (message) => {
    setModalContent(message);
    setTitleModale("Validation");
    showModal();
  };

  /**
   * Gestion du button suggestion
   */
  const suggestion = () => {
    // Utilisation d'une boucle forEach pour itérer à travers les messages
    messages.forEach((message, index) => {
      // Accès à la propriété "content" de chaque message
      console.log(`Contenu du message ${index + 1}: ${message.content}`);
    });
  };

  const showSelectedMessages = () => {
    console.log("Messages sélectionnés :", selectedMessages);
  };

  /**
   * Composant qui affiche le message saisie
   * @param {*} param0
   * @returns
   */
  const MessageComponent = ({ content, clientId, timestamp }) => {
    const isSentByUser = clientId === userId;
    const isSelected = selectedMessages.includes(content);

    /**
     * Gère le clique sur le button traduire
     * @param {*} option
     */
    const handleTranslateClick = (option) => {
      handleTranslateButtonClick(option, content);
    };

    /**
     *  Gère le clic sur le bouton Valider
     */
    const handleValidateClick = () => {
      isValidCkick(content);
    };

    /**
     * Gère la selection multiple
     */
    const handleSelectClick = () => {
      const updatedSelectedMessages = isSelected
        ? selectedMessages.filter((msg) => msg !== content)
        : [...selectedMessages, content];
      setSelectedMessages(updatedSelectedMessages);
    };

    // const handleSelectClick = () => {
    //   const updatedSelectedMessages = isSelected
    //     ? selectedMessages.filter(
    //         (selectedMsg) => selectedMsg.content !== message.content
    //       )
    //     : [...selectedMessages, message];
    //   setSelectedMessages(updatedSelectedMessages);
    // };

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
                onClick={handleValidateClick}
              >
                valider
              </button>

              <button
                type="button"
                className={`text-white ${
                  isSelected ? "bg-green-600" : "bg-gray-600"
                } hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 dark:bg-green-600 dark:focus:ring-green-500 rounded-lg px-3 py-0`}
                onClick={handleSelectClick}
              >
                Sélectionner
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-800">
      <>
        <Modal
          title={titleModale}
          open={isModalOpen}
          onCancel={handleCancel}
          okButtonProps={{ style: { display: "none" } }}
        >
          <p>{modalContent}</p>
        </Modal>
      </>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(({ content, timestamp, userId }, index) => (
          <MessageComponent
            key={`${content}-${timestamp}`}
            content={content}
            timestamp={timestamp}
            clientId={userId}
          />
        ))}
        {/* {messages.map((message, index) => (
          <MessageComponent
            key={`${message.content}-${message.timestamp}`}
            message={message}
            clientId={message.userId}
            timestamp={message.timestamp}
          />
        ))} */}
      </div>
      <div className="flex items-center p-4 border-t border-gray-700 dark:border-gray-600 gap-3">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="Message..."
          className="flex-1 px-2 py-5 mr-2 text-sm text-gray-900 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-blue-600"
        />

        <div className=" flex gap-3">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={suggestion}
              className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-blue-600 dark:focus:ring-blue-600 rounded-lg px-4 py-2"
            >
              Suggestion
            </button>
          )}

          <button
            type="button"
            onClick={sendMessage}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-blue-600 dark:focus:ring-blue-600 rounded-lg px-6 py-2"
          >
            Envoyer
          </button>
          <button
            type="button"
            onClick={showSelectedMessages}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-blue-600 dark:focus:ring-blue-600 rounded-lg px-4 py-2"
          >
            Afficher
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
