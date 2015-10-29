var express    = require('express');
var app        = express();
var router     = express.Router();
var bodyParser = require('body-parser');
var AWS        = require('aws-sdk');
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
// Only use the below settings to make it easy on your local, development machines.
// You will want to better prep your settings for distribution
 
// AWS.config.loadFromPath('./config.json');
AWS.config.region = 'us-east-1';
 
app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Content-Type");
 next();
});
 
router.route('/aws')
.post(function(req, res) {
   if(req.body.UserIDFromAngularApp) {
      var cognitoidentity = new AWS.CognitoIdentity();
      var params = {
         IdentityPoolId: 'ap-northeast-1:d63ce073-fa14-4d8a-8e29-1ec0f7a1019c'
      };
      cognitoidentity.getOpenIdTokenForDeveloperIdentity(params, function(err, data) {
         if (err) { console.log(err, err.stack); res.json({failure: 'Connection failure'}); }
         else {
            console.log(data); // so you can see your result server side
            res.json(data); // send it back
         }
      });
   }	
   else { res.json({failure: 'Connection failure'}); }
});

 
app.use('/simpleapi', router);
var apiPort = process.env.PORT || 8888;
app.listen(apiPort);
console.log('Port ' + apiPort + ' is a go.');

