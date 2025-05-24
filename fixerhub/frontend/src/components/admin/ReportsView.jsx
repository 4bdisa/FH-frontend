// filepath: c:\Users\4bdisa\Desktop\fixerhub\frontend\src\components\admin\AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2'; // Assuming you are using Chart.js for visualizations
import { saveAs } from 'file-saver'; // For exporting data

const AnalyticsDashboard = () => {
    const [kpis, setKpis] = useState({});
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({ startDate: '', endDate: '' });

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

                const data = await response.json();
                setKpis(data.kpis);
                setReports(data.reports);
                setFilteredReports(data.reports);
                setLoading(false);
            } catch (error) {
                setError('Failed to load analytics data.');
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilter = () => {
        const { startDate, endDate } = filter;
        const filtered = reports.filter(report => {
            const reportDate = new Date(report.date);
            return reportDate >= new Date(startDate) && reportDate <= new Date(endDate);
        });
        setFilteredReports(filtered);
    };

    const exportReports = () => {
        const blob = new Blob([JSON.stringify(filteredReports)], { type: 'application/json' });
        saveAs(blob, 'reports.json');
    };

    if (loading) return <div>Loading analytics data...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const chartData = {
        labels: Object.keys(kpis),
        datasets: [
            {
                label: 'KPI Values',
                data: Object.values(kpis),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>
            <div className="mb-4">
                <h3 className="font-semibold">Key Performance Indicators (KPIs)</h3>
                <Bar data={chartData} />
            </div>
            <div className="mb-4">
                <h3 className="font-semibold">Filter Reports</h3>
                <input
                    type="date"
                    name="startDate"
                    value={filter.startDate}
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="endDate"
                    value={filter.endDate}
                    onChange={handleFilterChange}
                />
                <button onClick={applyFilter} className="bg-blue-500 text-white px-4 py-2 rounded">Apply Filter</button>
                <button onClick={exportReports} className="bg-green-500 text-white px-4 py-2 rounded ml-2">Export Reports</button>
            </div>
            <div>
                <h3 className="font-semibold">Detailed Reports</h3>
                <ul>
                    {filteredReports.map(report => (
                        <li key={report.id} className="border p-2 mb-2">
                            <p>{report.title} - {new Date(report.date).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;