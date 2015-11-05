console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
// var doc = require('dynamodb-doc');
// var dynamo = new doc.DynamoDB();
var applicationSalt = "XXX";
var crypto = require('crypto');

exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

    var tableName = "FireCrackerUsers";
    var username = event.username;
    var password = event.password;
    
    
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
                password = crypto.createHash('sha1').update(password + applicationSalt + data.Item.token.S).digest('hex');
                console.log('Given ' + password + ', db:' + pass);
                if (pass == password){
                    
                    //Give the token and the level
                    //At this point we have the token so we get the token data
                    
                    dynamodb.getItem({
                    "Key": {"token" : data.Item.token},
                    "TableName": "FireCrackerTable"
                    }, function(err, tokenData) {
                        if (err) {
                            context.fail('Incorrect username or password');
                        } else {
                            console.log('Dynamo Success: ' + JSON.stringify(tokenData, null, '  '));
                            //assert tokenData.username == username
                            if (tokenData.Item.username.S != username){
                                context.fail('Incorrect username or password');
                            }
                            
                            //ok we got the token stuff now
                            //we want the token to store as a cookie 
                            //the current score
                            //and the current level
                            var returnResults = {
                                "token" : tokenData.Item.token,
                                "level" : tokenData.Item.level,
                                "score" : tokenData.Item.score
                            }
                            context.succeed(returnResults);
                        }   
                    });
                }else{
                    context.fail('Incorrect username or password');
                }
            }
        }
    });
}