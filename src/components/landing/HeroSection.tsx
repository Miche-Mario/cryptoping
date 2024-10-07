import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <div className="pt-24 pb-16 flex-grow flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-white leading-tight">
              Welcome to CryptoPing
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-white opacity-90">
              Your all-in-one solution for tracking, analyzing, and buying
              cryptocurrency. Get real-time market data, advanced analytics, and
              personalized insights to stay ahead in the crypto world.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/signup"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold transition duration-300 flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold transition duration-300 flex items-center justify-center"
              >
                Log In
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img
              src="https://images.prismic.io/yellowcard-website/29843a43-2214-45e6-a87f-6af5076121fc_Desktop+mockup+-+Crypto.png?auto=compress,format"
              alt="CryptoTracker Ping Dashboard"
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
