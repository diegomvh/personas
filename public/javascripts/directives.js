'use strict';

/* Directives */

var directives = angular.module('myApp.directives', []);

directives.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}]);

directives.directive('helloMaps', function () {
    return function (scope, elem, attrs) {
        var mapOptions,
            latitude = attrs.latitude,
            longitude = attrs.longitude,
            map;

        latitude = latitude && parseFloat(latitude, 10) || -43.822;
        longitude = longitude && parseFloat(longitude, 10) || -68.362;

        mapOptions = {
            zoom: 7,
            center: new google.maps.LatLng(latitude, longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(elem[0], mapOptions);
    };
});
