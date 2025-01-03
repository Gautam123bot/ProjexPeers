import React from 'react';
import Navbar from '../../components/Navbar/Navbar';

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-32 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-5xl font-extrabold leading-snug">
            Connect with Peers Securely and Effortlessly
          </h2>
          <p className="text-xl">
            Your network, your rules. Sign up and start connecting today!
          </p>
          <div className="space-x-4">
            <a
              href="/signup"
              className="bg-yellow-300 text-blue-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-yellow-400 transition"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-white hover:text-blue-600 transition"
            >
              Login
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Peer Connections',
                description:
                  'Find and connect with people who share your interests or professional goals.',
              },
              {
                title: 'Secure Messaging',
                description:
                  'Chat with others in a secure, encrypted environment. Your privacy matters.',
              },
              {
                title: 'Build Your Network',
                description:
                  'Create your profile, interact with others, and grow your network.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <p className="mt-4 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">About ProjexPeers</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            ProjexPeers is a platform built to help you connect with like-minded
            individuals in a secure and collaborative environment. Whether you're
            looking for professional growth or personal connections, ProjexPeers
            brings people together.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">&copy; 2024 ProjexPeers. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4 text-lg">
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
                className="hover:text-yellow-300 transition"
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
