import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import cloudinary from 'cloudinary-core';

const ManageRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [mediaUrls, setMediaUrls] = useState({}); // Store media URLs by request ID

    // Cloudinary configuration
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; // Replace with your cloud name
    const cl = new cloudinary.Cloudinary({ cloud_name: cloudName });

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

                    // Generate Cloudinary URLs for each request
                    const urls = {};
                    response.data.data.forEach(request => {


                        if (request.media && request.media.length > 0) {
                            urls[request._id] = request.media.map(publicId => cl.url(publicId));
                        }

                    });
                    setMediaUrls(urls);

                }
            } catch (err) {
                if (err.response && err.response.status === 404 && err.response.data.message === "No requests found for this provider") {
                    setError("No requests yet."); // Display "No requests yet" if no requests are found
                } else {
                    setError("Failed to fetch requests. Please try again.");
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
            // Ensure the action is valid
            if (!["accepted", "declined"].includes(action)) {
                toast.error("Invalid action.");
                return;
            }

            // Send a PATCH request to update the request status
            // eslint-disable-next-line no-unused-vars
            const response = await API.patch(`/api/v1/requests/${requestId}/status`, { status: action });

            // Handle success
            toast.success(`Request ${action} successfully!`);
            setRequests((prev) => prev.filter((request) => request._id !== requestId));
        } catch (err) {
            // Handle errors
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(`Failed to ${action} request. Please try again.`);
            }
        }
    };

    const openMediaInNewTab = (url) => {
        window.open(url, '_blank');
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

                            {/* Display Uploaded Media */}
                            {request.media && request.media.length > 0 && (
                                <div className="mb-2 flex flex-wrap">
                                    {request.media.map((url, index) => (
                                        <div key={index} className="w-24 h-24 m-1 relative flex items-center">
                                            {url.match(/.(jpeg|jpg|gif|png|webp|bmp|tiff|tif|heic|heif|svg|ico|raw|jfif|avif)$/) ? (
                                                <>
                                                    <img
                                                        src={url}
                                                        alt={`Uploaded media ${index}`}
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                    <button
                                                        onClick={() => openMediaInNewTab(url)}
                                                        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 text-xs"
                                                    >
                                                        View File
                                                    </button>
                                                </>
                                            ) : (
                                                <video src={url} alt={`Uploaded media ${index}`} className="w-full h-full object-cover rounded-md" controls />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

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