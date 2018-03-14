from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
from bs4 import BeautifulSoup
import pymysql

print("Connecting to ES...")
es = Elasticsearch(hosts=[{"host":'elasticsearch'}]) # what should I put here?
if not es.ping():
    raise ValueError("Connection failed")
else:
	print('Connected to ES')

print("Connecting to MySQL...")
conn= pymysql.connect(host='wugsy_db_1',user='root',password='password',db='dboe_1',charset='utf8mb4',cursorclass=pymysql.cursors.DictCursor)
if conn.open:
	print('Connected to MySQL')
else:
	print('Connection to MySQL failed')

# create index
# print("Indexing Elasticsearch db... (please hold on)")
# bulk(es, actions)
# print("...done indexing :-)")