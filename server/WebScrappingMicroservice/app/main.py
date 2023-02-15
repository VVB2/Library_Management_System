from gevent import monkey
monkey.patch_all()
from flask import Flask, request
import time
import os
import pika
from flask_cors import CORS
from dotenv import dotenv_values
from utils import driver_setup, single_scrape_data
from databaseCRUD import DatabaseObject
from logger import customLogger

app = Flask(__name__)
CORS(app)

config = dotenv_values('.env')
print(config)

FILE_UPLOADS = 'app/static'
app.config['FILE_UPLOADS'] = FILE_UPLOADS

# connection = pika.BlockingConnection(pika.ConnectionParameters(host=config['RABBITMQ_URI']))
# channel = connection.channel()
# channel.queue_declare(queue='WebScrappingQueue', durable=True)

@app.route('/api/web-scrapping/single-insert-book', methods=['POST'])
def singleInsertBook():
    customLogger('info', 'Started with single book scrapping')
    # data = request.get_json()
    # with DatabaseObject() as dbo:
    #     if dbo.checkPresent(data['isbn']):
    #         dbo.updateList(data['isbn'], data['accession_books_list'])
    #     else:
    #         result_data = single_scrape_data(data, driver_setup())
    #         dbo.insertOne(result_data)
    return 'Done!'

@app.route('/api/web-scrapping/bulk-insert-book', methods=['POST'])
def bulkInsertBook():
    customLogger('info', 'Started with bulk books scrapping')
    uploaded_file = request.files['file']
    if uploaded_file:
        filepath = os.path.join(app.config['FILE_UPLOADS'], f'{time.strftime("%Y%m%d-%H%M%S")}-{uploaded_file.filename}')
        uploaded_file.save(filepath)
        # channel.basic_publish(exchange='',
        #             routing_key='WebScrappingQueue',
        #             body=filepath,
        #             properties=pika.BasicProperties(
        #                  delivery_mode = pika.spec.PERSISTENT_DELIVERY_MODE
        #               ))
        # connection.close()
        return 'Done!'
    else:
        customLogger('error', 'Server Error')
        return 'Server Error'


if (__name__ == "__main__"):
    customLogger('info', 'Server started')
    app.run(port = 8000, debug=True, host='0.0.0.0')