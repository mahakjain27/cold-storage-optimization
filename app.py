from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from ml_model import predict  # Import the predict function

# MongoDB Connection
MONGO_URI = "your_mongo_uri_here"  # Replace with your actual MongoDB URI
client = MongoClient(MONGO_URI)
db = client['your_database_name']  # Replace with your actual database name
collection = db['sensor_data']  # Collection to store sensor data

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

sensor_data = {}  # Store sensor data temporarily

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Cold Storage Dashboard API!"

@app.route('/sensor-data', methods=['POST'])
def submit_data():
    global sensor_data
    data = request.json

    # Basic validation
    if not data or 'temperature' not in data or 'humidity' not in data or 'spoilage' not in data:
        return jsonify({"error": "Invalid data"}), 400

    sensor_data = data
    return jsonify({"message": "Sensor data recorded successfully"}), 201

@app.route('/latest-data', methods=['GET'])
def get_latest_data():
    if not sensor_data:
        return jsonify({"error": "No data available"}), 404
    return jsonify(sensor_data)

# New API endpoint for predictions
@app.route('/predict', methods=['POST'])
def predict_endpoint():
    input_data = request.json  # Get input data from the request
    print("Received input for prediction:", input_data)  # Debug log
    try:
        prediction = predict(input_data)  # Call the predict function
        print("Prediction result:", prediction)  # Debug log
        return jsonify({'prediction': prediction})  # Return the prediction as JSON
    except Exception as e:
        print("Prediction error:", str(e))  # Debug log
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5005)
