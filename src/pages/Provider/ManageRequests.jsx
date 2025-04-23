import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

const ManageRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    throw new Error("Authentication token is missing. Please log in again.");
                }

                const response = await API.get(`/api/v1/requests/get`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
                    },
                });

                if (response.data.data.length === 0) {
                    setError("No requests yet."); // Display "No requests yet" if no jobs are found
                } else {
                    setRequests(response.data.data); // Set the requests if data is found
                }
            } catch (err) {
                if (err.response && err.response.status === 404 && err.response.data.message === "No requests found for this provider") {
                    setError("No requests yet."); // Display "No requests yet" if no requests are found
                } else {
                    setError("Failed to fetch requests. Please try again."); // Handle other errors
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleAction = async (requestId, action) => {
        const confirmAction = window.confirm(`Are you sure you want to ${action} this request?`);
        if (!confirmAction) return;

        try {
            const response = await API.patch(`/v1/requests/${requestId}`, { status: action });

            toast.success(`Request ${action} successfully!`);
            setRequests((prev) => prev.filter((request) => request._id !== requestId));
        } catch (err) {
            toast.error(`Failed to ${action} request. Please try again.`);
        }
    };

    if (loading) {
        return <div className="text-center">Loading requests...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Manage Requests</h2>
            {error === "No requests yet." ? (
                <p className="text-center text-black bg-gray-100 p-4 rounded-md shadow-sm">
                    {error}
                </p>
            ) : error ? (
                <p className="text-center text-red-500 bg-gray-100 p-4 rounded-md shadow-sm">
                    {error}
                </p>
            ) : requests.length === 0 ? (
                <p className="text-center text-black bg-gray-100 p-4 rounded-md shadow-sm">
                    No requests yet.
                </p>
            ) : (
                <ul className="space-y-4">
                    {requests.map((request) => (
                        <li key={request._id} className="p-4 border rounded">
                            <h3 className="text-lg font-semibold">{request.category}</h3>
                            <p>{request.description}</p>
                            <div className="mt-4 flex justify-end space-x-4">
                                <button
                                    onClick={() => handleAction(request._id, "accepted")}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleAction(request._id, "declined")}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
                                >
                                    Decline
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManageRequests;