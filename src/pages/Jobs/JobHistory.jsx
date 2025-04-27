import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

const JobHistory = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const navigate = useNavigate();

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

    const handleDelete = async () => {
        try {
            const response = await API.delete(`/api/v1/requests/${selectedRequestId}`);

            if (response.status === 200) {
                setRequests((prevRequests) =>
                    prevRequests.filter((request) => request._id !== selectedRequestId)
                );
                setShowModal(false);
                alert("Request deleted successfully.");
            } else {
                throw new Error("Failed to delete the request.");
            }
        } catch (err) {
            console.error("Error deleting request:", err);
            const errorMessage = err.response?.data?.message || "Failed to delete the request. Please try again.";
            alert(errorMessage);
        }
    };

    const openModal = (requestId) => {
        setSelectedRequestId(requestId);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRequestId(null);
    };

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
                            {/* Delete Button */}
                            <button
                                onClick={() => openModal(request._id)}
                                className="absolute top-2 right-2"
                                title="Delete Request"
                            >
                                <img
                                    src="https://img.icons8.com/?size=100&id=67884&format=png&color=000000"
                                    alt="Delete Icon"
                                    className="h-5 w-5"
                                />
                            </button>

                            {/* Delete Button */}
                            <button
                                onClick={() => openModal(request._id)}
                                className="absolute top-2 right-2"
                                title="Delete Request"
                            >
                                <img
                                    src="https://img.icons8.com/?size=100&id=67884&format=png&color=000000"
                                    alt="Delete Icon"
                                    className="h-5 w-5"
                                />
                            </button>

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

                            {/* Provider Details */}
                            {request.providerId && (
                                <div className="flex items-center space-x-2 mt-4">
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
                                    <span className="text-gray-700 text-sm">{request.providerId.name}</span>
                                </div>
                            )}

                            {/* Change State and Review Button for Ongoing Requests */}
                            {request.status === "ongoing" && (
                                <div className="mt-4">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/customer-dashboard/job-history/${request._id}/review`
                                            )
                                        }
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                                    >
                                        Change State and Review
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Confirm Deletion
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this request? This action cannot be
                            undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobHistory;


