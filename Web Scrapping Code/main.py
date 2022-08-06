import pandas as pd
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from selenium import webdriver
from selenium.webdriver.edge.service import Service 
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By

df = pd.read_csv('Accession Register.csv', skiprows=5)
df.dropna(inplace=True)
df_split = np.array_split(df, 4)
f = open('test.txt', 'a')
data_json = []

def driver_setup():
    service= Service("msedgedriver.exe")
    options = Options()
    options.headless = True
    driver = webdriver.Edge(service=service, options=options)
    driver.get("https://us.nicebooks.com/search?q=1501173081")
    driver.implicitly_wait(5)
    return driver

def scrape_images(df, driver):
    try:
        for _,data in df[0:3].iterrows():
            print(f'Scrapping for {data["Title-Edition-ISBN"]}')
            if not pd.isnull(data['ISBN']):
                search_text = driver.find_element(By.CLASS_NAME,"nb-input-group-left")
                search_text.clear()
                search_text.send_keys(data['ISBN'])
                submit = driver.find_element(By.CLASS_NAME,"nb-input-group-right")
                submit.click()
                try:
                    image = driver.find_element(By.XPATH, '//*[@id="search-results"]/div/div/div[1]/div/a/img')
                    if image.get_attribute('src') == 'https://nicebooksimages.b-cdn.net/placeholder.png?width=240&quality=90&optimizer=image&format=png' :
                        data_json.append({
                            'title': data['Title-Edition-ISBN'].split('.')[0],
                            'ISBN': data['ISBN'],
                            'year': data['Year'],
                            'author': data['Author'],
                            'publication': data['Publisher Details'],
                            'pages': data['Pages'],
                            'entry-date': data['Date'],
                            'url': None}
                            )
                    else:
                        data_json.append({
                            'title': data['Title-Edition-ISBN'].split('.')[0],
                            'ISBN': data['ISBN'],
                            'year': data['Year'],
                            'author': data['Author'],
                            'publication': data['Publisher Details'],
                            'pages': data['Pages'],
                            'entry-date': data['Date'],
                            'url':image.get_attribute('src')}
                            )
                except:
                    data_json.append({
                            'title': data['Title-Edition-ISBN'].split('.')[0],
                            'ISBN': data['ISBN'],
                            'year': data['Year'],
                            'author': data['Author'],
                            'publication': data['Publisher Details'],
                            'pages': data['Pages'],
                            'entry-date': data['Date'],
                            'url': None}
                            )
                search_text = driver.find_element(By.CLASS_NAME,"nb-input-group-left")
                search_text.clear()
    finally:
        driver.close()

drivers = [driver_setup() for _ in range(4)]

with ThreadPoolExecutor(max_workers=4) as executor:
    executor.map(scrape_images, df_split, drivers)
    
f.write(str(data_json))



