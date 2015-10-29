app.controller('ProductController', ['$scope', '$resource', '$location', '$window', function($scope, $resource, $location, $window){

  var getPass = $resource('https://2o25vxsrq3.execute-api.ap-northeast-1.amazonaws.com/Test/password:pass', {pass:'@ps'});
  $scope.tryPass = '';

  $scope.getLevel = function() {


	var car = getPass.get({password:$scope.tryPass})
	.$promise.then(function(response){
		if (response.Item){
			console.log(response.Item.level.S);
		}
	});
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




