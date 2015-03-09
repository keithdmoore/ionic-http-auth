angular.module('ionic-http-auth.controllers', [])
.controller('AppCtrl', function($scope, $state, $ionicModal) {
   
  $ionicModal.fromTemplateUrl('templates/login.html', function(modal) {
      $scope.loginModal = modal;
    },
    {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true
    }
  );
  //Be sure to cleanup the modal by removing it from the DOM
  $scope.$on('$destroy', function() {
    $scope.loginModal.remove();
  });
})
  
.controller('LoginCtrl', function($scope, $http, $state, AuthenticationService) {
  $scope.message = "";
  
  $scope.user = {
    username: null,
    password: null
  };
 
  $scope.login = function() {
    AuthenticationService.login($scope.user);
  };

  $scope.$on('event:auth-loginRequired', function(e, rejection) {
    console.log('handling login required');
    $scope.loginModal.show();
  });
 
  $scope.$on('event:auth-loginConfirmed', function() {
	 $scope.username = null;
	 $scope.password = null;
     $scope.loginModal.hide();
  });
  
  $scope.$on('event:auth-login-failed', function(e, status) {
    var error = "Login failed.";
    if (status == 401) {
      error = "Invalid Username or Password.";
    }
    $scope.message = error;
  });
 
  $scope.$on('event:auth-logout-complete', function() {
    console.log("logout complete");
    $state.go('app.home', {}, {reload: true, inherit: false});
  });    	
})
 
.controller('HomeCtrl', function($rootScope, $scope, $timeout) {
})

.controller('CustomerCtrl', function($scope, $state, $http) {
    $scope.customers = [];
    
    $http.get('https://customers')
        .success(function (data, status, headers, config) {
            $scope.customers = data;
        })
        .error(function (data, status, headers, config) {
            console.log("Error occurred.  Status:" + status);
        });
})
 
.controller('LogoutCtrl', function($scope, AuthenticationService) {
    $scope.$on('$ionicView.enter', function() {
      AuthenticationService.logout();
    });
})