from pymongo import MongoClient

MONGO_URI = "mongodb+srv://mahaksamdaria2004:QcH00aXef5kPgn5G@cluster0.odchl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["cold_storage"]
sensors_collection = db["sensors"]

def get_distinct_food_types():
    food_types = sensors_collection.distinct("food_type")
    print("Distinct food types in the sensors collection:")
    for ft in food_types:
        print(ft)

if __name__ == "__main__":
    get_distinct_food_types()
