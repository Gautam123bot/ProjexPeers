import React from 'react';
import Navbar from '../../components/Navbar/Navbar';

const Home = () => {
  const token = localStorage.getItem("token");

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-32 text-center">
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-5xl font-extrabold leading-tight sm:text-6xl">
            Connect with Peers Securely and Effortlessly
          </h2>
          <p className="text-xl sm:text-2xl max-w-xl mx-auto">
            Your network, your rules. Sign up and start connecting today!
          </p>
          {!token && (
            <div className="mt-6">
              <a
                href="/signup"
                className="bg-yellow-400 text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-500 transition duration-300 ease-in-out"
              >
                Get Started
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold mb-12 text-gray-900">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Peer Connections',
                description: 'Find and connect with people who share your interests or professional goals.',
              },
              {
                title: 'Secure Messaging',
                description: 'Chat with others in a secure, encrypted environment. Your privacy matters.',
              },
              {
                title: 'Build Your Network',
                description: 'Create your profile, interact with others, and grow your network.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-gray-100 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 ease-in-out"
              >
                <h3 className="text-2xl font-semibold text-gray-800">{feature.title}</h3>
                <p className="mt-4 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-semibold mb-8 text-gray-900">About ProjexPeers</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl mx-auto">
            ProjexPeers is a platform built to help you connect with like-minded individuals in a secure and collaborative environment. Whether you're looking for professional growth or personal connections, ProjexPeers brings people together.
          </p>
        </div>
      </section>

      {/* Contact Section (Footer) */}
      <footer id="contact" className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm mb-6">&copy; 2024 ProjexPeers. All rights reserved.</p>
          <div className="flex justify-center space-x-8 text-lg">
            {[
              { href: 'https://facebook.com', label: 'Facebook' },
              { href: 'https://twitter.com', label: 'Twitter' },
              { href: 'https://linkedin.com', label: 'LinkedIn' },
            ].map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-300 transition duration-300 ease-in-out"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
