import React, { useEffect, useState } from "react";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 25;
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const fetchUsers = async () => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/getAllUsers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                }
            });
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            // Ensure data is an array and has the 'data' property
            if (Array.isArray(data.data)) {
                setUsers(data.data);
            } else {
                setError("Invalid data format. Expected an array of users.");
                setUsers([]); // Set to empty array to prevent further errors
            }
        } catch (err) {
            setError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(users.length / usersPerPage);

    const handleNextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => prev - 1);
    };

    const handleToggleBanUser = async (userId) => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/banuser/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to toggle user ban status");
            }

            // Refresh the user list after toggling ban status
            fetchUsers();
        } catch (err) {
            console.error("Failed to toggle user ban status:", err); // Log the error for debugging
        }
    };
    const handleChangePassword = (user) => {
        setSelectedUser(user);
        setNewPassword("");
        setConfirmPassword("");
        setShowModal(true);
    };

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const adminToken = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${selectedUser._id}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({ newPassword })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update password");
            }

            setShowModal(false);
            alert("Password updated successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 md:text-2xl md:mb-4">User Management</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6 md:py-3">
                                Name
                            </th>
                            <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6 md:py-3">
                                Email
                            </th>
                            <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6 md:py-3">
                                Role
                            </th>
                            <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6 md:py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentUsers.map(user => (
                            <tr key={user._id}>
                                <td className="px-2 py-2 whitespace-nowrap md:px-6 md:py-4">
                                    <div className="flex items-center">
                                        <div className="ml-2 md:ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap md:px-6 md:py-4">
                                    <div className="text-sm text-gray-900">{user.email}</div>
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap md:px-6 md:py-4">
                                    <span className="text-sm text-gray-500">{user.role || "User"}</span>
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap text-sm font-medium md:px-6 md:py-4">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            value=""
                                            className="sr-only peer"
                                            checked={user.isVerified}
                                            onChange={() => handleToggleBanUser(user._id)}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                        <span className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-300 md:ml-3">{user.isVerified ? "unbanned" : "Banned"}</span>
                                    </label>
                                    <button className="ml-1 text-red-600 hover:text-red-900 md:ml-2" onClick={() => handleChangePassword(user)}>Change Password</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col items-center mt-2 space-y-2 md:flex-row md:justify-between md:items-center md:mt-4 md:space-y-0">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-2 rounded disabled:opacity-50 md:py-2 md:px-4"
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded disabled:opacity-50 md:py-2 md:px-4"
                >
                    Next
                </button>
            </div>
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Change Password for {selectedUser.name}
                                </h3>
                                <div className="mt-2">
                                    {error && <div className="text-red-500">{error}</div>}
                                    <div className="mb-4">
                                        <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                id="newPassword"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                                <svg
                                                    className="h-5 w-5 text-gray-400 hover:text-gray-500 cursor-pointer"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? (
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    ) : (
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    )}
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="confirmPassword"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                                <svg
                                                    className="h-5 w-5 text-gray-400 hover:text-gray-500 cursor-pointer"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? (
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    ) : (
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    )}
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleUpdatePassword}
                                >
                                    Update Password
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setShowModal(false)}
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

export default UserManagement;