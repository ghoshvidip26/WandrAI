"use client";
import { TbMessageChatbot } from "react-icons/tb";
import { useState } from "react";
import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";
import TypingIndicator from "./TypingIndicator";
import Microphone from "./Microphone";
import { handleResponse } from "../utils/utils";
import { useChatMessageContext } from "@/app/context/ChatContext";

export const ChatBot = () => {
  const [messages, setMessages] = useChatMessageContext();
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMsg = { from: "user", text: newMessage };
    setMessages((prev: any) => [...prev, userMsg]);
    setNewMessage("");
    setIsTyping(true);

    try {
      const response = await handleResponse(newMessage);
      console.log("AI response:", response);
      const botMsg = { from: "bot", text: response };

      setMessages((prev: any) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Error fetching AI response:", err);
      setMessages((prev: any) => [
        ...prev,
        { from: "bot", text: "Error fetching data. Please try again!" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-gray-900 to-indigo-700 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl mx-auto flex flex-col h-[90vh] bg-gray-900 rounded-2xl shadow-2xl border border-indigo-500/20">
        <div className="p-6 border-b border-indigo-500/20 bg-gray-800/80 rounded-t-2xl backdrop-blur-sm">
          <h2 className="font-bold text-2xl text-white flex items-center gap-2">
            <TbMessageChatbot className="text-indigo-400 text-3xl" /> AI Travel
            Planner
          </h2>
          <p className="text-indigo-300 text-base mt-2">
            Let's plan your next adventure!
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <span className="text-7xl animate-bounce">✈️</span>
              <p className="text-gray-400 text-center text-xl">
                Start the conversation to plan your next trip!
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg: any, index: number) =>
                msg.from === "user" ? (
                  <UserMessage key={index} newMessage={msg.text} />
                ) : (
                  <BotMessage key={index} botMessage={msg.text} />
                )
              )}
              {isTyping && <TypingIndicator />}
            </>
          )}
        </div>

        <div className="p-6 border-t border-indigo-500/20 bg-gray-800/80 rounded-b-2xl backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex flex-row space-x-3"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 py-3 px-5 bg-gray-700/90 text-white rounded-lg border border-indigo-500/30 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder-gray-400 transition-all duration-200 text-lg"
              placeholder="Type your destination..."
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="py-3 px-8 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
            >
              Send
            </button>
            <div className="flex items-center justify-center w-10 h-10 border border-black rounded-full bg-white text-black ml-1">
              <Microphone />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
