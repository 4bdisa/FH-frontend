import React from "react";

const JobHistoryBox = ({
    request,
    openModal,
    handleContactClick,
    navigate
}) => {
    

    return (
        <li
            key={request._id}
            className={`bg-white shadow-lg border border-blue-200 rounded-xl flex flex-col justify-between items-start relative w-full max-w-5xl mx-auto p-6 mb-4 transition-transform duration-200 hover:scale-105 ${request.status === "accepted" ? "cursor-pointer hover:shadow-blue-400/60" : ""
                }`}
            style={{ boxSizing: "border-box" }}
        >
            {/* Delete Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    openModal(request);
                }}
                className="absolute top-4 right-4"
                title="Delete Request"
            >
                <img
                    src="https://img.icons8.com/?size=100&id=67884&format=png&color=000000"
                    alt="Delete Icon"
                    className="h-5 w-5"
                />
            </button>
            {/* Request Details */}
            <div className="w-full">
                <h2 className="text-lg font-semibold text-blue-700">{request.category}</h2>
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
                    Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </p>
            </div>

            {/* Provider Details */}
            {request.providerId && (
                <div className="flex items-center space-x-2 mt-4">
                    <div className="relative w-10 h-10">
                        <img
                            src={request.providerId.photo}
                            alt={request.providerId.name}
                            className="w-10 h-10 rounded-full border border-blue-200"
                            onError={(e) => (e.target.src = "/default-avatar.png")}
                        />
                        {!request.providerId.photo && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full"></div>
                        )}
                    </div>
                    <span className="text-gray-700 text-sm">{request.providerId.name}</span>
                </div>
            )}

        

            {/* Rating and Review for Completed Requests */}
            {request.status === "completed" && request.reviewId && (
                <article className="mt-4 p-4 border border-blue-100 rounded-lg bg-blue-50 w-full max-w-md">
                    <div className="flex items-center mb-1 space-x-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <svg
                                key={index}
                                className={`w-4 h-4 ${index < (request.reviewId.rating || 0) ? "text-yellow-300" : "text-gray-300"}`}
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

            {/* Contact Info Section */}
            {request.status === "accepted" && (
                <div className="mt-4 w-full">
                    {request.paid ? (
                        <div className="contact-info p-3 bg-gray-100 rounded-md">
                            <h3 className="font-semibold">Provider Contact:</h3>
                            <p>Name: {request.providerId.name}</p>
                            <p>Phone: {request.providerId.phoneNumber}</p>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleContactClick(request)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
                        >
                            Get Contact Info (5 FH-Coins)
                        </button>
                    )}
                </div>
            )}

            {/* Change State and Review Button for accepted Requests */}
            {request.status === "accepted" && request.paid && (
                <div className="mt-4 w-full">
                    <button
                        onClick={() =>
                            navigate(`/customer-dashboard/job-history/${request._id}/review`)
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                    >
                        Change State and Review
                    </button>
                </div>
            )}
        </li>
    );
};

export default JobHistoryBox;