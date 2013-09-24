'use strict';


// Declare app level module which depends on filters, and services
angular.module('travelmap', ['travelmap.filters', 'travelmap.services', 'travelmap.directives']).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {templateUrl: 'public/partials/home.html', controller: 'HomeController'});
	$routeProvider.when('/map', {templateUrl: 'public/partials/map.html', controller: 'MapController'});
	$routeProvider.otherwise({redirectTo: '/home'});
}]);