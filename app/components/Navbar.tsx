"use client";

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-4">
          <img src="/globe.svg" alt="Logo" className="w-9 h-9 rounded-full" />
          <span className="text-2xl font-bold text-indigo-400 tracking-tight">
            TripSage
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
