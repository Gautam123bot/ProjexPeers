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
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div
          onClick={() => (window.location.href = '/')}
          className="flex items-center cursor-pointer"
        >
          <div className="w-16">
            <img src={logo} alt="Logo" />
          </div>
          <span className="text-2xl font-extrabold text-yellow-400 ml-2 tracking-wide">ProjexPeers</span>
        </div>

        {/* Hamburger menu button */}
        <button
          className="text-white text-3xl md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Navigation Links */}
        <nav
          className={`${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 text-lg px-6 md:px-0 py-4 md:py-0">
            <li>
              <a href="/dashboard" className="hover:text-yellow-400 transition font-medium">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/hackathons" className="hover:text-yellow-400 transition font-medium">
                Explore Hackathons
              </a>
            </li>
            <li>
              <a href="/articles" className="hover:text-yellow-400 transition font-medium">
                Articles
              </a>
            </li>
            <li>
              <a href="/help" className="hover:text-yellow-400 transition font-medium">
                Help
              </a>
            </li>

            {isLoggedIn ? (
              <li
                className="relative group"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="flex items-center cursor-pointer space-x-2">
                  <img
                    src={userImage}
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-yellow-400 hover:shadow-md transition"
                  />
                  <span className="font-medium">{userName}</span>
                </div>

                {isUserMenuOpen && (
                  <div className="absolute right-0 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-20">
                    <ul className="flex flex-col">
                      <li>
                        <a
                          href="/profile"
                          className="block px-4 py-2 hover:bg-gray-100 transition"
                        >
                          View Profile
                        </a>
                      </li>
                      <li>
                        <button
                          onClick={() => handleLogout()}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
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
                  <a href="/login" className="hover:text-yellow-400 transition font-medium">
                    Login
                  </a>
                </li>
                <li>
                  <a
                    href="/signup"
                    className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-full font-semibold hover:bg-yellow-500 transition shadow-md"
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
  );
}

export default Navbar;
