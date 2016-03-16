'use strict';

angular.module('main', [
  'ngRoute',
  'ngCookies',
  'ngMaterial',
  'oks'
])

.constant('INSTANCE_URL', 'http://localhost')

.constant('APP_API_KEY', '837d4c936a7d41830afd45690d8b2b164535f71b6fd694be6fc947105968b489')

.run([
  '$cookies', 'APP_API_KEY', '$http', '$rootScope', '$window',

  function ($cookies, APP_API_KEY, $http, $rootScope, $window) {
    $http.defaults.headers.common['X-Dreamfactory-API-Key'] = APP_API_KEY;
    $http.defaults.headers.common['X-DreamFactory-Session-Token'] = $cookies.session_token;
  }
])


// Config - configure applicaiton routes and settings
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
// Authentication interceptor. Executes a function everytime before sending any request.
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

			// If status is 401 or 403 with token blacklist error then redirect to login 
			if (result.status === 401 || (result.status === 403 && result.data.error.message.indexOf('token') > -1)) {
				$location.path('/login');	
			} 

			var $mdToast = $injector.get('$mdToast');
			$mdToast.show($mdToast.simple().content('Error: ' + result.data.error.message));

			return $q.reject(result);
      }
    }
  }
]);




