'use strict';


// Declare app level module which depends on filters, and services
var muvedoAdmin = angular.module('muvedoAdmin', ['muvedoAdmin.filters', 'muvedoAdmin.docsSimpleDirective', 'muvedoAdmin.services', 'muvedoAdmin.directives', 'ui.bootstrap', 'ui.bootstrap.tabs' ]).
  config(['$routeProvider', function($routeProvider, $location) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: homeCtrl});
    $routeProvider.otherwise({redirectTo: '/home/'});
  }]);
