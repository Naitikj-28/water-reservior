import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './CSS/ChartComponent.css';
import MapData from './Map';

const ChartComponent = ({ selectedDate, selectedDam, isSidebarOpen, isMainLoading }) => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const spreadsheetId = '1x8WkZ5NJk9BgOsQIz1R4jShRC7hd3KcwE-NK9C45RdM';
            const sheetName = selectedDam;
            const mainKey = 'AIzaSyDRMLsE7nXHAPfpL8WavbwqdtA70geEt0o';

            try {
                setLoading(true);
                const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${mainKey}`;
                const response = await axios.get(url);

                if (response.data && response.data.values) {
                    const rows = response.data.values;
                    const labels = [];
                    const currentResLevel = [];
                    const dayWisePrediction = [];

                    const selectedMonth = selectedDate.slice(0, 7);

                    rows.slice(1).forEach(row => {
                        const date = row[2];
                        const [day, month, year] = date.split('-');
                        const formattedDate = `${year}-${month}`;

                        if (date && formattedDate === selectedMonth) {
                            labels.push(date);
                            currentResLevel.push(parseFloat(row[3]) || 0);
                            dayWisePrediction.push(parseFloat(row[28]) || 0);
                        }
                    });

                    if (labels.length === 0) {
                        throw new Error('No data found for the selected month');
                    }

                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: 'Current Res Level',
                                data: currentResLevel,
                                borderColor: 'rgba(75,192,192,1)',
                                fill: true,
                            },
                            {
                                label: 'Day Wise Prediction',
                                data: dayWisePrediction,
                                borderColor: 'rgba(153,102,255,1)',
                                fill: true,
                            },
                        ],
                    });

                    setLoading(false);
                } else {
                    throw new Error('No data found in the sheet');
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
                setError(error.message);
                setLoading(false);
            }
        };

        if (selectedDam) {
            fetchData();
        }
    }, [selectedDate, selectedDam]);

    if (loading || isMainLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className={`chart-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="chart-wrapper">
                <Line
                    data={chartData}
                    options={{
                        scales: {
                            x: {
                                grid: {
                                    display: false,
                                },
                            },
                            y: {
                                grid: {
                                    display: true,
                                },
                            },
                        },
                    }}
                    className="chart"
                />
            </div>
            <div className="map-container">
                <MapData selectedDam={selectedDam} />
            </div>
        </div>
    );
};

export default ChartComponent;
