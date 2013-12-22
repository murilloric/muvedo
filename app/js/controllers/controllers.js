'use strict';

var host = window.location.hostname;
if ((host === 'localhost')) {
  host = 'http://' + host + ':8082';
} else {
  host = 'http://' + host;
}




/* Controllers */



function memberCtrl($scope, $http) {
  $scope.member_button = true;
  $scope.member_form = false;
  $scope.member_enter = function(){
    $scope.member_button = false;
    $scope.member_form = true;
  }
}

function homeCtrl($scope, $http, $routeParams, $location, $timeout) {

  $scope.host = '/app/index.html#';

  $scope.route_message = $routeParams.route_message;
  if ($scope.route_message === 'Thanks for joining Muvedo. Please Login!'){
      $scope.show_route_message = true;
  }else{
    $scope.show_route_message = false;
  }

  $scope.trigger_route_message = function(route_message, status){
    $scope.show_route_message = status;
    $scope.route_message = route_message;
    $timeout(function(){
        $scope.trigger_route_message('ddd', false)
    }, 3000);
  }


  $scope.login_member = {username:'', password:''}

  $scope.login_member_form = function(){
    var validate_form = $scope.validate_login.$valid;
    if (validate_form === false){
        $scope.trigger_route_message('your input is not valid', true)
    }else{
        $http.post('/accesscontrol/loginmember', $scope.login_member).success(function(data){
          var message = data.message
          if (message === false){
            $scope.trigger_route_message('Sorry Email or Password do not match', true)
          }else{
            // $location.path('/'+ message.path + '/' + message.username)
            window.location = host 
            $scope.check_for_user();
          }
        })
    }
  }

// handle login button
  $scope.member_button = true;
  $scope.member_form = false;
//handler login button

}

function socialCtrl($scope){}

function artistsCtrl($scope){}

function muvedotvCtrl($scope){}








