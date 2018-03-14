#!/usr/bin/env bash

# quick script to create and run docker image, with db migrations
if [ -z ${TEI_DIR+x} ]; then 
	echo "TEI_DIR variable is not set. Try setting it first using 'export TEI_DIR=/path/to/dir'";
	exit;
fi

if [ ! -d "$TEI_DIR" ] || [ -z "$(ls -A $TEI_DIR)" ]; then
	echo "$TEI_DIR does not exist or it is empty. Aborting.";
	exit;
fi

echo "TEI_DIR is set to $TEI_DIR" 

docker-compose up -d --build

sleep 5
#docker exec -it wugsy_web_1 python3 src/manage.py createsuperuser --name=admin --email=admin@admin.com --no-input
docker exec -it wugsy_web_1 python3 src/manage.py makemigrations
docker exec -it wugsy_web_1 python3 src/manage.py migrate
docker exec -it wugsy_web_1 python3 src/manage.py migrate easy_thumbnails
echo "Ready! Navigate to wugsy_web_1 with http://localhost:8000"
if [ -z "$1" ]
  then
    docker attach wugsy_web_1
fi