var locSido;
var locSigungu;
var locAdm;
var grid;
var dataGrid;
var currentLayer = null;

var idInputTimeseries = 'input-timeseries';
var idLabelTimeseries = 'label-timeseries';
var idDivTimeseries = 'div-timeseries';
var idDivDataInfo = 'div-data-info';
var idImgLegend = 'img-legend';
var idDivLegend = 'div-legend';

var timeSeriesLayerName =  '';
var timeSeriesLayerIdx =  0;

var init = function () {


    //olMap.addBaseLayer(vworldSrc.vector, [14137575.330745745, 4300621.372044271], 13);
    initLayer();
    //레이어 그리드 설정
    grid = new tui.Grid({
        el: document.getElementById('grid'), // Container element
        scrollX: false,
        scrollY: false,

        columns: [
            {
                header: 'Name',
                name: 'name'
            }
        ],
        header: {
            height: 0
        },
    });
    tui.Grid.applyTheme('clean');
    grid.resetData(olMap.getLayerListJson('layer,baseLayer'));

    //데이터 그리드 설정
    dataGrid = new tui.Grid({
        el: document.getElementById('dataGrid'), // Container element
        scrollX: false,
        scrollY: false,
        /*treeColumnOptions: {
            name: 'name',
            /!*useCascadingCheckbox: true*!/
        },*/
        columns: [
            {
                header: '데이터명',
                name: 'datNm'
            }
        ]
    });
    tui.Grid.applyTheme('clean');
    initData(null);
    olStyle.initStyle('a-line-color', 'a-plane-color', 'input-line-size', 'div-radius-size', 'input-radius-size');
    grid.on('click', layerFocusEvent);

};
var initAddr = function () {
//주소를 가져온다.
    olMap.olMap.on('moveend', function (e) {
        //현재 중간점의 좌표를 가져옴
        var coord = olMap.olMap.getView().getCenter();
        console.log(coord);
        // 시도 주소
        mapApi.getAddrByPoint('z_sop_bnd_sido_pg', 'sido_nm', 'sido_cd', coord, 'input-sido', locSido, 'EPSG:3857', 'EPSG:5181', setAddr);
        // 시군구 주소
        mapApi.getAddrByPoint('z_sop_bnd_sigungu_pg', 'sigungu_nm', 'sigungu_cd', coord, 'input-sigungu', locSigungu, 'EPSG:3857', 'EPSG:5181', setAddr);
        // 읍면동 주소
        mapApi.getAddrByPoint('z_sop_bnd_adm_dong_pg', 'adm_dr_nm', 'adm_dr_cd', coord, 'input-adm', locAdm, 'EPSG:3857', 'EPSG:5181', setAddr);
    });
};

// 지도 클릭시 이벤트
var initSingleClickEvent = function () {
    olMap.olMap.on('singleclick', function(evt) {
        getFeaturesInfo(evt);
    });
};

// 피쳐 정보 가져오는 함수
var getFeaturesInfo = function (evt) {
    var row = grid.getRow(grid.getFocusedCell().rowKey);
    if(row == null || row.type === 'baseLayer') {
        return;
    }
    var viewResolution = /** @type {number} */ (olMap.olMap.getView().getResolution());
    var layer = olMap.getLayersByName(row.name);
    var source = null;
    if(layer.get("timeSeriesOlLayer").length > 0){
        source = olMap.getTimeSeriesLayer(timeSeriesLayerName, timeSeriesLayerIdx).getSource();
    } else {
        source = layer.getSource();
    }
    if(row.tblName.split(';').length === 4 && row.tblName.split(';')[0]==='GEO' && row.tblName.split(';')[1]==='WMS'){
        //값 가져오는 지오서버 WMS
        var url = source.getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:'+mapSrid,{'INFO_FORMAT': 'application/json'});
        if (url) {
            $.ajax({
                url: url,
                success: function (obj) {
                    var featuresInfo = obj.features;
                    if(featuresInfo.length === 0){
                        setDivDataInfo(null,false, null);
                    } else {
                        mapApi.getGetTableComment(row.tblName.split(';')[3].split(':')[1], featuresInfo[0].properties, setDivDataInfo);
                    }
                }
            });

            // fetch 가 최신 기술이긴하나. 익스에서 지원하지 않음..
            /*
            fetch(url)
                .then(function (response) {
                    return response.text();
                })
                .then(function (str) {
                    var featuresInfo = JSON.parse(str).features;
                    if(featuresInfo.length === 0){
                        setDivDataInfo(null,false, null);
                    } else {
                        mapApi.getGetTableComment(row.tblName.split(';')[3].split(':')[1], featuresInfo, setDivDataInfo);
                    }
                });
            */
        }
    } else {
        //WFS 값 가져오기 (GeoServer, 기본 서버 WFS 값 가져오기)
        source.getFeaturesAtCoordinate(evt.coordinate)[0].getProperties();
        var featuresInfo = source.getFeaturesAtCoordinate(evt.coordinate);
        if(featuresInfo.length === 0){
            setDivDataInfo(null,false, null);
        } else {
            var properties = featuresInfo[0].getProperties();
            delete properties["geometry"];
            mapApi.getGetTableComment(row.tblName, properties, setDivDataInfo);
        }
    }
};

// layer 선택시 발생하는 이벤트
var layerFocusEvent = function (ev) {
    // legend 관련
    setFocusLayerForLegend();
    // 시계열 관련 이벤트
    setFocusLayerForTimeSeries();
};

// layer 선택시 시계열 변경 이벤트
var setFocusLayerForTimeSeries = function () {
    var row = grid.getRow(grid.getFocusedCell().rowKey);
    if(row == null || row.type === 'baseLayer') {
        $('#'+idDivTimeseries).hide();
    } else {
        var layer = olMap.getLayersByName(row.name);
        var timeSeriesOlLayer = layer.get("timeSeriesOlLayer");
        if(timeSeriesOlLayer.length > 0){
            timeSeriesLayerName = row.name;
            var tcfTimeSeries = olMap.getVisibleTimeSeriesLayer(row.name).get("timeSeries");
            var timeSeriesDesc = JSON.parse(tcfTimeSeries.timeSeriesDesc);
            $('#' + idInputTimeseries)[0].max = (timeSeriesOlLayer.length-1);
            $('#' + idInputTimeseries).val(timeSeriesDesc.index);
            timeSeriesLayerIdx = timeSeriesDesc.index;
            $('#' + idLabelTimeseries).html(timeSeriesDesc.name);
            $('#'+idDivTimeseries).show();
        } else {
            $('#' + idInputTimeseries)[0].max = 0;
            $('#' + idInputTimeseries).val(0);
            $('#' + idLabelTimeseries).html('');
            $('#'+idDivTimeseries).hide();
        }
    }
};

// layer 선택시 legend 변경 이벤트
var setFocusLayerForLegend = function () {
    var row = grid.getRow(grid.getFocusedCell().rowKey);
    if(row == null || row.type === 'baseLayer') {
        $('#'+idDivLegend).hide();
    } else if(row.tblName.split(';').length === 4 && row.tblName.split(';')[0]==='GEO' && row.tblName.split(';')[1]==='WMS'){
        var imageSrc = olMap.getGeoServerWmsLegend(olMap.getLayersByName(row.name), olMap.olMap.getView().getResolution(), {'WIDTH': '50', 'legend_options': 'fontAntiAliasing:true;dpi:120'});
        $('#'+idImgLegend).attr("src",imageSrc);
        $('#'+idDivLegend).show();
    } else if(row.tblName.split(';').length === 4 && row.tblName.split(';')[0]==='GEO' && row.tblName.split(';')[1]==='WFS'){
        //todo WMS legend
        $('#'+idDivLegend).hide();
    } else {
        //todo 기본 legend
        $('#'+idDivLegend).hide();
    }
};

//데이터 출력 부분
var setDivDataInfo = function (featuresInfo, isDisplay, comments) {
    if (isDisplay) {
        var html = '';
        //첫번째 정보를 표기함.
        for (var key in featuresInfo) {
            var keyNm = '';
            if (comments != null) {
                for (var i = 0; i < comments.length; i++) {
                    if (comments[i].column_name === key)
                        keyNm = comments[i].column_comment;
                }
            }
            if (keyNm === '')
                keyNm = key;

            html = html +
                '<li class="list-group-item">' +
                keyNm + ' : ' + featuresInfo[key] +
                '</li>';
        }
        $('#' + idDivDataInfo).html('<ul class="list-group list-group-flush">' + html + '</ul>');
        $('#' + idDivDataInfo).show();

    } else {
        $('#' + idDivDataInfo).html('');
        $('#' + idDivDataInfo).hide();
    }

};

// 드로우한 레이어를 WKT로 가져옴.
var getDrawLayer = function(src, dest) {
    return olMap.getDrawLayerToWKT(src, dest);
};

// 주소 코드를 이용하여 이동함.
var gotoAddrAdm = function (admCd) {
    mapApi.getAddrExtentByCd('z_sop_bnd_adm_dong_pg','adm_dr_cd',admCd,'EPSG:3857', olMap.gotoExtent);
};

//주소값을 input에 입력
var setAddr= function(result, uiId, addrValue){
    $('#'+uiId).val(result.value);
    addrValue = {
        cd : result.cd,
        value : result.value
    };
};

//데이터 그리드 초기화 Set
var initData = function (data) {
    if(data == null){
        cmmApi.getTcfDatList(cbInitData);
    } else {
        cmmApi.getTcfDat(data, cbInitData);
    }
};

//데이터 그리드 초기화 콜백
var cbInitData = function (tcfDatList) {
    dataGrid.resetData(tcfDatList);
    //$('#div-data-grid').hide();
};

//레이어 그리드 초기화
var initLayer = function () {
    cmmApi.getTcfLayList(mapSno, cbInitLayer);
};

//레이어 그리드 초기화 콜백
var cbInitLayer = function (layers) {
    layers.forEach(function (layer) {
        if(Number(layer.datSno) === -1) {
            olMap.addBaseLayer(baseMap[layer.layNm.split('.')[0]][layer.layNm.split('.')[1]], [14152184.52292413, 4277309.80028221], 13);
            grid.resetData(olMap.getLayerListJson('layer,baseLayer'));
        }
    });
    layers.forEach(function (layer) {
        if(Number(layer.datSno) !== -1) {
            getLayerToStyle(layer);
        }
    });
    initAddr();
    initSingleClickEvent();
};

// 새로운 레이어 추가
var addNewLayer = function () {
    var row = dataGrid.getRow(dataGrid.getFocusedCell().rowKey);
    var idx = dataGrid.getRowCount();
    var data = {
        datSno : row.datSno,
        mapSno : mapSno,
        layNm : row.datNm,
        layVisYn : 'Y',
        layIdx : idx,
    };
    cmmApi.saveTcfLay(data, cbAddNewLayerStyle, row);
};

// 새로운 레이어 스타일 추가 콜백
var cbAddNewLayerStyle = function (res, dat) {
    var style = '';
    if(dataGrid.getRow(4).tblNm.split(';').length === 4 && dataGrid.getRow(4).tblNm.split(';')[1] === 'WFS'){
        //지오서버에서 스타일을 가져와 저장하려면 다른 방식으로 해야함. 현재는 지오서버에서 스타일을 지정해야함.
        var data = {
            laySno : res.laySno,
            styleText : ''
        };
    } else {
        var type = dat.geomType.toUpperCase();
        if(type === 'MULTIPOLYGON' || type=== 'POLYGON') {
            style = olStyle.getPolygonStyle(olStyle.getStroke(random_rgb(), 1) , olStyle.getFillStyle(random_rgba()));
        } else if(type=== 'MULTIPOINT' || type === 'POINT'){
            style = olStyle.getSvgCircleStyle(random_rgb(), 1,random_rgb(), 5);
        } else if(type=== 'MULTILINESTRING' || type === 'LINESTRING'){
            style = olStyle.getLineStyle(olStyle.getStroke(random_rgb(), 1));
        } else {
            //todo 추후 다른 타입
        }
        var data = {
            laySno : res.laySno,
            styleText : olStyle.getStringStyle(style)
        };
    }
    cmmApi.saveTcfLayStyle(data, cbAddNewLayer);
};

// 새로운 레이어 추가 콜백
var cbAddNewLayer =function(style){
    var row = dataGrid.getRow(dataGrid.getFocusedCell().rowKey);
    var layer = {laySno : style.laySno, layNm : row.datNm};
    addLayer(layer, style, row);
};

// 레이어 값을 이용하여 데이터 정보를 가져옴
var getLayerToData = function (layer, style) {
    if(layer.datSno != -1) {
        cmmApi.getTcfDatBySno(layer.datSno, layer, style, addLayer, null, null);
    }
};

// 레이어 값을 이용하여 스타일 정보를 가져옴
var getLayerToStyle = function (layer) {
    cmmApi.getTcfLayStyleBySno(layer, getLayerToData);
};

//레이어 추가함.
var addLayer = function (layer, style, data) {
    if(data.tblNm.split(';').length === 4 && data.tblNm.split(';')[0]==='GEO'){
        addGeoLayer(layer, style, data);
    } else {
        var olLayer = olMap.addVectorLayer(serverMapHost + '/geoCalc/getMap', 'EPSG:'+mapSrid, minResolution, maxResolution, style, null, layer, data);
        grid.resetData(olMap.getLayerListJson('layer,baseLayer'));
        $('#div-data-grid').hide();
        getTimeSeriesList(olLayer);
    }
};

//지오서버 레이어 추가함
var addGeoLayer = function (layer, style, data) {
    cmmApi.getTcfDatSrcBySno(layer, style, data, _addGeoLayer);
};

//지오서버 레이어 추가 콜백 함수
var _addGeoLayer = function (layer, style, data, src) {
    var olLayer;
    if(data.tblNm.split(';').length === 4 && data.tblNm.split(';')[1]==='WFS'){
        olLayer = olMap.addGeoServerWFSLayer(src[0].srcUrl, 'EPSG:'+mapSrid, minResolution, maxResolution, style, null, layer, data);
    } else {
        olLayer = olMap.addGeoServerWMSLayer(src[0].srcUrl, 'EPSG:'+mapSrid, minResolution, maxResolution, style, null, layer, data);
    }
    olLayer.set("url", src[0].srcUrl);
    grid.resetData(olMap.getLayerListJson('layer,baseLayer'));
    $('#div-data-grid').hide();
    getTimeSeriesList(olLayer);
};

// 해당 레이어의 시계열 레이어 목록 가져옴 
var getTimeSeriesList= function(olLayer){
    var data = {
        laySno : olLayer.get("tcfLay").laySno
    };
    cmmApi.getTcfDatTimeSeries(olLayer, data, _getTimeSeriesList);
};
// 시계열 레이어 목록 콜백 함수
var _getTimeSeriesList= function(olLayer, res){
    olLayer.set("timeSeriesOlLayer", []);
    if(olLayer.get("tcfDat").datSno != -1) {
        res.forEach(function (item) {
            cmmApi.getTcfDatBySno(item.datSno, olLayer, olLayer.get("style"), addTimeSeriesLayer, null, item);
            }
        );
        if(res.length > 0){
            $('#'+idInputTimeseries)[0].max = (res.length-1);
            olLayer.setVisible(false);
        }
    }
};
// 시계열 레이어를 추가
var addTimeSeriesLayer = function (layer, style, data, tcfTimeSeries) {
    var olLayer;
    if(data.tblNm.split(';').length === 4 && data.tblNm.split(';')[0]==='GEO' && data.tblNm.split(';')[1]==='WFS'){
        var st = olStyle.getStrToStyle(style.styleText);
        olLayer = mapApi.getGeoServerVectorLayerExtend(layer.get("url"), 'EPSG:'+mapSrid, minResolution, maxResolution, st, data);
    } else if(data.tblNm.split(';').length === 4 && data.tblNm.split(';')[0]==='GEO' && data.tblNm.split(';')[1]==='WMS'){
        olLayer = mapApi.getGeoServerTileLayerExtend(layer.get("url"), minResolution, maxResolution, data);
    } else {
        var st = olStyle.getStrToStyle(style.styleText);
        olLayer = mapApi.getVectorLayerExtend(serverMapHost + '/geoCalc/getMap', 'EPSG:'+mapSrid, minResolution, maxResolution, st, data);
    }
    olMap.olMap.addLayer(olLayer);
    olLayer.set("timeSeries", tcfTimeSeries);
    if(JSON.parse(tcfTimeSeries.timeSeriesDesc).index != 0){
        olLayer.setVisible(false);
    } else {
        $('#' + idLabelTimeseries).html(JSON.parse(tcfTimeSeries.timeSeriesDesc).name);
        olLayer.setVisible(true);
    }
    layer.get("timeSeriesOlLayer").push(olLayer);
};

// 다운로드
var download = function() {
    var row = grid.getRow(grid.getFocusedCell().rowKey);
    if(row == null) {
        alert("레이어를 선택해주세요");
        return;
    }
    if(row.type === "baseLayer") {
        alert("base 레이어가 아닌 레이어를 선택해주세요");
        return;
    }
    var area = getDrawLayer(mapSrid, row.srid);
    if(area == null) {
        alert("다운로드 받을 영역을 선택해주세요");
        return;
    }
    fileApi.zipFileDownload(area, row);
    measure.measureLayer('None');
};

//데이터 그리드 창 토글
var toggleDataGrid = function () {
    $('#div-data-grid').toggle();
    $('#div-download').hide();
    $('#div-measure').hide();
    $('#div-addr').hide();
    $('#div-style-text').hide();
    $('#div-style').hide();
};

//다운로드 창 토글
var toggleDownload = function () {
    $('#div-data-grid').hide();
    $('#div-download').toggle();
    $('#div-measure').hide();
    $('#div-addr').hide();
    $('#div-style-text').hide();
    $('#div-style').hide();
};

//Measure 창 토글
var toggleMeasure = function () {
    $('#div-data-grid').hide();
    $('#div-download').hide();
    $('#div-measure').toggle();
    $('#div-addr').hide();
    $('#div-style-text').hide();
    $('#div-style').hide();
};
var toggleAddr = function () {
    $('#div-data-grid').hide();
    $('#div-download').hide();
    $('#div-measure').hide();
    $('#div-addr').toggle();
    $('#div-style-text').hide();
    $('#div-style').hide();
};

//텍스트 스타일 창 토글
var toggleStyleText = function () {
    if($('#div-style-text').is(':visible')){
        currentLayer = null;
    } else {
        var row = grid.getRow(grid.getFocusedCell().rowKey);
        if(row == null) {
            alert("레이어를 선택해주세요");
            return;
        }
        if(row.type === "baseLayer") {
            alert("base 레이어가 아닌 레이어를 선택해주세요");
            return;
        }
        currentLayer = olMap.getLayersByName(row.name);
        var styleText = currentLayer.get("styleStr");
        $('#input-style-text').val(styleText);
    }
    $('#div-data-grid').hide();
    $('#div-download').hide();
    $('#div-measure').hide();
    $('#div-addr').hide();
    $('#div-style-text').toggle();
    $('#div-style').hide();
};

// 텍스트 스타일 셋
var setStyleText = function () {
    if(currentLayer != null){
        var styleText = $('#input-style-text').val();
        var style = olStyle.getStrToStyle(styleText);
        currentLayer.setStyle(style);
        var sty = currentLayer.get("style", style);
        sty.styleText = styleText;
        currentLayer.set("style", sty);
        currentLayer.set("styleStr", styleText);
    }
    toggleStyleText();
};


// 스타일 창 토글
var toggleStyle = function () {
    var div = $('#div-style');
    if(div.is(':visible')){
        currentLayer = null;
    } else {
        var row = grid.getRow(grid.getFocusedCell().rowKey);
        if(row == null) {
            alert("레이어를 선택해주세요");
            return;
        }
        if(row.type === "baseLayer") {
            alert("base 레이어가 아닌 레이어를 선택해주세요");
            return;
        }
        currentLayer = olMap.getLayersByName(row.name);
        olStyle.setColorPickerLineColor(currentLayer);
        olStyle.setColorPickerFillColor(currentLayer);
        olStyle.setStrokeWidth(currentLayer);
        olStyle.setRadiusWidth(currentLayer);
    }
    $('#div-data-grid').hide();
    $('#div-download').hide();
    $('#div-measure').hide();
    $('#div-addr').hide();
    $('#div-style-text').hide();
    div.toggle();
};

// input 값 변경에 따른 시계열 레이어 변경 이벤트
var idInputTimeSeriesChangeEvent = function(idx){
    setDivDataInfo(null, false, null);
    this.timeSeriesLayerIdx = idx;
    olMap.getTimeSeriesLayerList(this.timeSeriesLayerName).forEach(function (item) {
        item.setVisible(false);
    });
    var olLayer = olMap.getTimeSeriesLayer(this.timeSeriesLayerName, idx)
    olLayer.setVisible(true);
    $('#' + idLabelTimeseries).html(JSON.parse(olLayer.get("timeSeries").timeSeriesDesc).name);
};

