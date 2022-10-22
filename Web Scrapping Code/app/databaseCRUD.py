from dotenv import dotenv_values
from pymongo import MongoClient

config = dotenv_values('.env')

class DatabaseObject:
    def __init__(self) -> None: 
        self.URI = config['MONGO_URI']
        self.DATABASE = None      
    
    def insertOne(self, data):
        self.DATABASE['Books'].insert_one(data)

    def getBooks(self, pageNo):
        return self.DATABASE['Books'].find( {}, { "_id": 0 }).skip(20 * pageNo).limit(20)

    def bookPresent(self, book):
        present = self.DATABASE['Books'].count_documents({"book_detail.isbn": book['ISBN']}) > 0
        if present:
            self.DATABASE['Books'].update_one(
                {
                    "book_detail.isbn": book['ISBN']
                }, 
                {
                    "$addToSet": {
                        "accession_books_list": {
                            "$each": book['accession_list']
                        }, 
                        "available_books": {
                            "$each": book['accession_list']
                        }
                    }
                }
            )
        return present
    
    def getBookTitle(self):
        return self.DATABASE['Books'].distinct("book_detail.title")

    def checkAvailable(self, number):
        return self.DATABASE['Books'].find( { "accession_books_list": { "$in": [number] } }, { "_id": 0 } )
    
    def getBookByISBN(self, ISBN):
        return self.DATABASE['Books'].find( { "book_detail.isbn": ISBN }, {"_id": 0 } )

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