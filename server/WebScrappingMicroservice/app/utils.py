import pandas as pd
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By

def driver_setup():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-gpu')
    driver = webdriver.Firefox(options=chrome_options)
    driver.implicitly_wait(5)
    driver.get("https://us.nicebooks.com/search?q=1501173081")
    return driver

def bulk_scrape_data(df, driver, accession_list):
    """Helper function to scrape multiple books for image URL

    Args:
        df (DataFrame): Dataframe containing all the details of the books   
        driver (Driver): Gevent driver
        accession_list (list): List of the accession

    Returns:
        JSON: A dictionary containing all the book details along with image URL 
    """
    data_json = []
    try:
        for _,data in df.iterrows():
            if not pd.isnull(data['ISBN']):
                search_text = driver.find_element(By.CLASS_NAME,"nb-input-group-left")
                search_text.clear()
                search_text.send_keys(data['ISBN'])
                submit = driver.find_element(By.CLASS_NAME,"nb-input-group-right")
                submit.click()
                result_data = {'book_detail': {
                        'title': data['Title-Edition-ISBN'].split('.')[0].strip(),
                        'isbn': str(data['ISBN']),
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
                        result_data['books_detail']['image_url'] = image.get_attribute('src') 
                    title = driver.find_element(By.XPATH, '//*[@id="search-results"]/div/div/div[2]/div[1]/a')
                    result_data['books_detail']['title'] = title.get_attribute('innerHTML')
                except Exception as e:
                    print(e)
                data_json.append(result_data)
                search_text = driver.find_element(By.CLASS_NAME,"nb-input-group-left")
                search_text.clear()
    finally:
        driver.close()

    return data_json

def single_scrape_data(data, driver):
    """Helper function to scrape book for image URL

    Args:
        df (DataFrame): Dataframe containing all the details of the books  
        driver (Driver): Gevent driver

    Returns:
        JSON: A dictionary containing all the book details along with image URL 
    """
    try:
        search_text = driver.find_element(By.CLASS_NAME,"nb-input-group-left")
        search_text.clear()
        search_text.send_keys(data['isbn'])
        submit = driver.find_element(By.CLASS_NAME,"nb-input-group-right")
        submit.click()
        result_data = {'book_detail': {
                'title': data['title'].split('.')[0].strip(),
                'isbn': data['isbn'],
                'publishedYear': data['publishedYear'],
                'author': data['author'],
                'price': data['price'],
                'publisher': data['publisher'],
                'pages': data.get('pages', 'None'),
                'entry_date': data['entry_date'],
                'image_url': 'https://leadershiftinsights.com/wp-content/uploads/2019/07/no-book-cover-available.jpg'
            },
            'accession_books_list' : data['accession_books_list'],
            'available_books' : data['accession_books_list']
        } 

        try:
            image = driver.find_element(By.XPATH, '//*[@id="search-results"]/div/div/div[1]/div/a/img')
            if image.get_attribute('src') != 'https://nicebooksimages.b-cdn.net/placeholder.png?width=240&quality=90&optimizer=image&format=png' :
                result_data['books_detail']['image_url'] = image.get_attribute('src') 
            title = driver.find_element(By.XPATH, '//*[@id="search-results"]/div/div/div[2]/div[1]/a')
            result_data['books_detail']['title'] = title.get_attribute('innerHTML')
        except Exception as e:
            print(e)
    finally:
        driver.close()
    
    return result_data