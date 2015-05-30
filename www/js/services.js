angular.module('ionic-http-auth.services', ['http-auth-interceptor'])
.factory('AuthenticationService', function($rootScope, $http, authService, localStorageService) {
  var service = {
    login: function(user) {
      $http.post('https://login', { user: user }, { ignoreAuthModule: true })
      .success(function (data, status, headers, config) {

    	$http.defaults.headers.common.Authorization = data.authorizationToken;  // Step 1
    	// A more secure approach would be to store the token in SharedPreferences for Android, and Keychain for iOS
      localStorageService.set('authorizationToken', data.authorizationToken);
        
    	// Need to inform the http-auth-interceptor that
        // the user has logged in successfully.  To do this, we pass in a function that
        // will configure the request headers with the authorization token so
        // previously failed requests(aka with status == 401) will be resent with the
        // authorization token placed in the header
        authService.loginConfirmed(data, function(config) {  // Step 2 & 3
          config.headers.Authorization = data.authorizationToken;
          return config;
        });
      })
      .error(function (data, status, headers, config) {
        $rootScope.$broadcast('event:auth-login-failed', status);
      });
    },
    logout: function(user) {
      $http.post('https://logout', {}, { ignoreAuthModule: true })
      .finally(function(data) {
        localStorageService.remove('authorizationToken');
        delete $http.defaults.headers.common.Authorization;
        $rootScope.$broadcast('event:auth-logout-complete');
      });			
    },	
    loginCancelled: function() {
      authService.loginCancelled();
    }
  };
  return service;
})
