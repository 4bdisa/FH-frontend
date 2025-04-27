import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

const ChangeStateAndReview = () => {
    const { requestId } = useParams(); // Get the request ID from the URL
    const navigate = useNavigate();

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError("Rating is required.");
            return;
        }

        try {
            await API.patch(`/api/v1/requests/${requestId}/complete`, {
                rating,
                review,
            });

            alert("Job marked as completed and feedback submitted successfully!");
            navigate("/customer-dashboard/job-history");
        } catch (err) {
            console.error("Error submitting review:", err);
            setError("Failed to submit review. Please try again.");
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto mt-10">
            <h1 className="text-2xl font-semibold text-blue-600 mb-4">
                Change State and Review
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Rating (Required)
                    </label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full p-2 border rounded-md"
                        required
                    >
                        <option value={0}>Select a rating</option>
                        <option value={1}>1 - Poor</option>
                        <option value={2}>2 - Fair</option>
                        <option value={3}>3 - Good</option>
                        <option value={4}>4 - Very Good</option>
                        <option value={5}>5 - Excellent</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Review (Optional)
                    </label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        rows="4"
                        placeholder="Write your review here..."
                    ></textarea>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangeStateAndReview;