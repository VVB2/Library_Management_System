from dotenv import dotenv_values
from pymongo import MongoClient

config = dotenv_values('.env')

def get_database(data):

    CONNECTION_STRING = config['MONGO_URI']
    client = MongoClient(CONNECTION_STRING)
    db = client['LibraryManagementSystem']
    collection = db['Books']

    collection.insert_one(data)
    