import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../services/api";
import CustomerSidebar from "../components/CustomerSidebar";

const CustomerDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {
        name: "Customer",
        email: "customer@example.com",
        profileImage: "https://img.icons8.com/?size=100&id=25224&format=png&color=000000",
    };

    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [fhCoins, setFhCoins] = useState(0); // State to store fh-coin balance
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState("");
    const dropdownRef = useRef(null);
    const [transactionStatus, setTransactionStatus] = useState(null); // State to store transaction status

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleSignOut = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userId"); // Clear txRef on sign out
        localStorage.removeItem("txRef"); // Clear txRef on sign out
        localStorage.removeItem("transactionStatus"); // Clear transaction status on sign out
        localStorage.removeItem("paymentCancelled"); // Clear payment cancelled status on sign out
        navigate("/pages/SignIn");
    };

    const openDepositModal = () => {
        setIsDepositModalOpen(true);
    };

    const closeDepositModal = () => {
        setIsDepositModalOpen(false);
        setDepositAmount(""); // Clear the input field when closing
    };

    const handleInputChange = (e) => {
        setDepositAmount(e.target.value);
    };

    const handleDeposit = async () => {
        if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        try {
            const response = await API.post(
                `/api/transactions/create`,
                { totalAmount: parseFloat(depositAmount) },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );

            if (response.data.success) {
                // Redirect to Chapa checkout page
                localStorage.setItem(`transactionStatus_${response.data.txRef}`, 'pending'); // Store initial status
                localStorage.setItem('txRef', response.data.txRef); // Store txRef

                // Attempt to detect window close (unreliable)
                window.addEventListener('beforeunload', () => {
                    localStorage.setItem('paymentCancelled', 'true');
                });

                window.location.href = response.data.checkoutUrl;
            } else {
                alert("Failed to initialize payment. Please try again.");
            }
        } catch (error) {
            console.error("Error initializing payment:", error);
            alert("An error occurred. Please try again.");
        } finally {
            closeDepositModal(); // Close the modal after the deposit attempt
        }
    };

    // Check transaction status on component mount
    useEffect(() => {
        const checkTransactionStatus = async () => {
            const txRef = localStorage.getItem('txRef');
            if (txRef) {
                const status = localStorage.getItem(`transactionStatus_${txRef}`);
                setTransactionStatus(status); // Set transaction status in state
                localStorage.removeItem(`transactionStatus_${txRef}`); // Clear status
            }
        };

        checkTransactionStatus();
    }, []);

    const handleGoToDashboard = () => {
        localStorage.removeItem('txRef'); // Clear txRef
        navigate("/customer-dashboard"); // Redirect
    };

    return (
        <div className="flex min-h-screen bg-blue-50">
            {/* Sidebar */}
            <CustomerSidebar />

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
                                ref={dropdownRef}
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
                                        onClick={openDepositModal}
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

                {/* Deposit Modal */}
                {isDepositModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"> {/* Added z-50 */}
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3 text-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Deposit FH-Coins
                                </h3>
                                <div className="mt-2 px-7 py-3">
                                    <input
                                        type="number"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Enter amount in ETB"
                                        value={depositAmount}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="items-center px-4 py-3">
                                    <button
                                        className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                                        onClick={handleDeposit}
                                    >
                                        Deposit Now
                                    </button>
                                    <button
                                        className="mt-2 px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                                        onClick={closeDepositModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dynamic Content */}
                <main className="flex-1 p-6">
                    {/* Transaction Status Display */}
                    {transactionStatus === 'success' && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Payment Successful!</strong>
                            <span className="block sm:inline"> Your FH-Coin deposit was successful.</span>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleGoToDashboard}
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    )}
                    {transactionStatus === 'failed' && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Payment Failed!</strong>
                            <span className="block sm:inline"> There was an error processing your payment. Please try again.</span>
                        </div>
                    )}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CustomerDashboard;

<link rel="preload" as="image" href="https://img.icons8.com/?size=100&id=25224&format=png&color=000000"></link>