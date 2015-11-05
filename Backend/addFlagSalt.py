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
FLAG_TABLE_NAME = "FireCrackerFlags"
TOKEN_TABLE_NAME = "FireCrackerTable"
REGION = "ap-northeast-1"



conn = dynamodb2.connect_to_region(
	REGION,
	aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
	aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
)


flagTable = Table(
	FLAG_TABLE_NAME,
	connection=conn
)


tokenTable = Table(
	TOKEN_TABLE_NAME,
	connection=conn
)

#this is the flag that we are changing


flagMap = {}
#for each flag

flags = flagTable.scan()
for flag in flags:
	print simplejson.dumps(dict(flag), indent=4*' ')
	oldHashedFlag = flag['flag']

	newSalt = "XXX";

	#make a hash of it with the new salt
	sha1 = hashlib.sha1()
	sha1.update(oldHashedFlag + newSalt)
	newHashedFlag = sha1.hexdigest()
	print oldHashedFlag
	print newHashedFlag

	flagMap[oldHashedFlag] = newHashedFlag

	#Delete it
	flagTable.delete_item(**{
		'flag': oldHashedFlag
	})

	#change it 
	flag['flag'] = newHashedFlag


	#put it back
	flagTable.put_item(flag)

print flagMap


# now update all the users!
users = tokenTable.scan()
for user in users:

	#Delete the user .. Eaakkk
	tokenTable.delete_item(**{
		'token': user['token']
	})

	if user['flags']:
		for userFlag in user['flags']:
			userFlag['flag'] = flagMap[userFlag['flag']]

	#Put them back .. pheww
	tokenTable.put_item(user)






