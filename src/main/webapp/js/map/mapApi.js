var mapApi = {
    getAddrByPoint : function (layerName, valueColumnName, cdColumnName, coord, uiId, addrValue, mapProj, layerProj, callback) {
        coord = transformCoord(coord, mapProj, layerProj);
        $.ajax({
            url: serverMapHost + "/geoCalc/getAddrByPoint",
            data : {
                layerName : layerName
                , valueColumnName : valueColumnName
                , cdColumnName : cdColumnName
                , coord : coord[0] + ", " + coord[1]
            },
            success: function (result) {
                callback(result, uiId, addrValue);
            }
        });
    },
    getAddrExtentByCd : function (layerName, cdColumnName, cdValue, srid, callback) {
        $.ajax({
            url: serverMapHost + "/geoCalc/getAddrExtentByCd",
            data : {
                layerName : layerName
                , srid : srid
                , cdColumnName : cdColumnName
                , cdValue : cdValue
            },
            success: function (result) {
                var extent = [
                    result.xmin,
                    result.ymin,
                    result.xmax,
                    result.ymax,
                ];
                callback(extent);
            }
        });
    },
    getVectorLayerExtend : function  (name, url, layerName, fromPrj, toPrj, minResolution, maxResolution, style, group) {
        var source = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: function(extent) {
                var ext = transformExtent(extent, toPrj, fromPrj);
                return url + '?layerName='+layerName+'&bbox='+ext.join(',')+'&fromProj=EPSG:'+fromPrj+'&toProj=EPSG:'+toPrj;
            },
            strategy: ol.loadingstrategy.bbox,
            crossOrigin: "Anonymous"
        });
        var vector = new ol.layer.Vector({
            source: source,
            style: style,
            minResolution : minResolution,
            maxResolution : maxResolution
        });
        vector.set("name", name);
        vector.set("tblName", layerName);
        vector.set("type", "layer");
        vector.set("srid", fromPrj);
        //vector.setMaxZoom(maxZoom);
        if(group != null) {
            //todo 레이어 그룹
        }
        return vector;
    }
};


