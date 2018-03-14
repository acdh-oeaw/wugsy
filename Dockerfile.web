FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
RUN apt-get update
RUN apt-get install -y sudo python3-dev python3-setuptools libjpeg-dev zlib1g-dev
ADD requirements.txt /code/
ADD requirements /code/requirements
RUN pip install -r requirements.txt
#RUN pip uninstall PIL
RUN pip install Pillow
ADD . /code/
