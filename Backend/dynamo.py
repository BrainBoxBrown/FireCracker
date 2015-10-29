#!/usr/bin/python
#dynamo Example

import os
from boto import dynamodb2
from boto.dynamodb2.table import Table
import simplejson
import uuid
TABLE_NAME = "jordanP1Products"
REGION = "ap-southeast-2"

conn = dynamodb2.connect_to_region(
    REGION,
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
)



data = {
    "ProductID": str(uuid.uuid4()),
    "Title": "BMW",
    "Description": "318i BMW 1996",
    "Price": 23000,
    "DateCreated": 944006400, #Unix time stamp
    "DateModified": 944006400, #Unix time stamp
    "Archived": False
}

productTable = Table(
    TABLE_NAME,
    connection=conn
)

# product = productTable.delete_item(**{
#     'ProductID': 1
# })
# productTable.put_item(data)

# product = productTable.get_item(**{
#     'ProductID': 1
# })
everything = productTable.scan()
for result in everything:
    print simplejson.dumps(dict(result), indent=4*' ')

