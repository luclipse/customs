var styleStrDef = "new ol.style.Style({" +
    "stroke: new ol.style.Stroke({" +
    "color: '{0}'," +
    "width: {1}" +
    "})," +
    "fill: new ol.style.Fill({ " +
    "color: '{2}'" +
    "})" +
    "});";

var transformExtent = function (extent, from, to) {
    var source = from;
    var destination = to;
    return ol.proj.transformExtent(extent, source, destination);
};

var transformCoord = function (coord , from, to) {
    var source = from;
    var destination = to;
    return ol.proj.transform(coord, source, destination);
};

var replacer = function(key, value) {
    if (value.geometry) {
        var type;
        var rawType = value.type;
        var geometry = value.geometry;

        if (rawType === 1) {
            type = 'MultiPoint';
            if (geometry.length === 1) {
                type = 'Point';
                geometry = geometry[0];
            }
        } else if (rawType === 2) {
            type = 'MultiLineString';
            if (geometry.length === 1) {
                type = 'LineString';
                geometry = geometry[0];
            }
        } else if (rawType === 3) {
            type = 'Polygon';
            if (geometry.length > 1) {
                type = 'MultiPolygon';
                geometry = [geometry];
            }
        }

        return {
            'type': 'Feature',
            'geometry': {
                'type': type,
                'coordinates': geometry
            },
            'properties': value.tags
        };
    } else {
        return value;
    }
};

function random_rgb() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')';
}

function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + /*r().toFixed(1)*/'0.1' + ')';
}


