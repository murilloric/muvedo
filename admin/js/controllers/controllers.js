'use strict';

var host = window.location.hostname;
if ((host === 'localhost')) {
  host = 'http://' + host + ':8082';
} else {
  host = 'http://' + host;
}




/* Controllers */


function homeCtrl($scope, $http, $routeParams, $location, $timeout) {
  console.log('admin home')
  $scope.admin_tabs = [
    { title:"Artist", content:"Dynamic content 1" }
  ]


}








