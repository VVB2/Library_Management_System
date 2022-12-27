from dotenv import dotenv_values
from pymongo import MongoClient

config = dotenv_values('.env')

class DatabaseObject:
    def __init__(self) -> None: 
        self.URI = config['MONGO_URI']
        self.DATABASE = None   

    def checkPresent(self, isbn):
        return len(self.DATABASE['Test'].find_one({ 'book_detail.isbn': isbn })) > 0
    
    def insertOne(self, data):
        self.DATABASE['Test'].insert_one(data)

    def __enter__(self):
        '''make a database connection and return it'''
        try:
            self.client = MongoClient(self.URI)
            self.DATABASE = self.client['LibraryManagementSystem']
        except Exception as e:
            print(e)
            self.__exit__()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            self.client.close()
        except Exception as e:
            print(e)