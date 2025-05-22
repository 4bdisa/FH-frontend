import React, { useState } from 'react';

const ReportsView = ({ reports, onDeleteReport }) => {
    const [reportToDelete, setReportToDelete] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const handleOpenConfirmationModal = (reportId) => {
        setReportToDelete(reportId);
        setShowConfirmationModal(true);
    };

    const handleCloseConfirmationModal = () => {
        setReportToDelete(null);
        setShowConfirmationModal(false);
    };

    const handleConfirmDelete = () => {
        onDeleteReport(reportToDelete);
        handleCloseConfirmationModal();
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">View Reports</h2>
            {reports.length > 0 ? (
                <ul>
                    {reports.map((report) => (
                        <li key={report._id} className="mb-4 p-4 border rounded-md">
                            <h3 className="font-semibold text-blue-700 mb-2">Report Type: {report.reportType}</h3>
                            <p className="mb-1"><span className="font-semibold">Comment:</span> {report.comment || "No comment provided."}</p>
                            <p className="mb-1">
                                <span className="font-semibold">Reporter:</span>{" "}
                                {report.reporterName || 'Unknown'} ({report.reporterEmail || 'No email'})
                                <span className="ml-2 text-xs text-gray-500">ID: {report.reporterId || 'Unknown'}</span>
                            </p>
                            <p className="mb-1"><span className="font-semibold">Request Category:</span> {report.requestCategory || 'Unknown'}</p>
                            <p className="mb-1"><span className="font-semibold">Request Description:</span> {report.requestDescription || 'Unknown'}</p>
                            <p className="mb-1">
                                <span className="font-semibold">Provider (Reported):</span> {report.providerName || report.providerId || 'Unknown'} ({report.providerEmail || 'No email'})
                            </p>
                            <p className="mb-1 text-xs text-gray-500">Reported At: {new Date(report.createdAt).toLocaleString()}</p>
                            <button
                                onClick={() => handleOpenConfirmationModal(report._id)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600">No reports available.</p>
            )}

            {/* Confirmation Modal */}
            {showConfirmationModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay, when the modal is open */}
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        {/* Heroicon name: outline/exclamation */}
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938-1.382L12 3m0 0l6.938 8.618M6.938 14.618L12 21m0 0l6.938-8.618" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Delete Report
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete this report? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleConfirmDelete}
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleCloseConfirmationModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsView;