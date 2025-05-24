import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
//import ViewProfile from "../components/ViewProfile"; // Remove ViewProfile import
//import UpdateProfile from "../components/UpdateProfile"; // Remove this import

const ServiceProviderDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {
        name: "Service Provider",
        email: "provider@example.com",
        profileImage: "https://img.icons8.com/?size=100&id=25224&format=png&color=000000",
    };

    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [requestCount, setRequestCount] = useState(0); // State to store the number of requests

    const handleSignOut = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        navigate("/pages/SignIn");
    };

    useEffect(() => {
        const fetchRecentJobs = async () => {
            try {
                const response = await API.get("/api/v1/requests/provider/history");
                const completedJobs = response.data.data.filter(
                    (job) => job.status === "completed"
                );
                setRecentJobs(completedJobs.slice(0, 3)); // Show only the 3 most recent completed jobs
            } catch (err) {
                console.error("Error fetching recent jobs:", err);
                setError("Failed to fetch recent jobs. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        const fetchRequestCount = async () => {
            try {
                const response = await API.get("/api/v1/provider/count", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                setRequestCount(response.data.count || 0); // Set the request count
            } catch (err) {
                console.error("Error fetching request count:", err);
            }
        };

        fetchRecentJobs();
        fetchRequestCount();
    }, []);

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
                                to="/service-provider-dashboard"
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
                        {/* Remove the Update Profile link from the sidebar */}
                        {/*<li>
                            <Link
                                to="/service-provider-dashboard/update-profile"
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
                        </li>*/}
                        <li>
                            <Link
                                to="/service-provider-dashboard/view-profile"
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
                                View Profile
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/service-provider-dashboard/manage-services"
                                className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-md relative"
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
                                Manage Services
                                {requestCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {requestCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/service-provider-dashboard/job-history"
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
                        Welcome, {user.name}!
                    </h1>
                    <div className="relative">
                        <div
                            className="flex items-center space-x-4 cursor-pointer"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="text-gray-700">{user.name}</span>
                            <img
                                src={user.profileImage}
                                alt="User Profile"
                                className="w-10 h-10 rounded-full"
                            />
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

                                {/* Actions */}
                                <div className="border-t border-gray-200">
                                    <Link
                                        to="/service-provider-dashboard/view-profile"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        View Profile
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
                    {/* Show recently completed jobs only on the main dashboard route */}
                    {location.pathname === "/service-provider-dashboard" && (
                        <>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Recently Completed Jobs
                            </h2>
                            {loading ? (
                                <div className="text-center">Loading recent jobs...</div>
                            ) : error ? (
                                <div className="text-center text-red-500">{error}</div>
                            ) : recentJobs.length === 0 ? (
                                <p className="text-gray-600">No completed jobs available.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {recentJobs.map((job) => (
                                        <li key={job._id} className="p-4 border rounded-md bg-white shadow">
                                            <h3 className="text-lg font-semibold text-gray-800">{job.category}</h3>
                                            <p className="text-gray-600">{job.description}</p>
                                            <p className="text-sm text-gray-500">
                                                Completed on: {new Date(job.updatedAt).toLocaleDateString()}
                                            </p>
                                            {job.reviewId && (
                                                <div className="mt-2">
                                                    <p className="text-sm font-medium text-gray-700">Customer Review:</p>
                                                    <p className="text-gray-600 italic">
                                                        "{job.reviewId.comment || "No comment provided."}"
                                                    </p>
                                                    <p className="text-yellow-500">
                                                        {"★".repeat(job.reviewId.rating)}
                                                        {"☆".repeat(5 - job.reviewId.rating)}
                                                    </p>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ServiceProviderDashboard;