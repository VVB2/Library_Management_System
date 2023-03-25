import time, os
from worker import scrapping

path_to_watch = "/scrapping/app/static"
before = dict ([(f, None) for f in os.listdir (path_to_watch)])
while 1:
    time.sleep(10)
    after = dict([(f, None) for f in os.listdir (path_to_watch)])
    files = [f for f in after if not f in before]
    if files: 
        for file in files:
            scrapping(file)