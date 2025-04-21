import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-circle.png";

const Home = () => {
  return (
    <div className="bg-blue-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center">
            <img
              className="h-10 w-auto"
              src={logo}
              alt="FixerHub Logo"
            />
            <h1 className="ml-3 text-2xl font-bold text-blue-600">FixerHub</h1>
          </div>
          <div>
            <Link
              to="/pages/SignIn"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Log In <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl">
            FixerHub: Connecting Service Providers and Customers
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            FixerHub is your go-to platform to connect with skilled service providers or find services that you need. Join us today!
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/pages/SignIn"
              className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-500 transition"
            >
              Get Started
            </Link>
            <Link
              to="/learn-more"
              className="px-6 py-3 bg-gray-100 text-blue-600 rounded-md shadow-md hover:bg-gray-200 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow p-4">
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FixerHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
