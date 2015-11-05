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
oldFlag = "hats"
newFlag = "rats"

salts = ["XXX"]

#make a hash of it with the salts
oldHashedFlag = oldFlag
for salt in salts:
	sha1Old = hashlib.sha1()
	sha1Old.update(oldHashedFlag + salt)
	oldHashedFlag = sha1Old.hexdigest()

newHashedFlag = newFlag
for salt in salts:
	sha1New = hashlib.sha1()
	sha1New.update(newHashedFlag + salt)
	newHashedFlag = sha1New.hexdigest()

print oldHashedFlag
print newHashedFlag

#get the old one
flag = flagTable.get_item(**{
	'flag': oldHashedFlag
})

#Delete it
flagTable.delete_item(**{
	'flag': oldHashedFlag
})

#change it 
flag['flag'] = newHashedFlag

#put it back
flagTable.put_item(flag)


# now update all the users!

users = tokenTable.scan()
for user in users:

	#Delete the user .. Eaakkk
	tokenTable.delete_item(**{
		'token': user['token']
	})

	if user['flags']:
		for userFlag in user['flags']:
			if userFlag['flag'] == oldHashedFlag:
				print simplejson.dumps(dict(userFlag), indent=4*' ')
				userFlag['flag'] = newHashedFlag

	#Put them back .. pheww
	tokenTable.put_item(user)



users = tokenTable.scan()
for user in users:
	if user['flags']:
		for userFlag in user['flags']:
			if userFlag['flag'] == newHashedFlag:
				print simplejson.dumps(dict(userFlag), indent=4*' ')
				# userFlag['flag'] = newHashedFlag





