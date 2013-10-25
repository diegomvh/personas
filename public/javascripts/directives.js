'use strict';

/* Directives */

/* 0 a 3 por pais
4 a 5 por provincia
6 a 7 por departamento
8 a 14 por localidad
15 a 16 por zonas
17 a 18 por cuadra
19 en adelante se ve todo
*/

var NIVELES = {
    pais: [0, 3],
    provincia: [4, 5],
    departamento: [6, 7],
    localidad: [8, 14],
    domicilio: [19, 21]
}

var directives = angular.module('Personas.directives', []);

directives.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}]);

directives.directive("appMap", function ($http) {
    return {
        restrict: "E",
        replace: true,
        template: "<div></div>",
        scope: {
            center: "=",        // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
            markers: "=",       // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
            width: "@",         // Map width in pixels.
            height: "@",        // Map height in pixels.
            zoom: "@",          // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
            mapTypeId: "@",     // Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
            panControl: "@",    // Whether to show a pan control on the map.
            zoomControl: "@",   // Whether to show a zoom control on the map.
            scaleControl: "@"   // Whether to show scale control on the map.
        },
        link: function (scope, element, attrs) {
            var toResize, toCenter;
            var map;
            var markers;
            var markerManager;
            
            // listen to changes in scope variables and update the control
            var arr = ["width", "height", "markers", "mapTypeId", "panControl", "zoomControl", "scaleControl"];
            for (var i = 0, cnt = arr.length; i < arr.length; i++) {
                scope.$watch(arr[i], function () {
                    cnt--;
                    if (cnt <= 0) {
                        updateControl();
                    }
                });
            }

            // update zoom and center without re-creating the map
            scope.$watch("zoom", function () {
                if (map && scope.zoom)
                    map.setZoom(scope.zoom * 1);
            });
            scope.$watch("center", function () {
                if (map && scope.center)
                    map.setCenter(getLocation(scope.center));
            });

            // update the control
            function updateControl() {

                // update size
                if (scope.width) element.width(scope.width);
                if (scope.height) element.height(scope.height);

                // get map options
                var options =
                {
                    center:  new google.maps.LatLng(scope.center.lat, scope.center.lon),
                    zoom: 7,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                if (scope.center) options.center = getLocation(scope.center);
                if (scope.zoom) options.zoom = scope.zoom * 1;
                if (scope.mapTypeId) options.mapTypeId = scope.mapTypeId;
                if (scope.panControl) options.panControl = scope.panControl;
                if (scope.zoomControl) options.zoomControl = scope.zoomControl;
                if (scope.scaleControl) options.scaleControl = scope.scaleControl;
                
                // create the map
                map = new google.maps.Map(element[0], options);
                markerManager = new MarkerManager(map);

                // listen to changes in the center property and update the scope
                google.maps.event.addListener(map, 'center_changed', function () {

                    // do not update while the user pans or zooms
                    if (toCenter) clearTimeout(toCenter);
                    toCenter = setTimeout(function () {
                        if (scope.center) {
                            // check if the center has really changed
                            if (map.center.lat() != scope.center.lat ||
                                map.center.lng() != scope.center.lon) {

                                // update the scope and apply the change
                                scope.center = { lat: map.center.lat(), lon: map.center.lng() };
                                if (!scope.$$phase) scope.$apply("center");
                            }
                        }
                    }, 500);
                });
                google.maps.event.addListener(map, 'zoom_changed', function() {
                    var zoomLevel = map.getZoom();
                    var bounds = map.getBounds().toUrlValue();
                    var center = map.getCenter().toUrlValue();
                    // Nivel de Domicilio
                    if (zoomLevel >= NIVELES.domicilio[0]) {
                        $http.get('/api/geo/domicilios', {
                            params: { bounds: bounds, center: center }}).
                            success(function(data, status, headers, config) {
                                scope.addMarkers(data.objects, NIVELES.domicilio[0], NIVELES.domicilio[1]);
                            }).
                            error(function(data, status, headers, config) {
                                console.log(data, status, headers, config);
                            });
                    }
                    //console.log(zoomLevel, bounds, center);
                });
            }
            
            // add markers
            scope.addMarkers = function(locations, minZoom, maxZoom) {
                if (map && locations) {

                    // create new markers
                    markers = [];
                    if (angular.isString(locations)) locations = scope.$eval(locations);
                    for (var i = 0; i < locations.length; i++) {
                        var location = locations[i];
                        var loc = new google.maps.LatLng(location.location[0], location.location[1]);
                        var mm = new google.maps.Marker({ position: loc, title: location.descripcion });
                        markers.push(mm);
                    }
                    markerManager.addMarkers(markers, minZoom, maxZoom);

                    markerManager.refresh();
                }
            }

            // convert current location to Google maps location
            function getLocation(loc) {
                if (loc == null) return new google.maps.LatLng(40, -73);
                if (angular.isString(loc)) loc = scope.$eval(loc);
                return new google.maps.LatLng(loc.lat, loc.lon);
            }

            //google.maps.event.addListener(markerManager, 'loaded', function() {
            $http.get('/api/geo/paises').
                success(function(data, status, headers, config) {
                    scope.addMarkers(data.objects, 1, 3);
                }).
                error(function(data, status, headers, config) {
                    console.log(data, status, headers, config);
                });

            $http.get('/api/geo/provincias').
                success(function(data, status, headers, config) {
                    scope.addMarkers(data.objects, NIVELES.provincia[0], NIVELES.provincia[1]);
                }).
                error(function(data, status, headers, config) {
                    console.log(data, status, headers, config);
                });

            $http.get('/api/geo/departamentos').
                success(function(data, status, headers, config) {
                    scope.addMarkers(data.objects, NIVELES.departamento[0], NIVELES.departamento[1]);
                }).
                error(function(data, status, headers, config) {
                    console.log(data, status, headers, config);
                });

            $http.get('/api/geo/localidades').
                success(function(data, status, headers, config) {
                    scope.addMarkers(data.objects, 7, 14);
                }).
                error(function(data, status, headers, config) {
                    console.log(data, status, headers, config);
                });
            //});
        }
    };
});
