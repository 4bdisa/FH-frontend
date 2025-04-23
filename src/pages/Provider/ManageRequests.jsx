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
                let providerId = localStorage.getItem("userId");
                const email = JSON.parse(localStorage.getItem("user"))?.email;

                console.log("Provider ID:", providerId); // Debugging
                console.log("Provider Email:", email); // Debugging

                if (!providerId && !email) {
                    throw new Error("Provider ID or email is missing. Please log in again.");
                }

                let response;
                if (providerId) {
                    response = await API.get(`/v1/requests/${providerId}`);
                } else if (email) {
                    response = await API.get(`/v1/requests/email/${email}`);
                }

                console.log("API Response:", response); // Debugging
                setRequests(response.data.data);
            } catch (err) {
                console.error("Error fetching requests:", err); // Debugging
                setError("Failed to fetch requests. Please try again.");
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
            console.log("API Response:", response); // Debugging
            toast.success(`Request ${action} successfully!`);
            setRequests((prev) => prev.filter((request) => request._id !== requestId));
        } catch (err) {
            console.error("Error updating request:", err); // Debugging
            toast.error(`Failed to ${action} request. Please try again.`);
        }
    };

    if (loading) {
        return <div className="text-center">Loading requests...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Manage Requests</h2>
            {requests.length === 0 ? (
                <p className="text-center text-gray-500">No pending requests.</p>
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