'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('Personas', ['Personas.filters', 'Personas.services', 'Personas.directives']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partial/1', controller: MyCtrl1});
    $routeProvider.when('/view2', {templateUrl: 'partial/2', controller: MyCtrl2});
    //$routeProvider.otherwise({redirectTo: '/view1'});
    $locationProvider.html5Mode(true);
}]);