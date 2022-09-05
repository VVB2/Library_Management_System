from collections import defaultdict
from gevent import monkey
monkey.patch_all()
import pandas as pd
import numpy as np
import gevent
import json
from utils import driver_setup, scrape_data
from databaseEntry import DatabaseObject

INSTANCE = 5

def clean_json(books_data):
    unique = { each['books_details']['isbn'] : each for each in books_data }.values()
    with DatabaseObject() as dbo:
        for data in unique:
            print(f'Entering {data["books_details"]["isbn"]} into database')
            dbo.insertOne(data)

df = pd.read_csv('Accession Register.csv', skiprows=5)
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
threads = [gevent.spawn(scrape_data, data, driver, accession_list) for data,driver in zip(df_split, drivers)]
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