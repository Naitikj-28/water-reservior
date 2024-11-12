import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/Main.css';
import ChartComponent from './Chart';
import Spinner from './Spinner';

function Main({ selectedDam, isSidebarOpen, selectedDate }) {
  const [data, setData] = useState(null);
  const [averageRainfall, setAverageRainfall] = useState(null);
  const [loading, setLoading] = useState(true);
  const mainKey = 'AIzaSyDRMLsE7nXHAPfpL8WavbwqdtA70geEt0o';
  const sheetId = '1x8WkZ5NJk9BgOsQIz1R4jShRC7hd3KcwE-NK9C45RdM';

  useEffect(() => {
    if (selectedDam) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${selectedDam}?key=${mainKey}`
          );
          const rows = response.data.values;

          if (rows.length === 0) {
            setData([]);
            setLoading(false);
            return;
          }

          const headers = rows[0];
          const dateIndex = headers.indexOf('Date');
          const cumulativeRainfallInsideIndex = headers.indexOf('Cumulative_Rainfall_Inside');

          if (dateIndex === -1 || cumulativeRainfallInsideIndex === -1) {
            console.error('Date or Cumulative_Rainfall_Inside column not found');
            setData([]);
            setLoading(false);
            return;
          }

          const formatDate = (dateStr) => {
            const [day, month, year] = dateStr.split('-');
            return `${year}-${month}-${day}`;
          };

          const formattedDate = formatDate(selectedDate || '01-01-2011');
          const filteredRow = rows.slice(1).find(row => row[dateIndex] === formattedDate);

          const totalCumulativeRainfallInside = rows.slice(1).reduce((sum, row) => {
            const rainfallInside = parseFloat(row[cumulativeRainfallInsideIndex]);
            return sum + (isNaN(rainfallInside) ? 0 : rainfallInside);
          }, 0);

          const averageRainfall = (totalCumulativeRainfallInside / (rows.length - 1)).toFixed(2);
          setAverageRainfall(averageRainfall);

          if (filteredRow) {
            setData(filteredRow);
          } else {
            setData([]);
          }

        } catch (error) {
          console.error('Error fetching data:', error);
          setData([]);
        }
        setLoading(false);
      };

      fetchData();
    }
  }, [selectedDam, selectedDate, mainKey, sheetId]);

  if (loading) {
    return <Spinner />;
  }

  if (data === null) {
    return <p>No dam selected</p>;
  }

  if (data.length === 0) {
    return <p>No data available for the selected date.</p>;
  }

  const currentResLevel = data[3];
  const storage = data[6];
  const cumulativeRainfallInside = data[10];
  const resLevel15D = data[23];
  const resLevel30D = data[24];
  const riskLevelCurrent = data[25];
  const riskLevel15D = data[26];
  const riskLevel30D = data[27];
  const accuracy15D = data[29];
  const accuracy30D = data[30];

  return (
    <div className={`main-container ${isSidebarOpen ? 'with-sidebar' : ''}`}>
      <div className="content-wrapper">
        <h2 className="dam-title">{selectedDam}</h2>
        <div className="info-container">
          <div className="info-card">
            <h3>Cumulative Annual Rainfall in Catchment</h3>
            <div className="data-display">
              <strong>{cumulativeRainfallInside ? parseFloat(cumulativeRainfallInside).toFixed(2) : 'N/A'}mm</strong><br />
              <span className="average-rainfall">Average Annual Rainfall: {averageRainfall ? averageRainfall : 'N/A'}mm</span><br />
            </div>
          </div>
          <div className="info-card">
            <h4>Current Reservoir Status</h4>
            <span className="risk-label"><strong>Water Supply Risk:</strong> {riskLevelCurrent}</span><br />
            <div className={`risk-status ${riskLevelCurrent}`}>
              <strong>Water-Level:</strong> {currentResLevel ? parseFloat(currentResLevel).toFixed(1) : 'N/A'}<span className="height-label"> Height in ft</span><br />
              <strong>Volume:</strong> {storage ? parseFloat(storage).toFixed(2) : 'N/A'} <span className="volume-label">(Volume in TMC)</span><br />
            </div>
          </div>
          <div className="info-card">
            <h3>15 Days Prediction</h3>
            <span className="risk-label"><strong>Water Supply Risk:</strong> {riskLevel15D}</span><br />
            <div className={`risk-status ${riskLevel15D}`}>
              <strong>Water-Level:</strong> {resLevel15D ? parseFloat(resLevel15D).toFixed(1) : 'N/A'}<span className="height-label"> Height in ft</span><br />
              <strong>Accuracy:</strong> {accuracy15D ? parseFloat(accuracy15D).toFixed(2) : 'N/A'}<span className="percentage-label">%</span><br />
            </div>
          </div>
          <div className="info-card">
            <h3>30 Days Prediction</h3>
            <span className="risk-label"><strong>Water Supply Risk:</strong> {riskLevel30D}</span><br />
            <div className={`risk-status ${riskLevel30D}`}>
              <strong>Water-Level:</strong> {resLevel30D ? parseFloat(resLevel30D).toFixed(1) : 'N/A'}<span className="height-label"> Height in ft</span><br />
              <strong>Accuracy:</strong> {accuracy30D ? parseFloat(accuracy30D).toFixed(2) : 'N/A'}<span className="percentage-label">%</span><br />
            </div>
          </div>
        </div>
      </div>
      <ChartComponent selectedDate={selectedDate} selectedDam={selectedDam} isSidebarOpen={isSidebarOpen} />
    </div>
  );
}

export default Main;
