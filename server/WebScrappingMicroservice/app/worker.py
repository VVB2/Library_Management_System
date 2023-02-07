import pika
import os
import pandas as pd
import numpy as np
import gevent
import json
import time
from dotenv import dotenv_values
from utils import driver_setup, bulk_scrape_data
from collections import defaultdict
from databaseCRUD import DatabaseObject

config = dotenv_values('.env')

INSTANCE = 5

def clean_json(books_data):
    unique = { each['book_detail']['isbn'] : each for each in books_data }.values()
    with DatabaseObject() as dbo:
        for data in unique:
            if dbo.checkPresent(data['book_detail']['isbn']):
                dbo.updateList(data['book_detail']['isbn'], data['accession_books_list'])
            else:
                dbo.insertOne(data)

def scrapping(channel, method, properties, body):
    try:
        print('Started Scrapping')
        filepath = body.decode()
        df = pd.read_csv(filepath, encoding='latin-1')
        old_ISBN = df['ISBN'][0]
        accession_list = defaultdict(list)
        for _,data in df.iterrows():
            if not pd.isnull(data['ISBN']) and old_ISBN != data['ISBN']:
                old_ISBN = data['ISBN']
            accession_list[str(old_ISBN)].append(data['Accession Number'])

        #Dropping Null and duplicate values
        df.dropna(subset=['ISBN'], inplace=True)
        df.drop_duplicates(subset=['ISBN'])
        df_split = np.array_split(df, INSTANCE)

        #Creating multiple instances
        drivers = [driver_setup() for _ in range(INSTANCE)]
        threads = [gevent.spawn(bulk_scrape_data, data, driver, accession_list) for data,driver in zip(df_split, drivers)]
        gevent.joinall(threads)

        #Catching the results from different threads
        result = []
        for thread in threads:
            result.extend(thread.value)

        datapath = os.path.join('app/static', f'{time.strftime("%Y%m%d-%H%M%S")}-data.json')
        #Storing the data into json file
        with open(datapath, 'w') as f:
            json.dump(result, f, indent=4)

        #Removing duplicates and pushing to database
        with open(datapath) as f:
            file_data = json.load(f)

        clean_json(file_data)
        channel.basic_ack(delivery_tag=method.delivery_tag)
    
    finally:
        print('[x] Done!')
        os.remove(filepath)
        os.remove(datapath)

connection = pika.BlockingConnection(pika.ConnectionParameters(host=config['RABBITMQ_URI']))
channel = connection.channel()
channel.basic_consume(queue='WebScrappingQueue', on_message_callback=scrapping)
channel.start_consuming()