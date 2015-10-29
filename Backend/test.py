#!/usr/bin/python
import time
from flask import Flask, jsonify, abort, make_response, request, url_for
import uuid
import hashlib
import os
from boto import dynamodb2
from boto.dynamodb2.table import Table
import re



PRODUCT_TABLE_NAME = "jordanP1Products"
ORDER_TABLE_NAME = "jordanP1Orders"
USERS_TABLE_NAME = "jordanP1Users"
REGION = "ap-southeast-2"

conn = dynamodb2.connect_to_region(
    REGION,
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
)

app = Flask(__name__)


productTable = Table(
    PRODUCT_TABLE_NAME,
    connection=conn
)


orderTable = Table(
    ORDER_TABLE_NAME,
    connection=conn
)



@app.route('/login', methods=['GET'])
#@auth.login_required
def login():
    return "Success"


#Product Stuff
@app.route('/products', methods=['GET'])
#@auth.login_required
def get_products():
    return jsonify({'products': [dict(prod) for prod in productTable.scan()]})


def make_public_product(prod):
    newProduct = {}
    for field in prod:
        if field == 'ProductID':
            newProduct['uri'] = url_for('get_product', pid=prod['ProductID'], _external=True)
        else:
            newProduct[field] = prod[field]
    return newProduct



@app.route('/products/<pid>', methods=['GET'])
#@auth.login_required
def get_product(pid):
    everything = orderTable.scan()
    things = []
    for order in everything:
        things.append(filter_products(dict(order), pid))
        #serve up all the orders that are not null
    return jsonify({'orders': [order for order in things if order]})
#make sure that you only see your orders and that you get a url 

def filter_products(order, pid):
    publicOrder = {}
    viewable = False
    for field in order:
        if field == 'ProductID':
            if order['ProductID'] == pid:
                viewable = True
                publicOrder[field] = order[field]
            else:
                return None
        elif re.match('Date', field):
            publicOrder[field] = int(order[field])
        else:
            publicOrder[field] = order[field]
    if viewable:
        return publicOrder
    return None


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)




@app.route('/products', methods=['POST'])
#@auth.login_required
def create_product():

    if not request.json:
        abort(400)
    if not 'Title' in request.json:
        abort(400)

    newProduct = {
        "ProductID": str(uuid.uuid4()),
        "Title": request.json["Title"],
        "Description": request.json.get("Description", ""),
        "Price": request.json["Price"],
        "DateCreated": time.time(),
        "DateModified": time.time(),
        "Archived": False
    } 

    productTable.put_item(newProduct)
    return jsonify({"product":newProduct}), 201


@app.route('/products/<pid>', methods=['PUT'])
#@auth.login_required
def update_product(pid):

    product = productTable.get_item(**{
        'ProductID': pid
    })
    if not product:
        abort(404)
    if not request.json:
        abort(400)
    if 'Title' in request.json and type(request.json['Title']) != unicode:
        abort(400)
    if 'Description' in request.json and type(request.json['Description']) is not unicode:
        abort(400)
    if 'Archived' in request.json and type(request.json['Archived']) is not bool:
        abort(400)
    if 'Price' in request.json and type(request.json['Price']) is not int:
        abort(400)

    product['Title'] = request.json.get('Title', product['Title'])
    product['Description'] = request.json.get('Description', product['Description'])
    product['Archived'] = request.json.get('Archived', product['Archived'])
    product['Price'] = request.json.get('Price', product['Price'])
    product['DateModified'] = time.time()
    product.save()
    return jsonify({'product': dict(product)})

@app.route('/products/<pid>', methods=['DELETE'])
#@auth.login_required
def delete_product(pid):
    product = productTable.get_item(**{
        'ProductID': pid
    })
    if not product:
        abort(404)
    productTable.delete_item(**{
        'ProductID': pid
    })
    
    return jsonify({'result':True})










#Order Stuff
@app.route('/orders', methods=['GET'])
#@auth.login_required
def get_orders():
    everything = orderTable.scan()
    things = []
    for order in everything:
        things.append(dict(order))
        #serve up all the orders that are not null
    return jsonify({'orders': [order for order in things if order]})
#make sure that you only see your orders and that you get a url 




@app.route('/orders/<oid>', methods=['GET'])
#@auth.login_required
def get_order(oid):
    order = orderTable.get_item(**{
        'OrderID': oid
    })
    if not order:
        abort(404)

    return jsonify({'order': order[0]})





@app.route('/orders', methods=['POST'])
#@auth.login_required
def create_order():

    if not request.json:
        abort(400)
    if not 'ProductID' in request.json:
        abort(400)

    newOrder = {
        "OrderID": str(uuid.uuid4()),
        "Qty": request.json["Qty"],
        "Username": "User",
        "ProductID": request.json["ProductID"],
        "DateCreated": time.time(),
        "DateModified": time.time()
    } 
    orderTable.put_item(newOrder)
    return jsonify({"order":newOrder}), 201




@app.route('/orders/<oid>', methods=['PUT'])
#@auth.login_required
def update_order(oid):
    order = orderTable.get_item(**{
        'OrderID': oid
    })
    if not order:
        abort(404)
    if not request.json:
        abort(400)
    if 'Qty' in request.json and type(request.json['Qty']) is not int:
        abort(400)
    if 'ProductID' in request.json and type(request.json['ProductID']) is not int:
        abort(400)

    order['Qty'] = request.json.get('Qty', order['Qty'])
    order['ProductID'] = request.json.get('ProductID', order['ProductID'])
    order['DateModified'] = time.time()
    order.save()
    return jsonify({'order': dict(order)})

@app.route('/orders/<oid>', methods=['DELETE'])
#@auth.login_required
def delete_order(oid):
    order = orderTable.get_item(**{
        'OrderID': oid
    })
    if not order:
        abort(404)
    orderTable.delete_item(**{
        'OrderID': oid
    })
    return jsonify({"reslult":True})






if __name__ == '__main__':

    app.run(port=5000, debug=True)
