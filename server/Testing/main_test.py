import unittest
from selenium import webdriver
from time import sleep


class app_test_case(unittest.TestCase):
    def setUp(self):
        chromeOptions = webdriver.ChromeOptions()
        driver_path = '/usr/local/bin/chromedriver'
        chromeOptions.add_argument('--headless')
        chromeOptions.add_argument('--disable-gpu')
        chromeOptions.add_argument('--no-sandbox')


        self.driver = webdriver.Chrome(driver_path, chrome_options=chromeOptions)
        self.driver.implicitly_wait(30)
        self.driver.maximize_window()
        path = 'https://www.google.com/'
        self.base_url = path


    def test_i_d_e_script1(self):
        driver = self.driver
        driver.get(self.base_url)

        get_title = driver.title
        print(get_title, "  ", len(get_title))


    def tearDown(self):
        sleep(5)
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()