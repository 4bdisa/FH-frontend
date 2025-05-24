// filepath: c:\Users\4bdisa\Desktop\fixerhub\frontend\src\components\admin\AnalyticsDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Example using Chart.js
import { saveAs } from 'file-saver'; // For exporting files

const AnalyticsDashboard = () => {
    const [kpis, setKpis] = useState({});
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics`);
                if (!response.ok) {
                    throw new Error('Failed to fetch analytics data');
                }
                const data = await response.json();
                setKpis(data.kpis);
                setReports(data.reports);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(reports)], { type: 'application/json' });
        saveAs(blob, 'analytics_report.json');
    };

    if (loading) return <div>Loading analytics data...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const chartData = {
        labels: reports.map(report => report.date), // Assuming reports have a date field
        datasets: [
            {
                label: 'Report Count',
                data: reports.map(report => report.count), // Assuming reports have a count field
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Analytics Overview</h2>
            <div className="mb-4">
                <h3 className="font-semibold">Key Performance Indicators (KPIs)</h3>
                <ul>
                    <li>Total Reports: {kpis.totalReports}</li>
                    <li>New Reports: {kpis.newReports}</li>
                    <li>Resolved Reports: {kpis.resolvedReports}</li>
                </ul>
            </div>
            <div className="mb-4">
                <h3 className="font-semibold">Reports Chart</h3>
                <Bar data={chartData} />
            </div>
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                onClick={handleExport}
            >
                Export Reports
            </button>
        </div>
    );
};

export default AnalyticsDashboard;