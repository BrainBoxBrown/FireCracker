#!/usr/bin/python

# FireCracker WarGame Scoreboard
# AddFlag.py
# Jordan Brown 31/October/2015

import os
from boto import dynamodb2
from boto.dynamodb2.table import Table
import simplejson
import uuid
import hashlib
TABLE_NAME = "FireCrackerFlags"
REGION = "ap-northeast-1"



conn = dynamodb2.connect_to_region(
    REGION,
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
)

flag =
salts =  

#make a hash of it with the salt
hashedFlag = flag
for salt in salts:
	sha1 = hashlib.sha1()
	sha1.update(hashedFlag + salt)
	hashedFlag = sha1.hexdigest()
print hashedFlag

data = {
    "flag": hashedFlag,
    "challenge": "Mac_n_me",
    "category": "Programming",
    "points": 73
}
flagTable = Table(
    TABLE_NAME,
    connection=conn
)

flagTable.put_item(data)



