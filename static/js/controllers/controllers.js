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
  $scope.login_message = false;
  $scope.join_message = false;

  $scope.login_member = {username:'', password:''}
  $scope.join_data = {name:'', email:'', password:'', member_type:'artist'}



  $scope.login_member_form = function(){

    var validate_form = $scope.validate_login.$valid;
    console.log('form clicked')
    console.log(validate_form)
    if (validate_form === false){
        $scope.login_message = 'your input is not valid'
    }else{
        $http.post('/accesscontrol/loginmember', $scope.login_member).success(function(data){
          var message = data.message
          console.log(message)
          if (message === false){
            $scope.login_message = 'Sorry Email or Password do not match'
          }else{
            alert('yea!!! login')
            // $location.path('/'+ message.path + '/' + message.username)
            ///window.location = host + '/accesscontrol/redirectuser' 
            //$scope.check_for_user();
          }
        })
    }
  }


  $scope.join_form = function(){
    if(!$scope.join_data.name){
      $scope.join_message = 'user name is required'
      return
    }else if(!$scope.join_data.email){
      $scope.join_message = 'email is required'
      return
    }else if(!$scope.join_data.password){
      $scope.join_message = 'password is required'
      return
    }else{
      //post form
      $http.post('/accesscontrol/join', $scope.join_data).success(function(data){
        console.log(data);
        var message = data.message;
        if(message === true){
          alert('yea created')
            //$location.path('/home/' + "Thanks for joining Muvedo. Please Login!")
          }else{
            console.log(message[0])
            if (message[0] === 'name'){
              $scope.join_message = 'Ohh shit! This Username is taken.'
              return
            }

            if (message[0] === 'auth_id'){
              $scope.join_message = 'Ohh shit! This Email is Taken.'
            }
  
          }
      })
      //end post form
    }
  }







}

function socialCtrl($scope){}

function artistsCtrl($scope){}

function muvedotvCtrl($scope){}








