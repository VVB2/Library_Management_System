from gevent import monkey
monkey.patch_all()
import time
import os
import atexit
from apscheduler.schedulers.background import BackgroundScheduler
from werkzeug.utils import secure_filename
from flask import Flask, request
from flask_cors import CORS
from utils import driver_setup, single_scrape_data
from worker import scrapping
from databaseCRUD import DatabaseObject

app = Flask(__name__)
CORS(app)

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
            dbo.insertOne(result_data, 'Books')
    return { 'message': 'Done!' }

@app.route('/api/web-scrapping/bulk-insert-book', methods=['POST'])
def bulkInsertBook():
    """API to scrape books images for single book 

    Returns:
        JSON: Message indicating successful API call
    """
    uploaded_file = request.files['file']
    if uploaded_file:
        uploaded_file.save(os.path.join(app.config['FILE_UPLOADS'], secure_filename(f'{time.strftime("%d%m%Y-%H%M%S")}-{uploaded_file.filename}')))
        return { 'message': 'Done!' }
    else:
        return { 'message': 'Server Error!' }

def scrape_from_csv():
    for file in os.listdir(app.config['FILE_UPLOADS']):
        if file.endswith('.csv'):
            scrapping(file)

scheduler = BackgroundScheduler(daemon=True)
scheduler.add_job(scrape_from_csv, 'cron', day_of_week='0-6', hour='22')
scheduler.start()

atexit.register(lambda: scheduler.shutdown())

if (__name__ == "__main__"):
    print('Server started')
    app.run(port = 4000, host='0.0.0.0')
