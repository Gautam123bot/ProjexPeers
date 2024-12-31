import React from 'react';

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">ProjexPeers</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#features" className="hover:text-blue-300">Features</a></li>
              <li><a href="#about" className="hover:text-blue-300">About</a></li>
              <li><a href="#contact" className="hover:text-blue-300">Contact</a></li>
              <li><a href="/login" className="hover:text-blue-300">Login</a></li>
              <li><a href="/signup" className="hover:text-blue-300 bg-yellow-500 px-4 py-2 rounded-full">Sign Up</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-32 flex flex-col items-center justify-center space-y-6">
        <h2 className="text-4xl font-semibold">Connect with Peers Securely and Effortlessly</h2>
        <p className="text-xl">Your network, your rules. Sign up and start connecting today!</p>
        <div className="space-x-4">
          <a href="/signup" className="bg-yellow-500 text-blue-600 px-8 py-3 rounded-full text-lg hover:bg-yellow-400">Get Started</a>
          <a href="/login" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg hover:bg-white hover:text-blue-600">Login</a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">Peer Connections</h3>
              <p className="mt-4">Find and connect with people who share your interests or professional goals.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">Secure Messaging</h3>
              <p className="mt-4">Chat with others in a secure, encrypted environment. Your privacy matters.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">Build Your Network</h3>
              <p className="mt-4">Create your profile, interact with others, and grow your network.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8">About ProjexPeers</h2>
          <p className="text-lg">ProjexPeers is a platform built to help you connect with like-minded individuals in a secure and collaborative environment. Whether you're looking for professional growth or personal connections, ProjexPeers brings people together.</p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-blue-600 text-white py-6">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 ProjexPeers. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
