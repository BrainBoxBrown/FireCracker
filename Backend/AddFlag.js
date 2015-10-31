console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var flagSalt = "bJppymeUtB";
var crypto = require('crypto');

exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

    var tableName = "FireCrackerFlags";
    var hashedFlag = crypto.createHash('sha1').update(event.flag + flagSalt).digest('hex');
    var token = '';
    var auth = false;
    if (typeof event.token != 'undefined'){
        auth = true;
        token = event.token;
    }
    
    dynamodb.getItem({
    "Key":{"flag" :{'S' : hashedFlag}},
    "TableName": tableName
    }, function(err1, flagData) {
        if (err1) {
            context.fail('Failed to retrieve flag');
        } else {
            
            //This is a valid flag
            //If they are unauthenticated then just give the value of the flag
            if (!auth){
                context.succeed(flagData.Item.points.N);
            }else {
                //They have given a token so now we
                //check that this user exists and then update their data
                dynamodb.getItem({
                "Key":{"token" :{'S' : token}},
                "TableName": "FireCrackerTable" //The table with the tokens
                }, function(err2, data2) {
                    if (err2) {
                        context.fail('Failed to find user');
                    } else {
                        //Put it in their inventory of flags
                        //if they alreadyhave this flag then nothing changes
                        
                        if (typeof data2.Item.flags != 'undefined'){
                            //Append the new flag to the data
                            var found = false;
                            for (var flag in data2.Item.flags.L){
                                if (data2.Item.flags.L[flag].M.flag.S === flagData.Item.flag.S){
                                    //this is a flag you already have
                                    console.log("They already own this flag. Updating");
                                    data2.Item.flags.L[flag].M.category.S = flagData.Item.category.S;
                                    data2.Item.flags.L[flag].M.points.N = flagData.Item.points.N;
                                    found = true;
                                    break;
                                }
                            }
                            if (!found){
                                //The format is probably going to suffer but we'll see how it pans out
                                data2.Item.flags.push(flagData);
                            }
                            
                            
                        }else{
                            //This is their first flag
                            //make a new array with the new flag
                            console.log('this is a fist flag for someone');
                            data2.Item.flags  = {"L": []};
                            data2.Item.flags.L.push({"M":flagData.Item});
                            
                        }
                        
                        
                        console.log('Current situation:'+JSON.stringify(data2, null, '  '));
                        //Now update the points
                        var score = 0;
                        for (var capFlag in data2.Item.flags.L){
                            score += data2.Item.flags.L[capFlag].M.points.N*1;
                        }
                        
                        
                        
                        data2.Item.score = {"N" : score.toString()};
                        
                        
                        
                        //Finaly update the user's flag data
                        dynamodb.putItem({
                            "TableName": "FireCrackerTable",
                            "Item": data2.Item
                        }, function(err3, data3) {
                            if (err3) {
                                console.log('so this is where we meet ' + err3);
                                context.done('error','putting item into dynamodb failed: '+err3);
                            }
                            else {
                                context.succeed(score);
                            }
                        });
                
                    }
                });
            }
        }
    });
}