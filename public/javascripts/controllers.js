'use strict';

/* Controllers */

function AppCtrl($scope, $http) {

    // current location
    $scope.loc = { lat: -43.822, lon: -68.362 };
    $scope.gotoCurrentLocation = function () {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var c = position.coords;
                $scope.gotoLocation(c.latitude, c.longitude);
            });
            return true;
        }
        return false;
    };
    $scope.gotoLocation = function (lat, lon) {
        if ($scope.lat != lat || $scope.lon != lon) {
            $scope.loc = { lat: lat, lon: lon };
            if (!$scope.$$phase) $scope.$apply("loc");
        }
    };

    // geo-coding
    $scope.search = "";
    $scope.geoCode = function () {
        if ($scope.search && $scope.search.length > 0) {
            if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
            this.geocoder.geocode({ 'address': $scope.search }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var loc = results[0].geometry.location;
                    $scope.search = results[0].formatted_address;
                    $scope.gotoLocation(loc.lat(), loc.lng());
                } else {
                    alert("Sorry, this search produced no results.");
                }
            });
        }
    };

    $http.get('/api/localidades').
        success(function(data, status, headers, config) {
            $scope.localities = data.objects;
        }).
        error(function(data, status, headers, config) {
            $scope.localities = [];
        });

    // some points of interest to show on the map
    // to be user as markers, objects should have "lat", "lon", and "name" properties
    var airports = [
        { "name": "Hartsfield Jackson Atlanta", "code": "ATL", "city": "Atlanta", "state": "GA", "lat": 33.64, "lon": -84.444, "vol2011": 44414121 },
        { "name": "O'Hare", "code": "ORD", "city": "Chicago", "state": "IL", "lat": 41.9794, "lon": -87.9044, "vol2011": 31892301 },
        { "name": "Los Angeles", "code": "LAX", "city": "Los Angeles", "state": "CA", "lat": 33.9425, "lon": -118.4081, "vol2011": 30528737 },
        { "name": "Dallas/Fort Worth", "code": "DFW", "city": "Dallas/Fort Worth", "state": "TX", "lat": 32.8974, "lon": -97.0407, "vol2011": 27518358 },
        { "name": "Denver", "code": "DEN", "city": "Denver", "state": "CO", "lat": 39.8631, "lon": -104.6736, "vol2011": 25667499 },
        { "name": "ATR @ 60180850", "code": "JFK", "city": "60180850", "state": "NY", "lat": 40.6438, "lon": -73.782, "vol2011": 23664830 },
        { "name": "San Francisco", "code": "SFO", "city": "San Francisco", "state": "CA", "lat": 37.6152, "lon": -122.39, "vol2011": 20038679 },
        { "name": "McCarran", "code": "LAS", "city": "Las Vegas", "state": "NV", "lat": 36.085, "lon": -115.1511, "vol2011": 19854759 },
        { "name": "Phoenix Sky Harbor", "code": "PHX", "city": "Phoenix", "state": "AZ", "lat": 33.4365, "lon": -112.0073, "vol2011": 19750306 },
        { "name": "George Bush", "code": "IAH", "city": "Houston", "state": "TX", "lat": 29.9867, "lon": -95.3381, "vol2011": 19306660 },
    ];
}

function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
