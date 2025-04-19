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

    const [predictionTemperature, setPredictionTemperature] = useState('');
    const [predictionHumidity, setPredictionHumidity] = useState('');
    const [predictionFoodType, setPredictionFoodType] = useState('');
    const [predictionResult, setPredictionResult] = useState(null);
    const [predictionLoading, setPredictionLoading] = useState(false);
    const [predictionError, setPredictionError] = useState(null);

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

    // Function to get prediction
    const getPrediction = async () => {
        console.log("Get Prediction button clicked");
        console.log("Input values:", predictionTemperature, predictionHumidity, predictionFoodType);
        setPredictionLoading(true);
        setPredictionError(null);
        setPredictionResult(null);

        try {
            const response = await axios.post('/predict', {
                temperature: Number(predictionTemperature),
                humidity: Number(predictionHumidity),
                food_type: predictionFoodType
            });
            console.log("Prediction response:", response.data);
            setPredictionResult(response.data.prediction);
        } catch (err) {
            console.error("Prediction error:", err);
            setPredictionError(err.message);
        } finally {
            setPredictionLoading(false);
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
                    name="temperature"
                    placeholder="Temperature (°C)"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    required
                    style={{ margin: "5px", padding: "10px" }}
                />
                <input
                    type="number"
                    name="humidity"
                    placeholder="Humidity (%)"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    required
                    style={{ margin: "5px", padding: "10px" }}
                />
                <input
                    type="number"
                    name="spoilage"
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

            {/* Prediction Section */}
            <div style={{ marginTop: "30px" }}>
                <h2>Get Prediction</h2>
                <input
                    type="number"
                    name="predictionTemperature"
                    placeholder="Temperature for prediction"
                    value={predictionTemperature}
                    onChange={(e) => setPredictionTemperature(e.target.value)}
                    style={{ margin: "5px", padding: "10px", width: "150px" }}
                />
                <input
                    type="number"
                    name="predictionHumidity"
                    placeholder="Humidity for prediction"
                    value={predictionHumidity}
                    onChange={(e) => setPredictionHumidity(e.target.value)}
                    style={{ margin: "5px", padding: "10px", width: "150px" }}
                />
                <input
                    type="text"
                    name="predictionFoodType"
                    placeholder="Food type for prediction"
                    value={predictionFoodType}
                    onChange={(e) => setPredictionFoodType(e.target.value)}
                    style={{ margin: "5px", padding: "10px", width: "150px" }}
                />
                <button
                    onClick={getPrediction}
                    disabled={predictionLoading}
                    style={{ padding: "10px", margin: "10px", cursor: "pointer" }}
                >
                    {predictionLoading ? "Predicting..." : "Get Prediction"}
                </button>
                {predictionError && <p style={{ color: "red" }}>Error: {predictionError}</p>}
                {predictionResult && <p>Prediction Result: {predictionResult}</p>}
            </div>
        </div>
    );
};

export default Dashboard;
