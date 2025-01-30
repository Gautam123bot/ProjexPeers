import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ContactUs from '../../components/ContactUs/Contactus';

const Home = () => {
  const token = localStorage.getItem("token");

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-yellow-400 text-gray-900 py-3 text-center font-semibold text-lg overflow-hidden whitespace-nowrap">
        <marquee behavior="scroll" direction="left" scrollamount="8">
          🚀 Exciting News! ProjexPeers is launching on <span className="font-bold">March 15th</span>. Stay tuned for an incredible experience! 🎉
        </marquee>
      </div>

      {/* Hero Section */}
      <section className="bg-gray-800 text-white py-24 text-center h-screen md:py-32 md:h-screen">
        <div className="max-w-6xl mx-auto space-y-12 px-6 md:space-y-12">
          <h1 className="text-4xl font-extrabold leading-tight md:text-7xl animate-fade-in md:leading-tight">
            Empower Your Connections <br /> <span className='text-yellow-400'>Securely and Effortlessly</span>
          </h1>
          <p className="text-base md:text-2xl max-w-2xl mx-auto animate-fade-in animation-delay-2">
            Join a community where your network grows with your aspirations. Sign up now to create meaningful connections.
          </p>
          {!token && (
            <div className="mt-6 md:mt-8">
              <a
                href="/signup"
                className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-full text-lg font-semibold hover:bg-yellow-500 transition duration-300 ease-in-out animate-fade-in animation-delay-3 shadow-lg hover:shadow-xl"
              >
                Get Started
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-12 text-white">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[{
              title: 'Peer Connections',
              description: 'Discover and collaborate with individuals who share your goals and interests.',
              icon: '🤝',
            }, {
              title: 'Secure Messaging',
              description: 'Communicate safely with end-to-end encryption for your privacy.',
              icon: '🔒',
            }, {
              title: 'Grow Your Network',
              description: 'Expand your reach and build meaningful professional relationships.',
              icon: '📈',
            }].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-gray-700 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                <p className="mt-4 text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-white">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[{
              quote: 'ProjexPeers helped me find like-minded professionals to collaborate with. It’s a game-changer!',
              author: 'John Doe',
            }, {
              quote: 'The secure messaging feature gives me peace of mind while networking.',
              author: 'Jane Smith',
            }].map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
              >
                <p className="italic text-gray-300">"{testimonial.quote}"</p>
                <h4 className="mt-4 font-semibold text-white">- {testimonial.author}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-800 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8 text-white">About ProjexPeers</h2>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            ProjexPeers is your go-to platform for building and fostering meaningful connections in a secure and collaborative environment. Whether you are here for professional growth, skill-building, or just to expand your network, we make it easy and safe.
          </p>
          <a
            href="#features"
            className="mt-6 inline-block bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition duration-300 ease-in-out"
          >
            Learn More
          </a>
        </div>
      </section>

      <ContactUs />
      <Footer />
      
    </div>
  );
};

export default Home;
