// filepath: c:\Users\4bdisa\Desktop\fixerhub\frontend\src\components\admin\AnalyticsDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Assuming you're using Chart.js
import { CSVLink } from 'react-csv'; // For exporting CSV

const AnalyticsDashboard = () => {
    const [kpis, setKpis] = useState({});
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics`);
                const data = await response.json();
                setKpis(data.kpis);
                setReports(data.reports);
                setFilteredReports(data.reports);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch analytics data:', error);
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setFilter(value);
        setFilteredReports(reports.filter(report => report.title.includes(value)));
    };

    const chartData = {
        labels: ['KPI 1', 'KPI 2', 'KPI 3'], // Replace with actual KPI labels
        datasets: [
            {
                label: 'KPI Values',
                data: [kpis.kpi1, kpis.kpi2, kpis.kpi3], // Replace with actual KPI values
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Analytics Dashboard</h2>
            {loading ? (
                <p>Loading analytics data...</p>
            ) : (
                <>
                    <div className="mb-4">
                        <h3 className="font-semibold">Key Performance Indicators (KPIs)</h3>
                        <p>KPI 1: {kpis.kpi1}</p>
                        <p>KPI 2: {kpis.kpi2}</p>
                        <p>KPI 3: {kpis.kpi3}</p>
                    </div>
                    <div className="mb-4">
                        <Bar data={chartData} />
                    </div>
                    <div className="mb-4">
                        <h3 className="font-semibold">Detailed Reports</h3>
                        <input
                            type="text"
                            placeholder="Filter reports..."
                            value={filter}
                            onChange={handleFilterChange}
                            className="border rounded p-2 mb-2"
                        />
                        <ul>
                            {filteredReports.map(report => (
                                <li key={report.id} className="border-b py-2">
                                    {report.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <CSVLink data={reports} filename={"reports.csv"} className="bg-blue-500 text-white py-2 px-4 rounded">
                        Export Reports
                    </CSVLink>
                </>
            )}
        </div>
    );
};

export default AnalyticsDashboard;