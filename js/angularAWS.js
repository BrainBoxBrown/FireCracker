angular.module('ProductApp').factory('AWSmaker', ['$http', function($http) {
   return {
      reachCognito: function(authData) {
      	console.log('kittens')
         $http.post('http://localhost:8888/simpleapi/aws', {
            'UserIDFromAngularApp': authData.uid,
         });
      }
}}]);