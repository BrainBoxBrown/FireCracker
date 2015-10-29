#!/usr/bin/python
import time
from flask import Flask, jsonify, abort, make_response, request, url_for
from flask.ext.httpauth import HTTPBasicAuth
import uuid
import hashlib
import os
from boto import dynamodb2
from boto.dynamodb2.table import Table
from flask.ext.cors import CORS
import re



PRODUCT_TABLE_NAME = "FireCrackerPasswords"
REGION = "ap-southeast-2"

conn = dynamodb2.connect_to_region(
    REGION,
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
)

app = Flask(__name__)
CORS(app, resources=r'/*', allow_headers='Content-Type')

products = [
    {
        "password": "littens",
        "Level": 0,
        "Points": 100
    }
]

productTable = Table(
    PRODUCT_TABLE_NAME,
    connection=conn
)

# productTable.delete_item(**{
#     'ProductID': 0
# })
# productTable.delete_item(**{
#     'ProductID': 1
# })

# product = productTable.get_item(**{
#     'ProductID': 1
# })

# productTable.put_item(products[0])
# productTable.put_item(products[1])


#Product Stuff
@app.route('/products', methods=['GET'])
def get_products():
    # return jsonify({'products': [dict(prod) for prod in productTable.scan()]})
    return jsonify({'products': [dict(prod) for prod in productTable.scan()]})





if __name__ == '__main__':

    app.run(port=3000, debug=True)
