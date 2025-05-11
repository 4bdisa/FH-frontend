import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../services/api";

const CustomerDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {
        name: "Customer",
        email: "customer@example.com",
        profileImage: "https://img.icons8.com/?size=100&id=25224&format=png&color=000000",
    };

    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [fhCoins, setFhCoins] = useState(0); // State to store fh-coin balance

    // Fetch fh-coin balance from the database
    useEffect(() => {
        const fetchFhCoins = async () => {
            try {
                const response = await API.get("/api/user/fh-coins", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });

                if (response.status === 200) {
                    setFhCoins(response.data.fhCoins); // Update state with fh-coin balance
                } else {
                    console.error("Unexpected response status:", response.status);
                }
            } catch (err) {
                if (err.response) {
                    console.error("Error fetching fh-coin balance:", err.response.data);
                } else if (err.request) {
                    console.error("No response received:", err.request);
                } else {
                    console.error("Error:", err.message);
                }
            }
        };

        fetchFhCoins();
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/pages/SignIn");
    };

    const handleDeposit = async () => {
        const totalAmount = prompt("Enter the amount to deposit (in ETB):");

        if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/transactions/create`,
                { totalAmount },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );

            if (response.data.success) {
                // Redirect to Chapa checkout page
                window.location.href = response.data.checkoutUrl;
            } else {
                alert("Failed to initialize payment. Please try again.");
            }
        } catch (error) {
            console.error("Error initializing payment:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen bg-blue-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold text-blue-600">FixerHub</h2>
                </div>
                <nav className="mt-6">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/customer-dashboard"
                                className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-md"
                            >
                                <svg
                                    className="w-5 h-5 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 10l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                    ></path>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 21V9h6v12"
                                    ></path>
                                </svg>
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/customer-dashboard/profile-update"
                                className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-md"
                            >
                                <svg
                                    className="w-5 h-5 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                                Update Profile
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/customer-dashboard/post-job"
                                className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-md"
                            >
                                <svg
                                    className="w-5 h-5 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4v16m8-8H4"
                                    ></path>
                                </svg>
                                Post Job
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/customer-dashboard/job-history"
                                className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-md"
                            >
                                <svg
                                    className="w-5 h-5 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4v16m8-8H4"
                                    ></path>
                                </svg>
                                Job History
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between bg-white shadow p-4">
                    <h1 className="text-xl font-semibold text-blue-600">
                        Customer Dashboard
                    </h1>
                    <div className="relative">
                        <div
                            className="flex items-center space-x-4 cursor-pointer"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="text-gray-700">{user.name}</span>
                            {user.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="User Profile"
                                    className="w-10 h-10 rounded-full"
                                    onError={(e) => (e.target.src = "https://img.icons8.com/?size=100&id=25224&format=png&color=000000")}
                                />
                            ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                            )}
                        </div>
                        {isDropdownOpen && (
                            <div
                                className="absolute right-4 mt-14 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
                            >
                                {/* User Info */}
                                <div className="p-4 flex items-center">
                                    <img
                                        src={user.profileImage}
                                        alt="User Profile"
                                        className="w-16 h-16 rounded-full"
                                    />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-700">
                                            {user.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>

                                {/* FH-Coin Balance */}
                                <div className="p-4 border-t border-gray-200">
                                    <p className="text-sm font-medium text-gray-700">
                                        FH-Coin Balance: <span className="text-blue-600">{fhCoins}</span>
                                    </p>
                                    <button
                                        onClick={handleDeposit}
                                        className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                    >
                                        Deposit
                                    </button>
                                </div>

                                {/* Actions */}
                                <div className="border-t border-gray-200">
                                    <Link
                                        to="/customer-dashboard/profile-update"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Edit Profile
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CustomerDashboard;

<link rel="preload" as="image" href="https://img.icons8.com/?size=100&id=25224&format=png&color=000000"></link>