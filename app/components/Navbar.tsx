"use client";

import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white shadow-lg border-b border-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <img
              src="/Logo.png"
              alt="WandrAI Logo"
              className="rounded-full w-12 h-12 ring-2 ring-indigo-400 shadow-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              WandrAI
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
