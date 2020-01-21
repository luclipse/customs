var mapApi = {
    // 포인트를 이용해여 해당 텍스트 주소를 가져옴
    // layer 는 주소 gis layser를 이용해야함.
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
    // 포인트를 이용해여 해당 주소코드를 가져옴
    // layer 는 주소 gis layser를 이용해야함.
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
    //해당 extend 에서 WFS 데이터를 가져옴.
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
    //해당 extend 에서 Geoserver의 WFS 데이터를 가져옴.
    getGeoServerVectorLayerExtend : function  (url, toPrj, minResolution, maxResolution, style, group, layer, data) {
        var source = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: function(extent) {
                var ext = transformExtent(extent, toPrj, data.srid);
                return url + '/wfs?service=WFS&' +
                    'version=1.1.0&request=GetFeature&typename='+data.tblNm.split(';')[3]+'&' +
                    'outputFormat=application/json&srsname='+toPrj+'&' +
                    'bbox=' + extent.join(',') + ','+ toPrj;

            },
            strategy: ol.loadingstrategy.bbox,
            crossOrigin: "anonymous",
            serverType : 'geoserver'
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
    
    //해당 extend 에서 Geoserver의 WMS 데이터를 가져옴.
    getGeoServerTileLayerExtend : function  (url, toPrj, minResolution, maxResolution, style, group, layer, data) {
        var source = new ol.source.TileWMS({
            url: url + '/wms',
            params: {'LAYERS': data.tblNm.split(';')[3], 'TILED': true},
            serverType: 'geoserver',
            transition: 0
        });

        var layers = new ol.layer.Tile({
            // TODO 임시로 투명도 부여
            opacity : 0.5,
            source: source,
            minResolution : minResolution,
            maxResolution : maxResolution
        });
        layers.set("tcfDat", data);
        layers.set("tcfLay", layer);
        layers.set("name", layer.layNm);
        layers.set("tblName", data.tblNm);
        layers.set("type", "layer");
        layers.set("srid", data.srid);
        layers.set("geomType", data.geomType);
        //vector.setMaxZoom(maxZoom);
        if(group != null) {
            //todo 레이어 그룹
        }
        return layers;
    },

    // geometry table 목록을 가져옴
    getGeometryTable : function (callback) {
        $.ajax({
            url: serverMapHost + "/geoCalc/getGeometryTable",
            data : {
            },
            success: function (res) {
                if(res.cd === cmmApi.CD_SUCCESS) {
                    callback(res.data);
                } else {

                }
            }
        });
    },
    
    // geo server 의 레이어 목록을 가져옴
    getGeoServerLayers : function (geoserverData, type, callback) {
        $.ajax({
            url: serverMapHost + "/geoserver/getLayers",
            method : 'GET',
            data : {
                geoserverHost : geoserverData.srcUrl,
                type : type
            },
            success: function (res) {
                if(res.cd === cmmApi.CD_SUCCESS) {
                    callback(res.data, geoserverData);
                } else {

                }
            }
        });
    }
};


