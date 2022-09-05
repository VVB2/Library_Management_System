import pandas as pd
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

def scrape_data(df, driver, accession_list):
    data_json = []
    try:
        for _,data in df.iterrows():

            if not pd.isnull(data['ISBN']):
                print(f'Scrapping for {data["Title-Edition-ISBN"].split(".")[0].strip()} - {data["ISBN"]}')
                search_text = driver.find_element(By.CLASS_NAME,"nb-input-group-left")
                search_text.clear()
                search_text.send_keys(data['ISBN'])
                submit = driver.find_element(By.CLASS_NAME,"nb-input-group-right")
                submit.click()

                result_data = {'books_details': {
                        'title': data['Title-Edition-ISBN'].split('.')[0].strip(),
                        'isbn': data['ISBN'],
                        'publishedYear': data['Year'],
                        'author': data['Author'],
                        'price': data['Price'],
                        'publisher': data['Publisher Details'],
                        'pages': data.get('Pages', 'None'),
                        'entry_date': data['Date'],
                        'image_url': 'https://leadershiftinsights.com/wp-content/uploads/2019/07/no-book-cover-available.jpg'
                    },
                    'accession_books_list' : accession_list[str(data['ISBN'])],
                    'available_books' : accession_list[str(data['ISBN'])]
                } 

                try:
                    image = driver.find_element(By.XPATH, '//*[@id="search-results"]/div/div/div[1]/div/a/img')
                    if image.get_attribute('src') != 'https://nicebooksimages.b-cdn.net/placeholder.png?width=240&quality=90&optimizer=image&format=png' :
                        result_data['books_details']['image_url'] = image.get_attribute('src') 
                    title = driver.find_element(By.XPATH, '//*[@id="search-results"]/div/div/div[2]/div[1]/a')
                    result_data['books_details']['title'] = title.get_attribute('innerHTML')
                except Exception as e:
                    print(e) 
            
                data_json.append(result_data)
                search_text = driver.find_element(By.CLASS_NAME,"nb-input-group-left")
                search_text.clear()
    finally:
        driver.close()

    return data_json

