import React, { useState, useEffect } from 'react';
import ReportsView from '../../components/admin/ReportsView.jsx';
import UserManagement from '../../components/admin/UserManagement.jsx';
import CreateAdmin from '../../components/admin/createadmin.jsx';
import AnalyticsDashboard from '../../components/admin/analyticsdashboard.jsx'; // Import AnalyticsDashboard

const AdminDashboardPage = () => {
    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState('');
    const [activeView, setActiveView] = useState('dashboard');
    const [reports, setReports] = useState([]);
    const [reportCount, setReportCount] = useState(0);
    const [newReportCount, setNewReportCount] = useState(0);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const storedAdmin = localStorage.getItem('admin');
                const adminToken = localStorage.getItem('adminToken');
                if (!storedAdmin || !adminToken) {
                    window.location.href = '/admin/login';
                    return;
                }
                const adminData = JSON.parse(storedAdmin);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/getAdmin/${adminData.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken}`
                    },
                });
                if (!response.ok) {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('admin');
                    window.location.href = '/admin/login';
                    return;
                }
                const data = await response.json();
                setAdmin(data.data);
            } catch (err) {
                setError('Failed to load admin data.');
            }
        };

        const fetchReports = async () => {
            try {
                const adminToken = localStorage.getItem('adminToken');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/get`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken}`
                    },
                });

                
                if (!response.ok) {
                    throw new Error('Failed to fetch reports');
                }

                const data = await response.json();
                setReports(data);
                setReportCount(data.length);
                setNewReportCount(data.length);
            } catch (error) {
                setError('Failed to load reports.');
            }
        };

        fetchAdminData();
        if (localStorage.getItem('adminToken')) {
            fetchReports();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        window.location.href = '/admin/login';
    };

    const handleDeleteReport = async (reportId) => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reports/deleteReport/${reportId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete report');
            }

            setReports(reports.filter(report => report._id !== reportId));
            setReportCount(prevCount => prevCount - 1);
            setNewReportCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
        } catch (error) {
            setError('Failed to delete report.');
        }
    };

    const handleViewReports = () => {
        setActiveView('reports');
        setNewReportCount(0);
    };

    const handleAddAdmin = () => {
        setActiveView('createAdmin');
    };

    const handleAnalyticsDashboard = () => {
        setActiveView('analytics');
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!admin) {
        return <div>Loading admin data...</div>;
    }

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, {admin.name}!</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-md">
                                <h3 className="font-semibold text-gray-700">Email</h3>
                                <p className="text-gray-600">{admin.email}</p>
                            </div>
                            <div className="p-4 border rounded-md">
                                <h3 className="font-semibold text-gray-700">Role</h3>
                                <p className="text-gray-600">Administrator</p>
                            </div>
                        </div>
                    </div>
                );
            case 'reports':
                return <ReportsView reports={reports} onDeleteReport={handleDeleteReport} />;
            case 'users':
                return <UserManagement />;
            case 'createAdmin':
                return <CreateAdmin />;
            case 'analytics':
                return <AnalyticsDashboard />; // Render AnalyticsDashboard
            default:
                return (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, {admin.name}!</h2>
                        <p className="text-gray-600">Email: {admin.email}</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-gray-200 py-4 px-6 flex justify-between items-center shadow-md">
                <div className="font-bold text-lg text-gray-800">Admin Panel</div>
                <button
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-gray-200 py-4 px-2">
                    <nav>
                        <ul>
                            <li
                                className={`py-2 px-4 hover:bg-gray-300 cursor-pointer rounded-md transition duration-300 ease-in-out ${activeView === 'dashboard' ? 'bg-gray-300' : ''}`}
                                onClick={() => setActiveView('dashboard')}
                            >
                                <span className="text-gray-700">Dashboard</span>
                            </li>
                            <li
                                className={`py-2 px-4 hover:bg-gray-300 cursor-pointer rounded-md transition duration-300 ease-in-out ${activeView === 'reports' ? 'bg-gray-300' : ''}`}
                                onClick={handleViewReports}
                            >
                                <span className="text-gray-700">View Reports</span>
                                {newReportCount > 0 && (
                                    <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">{newReportCount}</span>
                                )}
                            </li>
                            <li
                                className={`py-2 px-4 hover:bg-gray-300 cursor-pointer rounded-md transition duration-300 ease-in-out ${activeView === 'users' ? 'bg-gray-300' : ''}`}
                                onClick={() => setActiveView('users')}
                            >
                                <span className="text-gray-700">User Management</span>
                            </li>
                            <li
                                className={`py-2 px-4 hover:bg-gray-300 cursor-pointer rounded-md transition duration-300 ease-in-out ${activeView === 'createAdmin' ? 'bg-gray-300' : ''}`}
                                onClick={handleAddAdmin}
                            >
                                <span className="text-gray-700">Add Another Admin</span>
                            </li>
                             <li
                                className={`py-2 px-4 hover:bg-gray-300 cursor-pointer rounded-md transition duration-300 ease-in-out ${activeView === 'analytics' ? 'bg-gray-300' : ''}`}
                                onClick={handleAnalyticsDashboard}
                            >
                                <span className="text-gray-700">Analytics Dashboard</span>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 py-6 px-8">
                    {renderView()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;