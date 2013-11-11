'use strict';

// Declare app level module which depends on filters, and services
var padron = angular.module('Padron', ['Padron.filters', 'Padron.services', 'Padron.directives']);

padron.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    //$routeProvider.when('/view1', {templateUrl: 'partial/1', controller: MyCtrl1});
    //$routeProvider.when('/view2', {templateUrl: 'partial/2', controller: MyCtrl2});
    //$routeProvider.otherwise({redirectTo: '/view1'});
    $locationProvider.html5Mode(true);
}]);

/* Zoom
0 a 3 por pais
4 a 5 por provincia
6 a 7 por departamento
8 a 14 por localidad
15 a 16 por zonas
17 a 18 por cuadra
19 en adelante se ve todo
*/
padron.zoomLevels = {
    country: [0, 3],
    administrative_area_level_1: [4, 5],
    administrative_area_level_2: [6, 7],
    locality: [8, 14],
    street_address: [18, 19]
}

padron.levelTypes = ["country", "administrative_area_level_1", "administrative_area_level_2", "locality", "street_address"];
padron.getZoomLevel = function(types) {
    for (var i = 0; i < this.levelTypes.length; i++){
        var type = this.levelTypes[i];
        if (types.indexOf(type) != -1)
            return this.zoomLevels[type];
    }
}

padron.zoomAddressLevel = 18;

// Icons
padron.charts_url = "http://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=";
padron.icons = {
    country: "%E2%80%A2|FE8E08",
    administrative_area_level_1: "%E2%80%A2|FFEF66",
    administrative_area_level_2: "%E2%80%A2|01BF00",
    locality: "%E2%80%A2|6C97FF",
    street_address: "%E2%80%A2|BBE4FF"
}

padron.buildIcons = function() {
    this.icons.country = new google.maps.MarkerImage(this.charts_url  + this.icons.country);
    this.icons.administrative_area_level_1 = new google.maps.MarkerImage(this.charts_url + this.icons.administrative_area_level_1);
    this.icons.administrative_area_level_2 = new google.maps.MarkerImage(this.charts_url + this.icons.administrative_area_level_2);
    this.icons.locality = new google.maps.MarkerImage(this.charts_url + this.icons.locality);
    this.icons.street_address = new google.maps.MarkerImage(this.charts_url + this.icons.street_address);
}

padron.getIcon = function(types) {
    for (var i = 0; i < this.levelTypes.length; i++){
        var type = this.levelTypes[i];
        if (types.indexOf(type) != -1)
            return this.icons[type];
    }
}


