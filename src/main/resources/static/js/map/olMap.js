// 현재 한국에서 사용중인 좌표계를 설정함.
var projDef = function () {
    if(proj4 !== undefined){
        proj4.defs("EPSG:2096", "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43"); //Bassel East
        proj4.defs("EPSG:2097", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43"); //Bassel Middle
        proj4.defs("EPSG:2098", "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43"); //Bassel West
        proj4.defs("EPSG:4004", "+proj=longlat +ellps=bessel +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43"); //Bassel 1841
        proj4.defs("EPSG:4019", "+proj=longlat +ellps=GRS80 +no_defs"); //GRS80
        proj4.defs("EPSG:5174", "+proj=+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs");
        proj4.defs("EPSG:5179", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"); //UTM-K
        proj4.defs("EPSG:5185", "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"); //GRS80 West y:60000
        proj4.defs("EPSG:5186", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"); //GRS80 Middle y:60000
        proj4.defs("EPSG:5187", "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"); //GRS80 East y:60000
        proj4.defs("EPSG:5188", "+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"); //GRS80 EastSea y:60000
        proj4.defs("EPSG:5181", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs"); //GRS80 EastSea y:60000
        proj4.defs("EPSG:900918", "+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43"); //GRS80 EastSea y:60000
        proj4.defs("NGI60:MIDDLE", "+proj=tmerc +title=KOREA_CENTER_TM_3PARAM +lat_0=38.0 +lon_0=127.0028902777777777776 +x_0=200000.0 +y_0=600000.0 +k=1.0 +a=6377397.155 +b=6356078.9633422494 +towgs84=-146.43,507.89,681.46,0,0,0,0");

    } else{
        console.log("[Error] not define openlayers 'proj4' Object.");
    }
    ol.proj.proj4.register(proj4);
};

// 베이스 맵 주소 vworld 주소 xyz의 주소를 이용함.
var baseMap = {
    vworldSrc : {
        hybrid : new ol.source.XYZ({
            url: 'http://xdworld.vworld.kr:8080/2d/Hybrid/201802/{z}/{x}/{y}.png',
            crossOrigin: "Anonymous"
        }),
        gray : new ol.source.XYZ({
            url: 'http://xdworld.vworld.kr:8080/2d/gray/201802/{z}/{x}/{y}.png',
            crossOrigin: "Anonymous"
        }),
        vector : new ol.source.XYZ({
            url: 'http://xdworld.vworld.kr:8080/2d/Base/201710/{z}/{x}/{y}.png',
            crossOrigin: "Anonymous"
        }),
        sat : new ol.source.XYZ({
            url: 'http://xdworld.vworld.kr:8080/2d/Satellite/201710/{z}/{x}/{y}.jpeg',
            crossOrigin: "Anonymous"
        })
    }
};

projDef();

// 오픈레이어즈
var olMap = {
    olMap : null,
    /*draw : null,*/
    overviewMapControl : null,
    layerList : [],
    layers : {
        baseLayer : null,
        drawLayer : null,
        downloadDrawLayer : null,
        measureLayer : null,
        layer : []
    },
    // 베이스 레이어를 추가함.
    addBaseLayer : function (src, coord, zoom) {
        this.baseLayer = new ol.layer.Tile({
            zIndex : 0,
            source: src
        });

        this.overviewMapControl = new ol.control.OverviewMap({
            className: 'ol-overviewmap ol-custom-overviewmap',
            layers: [
                new ol.layer.Tile({
                    source: baseMap.vworldSrc.gray
                })
            ],
            //collapseLabel: '\u00BB',
            //label: '\u00AB',
            collapsed: false
        });

        this.olMap = new ol.Map({
            controls: ol.control.defaults().extend([
                this.overviewMapControl
            ]),
            target: 'map',
            view: new ol.View({
                center: coord,
                zoom: zoom
            })
        });
        this.baseLayer.set("name", "base");
        this.baseLayer.set("type", "baseLayer");
        this.baseLayer.set("tblName", "");
        this.baseLayer.set("srid", mapSrid);
        this.olMap.addLayer(this.baseLayer);
        this.layerList.push(this.baseLayer);
        this.layers.baseLayer = this.baseLayer;
    },

    // 백터 레이어를 추가함
    addVectorLayer : function (url, toPrj, minResolution, maxResolution, style, group, layer, data) {
        if(this.getLayersByName(layer.layNm) != null) {
            return "Already exists with the same name";
        }
        var st = olStyle.getStrToStyle(style.styleText);
        var vector = mapApi.getVectorLayerExtend(url, toPrj, minResolution, maxResolution, st, group, layer, data);
        vector.set("styleStr", olStyle.getStringStyle(st));
        vector.set("style", style);
        this.olMap.addLayer(vector);
        this.layerList.push(vector);
        this.layers.layer.push(vector);
        return "addVectorLayer Success"
    },

    // 지오서버 WFS 레이어를 추가함.
    addGeoServerWFSLayer : function (url, toPrj, minResolution, maxResolution, style, group, layer, data) {
        if(this.getLayersByName(layer.layNm) != null) {
            return "Already exists with the same name";
        }
        var st = olStyle.getStrToStyle(style.styleText);
        var vector = mapApi.getGeoServerVectorLayerExtend(url, toPrj, minResolution, maxResolution, st, group, layer, data);
        vector.set("styleStr", olStyle.getStringStyle(st));
        vector.set("style", style);
        this.olMap.addLayer(vector);
        this.layerList.push(vector);
        this.layers.layer.push(vector);
        return "addVectorLayer Success"
    },

    // 지오서버 WMS 레이어를 추가함.
    addGeoServerWMSLayer : function (url, toPrj, minResolution, maxResolution, style, group, layer, data) {
        if(this.getLayersByName(layer.layNm) != null) {
            return "Already exists with the same name";
        }
        //var st = olStyle.getStrToStyle(style.styleText);
        var vector = mapApi.getGeoServerTileLayerExtend(url, toPrj, minResolution, maxResolution, style, group, layer, data);
        vector.set("styleStr", '');
        vector.set("style", '');
        this.olMap.addLayer(vector);
        this.layerList.push(vector);
        this.layers.layer.push(vector);
        return "addVectorLayer Success"
    },

    //draw 레이어를 추가함.
    addDrawVectorLayer : function (layer) {
        this.olMap.addLayer(layer);
        this.layerList.push(layer);
        this.layers.drawLayer = layer;
    },

    //Measure 레이어를 추가함.
    addMeasureLayer : function(layer) {
        this.olMap.addLayer(layer);
        this.layerList.push(layer);
        this.layers.measureLayer = layer;
    },

    /*
    addVectorTileLayer : function (name, url, layerName, fromPrj, toPrj, maxResolution, style) {
        url = url + '?layerName='+layerName+'&fromProj=EPSG:'+fromPrj+'&toProj=EPSG:'+toPrj;
        fetch(url).then(function(response) {
            return response.json();
        }).then(function(json) {
            var tileIndex = geojsonvt(json, {
                extent: 4096,
                debug: 1
            });
            var source = new ol.source.VectorTile({
                format: new ol.format.GeoJSON({
                    // Data returned from geojson-vt is in tile pixel units
                    dataProjection: new ol.proj.Projection({
                        code: 'TILE_PIXELS',
                        units: 'tile-pixels',
                        extent: [0, 0, 4096, 4096]
                    })
                }),
                tileUrlFunction: function(tileCoord) {
                    var data = tileIndex.getTile(tileCoord[0], tileCoord[1], tileCoord[2]);
                    var geojson = JSON.stringify({
                        type: 'FeatureCollection',
                        features: data ? data.features : []
                    }, replacer);
                    return 'data:application/json;charset=UTF-8,' + geojson;
                }
            });
            var vector = new ol.layer.VectorTile({
                source: source,
                style: style,
                maxResolution : maxResolution
            });
            vector.set("name", name);
            vector.set("type", "layer");
            //vector.setMaxZoom(maxZoom);
            map.olMap.addLayer(vector);
            map.layerList.push(vector);
            map.layers.layer.push(vector);
        });
    },
    */


    /*
    setInteraction : function(name, value) {
        var src = null;
        if(this.layers.drawLayer == null) {
            src = this.addDrawVectorLayer(name).getSource();
        }
        else {
            src = this.layers.drawLayer.getSource();
        }
        if (value !== 'None') {
            this.draw = new ol.interaction.Draw({
                source: src,
                type: value
            });
            this.olMap.addInteraction(this.draw);
        }
    },

    drawLayer : function (name, value) {
        if(this.draw != null) {
            this.olMap.removeInteraction(this.draw);
        }
        this.setInteraction(name, value);
    },
    */
    
    // 현재 draw 영역을 가져와서 wkt로 반환함
    getDrawLayerToWKT : function (src, dest) {
        if(olMap.layers.drawLayer == null) {
            return null;
        }
        if(olMap.layers.drawLayer.getSource().getFeatures() <= 0) {
            return null;
        }
        var formatWkt = new ol.format.WKT();
        var ft = olMap.layers.drawLayer.getSource().getFeatures()[olMap.layers.drawLayer.getSource().getFeatures().length-1];
        src.replace('EPSG:', '');
        dest.replace('EPSG:', '');
        ft.getGeometry().transform('EPSG:'+src, 'EPSG:'+dest);
        return formatWkt.writeFeature(ft);
    },

    // 지도를 지정한 extent로 이동함.
    gotoExtent : function(extent){
        olMap.olMap.getView().fit(extent, olMap.olMap.getSize());
    },

    // 레이어 목록에서 이름으로 검색하여 레이어를 리턴함
    getLayersByName : function (name) {
        for (var i = 0; i < olMap.layerList.length; i++) {
            if(olMap.layerList[i].get("name") === name) {
                return olMap.layerList[i];
            }
        }
        return null;
    },
    // 레이어 목록에서 종류로 검색하여 레이어 목록을 리턴함
    getLayersByType : function (type) {
        var types = type.split(',');
        var list = [];
        types.forEach(function (ty) {
            olMap.layerList.forEach(function (layer) {
                if(layer.get("type") === ty.trim()){
                    list.push(layer);
                }
            })
        });
        return list;
    },
    // 레이어 목록에서 종류로 검색하여 레이어 목록을 JSON 형태로 리턴함
    getLayerListJson : function (type) {
        var resList = [];
        if(type === 'all'){
            for (var i = 0; i < olMap.layerList.length; i++) {
                var data = {
                    name: olMap.layerList[i].get("name"),
                    type: olMap.layerList[i].get("type"),
                    tblName: olMap.layerList[i].get("tblName"),
                    srid: olMap.layerList[i].get("srid"),
                    geomType: olMap.layerList[i].get("geomType"),
                };
                resList.push(data);
            }
        } else {
            var datas = this.getLayersByType(type);
            for (var i = 0; i < datas.length; i++) {
                var data = {
                    name: datas[i].get("name"),
                    type: datas[i].get("type"),
                    tblName: datas[i].get("tblName"),
                    srid: datas[i].get("srid"),
                    geomType: datas[i].get("geomType"),
                };
                resList.push(data);
            }
        }
        return resList;
    },
};




