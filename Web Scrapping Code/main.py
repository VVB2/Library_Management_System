from gevent import monkey
monkey.patch_all()
import pandas as pd
import numpy as np
import gevent
import json
from utils import driver_setup, scrape_data

INSTANCE = 2

df = pd.read_csv('Accession Register.csv', skiprows=5)
df.dropna(inplace=True)
df_split = np.array_split(df, INSTANCE)

drivers = [driver_setup() for _ in range(INSTANCE)]
threads = [gevent.spawn(scrape_data, data, driver) for data,driver in zip(df_split, drivers)]
gevent.joinall(threads)

result = []
for thread in threads:
    result.extend(thread.value)

with open('data.json', 'w') as f:
    json.dump(result, f, indent=4)