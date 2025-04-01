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

# Evaluation
print(classification_report(y_test, y_pred))
