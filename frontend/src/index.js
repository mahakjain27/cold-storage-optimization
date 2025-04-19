import React, { useState } from "react";
import ReactDOM from "react-dom";

function App() {
    const [temperature, setTemperature] = useState("");
    const [humidity, setHumidity] = useState("");
    const [foodType, setFoodType] = useState("");
    const [prediction, setPrediction] = useState(null);
    const [submittedData, setSubmittedData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                temperature: parseFloat(temperature),
                humidity: parseFloat(humidity),
                food_type: foodType,
            }),
        });
        const data = await response.json();
        setPrediction(data.prediction);
        setSubmittedData({ temperature, humidity, foodType, prediction: data.prediction });
    };

    return (
        <div>
            <h1>Hello, Cold Storage Dashboard!</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Temperature"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Humidity"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Food Type"
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    required
                />
                <button type="submit">Get Prediction</button>
            </form>
            {submittedData && (
                <div>
                    <h2>Submitted Data:</h2>
                    <p>Temperature: {submittedData.temperature}</p>
                    <p>Humidity: {submittedData.humidity}</p>
                    <p>Food Type: {submittedData.foodType}</p>
                    <h2>Prediction:</h2>
                    <p>{submittedData.prediction}</p>
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
