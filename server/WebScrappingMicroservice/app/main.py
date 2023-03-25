from gevent import monkey
monkey.patch_all()
import time
import os
import json
from flask import Flask, request
from flask_cors import CORS
from dotenv import dotenv_values
from utils import driver_setup, single_scrape_data
from worker import scrapping
from databaseCRUD import DatabaseObject

app = Flask(__name__)
CORS(app)

config = dotenv_values('.env')

FILE_UPLOADS = 'app/static'
app.config['FILE_UPLOADS'] = FILE_UPLOADS

@app.route('/api/web-scrapping/single-insert-book', methods=['POST'])
def singleInsertBook():
    """API to scrape books images for multiple books 

    Returns:
        JSON: Message indicating successful API call
    """
    data = request.get_json()
    with DatabaseObject() as dbo:
        if dbo.checkPresent(data['isbn']):
            dbo.updateList(data['isbn'], data['accession_books_list'])
        else:
            result_data = single_scrape_data(data, driver_setup())
            dbo.insertOne(result_data)
    return { 'message': 'Done!' }

@app.route('/api/web-scrapping/bulk-insert-book', methods=['POST'])
def bulkInsertBook():
    """API to scrape books images for single book 

    Returns:
        JSON: Message indicating successful API call
    """
    with DatabaseObject() as dbo:
        uploaded_file = request.files['file']
        if uploaded_file:
            filepath = os.path.join(app.config['FILE_UPLOADS'], f'{time.strftime("%Y%m%d-%H%M%S")}-{uploaded_file.filename}')
            uploaded_file.save(filepath)
            return { 'message': 'Done!' }
        else:
            return { 'message': 'Server Error!' }

if (__name__ == "__main__"):
    print('Server started')
    app.run(port = 4000, debug=True, host='0.0.0.0')
