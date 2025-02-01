import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import logo from "../../assets/images/logo.png";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-200 py-12 sm:py-16 lg:py-20 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-12 relative">
        <div className="absolute inset-0 flex justify-center items-center opacity-10 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-gray-700 z-0 transform scale-75 sm:scale-90 lg:scale-100">
          PROJEXPEERS
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 sm:gap-16 z-10">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <img src={logo} alt="ProjexPeers Logo" className="h-28 sm:h-40 mb-6 object-contain" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-400">ProjexPeers</h2>
            <p className="text-lg mt-2 text-gray-400">Your network, your growth!</p>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-4 text-lg sm:text-xl">
              <li><a href="#about" className="hover:text-yellow-400 transition">About Us</a></li>
              <li><a href="#features" className="hover:text-yellow-400 transition">Features</a></li>
              <li><a href="#contact" className="hover:text-yellow-400 transition">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl lg:text-3xl font-semibold text-white">Stay Updated</h3>
            <p className="text-lg lg:text-xl text-gray-400 mb-6">Subscribe to our newsletter for updates.</p>
            <div className="flex flex-col lg:flex-row items-center bg-gray-800 p-4 rounded-lg space-y-4 lg:space-y-0 lg:space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent outline-none text-lg lg:text-xl flex-1 px-4 text-white rounded-lg lg:w-60"
              />
              <button className="bg-yellow-400 text-gray-900 px-6 py-3 lg:py-4 text-lg lg:text-xl rounded-lg transition duration-200 ease-in-out hover:bg-yellow-500 w-full md:w-auto">
                Subscribe
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start space-y-6">
            <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-6">Follow Us</h3>
            <div className="flex space-x-8 text-3xl sm:text-4xl">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition duration-300"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition duration-300"
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition duration-300"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition duration-300"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-lg sm:text-xl mt-12 border-t border-gray-700 pt-6">
          &copy; 2024 ProjexPeers. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
