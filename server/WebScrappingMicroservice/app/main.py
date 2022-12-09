from collections import defaultdict
from gevent import monkey
monkey.patch_all()
from flask import Flask, request
import pandas as pd
import time
import os
import numpy as np
import gevent
import json
from flask_cors import CORS
from utils import driver_setup, bulk_scrape_data, single_scrape_data
from databaseCRUD import DatabaseObject

app = Flask(__name__)
CORS(app)

FILE_UPLOADS = 'app/static'
app.config['FILE_UPLOADS'] = FILE_UPLOADS

INSTANCE = 5

def clean_json(books_data):
    unique = { each['book_detail']['isbn'] : each for each in books_data }.values()
    with DatabaseObject() as dbo:
        for data in unique:
            print(f'Entering {data["book_detail"]["isbn"]} into database')
            dbo.insertOne(data)

@app.route('/api/web-scrapping/insert-book', methods=['POST'])
def insertBook():
    print('Started Scrapping')
    uploaded_file = request.files['file']
    try:
        if uploaded_file:
            filepath = os.path.join(app.config['FILE_UPLOADS'], f'{time.strftime("%Y%m%d-%H%M%S")}-{uploaded_file.filename}')
            uploaded_file.save(filepath)
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

            #Storing the data into json file
            with open('data.json', 'w') as f:
                json.dump(result, f, indent=4)

            #Removing duplicates and pushing to database
            with open('data.json') as f:
                file_data = json.load(f)

            clean_json(file_data)
        
    finally:
        os.remove(filepath)

    return 'Done!'

if (__name__ == "__main__"):
     app.run(port = 8000, debug=True, host='0.0.0.0')