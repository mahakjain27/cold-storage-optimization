from flask import Flask, request, jsonify

app = Flask(__name__)

sensor_data = {}  # Store sensor data temporarily

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

if __name__ == '__main__':
    app.run(debug=True, port=5005)
