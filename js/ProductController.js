app.controller('ProductController', ['$scope', '$resource', '$location', '$window', '$cookies', '$cookieStore', '$dialog',  function($scope, $resource, $location, $window, $cookies, $cookieStore,  $dialog){

  var getPass = $resource('https://2o25vxsrq3.execute-api.ap-northeast-1.amazonaws.com/Test/password:pass', {pass:'@ps'});
  var loginResource = $resource('https://2o25vxsrq3.execute-api.ap-northeast-1.amazonaws.com/Test/login:user:pass', {user:'@us', pass:'@pw'});
  $scope.userToken = $cookies['token'];
  $scope.loggedIn =  (typeof($scope.userToken) != "undefined" && 
  	$cookies['token'] != '' && 
  	$cookies['token'] != 'VlROU2RtTkRRbk5pTWpseVlWYzFia2xIUmpCSlJ6RTFTVWRPZG1JeWRIQmFXRTFMQ2c9PQo=');
  $scope.username = '';
  $scope.password = '';
  $scope.tryPass = '';
  $scope.noAuthPoints = 0;
  $scope.points = 0;
  $scope.pointsStatus = 0;
  $scope.signupPass = '';
  $scope.unswChecked = false; 


	$scope.showSignUp = function (){
    	$dialog.dialog({}).open('Templates/signupModal.html');  
	}

  $scope.getLevel = function() {
	getPass.get({password:$scope.tryPass})
	.$promise.then(function(response){
		if (response.Item){
			$scope.points = response.Item.points.N*1;
    	$scope.pointsStatus = 1;
		}else{
    	$scope.pointsStatus = 2;
		}
	});};

	$scope.showPoints = function() {
	getPass.get({password:$scope.tryPass})
	.$promise.then(function(response){
		if (response.Item && response.Item.points){
			$scope.noAuthPoints = response.Item.points.N*1; 
    	$scope.pointsStatus = 1;
		}else{
    	$scope.pointsStatus = 2;
		}
	});};

	$scope.login = function() {
	loginResource.get({username:$scope.username, password:$scope.password})
	.$promise.then(function(response){
		//set a cookie
		if (typeof(response.S) != "undefined"){
			$scope.userToken = response.S;
			$cookies['token'] = response.S;
			$scope.loggedIn =  (typeof($scope.userToken) != "undefined");
			$scope.username = '';
			$scope.password = '';
		}else{
			console.log(response)
		}
		
	});};

	$scope.logout = function() {
		$cookies['token'] = 'VlROU2RtTkRRbk5pTWpseVlWYzFia2xIUmpCSlJ6RTFTVWRPZG1JeWRIQmFXRTFMQ2c9PQo=';
		$scope.loggedIn = false;
		$scope.userToken = $cookies['token'];
  	$scope.tryPass = '';
    $scope.pointsStatus = 0;
	};


}]);







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




