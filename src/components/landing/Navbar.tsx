import React from "react";
import { Link } from "react-router-dom";
import { Coins } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white bg-opacity-90 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Coins className="h-8 w-8 text-indigo-600" />
            <Link
              to="/"
              className="ml-2 text-xl font-bold text-gray-800 hover:text-indigo-600"
            >
              CryptoPing
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              to="/login"
              className="text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="ml-4 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
