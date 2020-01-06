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
            success: function (res) {
                if(res.cd === cmmApi.CD_SUCCESS) {
                    callback(res.data, uiId, addrValue);
                } else {

                }
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
            success: function (res) {
                if(res.cd === cmmApi.CD_SUCCESS) {
                    var extent = [
                        res.data.xmin,
                        res.data.ymin,
                        res.data.xmax,
                        res.data.ymax,
                    ];
                    callback(extent);
                } else {

                }
            }
        });
    },
    getVectorLayerExtend : function  (url, toPrj, minResolution, maxResolution, style, group, layer, data) {
        var source = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: function(extent) {
                var ext = transformExtent(extent, toPrj, data.srid);
                return url + '?layerName='+data.tblNm+'&bbox='+ext.join(',')+'&fromProj='+data.srid+'&toProj='+toPrj;
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
        vector.set("tcfDat", data);
        vector.set("tcfLay", layer);
        vector.set("name", layer.layNm);
        vector.set("tblName", data.tblNm);
        vector.set("type", "layer");
        vector.set("srid", data.srid);
        vector.set("geomType", data.geomType);
        //vector.setMaxZoom(maxZoom);
        if(group != null) {
            //todo 레이어 그룹
        }
        return vector;
    },
};


