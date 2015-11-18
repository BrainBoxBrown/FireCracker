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


flags = flagTable.scan()
for flag in flags:
	#Delete it
	flagTable.delete_item(**{
		'flag': flag['flag']
	})

	# now update all the users!

	users = tokenTable.scan()
	for user in users:

		#Delete the user .. Eaakkk
		tokenTable.delete_item(**{
			'token': user['token']
		})

		if user['flags']:
			i = 0
			for userFlag in user['flags']:
				if userFlag['flag'] == flag['flag']:
					print simplejson.dumps(dict(userFlag), indent=4*' ')
					del user['flags'][i] 
				i += 1

		#Put them back .. pheww
		tokenTable.put_item(user)



# users = tokenTable.scan()
# for user in users:
# 	if user['flags']:
# 		for userFlag in user['flags']:
# 			print simplejson.dumps(dict(userFlag), indent=4*' ')
# 				# userFlag['flag'] = newHashedFlag





