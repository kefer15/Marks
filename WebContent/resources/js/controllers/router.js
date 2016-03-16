'use strict';

angular.module('main', [
  'ngRoute',
  'ngCookies',
  'ngMaterial',
  'marks'
])

.constant('INSTANCE_URL', 'http://localhost:8081')

.constant('APP_API_KEY', '46090a3872590fcc97886b4c2a4c5d5a1b1f3af2b8fccb1327d4d7fad73160e7')

.run([
  '$cookies', 'APP_API_KEY', '$http', '$rootScope', '$window',

  function ($cookies, APP_API_KEY, $http, $rootScope, $window) {
    $http.defaults.headers.common['X-Dreamfactory-API-Key'] = APP_API_KEY;
    $http.defaults.headers.common['X-DreamFactory-Session-Token'] = $cookies.session_token;
  }
])

// Config - configure application routes and settings
.config([ 
  '$routeProvider', '$httpProvider', 'APP_API_KEY',
  
  function ($routeProvider, $httpProvider, APP_API_KEY) {
    $routeProvider
        .otherwise({
          redirectTo:'/'
        });

    $httpProvider.interceptors.push('httpInterceptor');
  }
])

// Executes a function everytime before sending any request.
.factory('httpInterceptor', [
  '$location', '$q', '$injector', 'INSTANCE_URL',

  function ($location, $q, $injector, INSTANCE_URL) {

    return {

      request: function (config) {

        // Append instance url before every api call
        if (config.url.indexOf('/api/v2') > -1) {
        	config.url = INSTANCE_URL + config.url;
        };
        // delete x-dreamfactory-session-token header if login
        if (config.method.toLowerCase() === 'post' && config.url.indexOf('/api/v2/user/session') > -1) {
        	delete config.headers['X-DreamFactory-Session-Token'];
        }

        console.log(config);

        return config;
      },
      responseError: function (result) {
			var $mdToast = $injector.get('$mdToast');
			$mdToast.show($mdToast.simple().content('Error: ' + result.data.error.message));

			return $q.reject(result);
      }
    }
  }
]);




