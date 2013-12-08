





'use strict';

var host = window.location.hostname;
if ((host === 'localhost') || (host == '127.0.0.1')) {
  host = 'http://' + host + ':8082';
} else {
  host = 'http://' + host;
}

console.log(host);




function joinCtrl($scope, $timeout, $http, $location){
	console.log('join');
  $scope.join_message = false
  $scope.display_join_message = function(msg){
    $scope.join_message = msg
    $timeout(function(){
      $scope.join_message = false
    },5000)
  }

  $scope.join_data = {name:'', email:'', password:'', member_type:'artist'}
  $scope.join_form = function(){
    if(!$scope.join_data.name){
      $scope.display_join_message('user name is required')
      return
    }else if(!$scope.join_data.email){
      $scope.display_join_message('email is required')
      return
    }else if(!$scope.join_data.password){
      $scope.display_join_message('password is required')
      return
    }else{
      //post form
      $http.post('/accesscontrol/join', $scope.join_data).success(function(data){
    		console.log(data);
    		var message = data.message;
    		if(message === true){
          	$location.path('/home/' + "Thanks for joining Muvedo. Please Login!")
        	}else{
            console.log(message[0])
            if (message[0] === 'name'){
              $scope.display_join_message('Ohh shit! This Username is taken.')
              return
            }

            if (message[0] === 'auth_id'){
              $scope.display_join_message('Ohh shit! This Email is Taken.')
            }
  
        	}
      })
      //end post form
    }
  }



}
