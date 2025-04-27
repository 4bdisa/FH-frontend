import React, { useEffect, useState } from "react";
import API from "../../services/api";

const AcceptedJobs = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJobHistory = async () => {
            try {
                const response = await API.get("/api/v1/requests/accepted");
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
                        <li key={request._id} className="p-4 border rounded-md">
                            <h3 className="text-lg font-semibold">{request.category}</h3>
                            <p>{request.description}</p>
                            <p className="text-gray-500 text-sm">
                                Customer: {request.customer.name} ({request.customer.email})
                            </p>
                            <p className="text-green-600 font-medium mt-2">
                                Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AcceptedJobs;