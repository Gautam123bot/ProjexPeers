import React, { useState } from 'react';
import logo from "../../assets/images/logo.png";
import avatar_pic from '../../assets/images/profile_img.jpg';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const userName = localStorage.getItem("username") || "User";
  const userData = localStorage.getItem("user_info");
  const userImage = userData?.profilePic || avatar_pic;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("user_spaces");
    localStorage.removeItem("username");
    navigate("/login")
    window.location.reload();
  }

  return (
    <div>
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo */}
          <div
            onClick={() => (window.location.href = '/')}
            className="flex items-center cursor-pointer"
          >
            <img src={logo} className="w-20" alt="Logo" />
            <span className="text-xl font-bold ml-2">ProjexPeers</span>
          </div>

          {/* Hamburger menu button */}
          <button
            className="text-white text-3xl md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          {/* Navigation Links */}
          <nav
            className={`${isMenuOpen ? 'block' : 'hidden'
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

              {/* Conditional rendering for logged-in state */}
              {isLoggedIn ? (
                <li
                  className="relative group"
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  {/* User avatar and dropdown */}
                  <div className="flex items-center cursor-pointer space-x-2">
                    <img
                      src={userImage}
                      alt="User"
                      className="w-8 h-8 rounded-full border border-yellow-300"
                    />
                    <span className="font-medium">{userName}</span>
                  </div>
                  {/* Dropdown menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 w-48 bg-white text-blue-600 rounded-lg shadow-lg z-10">
                      <ul className="flex flex-col">
                        <li>
                          <a
                            href="/profile"
                            className="block px-4 py-2 hover:bg-gray-100"
                          >
                            View Profile
                          </a>
                        </li>
                        <li>
                          <button
                            onClick={() => handleLogout()}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              ) : (
                <>
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
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
