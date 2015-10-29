app.config(['$routeProvider', function($routeProvider){

	$routeProvider.when('/',{
		controller: "ProductController",
		templateUrl: 'Templates/home.html'
	}).
	otherwise({
		controller: 'ProductController',
		templateUrl: 'Templates/home.html'
	});
}]);

