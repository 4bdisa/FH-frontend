import React, { useEffect, useState } from "react";
import API from "../../services/api";

const ProviderJobHistory = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProviderJobHistory = async () => {
            try {
                const response = await API.get("/api/v1/requests/provider/history");
                console.log("Provider Job History Response:", response.data.data);
                setRequests(response.data.data);
            } catch (err) {
                console.error("Error fetching provider job history:", err);
                setError("Failed to fetch job history. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProviderJobHistory();
    }, []);

    if (loading) {
        return <div className="text-center">Loading job history...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold text-blue-600 mb-4">Job History</h1>
            {requests.length === 0 ? (
                <p className="text-gray-600">No job history available.</p>
            ) : (
                <ul className="space-y-4">
                    {requests.map((request) => (
                        <li
                            key={request._id}
                            className="p-4 border rounded-md flex flex-col justify-between items-start relative"
                        >
                            {/* Request Details */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">{request.category}</h2>
                                <p className="text-gray-600">{request.description}</p>
                                <p
                                    className={`mt-2 font-medium ${request.status === "accepted"
                                            ? "text-green-600"
                                            : request.status === "declined"
                                                ? "text-red-600"
                                                : request.status === "ongoing"
                                                    ? "text-blue-600"
                                                    : "text-yellow-600"
                                        }`}
                                >
                                    Status:{" "}
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </p>
                            </div>

                            {/* Customer Details */}
                            {request.customer && (
                                <div className="flex items-center space-x-2 mt-4">
                                    <div className="relative w-10 h-10">
                                        <img
                                            src={request.customer.photo || "/default-avatar.png"}
                                            alt={request.customer.name}
                                            className="w-10 h-10 rounded-full"
                                            onError={(e) => (e.target.src = "/default-avatar.png")} // Fallback on error
                                        />
                                    </div>
                                    <span className="text-gray-700 text-sm">{request.customer.name}</span>
                                </div>
                            )}

                            {/* Display Rating and Review for Completed Requests */}
                            {request.status === "completed" && request.reviewId && (
                                <article className="mt-4 p-4 border rounded-md bg-gray-50">
                                    {/* Rating Stars */}
                                    <div className="flex items-center mb-1 space-x-1">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <svg
                                                key={index}
                                                className={`w-4 h-4 ${index < request.reviewId.rating ? "text-yellow-300" : "text-gray-300"
                                                    }`}
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 22 20"
                                            >
                                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                            </svg>
                                        ))}
                                        <h3 className="ms-2 text-sm font-semibold text-gray-900">
                                            {request.reviewId.comment || "No comment provided."}
                                        </h3>
                                    </div>
                                </article>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProviderJobHistory;