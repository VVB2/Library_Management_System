FROM --platform=linux/amd64 python:3.9

EXPOSE 4000

# geckodriver
RUN apt-get update -y && \
    apt-get upgrade -y && \
    wget https://github.com/mozilla/geckodriver/releases/download/v0.32.2/geckodriver-v0.32.2-linux-aarch64.tar.gz -O /tmp/geckodriver.tar.gz && \
    tar -C /opt -xzf /tmp/geckodriver.tar.gz && \
    chmod 755 /opt/geckodriver && \
    ln -fs /opt/geckodriver /usr/bin/geckodriver && \
    ln -fs /opt/geckodriver /usr/local/bin/geckodriver

# firefox installation
RUN echo "deb http://deb.debian.org/debian/ unstable main contrib non-free" >> /etc/apt/sources.list.d/debian.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends firefox

# copying files and installing required packages
WORKDIR /scrapping
RUN pip install --upgrade pip
COPY ./requirements.txt /scrapping
RUN pip install --no-cache-dir --upgrade -r requirements.txt
COPY ./app /scrapping/app
COPY ./app/static /scrapping/app/static

# running the server
CMD ["python", "app/main.py"]