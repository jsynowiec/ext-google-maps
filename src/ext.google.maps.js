(function() {
    "use strict";

    /**
     * Set of helper functions extending Google Maps V3 functionality. Some are 
     * ported from {@link  http://www.movable-type.co.uk/scripts/latlong.html}
     *
     * Copyright (c) 2012 Jakub Synowiec [jakub at jakubsynowiec dot info]
     * Licensed under the MIT license
     * 
     * @augments {google.maps}
     * @requires {google.maps}
     * @author Jakub Synowiec [jakub at jakubsynowiec dot info]
     */

    /**
     * @return {Number} Bearing in radian
     */ 
	Number.prototype.toRad = function() {
	   return this * Math.PI / 180;
	};
    
    /**
     * @return {Number} Bearing in degree
     */ 
	Number.prototype.toDeg = function() {
	   return this * 180 / Math.PI;
	};	 
     
    if (google.maps) {
        
        /**
         * Returns a {@link google.maps.Point} on screen for 
         * a given {@link google.maps.LatLng}.
         *
         * @param {google.maps.LatLng} pos
         * @return {google.maps.Point}
         */
        google.maps.Map.prototype.fromLatLngToScreen = function (pos) {
            
            /**
             * @type {google.maps.Projection}
             */
            var proj = this.getProjection(),
            
            /**
             * @type {Number}
             */            
                scale = Math.pow(2, this.getZoom()),
            
            /**
             * @type {google.maps.LatLng}
             */                
                nw = new google.maps.LatLng(this.getBounds().getNorthEast().lat(),
                                            this.getBounds().getSouthWest().lng()),
                                            
            /**
             * @type {google.maps.Point}
             */                                            
                worldCoordinateNW = proj.fromLatLngToPoint(nw),
            
            /**
             * @type {google.maps.Point}
             */                
                worldCoordinate = proj.fromLatLngToPoint(pos);
    
            return new google.maps.Point(
                Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
                Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
            );
        };
    
        /**
         * Returns a {@link google.maps.LatLng} for a given {@link google.maps.Point}.
         *
         * @param {Number} x
         * @param {Number} y
         * @return {google.maps.LatLng}
         */
        google.maps.Map.prototype.fromScreenToLatLng = function (x, y) {
            
            /**
             * @type {google.maps.Projection}
             */
            var proj = this.getProjection(),
            
            /**
             * @type {Number}
             */            
                scale = Math.pow(2, this.getZoom()),
            
            /**
             * @type {google.maps.LatLng}
             */                
                nw = new google.maps.LatLng(this.getBounds().getNorthEast().lat(),
                                            this.getBounds().getSouthWest().lng()),
                                            
            /**
             * @type {google.maps.Point}
             */                                            
                worldCoordinateNW = proj.fromLatLngToPoint(nw);
            
            return proj.fromPointToLatLng(
                new google.maps.Point(x / scale + worldCoordinateNW.x, 
                                      y / scale + worldCoordinateNW.y));
        };
    
        /**
         * @name MapScaleOptions
         * 
         * @param {Number} zoom - (optional) scale will be computed for this 
         *                          zoom if present
         * 
         * @param {Number} lat - (optional) scale will be computed for this
         *                          latitude if present
         * 
         * @param {Number} fixed - (optional) how many decimal points should be
         *                          returned
         */
    
        /**
         * Computes a map scale in meters per pixel.
         *
         * @param {MapScaleOptions} opt - (Optional)
         * @returns {Number} Computet scale
         */
        google.maps.Map.prototype.getMapScale = function (opt) {
            
            /**
             * Earth circumference in meters
             * @type {Number}
             */
            var circumference = 40075040,
            
            /**
             * @type {Number}
             */            
                zoom, 
            /**
             * @type {Number}
             */                
                lat,
                
            /**
             * @type {Number}
             */                
                scale;
    
            zoom = (opt && opt.hasOwnProperty('zoom') && 
                    typeof (opt.zoom) === 'number') ? opt.zoom : this.getZoom();
                    
            lat = (opt && opt.hasOwnProperty('lat') && 
                   typeof (opt.lat) === 'number') ? opt.lat : this.getCenter().lat();
    
            scale = (circumference * Math.cos(lat) / Math.pow(2, zoom + 8));
    
            if (opt && opt.hasOwnProperty('fixed') &&  
                typeof(opt.fixed) === 'number') {
                scale = Number(scale.toFixed(opt.fixed));
            }
    
            return scale;
        };
    
        /**
         * Returns the destination point from this point having travelled 
         * the given distance (in km) on the given initial bearing 
         * (bearing may vary before destination is reached).
         *
         * @param {Number} brng - Initial bearing in degrees.
         * @param {Number} dist - Distance in km.
         * @returns {google.maps.LatLng} Destination point.
         * @see http://www.movable-type.co.uk/scripts/latlong.html
         */
        google.maps.LatLng.prototype.destinationPoint = function(brng, dist) {
            dist = dist / 6371;
            brng = brng.toRad();

            /**
             * @type {Number}
             */ 
            var lat1 = this.lat().toRad(),

            /**
             * @type {Number}
             */ 
                lng1 = this.lng().toRad(),

            /**
             * @type {Number}
             */ 
                lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
                                 Math.cos(lat1) * Math.sin(dist) * Math.cos(brng)),
                
            /**
             * @type {Number}
             */                 
                lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                                         Math.cos(lat1),
                                         Math.cos(dist) - Math.sin(lat1) *
                                         Math.sin(lat2));
    
            if (isNaN(lat2) || isNaN(lng2)) {
                return null;
            }
    
            return new google.maps.LatLng(lat2.toDeg(), lng2.toDeg());
        };
    
        /**
         * Returns the (initial) bearing from this point to the supplied
         * point, in degrees
         *
         * @param {google.maps.LatLng} point - Lat/Lnge of destination point
         * @returns {Number} Initial bearing in degrees from North
         * @see http://www.movable-type.co.uk/scripts/latlong.html
         */
        google.maps.LatLng.prototype.bearingTo = function(point) {
            
            /**
             * @type {Number}
             */             
            var lat1 = this.lat().toRad(),
            
            /**
             * @type {Number}
             */             
                lat2 = point.lat().toRad(),
    
            /**
             * @type {Number}
             */     
                dLng = (point.lng() - this.lng()).toRad(),
    
            /**
             * @type {Number}
             */ 
                y = Math.sin(dLng) * Math.cos(lat2),
                
            /**
             * @type {Number}
             */                 
                x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * 
                    Math.cos(lat2) * Math.cos(dLng),
                    
            /**
             * @type {Number}
             */                     
                brng = Math.atan2(y, x);
    
            return (brng.toDeg() + 360) % 360;
        };
    
        /**
         * Returns the midpoint between this point and the supplied point.
         *
         * @param   {google.maps.LatLng} point - lat/lng of destination point
         * @returns {google.maps.LatLng} Midpoint between this point and the supplied point
         * @see http://www.movable-type.co.uk/scripts/latlong.html
         */
        google.maps.LatLng.prototype.midpointTo = function (point) {
            
            /**
             * @type {Number}
             */            
            var lat1 = this.lat().toRad(),
            
            /**
             * @type {Number}
             */            
                lng1 = this.lng().toRad(),
               
            /**
             * @type {Number}
             */               
                lat2 = point.lat().toRad(),
    
            /**
             * @type {Number}
             */    
                dLng = (point.lng() - this.lng()).toRad(),
    
            /**
             * @type {Number}
             */    
                Bx = Math.cos(lat2) * Math.cos(dLng),
               
            /**
             * @type {Number}
             */               
                By = Math.cos(lat2) * Math.sin(dLng),
    
            /**
             * @type {Number}
             */
                lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2),
                                  Math.sqrt((Math.cos(lat1) + Bx) * 
                                  (Math.cos(lat1) + Bx) + By * By)),
    
                lng3 = lng1 + Math.atan2(By, Math.cos(lat1) + Bx);
    
            // normalise to -180..+180o
            lng3 = (lng3 + 3*Math.PI) % (2*Math.PI) - Math.PI;
    
            return new google.maps.LatLng(lat3.toDeg(), lng3.toDeg());
        };
    
        /**
         * Returns the point of intersection of two paths defined 
         * by point and bearing.
         *
         * @param   {google.maps.LatLng} p1 - First point
         * @param   {Number} brng1 - Initial bearing from first point
         * @param   {google.maps.LatLng} p2 - Second point
         * @param   {Number} brng2 - Initial bearing from second point
         * @returns {google.maps.LatLng} Destination point (null if no unique intersection defined)
         * @see http://www.movable-type.co.uk/scripts/latlong.html
         */
        google.maps.LatLng.intersection = function (p1, brng1, p2, brng2) {
            
            /**
             * @type {Number}
             */            
            var lat1 = p1.lat().toRad(),
            
            /**
             * @type {Number}
             */            
                lng1 = p1.lng().toRad(),
                
            /**
             * @type {Number}
             */                
                lat2 = p2.lat().toRad(),
    
            /**
             * @type {Number}
             */    
                lng2 = p2.lng().toRad(),
    
            /**
             * @type {Number}
             */    
                brng13 = brng1.toRad(),

            /**
             * @type {Number}
             */
                brng23 = brng2.toRad(),
                
            /**
             * @type {Number}
             */                
                brng12, 
                
            /**
             * @type {Number}
             */                
                brng21,

            /**
             * @type {Number}
             */
                brngA,
                
            /**
             * @type {Number}
             */
                brngB,                
    
            /**
             * @type {Number}
             */    
                dLat = lat2 - lat1,
                
            /**
             * @type {Number}
             */                
                dLng = lng2 - lng1,
    
            /**
             * @type {Number}
             */    
                dist12 = 2 * Math.asin(Math.sqrt(Math.sin(dLat/2) * 
                                       Math.sin(dLat/2) + Math.cos(lat1) * 
                                       Math.cos(lat2) * Math.sin(dLng/2) * 
                                       Math.sin(dLng/2))),
                                       
            /**
             * @type {Number}
             */                  
                alpha1,
                
            /**
             * @type {Number}
             */                  
                alpha2,
                
            /**
             * @type {Number}
             */
                alpha3,
                
            /**
             * @type {Number}
             */                
                dist13,
                
            /**
             * @type {Number}
             */
                lat3,

            /**
             * @type {Number}
             */
                dLng13,
                
            /**
             * @type {Number}
             */                
                lng3;

            if (dist12 === 0) {
                return null;
            }
    
            // initial/final bearings between points
            brngA = Math.acos((Math.sin(lat2) - Math.sin(lat1) * 
                               Math.cos(dist12)) / 
                               (Math.sin(dist12) * Math.cos(lat1)));
    
            if (isNaN(brngA)) {
                brngA = 0;
            }  // protect against rounding
    
            brngB = Math.acos((Math.sin(lat1) - Math.sin(lat2) * 
                               Math.cos(dist12)) / 
                               (Math.sin(dist12) * Math.cos(lat2)));
    
            if (Math.sin(lng2 - lng1) > 0) {
                brng12 = brngA;
                brng21 = 2 * Math.PI - brngB;
            } else {
                brng12 = 2 * Math.PI - brngA;
                brng21 = brngB;
            }
    
            // angle 2-1-3
            alpha1 = (brng13 - brng12 + Math.PI) % (2*Math.PI) - Math.PI;
            
            // angle 1-2-3
            alpha2 = (brng21 - brng23 + Math.PI) % (2*Math.PI) - Math.PI;
    
            if (Math.sin(alpha1) === 0 && Math.sin(alpha2) === 0) {
                return null;
            }  // infinite intersections
    
            if (Math.sin(alpha1) * Math.sin(alpha2) < 0) {
                return null;
            } // ambiguous intersection
    
            alpha3 = Math.acos(-Math.cos(alpha1) * Math.cos(alpha2) +
                                Math.sin(alpha1) * Math.sin(alpha2) * 
                                Math.cos(dist12));
    
            dist13 = Math.atan2(Math.sin(dist12) * Math.sin(alpha1) * Math.sin(alpha2),
                                Math.cos(alpha2) + Math.cos(alpha1) * Math.cos(alpha3));
    
            lat3 = Math.asin(Math.sin(lat1) * Math.cos(dist13) + 
                             Math.cos(lat1) * Math.sin(dist13) * Math.cos(brng13));
    
            dLng13 = Math.atan2(Math.sin(brng13) * Math.sin(dist13) * Math.cos(lat1),
                                Math.cos(dist13) - Math.sin(lat1) * Math.sin(lat3));
    
            lng3 = lng1 + dLng13;
            
            // normalise to -180..+180o
            lng3 = (lng3 + 3*Math.PI) % (2*Math.PI) - Math.PI;
    
            return new google.maps.LatLng(lat3.toDeg(), lng3.toDeg());
        };
    }

})();