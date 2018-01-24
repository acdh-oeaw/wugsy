#!/usr/bin/env bash

# quick script to create and run docker image, with db migrations

docker-compose build
docker-compose up -d
sleep 5
#docker exec -it wugsy_web_1 python3 src/manage.py createsuperuser --name=admin --email=admin@admin.com --no-input
docker exec -it wugsy_web_1 python3 src/manage.py makemigrations
docker exec -it wugsy_web_1 python3 src/manage.py migrate
docker exec -it wugsy_web_1 python3 src/manage.py migrate easy_thumbnails
echo "Ready! Navigate to http://localhost:8000"
if [ -z "$1" ]
  then
    docker attach wugsy_web_1
fi