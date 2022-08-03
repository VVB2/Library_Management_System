import pandas as pd
from selenium import webdriver
from selenium.webdriver.edge.service import Service 
from selenium.webdriver.common.by import By

df = pd.read_csv('Accession Register.csv', skiprows=5)
service= Service("C:/SeleniumDriver/msedgedriver.exe")
driver = webdriver.Edge(service=service)
driver.get("https://us.nicebooks.com/search?q=1501173081")
driver.implicitly_wait(5)
try:
    for index,data in df.iterrows():
        if not pd.isnull(data['ISBN']):
            search_text = driver.find_element(By.CLASS_NAME,"nb-input-group-left")
            search_text.clear()
            search_text.send_keys(data['ISBN'])
            submit = driver.find_element(By.CLASS_NAME,"nb-input-group-right")
            submit.click()
            try:
                image = driver.find_element(By.XPATH, '//*[@id="search-results"]/div/div/div[1]/div/a/img')
                if image.get_attribute('src') == 'https://nicebooksimages.b-cdn.net/placeholder.png?width=240&quality=90&optimizer=image&format=png' :
                    print(f'No image found for {data["Title-Edition-ISBN"]}')
                else:
                    print(image.get_attribute('src'))   
            except:
                print(f'No image found for {data["Title-Edition-ISBN"]}')
            search_text = driver.find_element(By.CLASS_NAME,"nb-input-group-left")
            search_text.clear()
except:
    driver.close()