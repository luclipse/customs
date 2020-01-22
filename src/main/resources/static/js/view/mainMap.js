//LXMap Instance
var LXMap = function(src, layersInfo, zoom){
    var _this = this;
    this.targetLayer = layersInfo[2];
    this.layersInfo = layersInfo;

    this.backgrounds = new ol.layer.Group({
        layers: [
            new ol.layer.Tile({
                visible : false,
                source: new ol.source.XYZ({
                    url: 'http://xdworld.vworld.kr:8080/2d/Satellite/201710/{z}/{x}/{y}.jpeg',
                    crossOrigin: "anonymous"
                })
            }),
            new ol.layer.Tile({
                visible : true,
                source: new ol.source.XYZ({
                    url: 'http://xdworld.vworld.kr:8080/2d/Base/201710/{z}/{x}/{y}.png',
                    crossOrigin: "anonymous"
                })
            }),
            new ol.layer.Tile({
                visible : false,
                source: new ol.source.XYZ({
                    url: 'http://xdworld.vworld.kr:8080/2d/gray/201802/{z}/{x}/{y}.png',
                    crossOrigin: "anonymous"
                })
            }),
            new ol.layer.Tile({
                visible : false,
                source: new ol.source.XYZ({
                    url: 'http://xdworld.vworld.kr:8080/2d/Hybrid/201802/{z}/{x}/{y}.png',
                    crossOrigin: "anonymous"
                })
            })
        ]
    })

    this.map = new ol.Map({
        target : src.target,
        layers : [
            this.backgrounds
        ],
        view: new ol.View({
            center      : src.view.center,
            //projection  : src.view.projection,
            zoom        : src.view.zoom,
            maxZoom     : 19,
            minZoom     : 7
        })
    })

    var mainCElement = this.initMainControl(layersInfo);


    this.controls = {
        routeControl : new ol.control.Control({
            element: mainCElement[0],
            target: 'ol-costom-maincontrol'
        }),
        scaleLineControl : new ol.control.ScaleLine({
            unit : "degrees",
            bar : true,
            steps : 4,
            text : false,
            minWidth : 140
        })
    }

    this.map.addControl(this.controls.routeControl);
    //this.map.addControl(this.controls.scaleLineControl);
}


LXMap.prototype.addLayer = function(layersInfo){
    console.log(layersInfo);

    //배경지도
    if(layersInfo.datSno == -1){return;}

    var node_vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return serverMapHost + '/geoCalc/getMap?layerName='
                + layersInfo.datVo.tblNm +'&bbox=' + ol.proj.transform(extent, 'EPSG:3857', layersInfo.datVo.srid).join(',')
                + '&fromProj=' + layersInfo.datVo.srid + '&toProj=EPSG:3857';
        },
        strategy: ol.loadingstrategy.bbox,
    });

    var node_vector = new ol.layer.Vector({
        name : layersInfo.layNm,
        source: node_vectorSource,
        style: olStyle.getStrToStyle(layersInfo.styleVo.styleText),
        visible : (layersInfo.layVisYn == 'Y' ? true : false)
    });

    this.map.addLayer(node_vector);
}

LXMap.prototype.initMainControl = function(layersInfo){
    var _this = this;
    var layersElement = $('<div/>', {class : 'row'});

    for (var i = 0; i < layersInfo.length; i++){
        if(layersInfo[i].datSno == -1){
            continue;
        }
        this.addLayer(layersInfo[i]);


        //레이어 리스트 페널 생성
        layersElement.append(
            $('<div/>', {
                class : 'col-12'
            }).append(
                $('<div/>', {
                    class : 'card mb-2'
                }).append(
                    $('<div/>', {
                        class : 'card-body'
                    }).append(
                        $('<div/>', {
                            class : 'row'
                        }).append(

                            $('<div/>', {
                                class : 'col-9'
                            }).append(
                                $('<button/>', {
                                    class : 'btn btn-link',
                                    id : layersInfo[i].layNm,
                                    click : function(){
                                        $('#v-pills-infoLayer-tab').tab('show');
                                        _this.resetInnerTab1Content(this.id);

                                        var layers = _this.map.getLayers().getArray();
                                        for (var i = 0; i < layers.length; i++){
                                            if(layers[i].get('name') == this.id){
                                                _this.targetLayer = layers[i];
                                                break;
                                            }
                                        }

                                    }
                                }).append(
                                    $('<small/>', {text : layersInfo[i].layNm})
                                )
                            ),
                            $('<div/>', {
                                class : 'col-3',
                                text : layersInfo[i].layVisYn
                            })
                        )
                    )
                )
            )
        )

    }

    var mainCElement = $('<div/>', {
        class : 'ol-costom-maincontrol ol-unselectable h-100'
        //class : 'ol-costom-maincontrol ol-unselectable ol-control h-100'
    });

    mainCElement.append(
        $('<div/>', {
            class : 'row h-100 bg-secondary'
        }).append(
            $('<div/>', {
                class : 'col-3 p-0'
            }).append(
                $('<div/>', {
                    class : 'nav flex-column nav-pills',
                    id : 'v-pills-tab',
                    role : 'tablist',
                    'aria-orientation' : "vertical"
                }).append(
                    $('<a/>', {
                        class : 'nav-link active',
                        id : 'v-pills-home-tab',
                        'data-toggle' : 'pill',
                        href : '#v-pills-home',
                        role : 'tab',
                        'aria-controls' : 'v-pills-home',
                        'aria-selected' : 'true',
                        text : 'Home'

                    }),
                    $('<a/>', {
                        class : 'nav-link',
                        id : 'v-pills-option-tab',
                        'data-toggle' : 'pill',
                        href : '#v-pills-option',
                        role : 'tab',
                        'aria-controls' : 'v-pills-option',
                        'aria-selected' : 'false',
                        text : 'Option'
                    }),
                    $('<a/>', {
                        class : 'nav-link',
                        id : 'v-pills-infoLayer-tab',
                        'data-toggle' : 'pill',
                        href : '#v-pills-infoLayer',
                        role : 'tab',
                        'aria-controls' : 'v-pills-infoLayer',
                        'aria-selected' : 'false',
                        text : 'layer-1',
                        'aria-expanded' : "true",
                        css: { 'display': 'none' }
                    }),
                )
            ),
            $('<div/>', {
                class : 'col-9 p-0'
            }).append(
                //dynamic
                $('<div/>', {
                    class : 'tab-content',
                    id : 'v-pills-tabContent'
                }).append(
                    $('<div/>', {
                        //class : 'tab-pane fade show active',
                        class : 'tab-pane show active',
                        id : 'v-pills-home',
                        role : 'tabpanel',
                        'aria-labelledby' : 'v-pills-home-tab',
                    }).append(
                        $('<div/>', {
                            class : 'card h-100'
                        }).append(
                            $('<div/>', {
                                class : 'card-body'
                            }).append(
                                $('<h5/>', {
                                    text : 'Untitled',
                                    class : 'font-weight-bold mb-3'
                                }),
                                $('<p/>', {
                                    text : 'sibal sibal sibal sibal'
                                }),
                                $('<div/>', {}).append(
                                    $('<ul/>', {
                                        class : 'nav nav-tabs',
                                        id : 'innerTab1',
                                        role : 'tablist'
                                    }).append(
                                        $('<li/>', {
                                            class : 'nav-item'
                                        }).append(
                                            $('<a/>', {
                                                class : 'nav-link active',
                                                id : 'innerTab1-layers-tab',
                                                'data-toggle' : 'tab',
                                                href : '#innerTab1-layers',
                                                role : 'tab',
                                                'aria-controls' : 'layers',
                                                'aria-selected' : 'true',
                                            }).append(
                                                $('<p/>').append($('<small/>', {text:'LAYERS'}))
                                            )
                                        ),
                                        $('<li/>', {
                                            class : 'nav-item'
                                        }).append(
                                            $('<a/>', {
                                                class : 'nav-link',
                                                id : 'innerTab1-widgets-tab',
                                                'data-toggle' : 'tab',
                                                href : '#innerTab1-widgets',
                                                role : 'tab',
                                                'aria-controls' : 'widgets',
                                                'aria-selected' : 'true',
                                            }).append(
                                                $('<p/>').append($('<small/>', {text:'WIDGETS'}))
                                            )
                                        )
                                    )
                                ),
                                $('<div/>', {
                                    class : 'tab-content',
                                    id : 'innerTab1Content'
                                }).append(
                                    $('<div/>', {
                                        class : 'tab-pane fade show active',
                                        id : 'innerTab1-layers',
                                        role : 'tabpanel',
                                        'aria-labelledby' : 'innerTab1-layers-tab',
                                    }).append(
                                        $('<button/>', {
                                            class : 'btn btn-outline-primary btn-lg btn-block mt-2 mb-2 p-2',
                                            type : 'button',
                                        }).append(
                                            $('<small/>', {text:'+ ADD NEW LAYER'})
                                        ),

                                        //Dynamic Layers
                                        layersElement
                                    ),
                                    $('<div/>', {
                                        class : 'tab-pane fade',
                                        id : 'innerTab1-widgets',
                                        role : 'tabpanel',
                                        'aria-labelledby' : 'innerTab1-widgets-tab',
                                        text : 'innerTab1-widgets-tab'
                                    })
                                )
                            )
                        )
                    ),
                    $('<div/>', {
                        //class : 'tab-pane fade',
                        class : 'tab-pane',
                        id : 'v-pills-option',
                        role : 'tabpanel',
                        'aria-labelledby' : 'v-pills-option-tab',
                    }).append(
                        $('<div/>', {
                            class : 'card h-100'
                        }).append(
                            $('<div/>', {
                                class : 'card-body'
                            }).append(
                                $('<h5/>', {
                                    text : 'Untitled',
                                    class : 'font-weight-bold mb-3'
                                }),
                                $('<p/>', {
                                    text : 'sibal sibal sibal sibal'
                                }),
                            ),
                            $('<div/>', {
                                class : 'container'
                            })
                        )
                    ),
                    //innertab 2 레이어 패널 클릭시
                    //동적으로 생성해야됨
                    $('<div/>', {
                        //class : 'tab-pane fade',
                        class : 'tab-pane',
                        id : 'v-pills-infoLayer',//dynamic
                        role : 'tabpanel',
                        'aria-labelledby' : 'v-pills-infoLayer-tab',
                    }).append(
                        $('<div/>', {
                            class : 'card h-100'
                        }).append(
                            $('<div/>', {
                                class : 'card-body'
                            }).append(
                                $('<ul/>', {
                                    class : 'list-inline'
                                }).append(
                                    $('<li/>', {
                                        class : 'list-inline-item',
                                    }).append(
                                        $('<button/>', {
                                            class : 'btn btn-link',
                                            //text : '← 뒤로가기',
                                            click : function(){
                                                $('#v-pills-home-tab').tab('show')
                                            }
                                        }).append(
                                            $('<small/>', {text : '← 뒤로가기'})
                                        )
                                    ),
                                    $('<li/>', {
                                        class : 'list-inline-item',
                                    }).append(
                                        $('<p/>').append($('<small/>', {text:'/ Layer Option'}))
                                    )
                                ),
                                $('<h6/>', {
                                    text : 'Dynamic Title',
                                    class : 'font-weight-bold mb-3',
                                    id : 'maincontrol-layer-title'
                                }),
                                $('<div/>', {}).append(
                                    $('<ul/>', {
                                        class : 'nav nav-tabs',
                                        id : 'innerTab2',
                                        role : 'tablist'
                                    }).append(
                                        $('<li/>', {
                                            class : 'nav-item'
                                        }).append(
                                            $('<a/>', {
                                                class : 'nav-link active',
                                                id : 'innerTab2-data-tab',
                                                'data-toggle' : 'tab',
                                                href : '#innerTab2-data',
                                                role : 'tab',
                                                'aria-controls' : 'data',
                                                'aria-selected' : 'true',
                                            }).append($('<small/>', {text : 'DATA'}))
                                        ),
                                        $('<li/>', {
                                            class : 'nav-item'
                                        }).append(
                                            $('<a/>', {
                                                class : 'nav-link',
                                                id : 'innerTab2-style-tab',
                                                'data-toggle' : 'tab',
                                                href : '#innerTab2-style',
                                                role : 'tab',
                                                'aria-controls' : 'style',
                                                'aria-selected' : 'true',
                                            }).append($('<small/>', {text : 'STYLE'}))
                                        ),
                                        $('<li/>', {
                                            class : 'nav-item'
                                        }).append(
                                            $('<a/>', {
                                                class : 'nav-link',
                                                id : 'innerTab2-legend-tab',
                                                'data-toggle' : 'tab',
                                                href : '#innerTab2-legend',
                                                role : 'tab',
                                                'aria-controls' : 'legend',
                                                'aria-selected' : 'true',
                                            }).append($('<small/>', {text : 'LEGEND'}))
                                        ),
                                    ),
                                    $('<div/>', {
                                        class : 'tab-content',
                                        id : 'innerTab1Content'
                                    }).append(
                                        $('<div/>', {
                                            class : 'tab-pane fade show active',
                                            id : 'innerTab2-data',
                                            role : 'tabpanel',
                                            'aria-labelledby' : 'innerTab2-data-tab',
                                        }),
                                        $('<div/>', {
                                            class : 'tab-pane fade',
                                            id : 'innerTab2-style',
                                            role : 'tabpanel',
                                            'aria-labelledby' : 'innerTab1-style-tab',
                                        }),
                                        $('<div/>', {
                                            class : 'tab-pane fade',
                                            id : 'innerTab2-legend',
                                            role : 'tabpanel',
                                            'aria-labelledby' : 'innerTab2-legend-tab',
                                            text : 'innerTab2-legend-tab'
                                        })
                                    )
                                )
                            ),
                            $('<div/>', {
                                class : 'container'
                            })
                        )
                    )

                )
            ),
        )
    );

    return mainCElement;
}

LXMap.prototype.resetInnerTab1Content = function(layNm){
    //innerTab1-data-tab
    //innerTab1-style-tab
    //innerTab1-legend-tab

    $('div#innerTab2-data').empty();
    $('div#innerTab2-style').empty();
    $('div#innerTab2-legend').empty();

    var layerInfo;

    for(var i = 0; i < this.layersInfo.length; i++){
        if(layNm == this.layersInfo[i].layNm){
            layerInfo = this.layersInfo[i];
            break;
        }
    }

    //타입별로 생성
    //Data
    for(var i = 0; i < layerInfo.datVo.tableInfos.length; i++){
        var columnName = layerInfo.datVo.tableInfos[i].columnName;
        var dataType = layerInfo.datVo.tableInfos[i].dataType;

        $('div#innerTab2-data').append(
            $('<div/>', {
                class : 'custom-control mt-4'
            }).append(
                $('<input/>', {
                    type : 'checkbox',
                    class : 'custom-control-input',
                    id : 'data-' + columnName
                }),
                $('<label/>', {
                    class : 'custom-control-label',
                    for : 'data-' + columnName,
                }).append($('<small/>', {text : 'Add as a widget'}))
            ),
            $('<div/>', {
                class : 'row ml-4'
            }).append(
                $('<div/>', {
                    class : 'col-12',
                }).append(
                    $('<p/>', {text : columnName}).append(
                        $('<span/>', {text: dataType.toUpperCase(), class : 'ml-2 p-1 border border-warning rounded', css : {'font-size' : '7px'}})
                    ),
                ),
            )
        )
    }


    switch (layerInfo.datVo.geomType) {
        case 'MULTIPOLYGON' :
        case 'POLYGON' :
            console.log('POLYGON')
            this.createPolygonStyleWidget(layerInfo)
            break;
        case 'MULTILINE' :
        case 'LINE' :
            console.log('LINE')
            break;
        case 'MULTIPOINT' :
        case 'POINT' :
            console.log('POINT')
            break;
    }

    // Style

}

LXMap.prototype.createPolygonStyleWidget = function(layerInfo){
    var _this = this;
    var style = olStyle.getStrToStyle(layerInfo.styleVo.styleText);
    var fillColorpicker = $('<input/>', {
        class : 'form-control',
        id : 'style_polygon_fill',
        type : 'text',
        readonly : true,
        value : style.getFill().getColor(),
        css : {'font-size' : '1px', 'background-color' : style.getFill().getColor()}
    }).colorpicker();

    var strokeColorpicker = $('<input/>', {
        class : 'form-control',
        id : 'style_polygon_stroke',
        type : 'text',
        readonly : true,
        value : style.getStroke().getColor(),
        css : {'font-size' : '1px', 'background-color' : style.getStroke().getColor()}
    }).colorpicker();

    var strokeWidth = $('<div/>', {
        class : 'form-group',
    }).append(
        $('<select/>', {
            class : 'form-control w-100',
            css : {'font-size' : '8px'},
            selected :style.getStroke().getWidth()
        }).append(
            $('<option/>', {value : 1}).append($('<small/>', {text : 1})),
            $('<option/>', {value : 2}).append($('<small/>', {text : 2})),
            $('<option/>', {value : 3}).append($('<small/>', {text : 3})),
            $('<option/>', {value : 4}).append($('<small/>', {text : 4})),
            $('<option/>', {value : 5}).append($('<small/>', {text : 5})),
            $('<option/>', {value : 6}).append($('<small/>', {text : 6})),
            $('<option/>', {value : 7}).append($('<small/>', {text : 7})),
            $('<option/>', {value : 8}).append($('<small/>', {text : 8})),
            $('<option/>', {value : 9}).append($('<small/>', {text : 9})),
        )
    )

    strokeColorpicker.on('colorpickerChange', function(event){
        $(this).css('background-color', event.color.toString());

        var style = new ol.style.Style({
            fill : new ol.style.Fill({color: $('#style_polygon_fill').val()}),
            stroke : new ol.style.Stroke({color : event.color.toString()}),
        })

        _this.targetLayer.setStyle(style);

    });


    fillColorpicker.on('colorpickerChange', function(event){
        $(this).css('background-color', event.color.toString());

        var style = new ol.style.Style({
            fill : new ol.style.Fill({color: event.color.toString()}),
            stroke : new ol.style.Stroke({color : $('#style_polygon_stroke').val()}),
        })

        _this.targetLayer.setStyle(style);

    });


    $('div#innerTab2-style').append(
        $('<p/>', {
            class : 'mt-2',
            text : '1. Polygon style'
        }),
        $('<div/>', {
            class : 'row ml-4'
        }).append(

            //POLYGON COLOR
            $('<div/>', {
                class : 'col-5 mb-2',
            }).append($('<small/>', {text : 'POLYGON COLOR'})),
            $('<div/>', {
                class : 'col-7',
            }).append(
                fillColorpicker
            ),

            //STROKE COLOR
            $('<div/>', {
                class : 'col-5 mb-2',
            }).append($('<small/>', {text : 'STROKE COLOR'})),
            $('<div/>', {
                class : 'col-7',
            }).append(
                strokeColorpicker
            ),

            //STROKE SIZE
            $('<div/>', {
                class : 'col-5 mb-2',
            }).append($('<small/>', {text : 'STROKE SIZE'})),
            $('<div/>', {
                class : 'col-7',
            }).append(
                strokeWidth
            ),
        )
    )
}