"use client";
import { TbMessageChatbot } from "react-icons/tb";

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-gray-900 to-indigo-700 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-gray-900 rounded-2xl shadow-2xl border border-indigo-500/20 p-10 flex flex-col items-center">
        <TbMessageChatbot size={72} className="text-indigo-400 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4 text-center">
          AI Travel Planner
        </h1>
        <p className="text-indigo-200 text-lg mb-8 text-center">
          Plan your next adventure with the help of AI! Get instant
          recommendations, tips, and personalized travel ideas.
        </p>
        <button
          onClick={onStart}
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-xl hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-lg"
        >
          Start Chat
        </button>
      </div>
    </div>
  );
}
