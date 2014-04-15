'use strict';

/* Directives */




angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])

angular.module('muvedoApp.docsSimpleDirective', [])
  .controller('Ctrl', function($scope) {
  	alert('sht')
    $scope.customer = {
      name: 'Naomi',
      address: '1600 Amphitheatre'
    };
  })
  .directive('myCustomer', function() {
    return {
      templateUrl: 'http://' + location.host + '/app/template/muvedo/new_artist.html'
    };
  });

