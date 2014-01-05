'use strict';


// Declare app level module which depends on filters, and services
var muvedoApp = angular.module('muvedoApp', ['muvedoApp.filters', 'muvedoApp.docsSimpleDirective', 'myApp.services', 'myApp.directives', 'ui.bootstrap' ]).
  config(['$routeProvider', function($routeProvider, $location) {
    $routeProvider.when('/home/:route_message', {templateUrl: 'partials/home.html', controller: homeCtrl});
    // $routeProvider.when('/artists', {templateUrl: 'partials/artists.html', controller: artistsCtrl});
    $routeProvider.when('/artist/:artist_name', {templateUrl: 'partials/artistprofile.html', controller: artistProfileCtrl});
    $routeProvider.when('/feed', {templateUrl: 'partials/social.html', controller: socialCtrl});
    $routeProvider.when('/muvedotv', {templateUrl: 'partials/muvedotv.html', controller: muvedotvCtrl});
    $routeProvider.when('/events', {templateUrl: 'partials/events.html', controller: eventsCtrl});
    $routeProvider.when('/join', {templateUrl: 'partials/join.html', controller: joinCtrl});
    $routeProvider.otherwise({redirectTo: '/home/'});
  }]);


muvedoApp.run(function($rootScope, $http, $location, $timeout){

    $rootScope.check_for_user = function () {
        var muvedo_url= $location.url()
        var split_url = muvedo_url.split('/')
        var artist_name = split_url[2]

        $rootScope.access_trigger;
        $rootScope.artist_dashboard = false
        $rootScope.hide_non_user_tools = false
        $http.get('/accesscontrol/checkuser').success(function(data){
            if (data.message === 'no'){
                $rootScope.access_trigger = 'login'
                $('#access_trigger_a').attr('href', '/')
                $rootScope.profile_url = host + '/'
            }else{
                $rootScope.hide_non_user_tools = true
                if (artist_name === data.message.user_name){
                    $rootScope.artist_dashboard = true
                }
                $rootScope.access_trigger = 'logout'
                $('#access_trigger_a').attr('href', host+'/accesscontrol/logoutmember')
                $rootScope.profile_url = host + '/app/index.html#/artist/' + data.message.user_name
                $rootScope.root_artist_name = data.message.user_name
                $rootScope.root_user_id = data.message.user_id
            }
        })
    }

    $rootScope.check_for_user()
  })  