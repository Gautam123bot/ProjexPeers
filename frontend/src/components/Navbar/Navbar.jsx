import React, { useState } from 'react';
import logo from "../../assets/images/logo.png"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <h1
            onClick={() => window.location.href = '/'}
            className="text-md font-bold cursor-pointer"
          >
          <img src={logo} className='w-20' alt="" />
            ProjexPeers
          </h1>
          {/* Hamburger menu button */}
          <button
            className="text-white text-3xl md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          {/* Navigation links */}
          <nav
            className={`${
              isMenuOpen ? 'block' : 'hidden'
            } md:block absolute md:static top-16 left-0 w-full md:w-auto bg-blue-600 md:bg-transparent`}
          >
            <ul className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 text-lg px-6 md:px-0 py-4 md:py-0">
              <li>
                <a href="#features" className="hover:text-yellow-300 transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-yellow-300 transition">
                  About
                </a>
              </li>
              <li>
                <a href="/hackathons" className="hover:text-yellow-300 transition">
                  Explore Hackathons
                </a>
              </li>
              <li>
                <a href="/articles" className="hover:text-yellow-300 transition">
                  Articles
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-yellow-300 transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="/help" className="hover:text-yellow-300 transition">
                  Help
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-yellow-300 transition">
                  Login
                </a>
              </li>
              <li>
                <a
                  href="/signup"
                  className="bg-yellow-300 text-blue-600 px-5 py-2 rounded-full font-medium hover:bg-yellow-400 transition"
                >
                  Sign Up
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
