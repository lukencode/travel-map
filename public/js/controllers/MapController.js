angular.module('travelmap').controller('MapController',
	function MapController($scope) {
		var map;
		var markers = [];
		var geocoder;
		var placeService;

		var defaultRadius = 20000;
		var defaultTypes = ["amusement_park", "aquarium", "art_gallery", "bar", "cafe", "casino", "church", "city_hall", "hindu_temple", "mosque", "museum", "nightclub", "park", "place_of_worship", "stadium", "zoo"]

		$scope.name = "Europe Trip";
		$scope.description = "Woo holidays!";
		$scope.cities = [];

		$scope.search;
		$scope.isSearching = false;
		$scope.searchResults = [];

		$scope.metaExpanded = true;

		$scope.addCity = function(insertAfter) {
			$scope.metaExpanded = false;
			$scope.isSearching = true;
		};

		$scope.stopAddingCity = function () {
			$scope.isSearching = false;
			$scope.searchResults = [];
			$scope.search = "";
		};

		$scope.searchCity = function() {
			$scope.searchResults = [];

			geocoder.geocode( { 'address': $scope.search }, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {

					$scope.$apply(function () {
						for (var i = 0; i < results.length; i++) {
							$scope.searchResults.push(results[i]);
						}
					});
					
				} else {
					alert('Geocode was not successful for the following reason: ' + status);
				}
			});
		};

		$scope.selectCity = function(result) {
			$scope.stopAddingCity();

			var firstCity = $scope.cities.length == 0;
			var defaultTravelType = firstCity ? "none" : "direct";

			var city = {
				name: result.formatted_address,
				address: result.formatted_address,
				lat: result.geometry.location.lat(),
				lng: result.geometry.location.lng(),
				days: 1,
				activities: [],
				suggested_activites: [],
				travel: { type: defaultTravelType, description: "" },
				open:false
			};

			$scope.cities.push(city);
			addCityMarker(city, true);
			$scope.openCity(city);

			getCityActivities(city);
		};

		$scope.removeCity = function (city) {
			var index = $scope.cities.indexOf(city);
			$scope.cities.splice(index, 1);     

			drawMap();			
		};

		$scope.openCity = function (city) {
			for(var i = 0; i < $scope.cities.length; i++) {
				var isSelected = $scope.cities[i].name == city.name;

				if(isSelected) {
					$scope.cities[i].open = !$scope.cities[i].open
				} else {
					$scope.cities[i].open = false;
				}
			}
		};

		$scope.centerMap = function(latlng) {
			map.setCenter(latlng);			
		};

		function getCityActivities(city, keyword) {
			var request = {
				types: defaultTypes,
				radius: defaultRadius,
				keyword: keyword,
				location: new google.maps.LatLng(city.lat, city.lng)
			};

			placeService.nearbySearch(request, function(results, status) {
				console.log(results);

				for (var i = 0; i < results.length; i++) {
					var result = results[i];

					var markerIcon = new google.maps.MarkerImage(results[i].icon, null, null, null, new google.maps.Size(25, 25));
					var photo = results[i].photos && results[i].photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35})

					var marker = new google.maps.Marker({
						map: map,
						position: results[i].geometry.location,
						icon: photo || markerIcon,
						title: results[i].name
					});

					markers.push(marker);

					city.suggested_activites.push({
						place: results[i],
						photo: photo
					});
				}
			});
		};

		function addCityMarker(city, center) {
			var latlng = new google.maps.LatLng(city.lat, city.lng);

			if(center) {
				map.setCenter(latlng);
				map.setZoom(13);
			}

			drawMap();
		};

		function drawMap() {
			clearMarkers();

			for(var i = 0; i < $scope.cities.length; i++) {
				var latlng = new google.maps.LatLng($scope.cities[i].lat, $scope.cities[i].lng);

				var marker = new google.maps.Marker({
					map: map,
					position: latlng
				});

				markers.push(marker);
			}
		};

		function clearMarkers() {
			for (var i = 0; i < markers.length; i++ ) {
				markers[i].setMap(null);
			}

			markers = [];
		};

		function initMap() {
			geocoder = new google.maps.Geocoder();

			google.maps.visualRefresh = true;

			var mapOptions = {
				zoom: 8,
				center: new google.maps.LatLng(-34.397, 150.644),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

			placeService = new google.maps.places.PlacesService(map);

			//todo scale/hide markers
			//google.maps.event.addListener(map, 'zoom_changed', function() {
			//});
		};

		initMap();
	});