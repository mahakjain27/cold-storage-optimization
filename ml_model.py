import pandas as pd
from pymongo import MongoClient
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# MongoDB Connection
MONGO_URI = "mongodb+srv://mahaksamdaria2004:QcH00aXef5kPgn5G@cluster0.odchl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["cold_storage"]
sensors_collection = db["sensors"]

# Load data from MongoDB
data = pd.DataFrame(list(sensors_collection.find()))

# Preprocess data
data['food_type'] = data['food_type'].astype('category').cat.codes  # Convert food type to numeric
X = data[['temperature', 'humidity', 'food_type']]
y = data['spoilage'].apply(lambda x: 1 if x < 0.5 else (2 if x < 1 else 3))  # Convert to discrete classes


# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Create a mapping of food_type categories from raw data before conversion
raw_data = pd.DataFrame(list(sensors_collection.find()))
raw_food_type_categories = raw_data['food_type'].astype('category').cat.categories.tolist()
food_type_to_code = {cat: code for code, cat in enumerate(raw_food_type_categories)}

# Function to make predictions
def predict(input_data):
    input_df = pd.DataFrame([input_data])
    # Map food_type to category code safely
    food_type = input_data.get('food_type')
    if food_type not in food_type_to_code:
        raise ValueError(f"Unknown food_type: {food_type}. Valid options: {list(food_type_to_code.keys())}")
    input_df['food_type'] = input_df['food_type'].map(food_type_to_code)
    prediction = model.predict(input_df[['temperature', 'humidity', 'food_type']])
    return prediction[0]

# Evaluation
print(classification_report(y_test, y_pred))
