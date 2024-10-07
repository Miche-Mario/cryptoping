import React from "react";
import { Link } from "react-router-dom";
import { Coins, MapPin, Phone, Mail } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Coins className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold">CryptoPingg</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your all-in-one solution for cryptocurrency tracking and analysis.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/signup"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Sign In
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-indigo-400" />
                <span>Canada: +1 4314309069</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-indigo-400" />
                <span>UK: +447588674655</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-indigo-400" />
                <span>Netherlands: +3197010256219</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-indigo-400" />
                <span>Switzerland: +41799072418</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-indigo-400" />
                <a
                  href="mailto:contact@cryptopingg.com"
                  className="hover:text-indigo-300"
                >
                  contact@cryptopingg.com
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Offices</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin
                  size={16}
                  className="mr-2 mt-1 text-indigo-400 flex-shrink-0"
                />
                <span>
                  Canada: First Canadian Place, 140 King St W Suite 5612
                </span>
              </li>
              <li className="flex items-start">
                <MapPin
                  size={16}
                  className="mr-2 mt-1 text-indigo-400 flex-shrink-0"
                />
                <span>UK: 112 - 190 City Road, London EC1V 2MX</span>
              </li>
              <li className="flex items-start">
                <MapPin
                  size={16}
                  className="mr-2 mt-1 text-indigo-400 flex-shrink-0"
                />
                <span>Netherlands: Overhoeksplein 1, 1031 KS Amsterdam</span>
              </li>
              <li className="flex items-start">
                <MapPin
                  size={16}
                  className="mr-2 mt-1 text-indigo-400 flex-shrink-0"
                />
                <span>Switzerland: Tramstrasse 10, 1050 Zürich</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-gray-400 hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-400 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/disclaimer"
                  className="text-gray-400 hover:text-white"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 CryptoTracker Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
