var locSido;
var locSigungu;
var locAdm;
var grid;
var dataGrid;
var mapSno = 1; //임시 맵 sno
var init = function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    olMap.addBaseLayer(vworldSrc.vector, [14137575.330745745, 4300621.372044271], 13);
    var styleStr = "new ol.style.Style({" +
        "stroke: new ol.style.Stroke({" +
            "color: 'yellow'," +
            "width: 1" +
        "})," +
        "fill: new ol.style.Fill({ " +
            "color: 'rgba(0, 0, 255, 0.1)'" +
        "})" +
    "});";
    //olMap.addVectorLayer('sigungu', '/geoCalc/getMap', 'z_sop_bnd_sigungu_pg', 5181, 3857, 0,90,  styleStr);
    //map.addVectorTileLayer('sigungu', '/geoCalc/getMap', 'f00_adm_legalemd', 5181, 3857, 90, f00_adm_legalemd_style);

    initLayer();

    olMap.olMap.on('moveend', function (e) {
        var coord = olMap.olMap.getView().getCenter();
        console.log(coord);
        mapApi.getAddrByPoint('z_sop_bnd_sido_pg', 'sido_nm', 'sido_cd', coord, 'input-sido', locSido, 3857, 5181, setAddr);
        mapApi.getAddrByPoint('z_sop_bnd_sigungu_pg', 'sigungu_nm', 'sigungu_cd', coord, 'input-sigungu', locSigungu, 3857, 5181, setAddr);
        mapApi.getAddrByPoint('z_sop_bnd_adm_dong_pg', 'adm_dr_nm', 'adm_dr_cd', coord, 'input-adm', locAdm, 3857, 5181, setAddr);
    });

    grid = new tui.Grid({
        el: document.getElementById('grid'), // Container element
        scrollX: false,
        scrollY: false,
        /*treeColumnOptions: {
            name: 'name',
            /!*useCascadingCheckbox: true*!/
        },*/
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
    //grid.resetData(map.getLayerListJson('layer'));
    grid.resetData(olMap.getLayerListJson('layer,baseLayer'));

    /*grid.on('focusChange', function(ev) {
        grid.setSelectionRange({
            start: [ev.rowKey, 0],
            end: [ev.rowKey, grid.getColumns().length]
        });
    });*/

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
    var selectedRowKey = null;
    /*dataGrid.on('mouseover', function(ev) {
        if(selectedRowKey) {
            for (var i = 0; i <dataGrid.getRowCount(); i++) {
                dataGrid.removeRowClassName(selectedRowKey, 'mouse-select');
            }
        }
        selectedRowKey = ev.rowKey;
        dataGrid.addRowClassName(selectedRowKey, 'mouse-select');
    });*/
    /*dataGrid.on('mouseout', function(ev) {
        for (var i = 0; i <dataGrid.getRowCount(); i++) {
            dataGrid.removeRowClassName(selectedRowKey, 'mouse-select');
        }
    });*/


    tui.Grid.applyTheme('clean');
    gridDataSet(null);
};
var getDrawLayer = function(src, dest) {
    return olMap.getDrawLayerToWKT(src, dest);
};

var gotoAddrAdm = function (value) {
    mapApi.getAddrExtentByCd('z_sop_bnd_adm_dong_pg','adm_dr_cd','2403054',3857, olMap.gotoExtent);
};

var setAddr= function(result, uiId, addrValue){
    $('#'+uiId).val(result.value);
    addrValue = {
        cd : result.cd,
        value : result.value
    };
};

var gridDataSet = function (data) {
    if(data == null){
        cmmApi.getTcfDatList(cbGridDataSet);
    } else {
        cmmApi.getTcfDat(data, cbGridDataSet);
    }
};

var cbGridDataSet = function (tcfDatList) {
    dataGrid.resetData(tcfDatList);
    $('#div-data-grid').hide();
};

var initLayer = function () {
    cmmApi.getTcfLayList(mapSno, cbInitLayer);
};

var cbInitLayer = function (layers) {
    layers.forEach(function (layer) {
        layerToData(layer);
    });
};

var addNewLayer = function () {
    var row = dataGrid.getRow(dataGrid.getFocusedCell().rowKey);
    var idx = dataGrid.getRowCount();
    var data = {
        datSno : row.datSno,
        mapSno : mapSno,
        layNm : row.datNm,
        layVisYn : 'Y',
        layIdx : idx
    };
    cmmApi.saveTcfLay(data, cbAddNewLayer);
};
var cbAddNewLayer =function(){
    var row = dataGrid.getRow(dataGrid.getFocusedCell().rowKey);
    var layer = {layNm : row.datNm};
    addLayer(layer, row);
};

var layerToData = function (layer) {
    cmmApi.getTcfDatBySno(layer, addLayer);
};
var addLayer = function (layer, data) {
    var styleStr = "new ol.style.Style({" +
        "stroke: new ol.style.Stroke({" +
        "color: '"+random_rgb()+"'," +
        "width: 1" +
        "})," +
        "fill: new ol.style.Fill({ " +
        "color: '"+random_rgba()+"'" +
        "})" +
        "});";
    olMap.addVectorLayer(layer.layNm, serverMapHost + '/geoCalc/getMap', data.tblNm, data.srid, 3857, 0, 200, styleStr);
    grid.resetData(olMap.getLayerListJson('layer,baseLayer'));
};

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

var toggleDataGrid = function () {
    $('#div-data-grid').toggle();
    $('#div-download').hide();
    $('#div-measure').hide();
    $('#div-addr').hide();
};
var toggleDownload = function () {
    $('#div-data-grid').hide();
    $('#div-download').toggle();
    $('#div-measure').hide();
    $('#div-addr').hide();
};
var toggleMeasure = function () {
    $('#div-data-grid').hide();
    $('#div-download').hide();
    $('#div-measure').toggle();
    $('#div-addr').hide();
};
var toggleAddr = function () {
    $('#div-data-grid').hide();
    $('#div-download').hide();
    $('#div-measure').hide();
    $('#div-addr').toggle();
};


