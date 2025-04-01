import random
from pymongo import MongoClient

# MongoDB Connection
MONGO_URI = "mongodb+srv://mahaksamdaria2004:QcH00aXef5kPgn5G@cluster0.odchl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URI)
db = client["cold_storage"]
sensors_collection = db["sensors"]

# Food types
food_types = ["Fruits", "Vegetables", "Dairy", "Meat"]

# Generate synthetic data
def generate_synthetic_data(num_records, temperature, humidity, food_type):

    for _ in range(num_records):
        spoilage_rate = calculate_spoilage(temperature, humidity, food_type)

        spoilage_rate = calculate_spoilage(temperature, humidity, food_type)

        # Insert data into MongoDB
        sensors_collection.insert_one({
            "temperature": temperature,
            "humidity": humidity,
            "food_type": food_type,
            "spoilage": spoilage_rate
        })

def calculate_spoilage(temperature, humidity, food_type):
    # Simple spoilage calculation based on temperature and humidity
    if food_type == "Fruits":
        return (temperature * 0.5 + humidity * 0.3) / 10
    elif food_type == "Vegetables":
        return (temperature * 0.4 + humidity * 0.4) / 10
    elif food_type == "Dairy":
        return (temperature * 0.6 + humidity * 0.5) / 10
    elif food_type == "Meat":
        return (temperature * 0.7 + humidity * 0.6) / 10
    return 0

# Example usage
generate_synthetic_data(100, 5, 50, "Fruits")  # Replace with dynamic input as needed

print("Synthetic data generated and stored in MongoDB.")
