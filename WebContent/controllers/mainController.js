'use strict';

angular.module('oks', [
	'ngResource',
	'ngRoute',
	'ngMaterial'
])


.config([
	'$routeProvider',

	function ($routeProvider) {

		// Routes
		$routeProvider
			.when('/oks', {
		    	title    	: 'OKS',
		    	templateUrl	: 'views/main.html',
		    	controller 	: 'MainController' 
		    });

	}
])
.factory('View', [
	'$resource',
	
	function ($resource) {
		return $resource('/api/v2/mongodb/_table/View/:id', { id: '@id' }, {
			query: {
				method: 'GET',
				isArray: false
			}
		/*,
			create: {
				method: 'POST'
			},
			update: {
				method: 'PUT'
			},
			remove: {
				method: 'DELETE'
			}*/
		});
	}
])
.controller('MainController', [
	'$scope', '$location', '$route', '$q', '$filter', 'View',
	function ($scope, $location, $route, $q, $filter, View) {
		$scope.tableName = "";
		
		$scope.changeTable = function(option) {
			switch(option) {
				case 'view': $scope.tableName = "View";
					View.query({}).$promise.then(function (result) {
						console.log(JSON.stringify(result));
						
						$scope.contacts.push.apply($scope.contacts, result.resource);
					});
					break;
				case 'box': $scope.tableName = "Box";
					break;
				case 'element': $scope.tableName = "Element";
					break;
			}
		};
	}
]);