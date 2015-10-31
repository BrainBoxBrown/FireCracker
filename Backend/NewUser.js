console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();


exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));
    
    
    var tableName = "FireCrackerUsers";
    var username = event.username;
     dynamodb.getItem({
    "Key": 
        {
            "username" :{'S' : username}
        },
    "TableName": tableName
    }, function(err1, data1) {
        if (err1) {
            context.fail('Umm shit');
        } else {
            if (typeof data1.Item == 'undefined'){
                
                
                var applicationSalt = "XXXXXXXXXXX";
                var crypto = require('crypto');
                var token = crypto.randomBytes(64).toString('hex');
                
                
                
                //If there is no user allready ***
                //then add the user ***
                
                var password = event.password;
                
                password = crypto.createHash('sha1').update(password + applicationSalt).digest('hex');
                //validate password
                
                var email = ' ';
                var zid = ' ';
                var careerInterest = 'false';
                var isUnsw = 'false';
                
                if (typeof event.email != 'undefined'){
                    email = event.email;
                }
                if (typeof event.zid != 'undefined' && event.zid.match(/[z][0-9]{7}/)){
                    zid = event.zid;
                }
                if (typeof event.careerInterest != 'undefined'){
                   careerInterest = event.careerInterest;
                }
                if (typeof event.isUnsw != 'undefined'){
                    isUnsw = event.isUnsw;
                }
                
                
                
                dynamodb.putItem({
                     "TableName": tableName,
                        "Item":{
                            "username":{"S":username},
                            "password":{"S":password},
                            "email":{"S":email},
                            "zid":{"S":zid},
                            "careerInterest":{"S":careerInterest},
                            "isUnsw":{"S":isUnsw},
                            "token":{"S":token}
                    }
                }, function(err2, data2) {
                    if (err2) {
                        context.done('error','putting item into dynamodb failed: '+err2);
                    }
                    else {
                        console.log('great success: '+JSON.stringify(data2, null, '  '));
                        
                        //Finaly put the token in the main database
                        dynamodb.putItem({
                         "TableName": "FireCrackerTable",
                            "Item":{
                                "token":{"S":token}
                            }
                        }, function(err3, data3) {
                            if (err3) {
                                context.done('error','putting item into dynamodb failed: '+err3);
                            }
                            else {
                                console.log('great success: '+JSON.stringify(data3, null, '  '));
                                context.succeed(token);
                            }
                        });
                        
                        
                        
                        
                    }
                });
                
                
                
            }else{
                context.fail('User exists');
            }
        }
    });
    
};