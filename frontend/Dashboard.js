import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [spoilage, setSpoilage] = useState('');
    
    const [latestData, setLatestData] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to fetch latest data
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5005/latest-data');
            setLatestData(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch data every 5 seconds
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Function to submit form data
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);
        setLoading(true);

        try {
            await axios.post('http://localhost:5005/sensor-data', {
                temperature,
                humidity,
                spoilage
            });
            setSuccess("✅ Data submitted successfully!");
            fetchData(); // Refresh latest data after submission
        } catch (err) {
            setError(`❌ Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", textAlign: "center" }}>
            <h1>Cold Storage Dashboard</h1>

            {/* Success & Error Messages */}
            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Data Input Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <input
                    type="number"
                    placeholder="Temperature (°C)"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    required
                    style={{ margin: "5px", padding: "10px" }}
                />
                <input
                    type="number"
                    placeholder="Humidity (%)"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    required
                    style={{ margin: "5px", padding: "10px" }}
                />
                <input
                    type="number"
                    placeholder="Spoilage Rate"
                    value={spoilage}
                    onChange={(e) => setSpoilage(e.target.value)}
                    required
                    style={{ margin: "5px", padding: "10px" }}
                />
                <button type="submit" style={{ padding: "10px", margin: "10px", cursor: "pointer" }}>
                    {loading ? "Submitting..." : "Submit Data"}
                </button>
            </form>

            {/* Loading Spinner */}
            {loading && <p>Loading data...</p>}

            {/* Latest Data Display */}
            {latestData ? (
                <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "10px", display: "inline-block" }}>
                    <h2>Latest Sensor Data</h2>
                    <p>🌡️ Temperature: {latestData.temperature} °C</p>
                    <p>💧 Humidity: {latestData.humidity} %</p>
                    <p>⚠️ Spoilage Status: {latestData.status}</p>
                </div>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default Dashboard;
