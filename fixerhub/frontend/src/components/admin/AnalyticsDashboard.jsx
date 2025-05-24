// filepath: c:\Users\4bdisa\Desktop\fixerhub\frontend\src\components/admin/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2'; // Assuming you are using Chart.js for visualizations
import { saveAs } from 'file-saver'; // For exporting data

const AnalyticsDashboard = () => {
    const [kpis, setKpis] = useState({});
    const [reports, setReports] = useState([]);
    const [filters, setFilters] = useState({ startDate: '', endDate: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    },
                });
                const data = await response.json();
                setKpis(data.kpis);
                setReports(data.reports);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch analytics data:', error);
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(reports)], { type: 'application/json' });
        saveAs(blob, 'analytics_report.json');
    };

    const chartData = {
        labels: reports.map(report => report.date), // Assuming reports have a date field
        datasets: [
            {
                label: 'Reports Over Time',
                data: reports.map(report => report.count), // Assuming reports have a count field
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    if (loading) {
        return <div>Loading analytics data...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Analytics Dashboard</h2>
            <div className="mb-4">
                <h3 className="font-semibold">Key Performance Indicators (KPIs)</h3>
                <ul>
                    <li>Total Reports: {kpis.totalReports}</li>
                    <li>New Reports: {kpis.newReports}</li>
                    <li>Resolved Reports: {kpis.resolvedReports}</li>
                </ul>
            </div>
            <div className="mb-4">
                <h3 className="font-semibold">Filter Reports</h3>
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="mr-2"
                />
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="mr-2"
                />
                <button onClick={handleExport} className="bg-blue-500 text-white py-2 px-4 rounded">
                    Export Data
                </button>
            </div>
            <Bar data={chartData} />
        </div>
    );
};

export default AnalyticsDashboard;