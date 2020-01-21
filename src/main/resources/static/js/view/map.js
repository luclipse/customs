var locSido;
var locSigungu;
var locAdm;
var grid;
var dataGrid;
var currentLayer = null;

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
};
var initAddr = function () {
//주소를 가져온다.
    olMap.olMap.on('moveend', function (e) {
        //현재 중간점의 좌표를 가져옴
        var coord = olMap.olMap.getView().getCenter();
        // 시도 주소
        mapApi.getAddrByPoint('z_sop_bnd_sido_pg', 'sido_nm', 'sido_cd', coord, 'input-sido', locSido, 'EPSG:3857', 'EPSG:5181', setAddr);
        // 시군구 주소
        mapApi.getAddrByPoint('z_sop_bnd_sigungu_pg', 'sigungu_nm', 'sigungu_cd', coord, 'input-sigungu', locSigungu, 'EPSG:3857', 'EPSG:5181', setAddr);
        // 읍면동 주소
        mapApi.getAddrByPoint('z_sop_bnd_adm_dong_pg', 'adm_dr_nm', 'adm_dr_cd', coord, 'input-adm', locAdm, 'EPSG:3857', 'EPSG:5181', setAddr);
    });
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
            olMap.addBaseLayer(baseMap[layer.layNm.split('.')[0]][layer.layNm.split('.')[1]], [14137575.330745745, 4300621.372044271], 13);
            grid.resetData(olMap.getLayerListJson('layer,baseLayer'));
        }
    });
    layers.forEach(function (layer) {
        if(Number(layer.datSno) !== -1) {
            getLayerToStyle(layer);
        }
    });
    initAddr();
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
            //추후 다른 타입
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
    var layer = {layNm : row.datNm};
    addLayer(layer, style, row);
};

// 레이어 값을 이용하여 데이터 정보를 가져옴
var getLayerToData = function (layer, style) {
    if(layer.datSno != -1) {
        cmmApi.getTcfDatBySno(layer, style, addLayer);
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
        olMap.addVectorLayer(serverMapHost + '/geoCalc/getMap', 'EPSG:3857', 0, 200, style, null, layer, data);
        grid.resetData(olMap.getLayerListJson('layer,baseLayer'));
        $('#div-data-grid').hide();
    }
};

//지오서버 레이어 추가함
var addGeoLayer = function (layer, style, data) {
    cmmApi.getTcfDatSrcBySno(layer, style, data, _addGeoLayer);
};

//지오서버 레이어 추가 콜백 함수
var _addGeoLayer = function (layer, style, data, src) {
    if(data.tblNm.split(';').length === 4 && data.tblNm.split(';')[1]==='WFS'){
        olMap.addGeoServerWFSLayer(src[0].srcUrl, 'EPSG:3857', 0, 200, style, null, layer, data);
    } else {
        olMap.addGeoServerWMSLayer(src[0].srcUrl, 'EPSG:3857', 0, 200, style, null, layer, data);
    }

    grid.resetData(olMap.getLayerListJson('layer,baseLayer'));
    $('#div-data-grid').hide();
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


