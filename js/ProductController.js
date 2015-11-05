app.controller('ProductController', function($scope, $resource, $location, $window, $cookies, $cookieStore, $uibModal, $log){

  var getPass = $resource('https://2o25vxsrq3.execute-api.ap-northeast-1.amazonaws.com/Test/password:pass:tok', {pass:'@ps', tok:'@tk'});
  var loginResource = $resource('https://2o25vxsrq3.execute-api.ap-northeast-1.amazonaws.com/Test/login:user:pass', {user:'@us', pass:'@pw'});
  $scope.userToken = $cookies.get('token');
  $scope.loggedIn =  (typeof($scope.userToken) != "undefined" && 
	$cookies.get('token') != '' && 
	$cookies.get('token') != 'VlROU2RtTkRRbk5pTWpseVlWYzFia2xIUmpCSlJ6RTFTVWRPZG1JeWRIQmFXRTFMQ2c9PQo=');

  $scope.username = '';
  $scope.password = '';
  $scope.tryPass = '';
  $scope.noAuthPoints = 0;

  $scope.leaderboard = [
  		{
  			'username':'bob',
  			'score' : 6
  		},
  		{
  			'username':'bob2',
  			'score' : 5
  		},{
  			'username':'bob3',
  			'score' : 2
  		}
  	];

  var statusCodes = {
	"login" : 00,
	"start hacking" : 10,
	"no auth correct" : 11,
	"already owned" : 12,
	"correct minus" : 13,
	"correct" : 14,
	"correct plus" : 15,
	"incorrect" : 20,
	"no auth incorrect" : 21,
	"wrong login" : 30,
	"loading blue" : 40,
	"loading green" : 50,
	"loading orange" : 60,
	"loading red" : 70
  };
  $scope.statusCodes = statusCodes;

  /*
	* pointsStatus
	*******BLUE*******
	* 00 == login message

	*******GREEN*******
	* 10 == start hacking
	* 11 == your not logged in and this is right
	* 12 == you already own that flag
	* 13 == you got that flag right but you're not getting all the points
	* 14 == good work you get some points
	* 15 == you got it right and your exploring, bonus points

	*******ORANGE*******
	* 20 == fuck off that flag isn't legit
	* 21 == your not logged in and this is wrong


	*******RED*******
	* 30 == wrong password/username

	####################
	## ADD 40 - MOD10 ## Add 30 to the status code and whatever 
	## GIVES LOAD CLR ## the first digit is determines the loading colour
	####################
	* 4X == loading blue
	* 5X == loading green
	* 6X == loading orange
	* 7X == loading red
	*
	*/
	$scope.pointsStatus = statusCodes["login"];
	if ($scope.loggedIn){
		$scope.pointsStatus = statusCodes["start hacking"];
	}


  $scope.pointsEarned = 0;
  $scope.potentialPoints = 0;
  $scope.score = 0;
  $scope.level = 0;

  	//Only used in debuggings
	$scope.sw = function(){
		if ($scope.pointsStatus == 30){
			$scope.pointsStatus = 00;
		}else{
			$scope.pointsStatus = 30;
		}
	}

	$scope.getLevel = function(first) {

		$scope.pointsStatus += 40 - ($scope.pointsStatus%10); //turns it into a loading animation
		getPass.get({flag:$scope.tryPass, token:$cookies.get('token')})
		.$promise.then(function(response){
			if (response.score){
				console.log('yo wtf' + response);
				$scope.score = response.score.N*1;
				$scope.pointsEarned = response.pointsEarned.N*1;
				$scope.potentialPoints = response.potentialPoints.N*1;
				$scope.pointsStatus = statusCodes["correct"];
				if (response.alreadyOwned){
					$scope.pointsStatus = statusCodes["already owned"];
				}
				$scope.level = response.level.N*1;
			}else{
				$scope.pointsStatus = statusCodes["incorrect"];
			}
			if (first){
				$scope.pointsStatus = statusCodes["start hacking"];
			}
	});};

	$scope.showPoints = function() {
		$scope.pointsStatus += 40 - ($scope.pointsStatus%10); //turns it into a loading animation
		getPass.get({flag:$scope.tryPass})
		.$promise.then(function(response){
			if (response.N){
				console.log(response);
				$scope.noAuthPoints = response.N*1; 
				$scope.pointsStatus = statusCodes["no auth correct"];
			}else{
				$scope.pointsStatus = statusCodes["no auth incorrect"];
			}
	});};

	$scope.login = function() {

		$scope.pointsStatus += 40 - ($scope.pointsStatus%10); //turns it into a loading animation
		console.log($scope.pointsStatus);
		loginResource.get({username:$scope.username, password:$scope.password})
		.$promise.then(function(response){
		//set a cookie
		console.log(response);
			if (typeof(response) != "undefined"){
				$scope.userToken = response.token.S;
				console.log($cookies);
				$cookies.put('token', response.token.S);
				$scope.loggedIn =  (typeof($scope.userToken) != "undefined");
				$scope.score = response.score.N;
				$scope.username = '';
				$scope.password = '';
				$scope.pointsStatus = statusCodes["start hacking"];
			}else{
				$scope.pointsStatus = statusCodes["wrong login"];
			}
			
	}).catch(function(e) {
			$scope.pointsStatus = statusCodes["wrong login"];
	});};


	$scope.logout = function() {
		$cookies.put('token', 'VlROU2RtTkRRbk5pTWpseVlWYzFia2xIUmpCSlJ6RTFTVWRPZG1JeWRIQmFXRTFMQ2c9PQo=');
		$scope.loggedIn = false;
		$scope.userToken = $cookies['token'];
		$scope.tryPass = '';
		$scope.pointsStatus = 0;
	};




	$scope.animationsEnabled = true;


	$scope.open = function (size) {

	console.log($uibModal);

	 var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'Templates/signupModal.html',
				controller: 'SignupModalCtrl'
		});

		modalInstance.result.then(function (token) {
			$cookies.put('token', token);
			$scope.userToken = token;
			$scope.loggedIn =  (typeof($scope.userToken) != "undefined" && 
				$cookies.get('token') != '' && 
				$cookies.get('token') != 'VlROU2RtTkRRbk5pTWpseVlWYzFia2xIUmpCSlJ6RTFTVWRPZG1JeWRIQmFXRTFMQ2c9PQo=');
			console.log('token == ' + token);
			if ($scope.loggedIn){
				$scope.tryPass = 'loginFlag';
				$scope.getLevel(true);
				$scope.tryPass = '';
			}

		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.toggleAnimation = function () {
		$scope.animationsEnabled = !$scope.animationsEnabled;
	};


	//ON startup
	if ($scope.loggedIn){
		$scope.tryPass = 'loginFlag';
		$scope.getLevel(true);
		$scope.tryPass = '';
	}


});















app.controller('SignupModalCtrl', function ($scope, $uibModalInstance, $resource, $cookies) {

	var signupResource = $resource('https://2o25vxsrq3.execute-api.ap-northeast-1.amazonaws.com/Test/signup:user:pass:em:z:isU:ci', {user:'@us', pass:'@pw', em:'@em', z:'@zd', isU:'@iu', ci:'@ci'});
  $scope.signupUsername = '';
  $scope.signupPass1 = '';
  $scope.signupPass2 = '';
  $scope.unswChecked = 'false'; 
  $scope.careerInterest = 'false';
  $scope.email = '';
  $scope.zid = '';
  $scope.alertText = '';



  //This function is riddled with whitty easter eggs 

  $scope.ok = function () {
  	console.log($scope.email);
  	console.log($scope.signupUsername);

  	$scope.alertText = '';
  	var valid = true;

  	if (typeof $scope.email == 'undefined' || $scope.email.length <= 0){
  		$scope.alertText += 'That\'s not an email and you know it, fix that shit';
  		valid = false;
  	}

  	if ($scope.signupPass1 != $scope.signupPass2){
  		//Show alert
  		if (!valid){
  			$scope.alertText += " and your passwords don't match"
  		}else{
  			$scope.alertText += 'Passwords don\'t match, does that look a green tick to you? No, no it doesn\'t\n';
  		}

  		valid = false;
  	}

  	if ($scope.signupUsername.length <= 0){
  		//Show alert
  		if (!valid){
  			$scope.alertText += " and where the hell is your username you know you need one of those"
  		}else{
  			$scope.alertText += "There's not much point if you don't have a kick ass username";
  		}
  		
  		valid = false;
  	}

  	if ($scope.signupUsername.length > 32){
  		//Show alert
  		if (!valid){
  			$scope.alertText += " and your username, that's not cool either"
  		}else{
  			$scope.alertText += "So here's the deal, if you want a username longer than 32 characters, you're best bet is to man-in-the-middle the server. I'd personally use burp suite,";
  		}
  		
  		valid = false;
  	}

  	if ($scope.signupPass1.length <=0){
  		//Show alert
  		if (!valid){
  			$scope.alertText += " and where exactly is your password, you're meant to be good at security not shit"
  		}else{
  			$scope.alertText += "Lol you call yourself a security pro and where exactly is your password?";
  		}
  		
  		valid = false;
  	}
  	if ($scope.signupPass1.length <5){
  		//Show alert
  		if (!valid){
  			$scope.alertText += ", your password is like your hacking ability, non-existant"
  		}else{
  			$scope.alertText += "Pfffttt you call that a password, I'm telling Richard";
  		}
  		
  		valid = false;
  	}

  	if ($scope.signupPass1.length > 16){
  		$scope.alertText += "Password too good. Reporting to the  NSA.... lol jks your fine this isn't actually an error";
  	}

  	if (!valid){
  		return;
  	}

  	//This is Niels username, should do more eggs like this need common names
  	if ($scope.signupUsername == 'espes'){
  		$scope.alertText += "Hey Niel, how's things";
  	}




		//Do validation

	signupResource.get({
		username:$scope.signupUsername,
		password:$scope.signupPass1,
		email:$scope.email,
		zid:$scope.zid,
		isUnsw:$scope.unswChecked,
		careerInterest:$scope.careerInterest
	})
	.$promise.then(function(response){

		if (typeof(response.S) != "undefined"){
			//We have successfully created a new user
			//The token will be sent back as the response

			$uibModalInstance.close(response.S);
		}else{
			console.log(response);
  			//Show alert
  			$scope.alertText += 'Something is wrong, probs username is taken already, dunno really, server\'s just like \'yeah... nahhh\'';
  			return;

		}
		
	});

  };

  $scope.cancel = function () {
	 $uibModalInstance.dismiss('cancel');
  };
});






 //  	$scope.getPass = $resource('https://2o25vxsrq3.execute-api.ap-northeast-1.amazonaws.com/Test/password:password', {password:'@password'});
	// $scope.level = 0;
	// $scope.tryPass = ' ';
	// $scope.tryPass2 = ' ';

	// $scope.getLevel = function () {
	// 	$scope.tryPass2 = 'clicked';
	// 	// console.log('Calling get req');
	// 	// $scope.getPass.get({password:$scope.tryPass}, function(u, getResponseHeaders){
	// 	// 	console.log(getResponseHeaders);
	// 	// 	$scope.tryPass = 'Returned';
	// 	// });
	// };

// function getLevel(){

// 	console.log('Calling get req');

// 	//Make spinner visable

// 	getPass.get({password:$scope.tryPass}, function(u, getResponseHeaders){
// 		console.log(getResponseHeaders);
// 		$scope.tryPass = 'Returned'
// 	});
// };




