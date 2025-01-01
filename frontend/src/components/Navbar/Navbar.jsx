import React from 'react'

function Navbar() {
  return (
    <div>
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-3xl font-bold">ProjexPeers</h1>
          <nav>
            <ul className="flex space-x-6 text-lg">
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
                <a href="#contact" className="hover:text-yellow-300 transition">
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="hover:text-yellow-300 transition"
                >
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
  )
}

export default Navbar
