'use strict';

/* Directives */

var directives = angular.module('Padron.directives', []);

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
            
            // Build icons
            padron.buildIcons();

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
                    if (zoomLevel >= padron.zoomAddressLevel) {
                        $http.get('/api/geo/domicilios', {
                            params: { bounds: bounds, center: center }}).
                            success(function(data, status, headers, config) {
                                scope.addMarkers(data.objects);
                            }).
                            error(function(data, status, headers, config) {
                                console.log(data, status, headers, config);
                            });
                    }
                    //console.log(zoomLevel, bounds, center);
                });
            }
            
            // add markers
            scope.addMarkers = function(locations) {
                if (map && locations) {

                    // create new markers
                    markers = {};
                    if (angular.isString(locations)) locations = scope.$eval(locations);
                    for (var i = 0; i < locations.length; i++) {
                        var location = locations[i];
                        var loc = new google.maps.LatLng(location.location[0], location.location[1]);
                        var zoom = padron.getZoomLevel(location.types);
                        
                        //Build marker
                        var marker = new google.maps.Marker({ 
                            position: loc,
                            map: map,
                            icon: padron.getIcon(location.types),
                            title: location.descripcion });
                        
                        //Bind click event
                        google.maps.event.addListener(marker, 'click', function() {
                            map.setZoom(8);
                            map.setCenter(this.getPosition());
                        });
                    
                        //Store marker
                        if (!(zoom in markers)) {
                            markers[zoom] = [ marker ];
                        } else {
                            markers[zoom].push(marker);    
                        }
                    }
                    for (var zoom in markers) {
                        var zoomRange = zoom.split(",");
                        var zoomRange = [ Number(zoomRange[0]), Number(zoomRange[1]) ];
                        markerManager.addMarkers(markers[zoom], zoomRange[0], zoomRange[1]);
                    }
                    
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
                    scope.addMarkers(data.objects);
                }).
                error(function(data, status, headers, config) {
                    console.log(data, status, headers, config);
                });

            $http.get('/api/geo/provincias').
                success(function(data, status, headers, config) {
                    scope.addMarkers(data.objects);
                }).
                error(function(data, status, headers, config) {
                    console.log(data, status, headers, config);
                });

            $http.get('/api/geo/departamentos').
                success(function(data, status, headers, config) {
                    scope.addMarkers(data.objects);
                }).
                error(function(data, status, headers, config) {
                    console.log(data, status, headers, config);
                });

            $http.get('/api/geo/localidades').
                success(function(data, status, headers, config) {
                    scope.addMarkers(data.objects);
                }).
                error(function(data, status, headers, config) {
                    console.log(data, status, headers, config);
                });
            //});
        }
    };
});
