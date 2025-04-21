import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-circle.png";

const LearnMore = () => {
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
                <div className="text-center max-w-3xl">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                        Learn More About FixerHub
                    </h1>
                    <p className="mt-6 text-lg text-gray-600">
                        FixerHub is a platform designed to connect skilled service providers with customers in need of their expertise. Whether you're looking for a plumber, electrician, or a software developer, FixerHub makes it easy to find the right person for the job.
                    </p>
                    <div className="mt-8 space-y-6">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-2xl font-semibold text-blue-600">For Customers</h2>
                            <p className="mt-4 text-gray-600">
                                Easily find and hire trusted service providers in your area. Browse profiles, read reviews, and connect with professionals who can help you get the job done.
                            </p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-2xl font-semibold text-blue-600">For Service Providers</h2>
                            <p className="mt-4 text-gray-600">
                                Showcase your skills, build your reputation, and grow your business by connecting with customers who need your services.
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center gap-4">
                        <Link
                            to="/pages/SignIn"
                            className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-500 transition"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/"
                            className="px-6 py-3 bg-gray-100 text-blue-600 rounded-md shadow-md hover:bg-gray-200 transition"
                        >
                            Back to Home
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

export default LearnMore;