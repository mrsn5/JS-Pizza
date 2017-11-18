/**
 * Created by sannguyen on 18.11.17.
 */

var Pizza_Order = require('./pizza/PizzaOrder');

var map;
function initialize() {
    var mapProp = {
        center: new google.maps.LatLng(50.464379, 30.519131),
        zoom: 15
    };
    var html_element = document.getElementById("googleMap");
    map = new google.maps.Map(html_element, mapProp);

    // Marker pizza
    var point = new google.maps.LatLng(50.464379, 30.519131);
    var marker = new google.maps.Marker({
        position: point,
        map: map,
        icon: "assets/images/map-icon.png"
    });


    google.maps.event.addListener(map, 'click', function (me) {
        var coordinates = me.latLng;
        geocodeLatLng(coordinates, function (err, adress) {
            if (!err) {
                Pizza_Order.setAdress(adress);
                setMarker(coordinates);
            } else {
                console.log("Can't find adress")
            }
        });
    });
}

function geocodeLatLng(latlng, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var adress = results[1].formatted_address;
            callback(null, adress);
        } else {
            callback(new Error("Can't find adress"));
        }
    });
}

function geocodeAddress(adress, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': adress}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            var coordinates = results[0].geometry.location;
            callback(null, coordinates);
        } else {
            callback(new Error("Can not find the adress"));
        }
    });
}

function getFullAddress(adress, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': adress}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            var adress = results[0];
            callback(null, adress);
        } else {
            callback(new Error("Can not find the adress"));
        }
    });
}

function calculateRoute(A_latlng, B_latlng, callback) {
    var directionService = new google.maps.DirectionsService();
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var leg = response.routes[0].legs[0];
            console.log(leg.duration.text);
            callback(null, leg.duration.text);
        } else {
            callback(new Error("Cannot find direction"));
        }
    });
}

// Home marker
var homeMarker = null;
function setMarker(coordinates) {
    if (homeMarker) {
        homeMarker.setMap(null);
        homeMarker = null;
    }

    console.log(coordinates);

    homeMarker = new google.maps.Marker({
        position: coordinates,
        map: map,
        icon: "assets/images/home-icon.png"
    });
}


exports.initialize = initialize;
exports.geocodeAddress = geocodeAddress;
exports.setMarker = setMarker;
exports.calculateRoute = calculateRoute;
exports.geocodeLatLng = geocodeLatLng;