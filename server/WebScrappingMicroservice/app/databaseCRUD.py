import os
from pymongo import MongoClient

class DatabaseObject:
    def __init__(self) -> None: 
        """Initialize the database connection"""
        self.URI = os.environ['MONGO_URI']
        self.DATABASE = None   

    def checkPresent(self, isbn):
        """Check if isbn present in database

        Args:
            isbn (ObjectID): Object Id of the book for which to check if present

        Returns:
            bool: If present or not
        """
        try:
            return len(self.DATABASE['Books'].find_one({ 'book_detail.isbn': str(isbn) })) > 0
        except:
            return False
    
    def insertOne(self, data):
        """Insert the book data into database

        Args:
            data (JSON): Book containing all the details
        """
        self.DATABASE['Books'].insert_one(data)

    def updateList(self, isbn, list):
        """Update the accession_BooksCopy_list and available_BooksCopy list in database

        Args:
            isbn (ObjectID): Object Id of the book for which to update lists
            list (List): A list contating all the new values to be inserted into database 
        """
        self.DATABASE['Books'].update_many({ 'book_detail.isbn': isbn }, { '$addToSet': {
            'accession_list': {
                '$each': list
            },
            'available_books': {
                '$each': list
            }
        }})

    def __enter__(self):
        """make a database connection and return it"""
        try:
            self.client = MongoClient(self.URI)
            self.DATABASE = self.client['LibraryManagementSystem']
        except Exception as e:
            print(e)
            self.__exit__()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Close the connection on exit"""
        try:
            self.client.close()
        except Exception as e:
            print(e)