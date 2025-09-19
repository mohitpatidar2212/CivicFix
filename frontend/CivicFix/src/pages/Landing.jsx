import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  return (
    <div className="font-sans text-gray-900">
      {/* Navbar */}
      <Navbar type="landing" />

      {/* Hero Section */}
      <section id="home" className="pt-24 bg-gradient-to-r from-blue-100 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="container mx-auto flex flex-col md:flex-row items-center py-20 px-6 relative z-10">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Smart Solutions
              </span>{" "}
              for Community Services
            </h1>
            <p className="text-gray-700 text-lg md:text-xl">
              CivicFix helps monitor and resolve public issues quickly, improving community life.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105"
              >
                Get Started
              </a>
              <a
                href="#services"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-100 transition transform hover:scale-105"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <DotLottieReact
              src="https://lottie.host/de6ae712-b5ce-4c50-835e-89cb79cbac2b/PGdS1HaupC.lottie"
              loop
              autoplay
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-10 px-6">
            {[
              {
                title: "Water & Sanitation Monitoring",
                desc: "Track water issues and sanitation complaints in your community.",
                icon: "💧",
              },
              {
                title: "Public Issue Reporting",
                desc: "Report problems like potholes, broken lights, or waste management.",
                icon: "📢",
              },
              {
                title: "Community Alerts",
                desc: "Receive timely alerts for emergencies and local updates.",
                icon: "🔔",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-xl transition transform hover:scale-105 border-t-4 border-blue-600"
              > 
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-10">
            {[
              { step: "Report", icon: "📌", desc: "Submit an issue via app or website." },
              { step: "Process", icon: "⚙️", desc: "Our team evaluates and assigns the issue." },
              { step: "Resolve", icon: "🔧", desc: "Local authorities fix the issue efficiently." },
              { step: "Feedback", icon: "✅", desc: "Users rate and give feedback on resolution." },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition transform hover:scale-105">
                <div className="text-4xl text-blue-600 mb-4">{item.icon}</div>
                <h3 className="font-semibold text-xl">{item.step}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-10 mt-20">
        <div className="container mx-auto text-center px-6">
          <p>&copy; {new Date().getFullYear()} CivicFix. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-blue-400"><Facebook size={22} /></a>
            <a href="#" className="hover:text-blue-400"><Twitter size={22} /></a>
            <a href="#" className="hover:text-blue-400"><Linkedin size={22} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
