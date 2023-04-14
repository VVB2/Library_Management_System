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

# path_to_watch = "/scrapping/app/static"

def clean_json(books_data, filepath, datapath):
    """To remove duplicate dictionary from json file befor inserting

    Args:
        books_data (Dictionary): Book details dictionary from the file
    """
    unique = { each['book_detail']['isbn'] : each for each in books_data }.values()
    with DatabaseObject() as dbo:
        for data in unique:
            if dbo.checkPresent(data['book_detail']['isbn']):
                dbo.updateList(data['book_detail']['isbn'], data['accession_books_list'])
            else:
                dbo.insertOne(data)
    os.remove(filepath)
    os.remove(datapath)

def scrapping(filename):
    """Used for scrapping image URL from website

    Args:
        channel (RabbitMQ): To connect to the RabbitMQ queue
        body (String): Contains the path to the json file
    """
    try:
        print('Started Scrapping')
        filepath = os.path.join('app/static', filename)
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

        clean_json(file_data, filepath, datapath)

    except Exception as e:
        print(e)
    
    finally:
        print('Done!')
