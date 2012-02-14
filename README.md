# Extended Google Maps

A small set of helper functions augments some classes in Google Maps JavaScript API v3.

## Augmented classes
    Number
        toRad
        toDeg
        
    google.maps.Map
        fromLatLngToScreen
        fromScreenToLatLng
        getMapScale
        
    google.maps.LatLng
        destinationPoint
        bearingTo
        midpointTo
        intersection

### Basic Usage

For examples, see the unit tests located in the test directory.

## License / Credits

This code is released under the [MIT license](http://en.wikipedia.org/wiki/MIT_License).

Some of the functions are ported from [Movable-Type](http://www.movable-type.co.uk/scripts/latlong.html)