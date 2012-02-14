describe("ext.google.maps", function () {

    it("Should return a google.maps.Point of given google.maps.LatLng", function () {
		var result = map.fromLatLngToScreen(new google.maps.LatLng(25.774252, -80.190262));
		expect(result).toEqual(new google.maps.Point(100, 100));
	});
	
	it("Should return a google.maps.LatLng of given google.maps.Point", function () {
		var result = map.fromScreenToLatLng(100, 100);
		var latLng = new google.maps.LatLng(25.774252, -80.190262);
		expect(result.lat().toFixed(6)).toEqual(latLng.lat().toFixed(6));
		expect(result.lng().toFixed(6)).toEqual(latLng.lng().toFixed(6));
	});
	
	it("Should return a scale", function () {
		var result = map.getMapScale({zoom: 14, lat: 25.774252, fixed: 6});
		expect(result).toEqual(7.655102);
	});
	
	it("Should return a google.maps.LatLng for given bearing and destination", function () {
		var result = map.getCenter().destinationPoint(90, 1);
		var latLng = new google.maps.LatLng(25.774251659197482, -80.18027524425048);
		expect(result.lat()).toEqual(latLng.lat());
		expect(result.lng()).toEqual(latLng.lng());
	});
	
	it("Should return a bearing to google.maps.LatLng", function () {
		var result = map.getCenter().bearingTo(new google.maps.LatLng(25.774251659197482, -80.18027524425048));
		expect(result.toFixed(2)).toEqual('90.00');
	});

	it("Should return a midpoint to google.maps.LatLng", function () {
		var result = map.getCenter().midpointTo(new google.maps.LatLng(25.774251659197482, -80.18027524425048));
		var latLng = new google.maps.LatLng(25.77425191479937, -80.18526862211809);
		expect(result.lat()).toEqual(latLng.lat());
		expect(result.lng()).toEqual(latLng.lng());
	});		
	
});