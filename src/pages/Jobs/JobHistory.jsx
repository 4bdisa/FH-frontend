import React, { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import JobHistoryBox from "./JobHistoryBox";

const JobHistory = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isPaying, setIsPaying] = useState(false);
    const navigate = useNavigate();
    const [depositAmount, setDepositAmount] = useState("");
    const [showDepositModal, setShowDepositModal] = useState(false);

    useEffect(() => {
        const fetchJobHistory = async () => {
            try {
                const response = await API.get("/api/v1/requests/history");
                // Sort requests by createdAt in descending order (newest first)
                const sortedRequests = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRequests(sortedRequests);
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
            const response = await API.delete(`/api/v1/requests/${selectedRequest._id}`);

            if (response.status === 200) {
                setRequests((prevRequests) =>
                    prevRequests.filter((request) => request._id !== selectedRequest._id)
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

    const handleGetContact = useCallback(async () => {
        try {
            setIsPaying(true);

            // First check customer balance
            const balanceResponse = await API.get("/api/user/fh-coins");
            console.log("Balance Response:", balanceResponse.data.fhCoins);
            if (balanceResponse.data.fhCoins < 5) {
                setShowDepositModal(true);
                return;
            }
            
            // Process payment
            const paymentResponse = await API.patch(`/api/v1/requests/${selectedRequest._id}/pay`);

            if (paymentResponse.data.success) {
                // Update the requests state with the new paid value
                setRequests(prevRequests =>
                    prevRequests.map(req =>
                        req._id === selectedRequest._id
                            ? { ...req, paid: true, providerId: paymentResponse.data.provider }
                            : req
                    )
                );
                alert("Payment successful! Contact information is now available.");
            } else {
                alert(paymentResponse.data.message || "Payment failed. Please try again.");
            }
        } catch (err) {
            console.error("Error processing payment:", err);
            alert(err.response?.data?.message || "Failed to process payment. Please try again.");
        } finally {
            setIsPaying(false);
            setShowContactModal(false);
        }
    }, [selectedRequest]);

    const handleContactClick = (request) => {
        setSelectedRequest(request);

        if (request.paid) {
            return;
        }
        setShowContactModal(true);
    };

    const openModal = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRequest(null);
    };

    const closeContactModal = () => {
        setShowContactModal(false);
        setSelectedRequest(null);
    };

    const closeDepositModal = () => {
        setShowDepositModal(false);
        setDepositAmount("");
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
                        <JobHistoryBox
                            key={`${request._id}-${request.paid}`} // Add a key prop that includes the paid value
                            request={request}
                            openModal={openModal}
                            handleContactClick={handleContactClick}
                            navigate={navigate}
                            hideReportButton={request.status === "completed"} // Add this prop
                        />
                    ))}
                </ul>
            )}

            {/* Confirmation Modal */}
            {showModal && selectedRequest && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this request? This action cannot be undone.
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

            {/* Payment and Contact Info Modal */}
            {showContactModal && selectedRequest && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Get Contact Information
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to get this provider's contact information? It will
                            deduct 5 FH-Coins from your balance.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={closeContactModal}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGetContact}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
                                disabled={isPaying}
                            >
                                {isPaying ? "Processing..." : "Confirm Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deposit Modal */}
            {showDepositModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Deposit FH-Coins</h2>
                        <p className="text-gray-600 mb-4">
                            You need to deposit at least 5 FH-Coins to get the contact information.
                        </p>
                        <input
                            type="number"
                            placeholder="Enter amount to deposit"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md mb-4"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={closeDepositModal}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeposit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                            >
                                Deposit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobHistory;