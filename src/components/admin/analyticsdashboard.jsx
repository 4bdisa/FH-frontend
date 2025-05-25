import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AnalyticsDashboard = () => {
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterType, setFilterType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredReports, setFilteredReports] = useState([]);
    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const adminToken = localStorage.getItem('adminToken');

                // Fetch Users
                const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/getUsers`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken}`
                    },
                });
                if (!usersResponse.ok) {
                    throw new Error('Failed to fetch users');
                }
                const usersData = await usersResponse.json();
                setUsers(usersData);

                // Fetch Reports
                const reportsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/get`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken}`
                    },
                });
                if (!reportsResponse.ok) {
                    throw new Error('Failed to fetch reports');
                }
                const reportsData = await reportsResponse.json();
                setReports(reportsData);

                // Fetch Revenue
                const revenueResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/revenue`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken}`
                    },
                });
                if (!revenueResponse.ok) {
                    throw new Error('Failed to fetch revenue');
                }
                const revenueData = await revenueResponse.json();
                setRevenue(revenueData.totalRevenue);

                setLoading(false);
            } catch (err) {
                setError('Failed to load analytics data.');
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    useEffect(() => {
        let newFilteredReports = [...reports];

        if (filterType) {
            newFilteredReports = newFilteredReports.filter(report => report.reportType === filterType);
        }

        if (startDate && endDate) {
            newFilteredReports = newFilteredReports.filter(report => {
                const reportDate = new Date(report.createdAt);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return reportDate >= start && reportDate <= end;
            });
        }

        setFilteredReports(newFilteredReports);
    }, [reports, filterType, startDate, endDate]);

    // Data for User Sign-ups Chart
    const userSignupsData = {
        labels: ['Users'],
        datasets: [
            {
                label: 'Number of Users',
                data: [users.length],
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
            },
        ],
    };

    // Data for Reports Chart
    const reportsDataChart = {
        labels: ['Reports'],
        datasets: [
            {
                label: 'Number of Reports',
                data: [filteredReports.length],
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
            },
        ],
    };

    // User growth over time
    const userGrowthData = {
        labels: users.map(user => new Date(user.createdAt).toLocaleDateString()),
        datasets: [
            {
                label: 'User Growth',
                data: users.map(user => users.filter(u => new Date(u.createdAt) <= new Date(user.createdAt)).length),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    // Options for Charts
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Analytics Overview',
            },
        },
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        doc.text("Analytics Dashboard", 10, 10);

        // User Data
        doc.text("Users:", 10, 30);
        const usersTableColumn = ["ID", "Name", "Email"];
        const usersTableData = users.map(user => [user._id, user.name, user.email]);
        doc.autoTable({
            head: [usersTableColumn],
            body: usersTableData,
            startY: 40,
        });

        // Reports Data
        doc.text("Reports:", 10, doc.autoTable.previous.finalY + 20);
        const reportsTableColumn = ["ID", "Type", "Comment"];
        const reportsTableData = filteredReports.map(report => [report._id, report.reportType, report.comment]);
        doc.autoTable({
            head: [reportsTableColumn],
            body: reportsTableData,
            startY: doc.autoTable.previous.finalY + 30,
        });

        // Revenue Data
        doc.text("Revenue:", 10, doc.autoTable.previous.finalY + 20);
        doc.text(`Total Revenue: $${revenue}`, 10, doc.autoTable.previous.finalY + 30);

        doc.save("analytics_dashboard.pdf");
    };

    if (loading) {
        return <div>Loading analytics data...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>

            {/* Filtering Options */}
            <div className="flex flex-wrap mb-4">
                <div className="w-full md:w-1/3 px-2 mb-2">
                    <label htmlFor="filterType" className="block text-gray-700 text-sm font-bold mb-2">Filter by Type:</label>
                    <select
                        id="filterType"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="scam">Scam</option>
                        <option value="harassment">Harassment</option>
                        <option value="inappropriate">Inappropriate Content</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="w-full md:w-1/3 px-2 mb-2">
                    <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-1/3 px-2 mb-2">
                    <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Key Performance Indicators (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow-md rounded-md p-4">
                    <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                    <p className="text-2xl text-gray-600">{users.length}</p>
                </div>
                <div className="bg-white shadow-md rounded-md p-4">
                    <h3 className="text-lg font-semibold text-gray-700">Total Reports</h3>
                    <p className="text-2xl text-gray-600">{filteredReports.length}</p>
                </div>
                <div className="bg-white shadow-md rounded-md p-4">
                    <h3 className="text-lg font-semibold text-gray-700">Revenue Generated</h3>
                    <p className="text-2xl text-gray-600">${revenue} ETB Birr</p>
                </div>
            </div>

            {/* Visualizations (Charts, Graphs) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="bg-white shadow-md rounded-md p-4">
                    <Bar data={userSignupsData} options={chartOptions} />
                </div>
                <div className="bg-white shadow-md rounded-md p-4">
                    <Bar data={reportsDataChart} options={chartOptions} />
                </div>
                <div className="bg-white shadow-md rounded-md p-4">
                    <Line data={userGrowthData} options={chartOptions} />
                </div>
            </div>

            {/* Exportable Data/Reports */}

        </div>
    );
};

export default AnalyticsDashboard;