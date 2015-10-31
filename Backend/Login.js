console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
// var doc = require('dynamodb-doc');
// var dynamo = new doc.DynamoDB();
var applicationSalt = "ASIjGHRr7wYBQPp";
var crypto = require('crypto');

exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

    var tableName = "FireCrackerUsers";
    var username = event.username;
    var password = event.password;
    
    password = crypto.createHash('sha1').update(password + applicationSalt).digest('hex');
    
    dynamodb.getItem({
    "Key": 
        {
            "username" :{'S' : username}
        },
    "TableName": tableName
    }, function(err, data) {
        if (err) {
            context.fail('Incorrect username or password');
        } else {
            console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
            if (typeof data.Item == 'undefined' || typeof data.Item.password == 'undefined' ){
                context.fail('Incorrect username or password');
            }else{
                var pass = data.Item.password.S;
                console.log('Given ' + password + ', db:' + pass);
                if (pass == password){
                    data.Item.token.S = '7' + data.Item.token.S;
                    context.succeed(data.Item.token);
                }else{
                    context.fail('Incorrect username or password');
                }
            }
        }
    });
}