// filepath: c:\Users\4bdisa\Desktop\fixerhub\frontend\src\components\admin\AnalyticsDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Assuming you're using Chart.js
import { CSVLink } from 'react-csv'; // For exporting CSV

const AnalyticsDashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ startDate: '', endDate: '' });

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

                if (!response.ok) {
                    throw new Error('Failed to fetch analytics data');
                }

                const result = await response.json();
                setData(result.data);
            } catch (err) {
                setError('Failed to load analytics data.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredData = data.filter(item => {
        const date = new Date(item.date);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        return (!filters.startDate || date >= startDate) && (!filters.endDate || date <= endDate);
    });

    const chartData = {
        labels: filteredData.map(item => item.date),
        datasets: [
            {
                label: 'Reports',
                data: filteredData.map(item => item.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    if (loading) return <div>Loading analytics data...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>
            <div className="mb-4">
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
            </div>
            <Bar data={chartData} />
            <CSVLink data={filteredData} filename={"analytics_report.csv"} className="btn btn-primary">
                Export to CSV
            </CSVLink>
        </div>
    );
};

export default AnalyticsDashboard;