console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

var levelToStatus = [
    "n00b",
    "New Starters",
    "Thought Followers",
    "Seasoned Employees",
    "Computer Whisperers",
    "Thought Leaders",
    "Middle Management Types",
    "1337 H4)(0r$",
    "Innovation Sherpas",
    "VPs of Pwnage",
    "Cloud Excellence Officers",
    "Chief Visionary Officers",
    "Chairs of the Baud"
    ];


exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

    var tableName = "FireCrackerTable";
    
    dynamodb.scan({"TableName": tableName},
    function(err, data) {
        if (err) {
            context.fail('Incorrect username or password');
        } else {
            console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
            var results = [];
            for (var index in data.Items){
                var user = data.Items[index];
                
                //Filter out the good bits
                var userData = {
                    "username": user.username.S,
                    "score"  : Number(user.score.N),
                    "level" : levelToStatus[Number(user.level.N)]
                };
                
                //push it to the results
                results.push(userData);
            }
            
            //finally send the results
            context.succeed({"board" : results});
        }
    });
}