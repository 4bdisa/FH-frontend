import React, { useEffect, useState } from "react";
import API from "../../services/api";

const JobHistory = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJobHistory = async () => {
            try {
                const response = await API.get("/api/v1/requests/history");
                setRequests(response.data.data);
            } catch (err) {
                console.error("Error fetching job history:", err);
                setError("Failed to fetch job history. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobHistory();
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
                        <li key={request._id} className="p-4 border rounded-md flex justify-between items-center">
                            {/* Left Section: Request Details */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">{request.category}</h2>
                                <p className="text-gray-600">{request.description}</p>
                                <p
                                    className={`mt-2 font-medium ${request.status === "accepted"
                                        ? "text-green-600"
                                        : request.status === "declined"
                                            ? "text-red-600"
                                            : "text-yellow-600"
                                        }`}
                                >
                                    Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </p>
                            </div>

                            {/* Right Section: Provider Details */}
                            {request.providerId && (
                                <div className="flex items-center space-x-2">
                                    <div className="relative w-10 h-10">
                                        <img
                                            src={request.providerId.photo}
                                            alt={request.providerId.name}
                                            className="w-10 h-10 rounded-full"
                                            onError={(e) => (e.target.src = "/default-avatar.png")} // Fallback on error
                                        />
                                        {!request.providerId.photo && (
                                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full"></div> // Placeholder
                                        )}
                                    </div>
                                    <span className="text-gray-700 text-sm">
                                        {request.providerId.name}
                                    </span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default JobHistory;


