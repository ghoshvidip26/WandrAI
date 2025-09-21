"use client";
import { ChatBot } from "./components/ChatBot";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4">
        <ChatBot />
      </main>
    </div>
  );
}
