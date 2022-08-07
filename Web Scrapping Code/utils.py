import pandas as pd
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from selenium import webdriver
from selenium.webdriver.edge.service import Service 
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By

def driver_setup():
    service= Service("msedgedriver.exe")
    options = Options()
    options.headless = True
    driver = webdriver.Edge(service=service, options=options)
    driver.get("https://us.nicebooks.com/search?q=1501173081")
    driver.implicitly_wait(5)
    return driver

def scrape_images(df, driver):
    data_json = []
    try:
        for _,data in df.iterrows():
            print(f'Scrapping for {data["Title-Edition-ISBN"]}')
            
            if not pd.isnull(data['ISBN']):
                search_text = driver.find_element(By.CLASS_NAME,"nb-input-group-left")
                search_text.clear()
                search_text.send_keys(data['ISBN'])
                submit = driver.find_element(By.CLASS_NAME,"nb-input-group-right")
                submit.click()

                result_data = {
                    'title': data['Title-Edition-ISBN'].split('.')[0].strip(),
                    'ISBN': data['ISBN'],
                    'year': data['Year'],
                    'author': data['Author'],
                    'publication': data['Publisher Details'],
                    'pages': data['Pages'],
                    'entry-date': data['Date'],
                    'url': None
                    }

                try:
                    image = driver.find_element(By.XPATH, '//*[@id="search-results"]/div/div/div[1]/div/a/img')
                    
                    if image.get_attribute('src') != 'https://nicebooksimages.b-cdn.net/placeholder.png?width=240&quality=90&optimizer=image&format=png' :
                        result_data['url'] = image.get_attribute('src')                    
                except Exception as e:
                    print(e) 
            
                data_json.append(result_data)

                search_text = driver.find_element(By.CLASS_NAME,"nb-input-group-left")
                search_text.clear()
    finally:
        driver.close()

    return data_json

if __name__ == "__main__":
    df = pd.read_csv('Accession Register.csv', skiprows=5)
    df.dropna(inplace=True)
    df_split = np.array_split(df, 4)
    drivers = [driver_setup() for _ in range(2)]

    with ThreadPoolExecutor(max_workers=2) as executor:
        executor.map(scrape_images, df, drivers)



