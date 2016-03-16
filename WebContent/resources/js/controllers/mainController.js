'use strict';

angular.module('marks', [
	'ngResource',
	'ngRoute',
	'ngMaterial'
])

.config([
	'$routeProvider',

	function ($routeProvider) {

		// Routes
		$routeProvider
			.when('/', {
		    	title    	: 'Main',
		    	templateUrl	: 'views/main.html',
		    	controller 	: 'MainController' 
		    })
		    .when('/addView', {
		    	title    	: 'AddView',
		    	templateUrl	: 'views/view.html',
		    	controller 	: 'ViewController' 
		    })
		    .when('/addProperty', {
		    	title    	: 'AddProperty',
		    	templateUrl	: 'views/property.html',
		    	controller 	: 'AddPropertyController' 
		    });

	}
])

/* FACTORIES*/
.factory('View', [
	'$resource',
	
	function ($resource) {
		console.log("This is resource " + JSON.stringify($resource));
		return $resource('/api/v2/mongodb/_table/View/:id', { id: '@id' }, {
			query: {
				method: 'GET',
				isArray: false
			},
			create: {
				method: 'POST'
			}
			/*,
			update: {
				method: 'PUT'
			},
			remove: {
				method: 'DELETE'
			}*/
		});
	}
])
.factory('Property', [
	'$resource',
	
	function ($resource) {
		
		return $resource('/api/v2/mongodb/_table/Property/:id', { id: '@id' }, {
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

/* CONTROLLERS */
.controller('MainController', [
	'$scope', '$location', '$route', '$q', '$filter', 'View', 'Property',
	function ($scope, $location, $route, $q, $filter, View, Property) {
		$scope.tableName = "";
		$scope.colLabels = [];
		$scope.colFields = [];
		$scope.data = [];
		
		$scope.changeTable = function(option) {
			switch(option) {
				case 'view':		$scope.tableName = "View";
									View.query({}).$promise.then(function (result) {
										$scope.colLabels = [ 'Pk Id' , 'Page View Id' , 'View Id' , 'Title' , 'Organization Id' , 'Visible Mobile' ,
										                     'General Model' , 'Last Changed By' , 'Last Changed Date' , 'Owner' , 'Puridiom View Id' ,
										                     'Page Type' , 'Sub Step' , 'View Group Id' , 'Full Browse' , 'Puridiom Process Id' ,
										                     'Document Type' , 'Enabled' ];
										$scope.colFields = [ 'pkId' , 'pageViewId' , 'viewId' , 'title' , 'organizationId' , 'visibleMobile' ,
										                     'generalModel' , 'lastChangedBy' , 'lastChangedDate' , 'owner' , 'puridiomViewId' ,
										                     'pageType' , 'subStep' , 'viewGroupId' , 'fullBrowse' , 'puridiomProcessId' ,
										                     'documentType' , 'enabled' ];
										$scope.data = result.resource;
									});
									break;
									
				case 'box': 		$scope.tableName = "Box";
					break;
					
				case 'element': 	$scope.tableName = "Element";
					break;
					
				case 'property': 	$scope.tableName = "Property";
									Property.query({}).$promise.then(function (result) {
										$scope.colLabels = [ 'Pk Id' , 'View Id' , 'Box Id' ,  'Label Id' , 'Element Type' , 'Element Property' ,
										                     'Element Value' , 'Property Order' , 'Enabled' , 'Owner' , 'Organization Id' ,
										                     'Last Changed By' , 'Last Changed Date' , 'Ic Rule' , 'Replace Property All Elements' ,
										                     'Document Type' , 'Html Tag Id' , 'Include Pages' ];
										$scope.colFields = [ 'pkId' , 'viewId' , 'boxId' ,  'labelId' , 'elementType' , 'elementProperty' ,
										                     'elementValue' , 'propertyOrder' , 'enabled' , 'owner' , 'organizationId' ,
										                     'lastChangedBy' , 'lastChangedDate' , 'icRule' , 'replacePropertyAllElements' ,
										                     'documentType' , 'htmlTagId' , 'includePages' ];
										$scope.data = result.resource;
									});
									break;
			}
		};
		
		$scope.addData = function() {
			switch($scope.tableName) {
				case "View" : 	$location.path('/addView');
								break;
				case "Box" : break;
				case "Element" : break;
				case "Property" :	$location.path('/addProperty');
									break;
			}
		};	
		
		$scope.removeData = function() {
			switch($scope.tableName) {
				case "View" : break;
				case "Box" : break;
				case "Element" : break;
				case "Property" : break;
			}
		};
		
		$scope.updateData = function() {
			switch($scope.tableName) {
				case "View" : break;
				case "Box" : break;
				case "Element" : break;
				case "Property" : break;
			}
		};
	}
])
.controller('ViewController', [
	'$scope', '$location', '$route', '$q', '$filter', 'View','$mdToast',
	function ($scope, $location, $route, $q, $filter, View, $mdToast) {
		$scope.view = {
				resource: [{
					
				}]
		};
		
		$scope.goBack = function() {
			$location.path('/');
		};
		
		$scope.save = function() {
			console.log("This is view " + JSON.stringify($scope.view));
			if ($scope.view.resource[0].pkId !== '') {
				View.create($scope.view).$promise.then(function () {
					$mdToast.show($mdToast.simple().content('View saved!'));
					$location.path('/');
				});
			}
		};
	}
])
.controller('AddPropertyController', [
	'$scope', '$location', '$route', '$q', '$filter', 'View', 'Property',
	function ($scope, $location, $route, $q, $filter, View, Property) {
		$scope.property = {};
		$scope.goBack = function() {
			$location.path('/');
		};	
	}
]);