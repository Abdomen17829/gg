import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  timestamp: Date;
}

const Chat: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_API_URL || "http://localhost:5000",
      {
        auth: {
          token: localStorage.getItem("accessToken"),
        },
      }
    );

    setSocket(newSocket);

    newSocket.on("message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on("previousMessages", (previousMessages: Message[]) => {
      setMessages(previousMessages);
    });

    newSocket.emit("requestPreviousMessages");

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket || !user) return;

    socket.emit("sendMessage", { text: inputMessage });
    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-96 border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">{t("chat.global")}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.author.id === user?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.author.id === user?.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <div className="font-semibold">{message.author.name}</div>
              <div>{message.text}</div>
              <div className="text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t("chat.typeMessage")}
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {t("chat.send")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
