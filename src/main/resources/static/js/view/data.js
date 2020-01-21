var dataGrid;
var zipFileInput = document.getElementById("zipFile");
var sridInput = document.getElementById("input-srid");
var fileList = [];
var fileType = "";
var tableDataId = 'table-data';
var tableGeoColumId = 'table-geo-colum';
var tcfDatList = null;
var geoColumnList = null;
var selDatasrcListId = 'sel-datasrc-list';
var tcfDatSrcList = null;
var geoServerLayerList = null;

//초기화
var init = function () {
    selDatasrcListInit();
    getTcfDat(null);
    getGeoColumn();
    $('#'+ selDatasrcListId).change(selDatasrcListChange);
};

//TcfDat를 반환함
var getTcfDat = function (data) {
    if(data == null){
        cmmApi.getTcfDatList(_gridDataSet);
    } else {
        cmmApi.getTcfDat(data, _gridDataSet);
    }
};

//_gridDataSet 콜백함수
var _gridDataSet = function (tcfDatList) {
    this.tcfDatList = tcfDatList;
    var tableData = $('#'+tableDataId);
    var html = '';
    tableData.empty();
    if(tcfDatList.length <= 0){
        html =
            ' <tr>' +
            '      <td colspan="5" class="text-center"><h3>데이터 없음</h3></td>' +
            '</tr>';
        tableData.append(html);
    } else {
        var idx = 1;
        tcfDatList.forEach(function (item, idx) {
            var cnt = item.datCnt;
            if(cnt == -1) {
                cnt = '';
            }
            var d = new Date(item.mdfDt),
                dformat = [d.getFullYear(),(d.getMonth()+1).padLeft(),
                        d.getDate().padLeft()].join('-') +' ' +
                    [d.getHours().padLeft(),
                        d.getMinutes().padLeft(),
                        d.getSeconds().padLeft()].join(':');

            html =
                '<tr>' +
                    '<td>'+ (idx+1) +'</td>' +
                    '<td><input type="checkbox" id="cb_tcfdat_'+idx+'" value="'+idx+'"></td>' +
                    '<td class="text-center">'+ item.datNm +'</td>' +
                    '<td class="text-center">'+ dformat +'</td>' +
                    '<td class="text-center">'+ cnt +'</td>' +
                    '<td class="text-center">' +
                    '<div class="dropdown">' +
                        '<button class="btn btn-primary btn-sm" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                            '설정' +
                        '</button>' +
                        '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' +
                        '<a class="dropdown-item" href="#" onclick="settingTcfDat('+idx+',\'del\')">삭제</a>' +
                    '</div>' +
                    '</div>' +
                    '</td>' +
                '</tr>';
            tableData.append(html);
        });
    }
};

//TcfDat의 셋팅 메뉴 
var settingTcfDat = function(idx, action) {
    var data = this.tcfDatList[idx];
    if(action === 'del'){
        _deleteDat(data.datSno);
    }
    //todo 셋팅 메뉴 개발해야함.
};

//TcfDat의 저장함수의 콜백함수
var saveDat = function (inputs) {
    var data = {};
    Object.keys(inputs).forEach(function (value) {
        data[value] = $('#'+inputs[value]).val();
    });
    cmmApi.saveTcfDat(data, _saveDat);
};

//TcfDat의 저장함수의 콜백함수
var _saveDat = function(res){
    getTcfDat(null);
    divTableListShow();
    toggleDatGrid('hide');
};

//레이어를 그리드에 셋팅함
var gridLayerSet = function (data) {
    if(data == null){
        cmmApi.getTcfDatList(_gridDataSet);
    } else {
        cmmApi.getTcfDat(data, _gridDataSet);
    }
};

// 해당 file이 gis 파일인지 확인함
var isGISFiles = function() {
    if(fileList.length <= 0) {
        return "";
    }
    // shp 파일 확인
    var shp = ["shp", "shx", "dbf"];
    var isShps = [false, false, false];
    for (var i = 0; i < shp.length; i++) {
        isShps[i] = false;
        for (var j = 0; j <fileList.length; j++) {
            if(hasExtension(fileList[j], shp[i])){
                isShps[i] = true;
            }
        }
    }
    if(isShps[0] && isShps[1] && isShps[2]){
        return "shp";
    } else if (isShps[0] || isShps[1] || isShps[2]) {
        if(!isShps[0]) {
            return "No shp FILE";
        } else if(!isShps[1]) {
            return "No shx FILE";
        } else {
            return "No dbf FILE";
        }
    }
    if(fileList.length === 0) {
        // KML 파일 확인
        if(hasExtension(fileList[0], "kml")){
            return "kml";
        }
        // GEOJSON 파일 확인
        if(hasExtension(fileList[0], "json|geojson")) {
            return "geojson";
        }
    }
    return "Please select correct file format";
};

// 확장자가 맞는지 확인
var hasExtension = function(fileNm, exts) {
    //exts = "docx|doc|pdf|xml|bmp|ppt|xls";
    var val = fileNm.toLowerCase();
    var regex = new RegExp("(.*?)\.("+exts+")$");
    return regex.test(val);
};

// 파일업로드 관련 함수들
(function(obj) {
    zip.workerScriptsPath = "/js/lib/zip/";
    var requestFileSystem = obj.webkitRequestFileSystem || obj.mozRequestFileSystem || obj.requestFileSystem;

    function onerror(message) {
        alert(message);
    }

    function createTempFile(callback) {
        var tmpFilename = "tmp.dat";
        requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function(filesystem) {
            function create() {
                filesystem.root.getFile(tmpFilename, {
                    create : true
                }, function(zipFile) {
                    callback(zipFile);
                });
            }

            filesystem.root.getFile(tmpFilename, null, function(entry) {
                entry.remove(create, create);
            }, create);
        });
    }

    var model = (function() {
        var URL = obj.webkitURL || obj.mozURL || obj.URL;

        return {
            getEntries : function(file, onend) {
                zip.createReader(new zip.BlobReader(file), function(zipReader) {
                    zipReader.getEntries(onend);
                    zipReader.close();
                }, onerror);
            },
            /*
            getEntryFile : function(entry, creationMethod, onend, onprogress) {
                var writer, zipFileEntry;

                function getData() {
                    entry.getData(writer, function(blob) {
                        var blobURL = creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL();
                        onend(blobURL);
                    }, onprogress);
                }

                if (creationMethod == "Blob") {
                    writer = new zip.BlobWriter();
                    getData();
                } else {
                    createTempFile(function(fileEntry) {
                        zipFileEntry = fileEntry;
                        writer = new zip.FileWriter(zipFileEntry);
                        getData();
                    });
                }
            }*/
        };
    })();

    (function() {
        //var unzipProgress = document.createElement("progress");
        //var fileList = document.getElementById("file-list");

        //var creationMethodInput = document.getElementById("creation-method-input");
        var creationMethodInput = {
            value : "Blob"
        };
    /*
        function download(entry, li, a) {
            model.getEntryFile(entry, creationMethodInput.value, function(blobURL) {
                var clickEvent = document.createEvent("MouseEvent");

                if (unzipProgress.parentNode)
                    unzipProgress.parentNode.removeChild(unzipProgress);
                unzipProgress.value = 0;
                unzipProgress.max = 0;
                clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.href = blobURL;
                a.download = entry.filename;
                a.dispatchEvent(clickEvent);
            }, function(current, total) {
                unzipProgress.value = current;
                unzipProgress.max = total;
                li.appendChild(unzipProgress);
            });
        }
*/

        /*if (typeof requestFileSystem == "undefined")
            creationMethodInput.options.length = 1;*/

        zipFileInput.addEventListener('change', function() {
            fileList = [];
            //fileInput.disabled = true;
            model.getEntries(zipFileInput.files[0], function(entries) {
                //fileList.innerHTML = "";
                entries.forEach(function(entry) {
                    fileList.push(entry.filename);
                    /*
                    var li = document.createElement("li");
                    var a = document.createElement("a");
                    a.textContent = entry.filename;
                    a.href = "#";
                    a.addEventListener("click", function(event) {
                        if (!a.download) {
                            download(entry, li, a);
                            event.preventDefault();
                            return false;
                        }
                    }, false);
                    li.appendChild(a);
                    fileList.appendChild(li);
                    */
                });
                fileType  = isGISFiles();
            });

        }, false);
    })();

})(this);

// zip 파일 업로드 함수
var zipFileUpload = function (saveFileToDat, fileApiAlert, cbSaveDat) {
    if(zipFileInput.files.length <= 0) {
        alert("select Zip File");
    } else if(fileType !== "shp" && fileType !== "kml" && fileType !== "geojson" ) {
        alert(fileType);
    }
    fileApi.zipFileToPostGis(saveFileToDat, fileApiAlert, cbSaveDat)
};

// 데이터 그리드를 토굴함
var toggleDatGrid = function(action) {
    $('#div-upload-grid').hide();
    if(action === 'show'){
        $('#div-dat-grid').modal('show');
    } else {
        $('#div-dat-grid').modal('hide');
    }
};
// 데이터 업로드 화면을 토굴함 
var toggleUploadGrid = function() {
    $('#div-dat-grid').modal('hide');
    $('#div-upload-grid').toggle();
};

//데이터를 삭제함
var deleteDat = function(){
    var row = dataGrid.getRow(dataGrid.getFocusedCell().rowKey);
    var datSno = null;
    if(row != null) {
        datSno = row.datSno;
    }
    _deleteDat(datSno);
};

//데이터를 삭제함
var _deleteDat = function (datSno) {
    if(datSno == null) {
        alert("데이터를 선택해주세요");
        return;
    }
    if(confirm("삭제 하시겠습니까?")) {
        var data = {datSno : datSno};
        cmmApi.removeTcfDat(data, __deleteDat);
    }
};

//데이터를 삭제후 다시 가져옴
var __deleteDat = function(res){
    getTcfDat(null);
};

//데이터 div를 출력함
var divDatListShow = function() {
    $('#div-table-list').hide();
    $('#div-dat-list').show();
};

//테이블 div를 출력함
var divTableListShow = function() {
    $('#div-dat-list').hide();
    $('#div-table-list').show();
};

// 지오메트리 테이블을 가져옴
var getGeoColumn = function () {
    mapApi.getGeometryTable(_getGeoColumn);
};

// 지오메트리 테이블을 가져오고 콜백 함수
var _getGeoColumn = function (geoColumns) {
    this.geoColumnList = geoColumns;
    var tableData = $('#'+tableGeoColumId);
    tableData.empty();
    if(geoColumns.length <= 0){
        tableData.append(emptyTableGeoColum());
    } else {
        var idx = 1;
        geoColumns.forEach(function (item, idx) {
            tableData.append(addTableGeoColum(idx, item.f_table_name, item.srid, item.type, 'settingGeoColumn('+idx+',\'add\')'));
        });
    }
};

// 지오메트리 테이블이 없을때 처리 함수
var emptyTableGeoColum = function () {
    return  '<tr>' +
            '<td colspan="5" class="text-center"><h3>데이터 없음</h3></td>' +
            '</tr>';
};

// 지오메트리 테이블을 가져와 테이블로 출력
var addTableGeoColum= function(idx, name, srid, type, addFuction) {
    return  '<tr>' +
            '<td>'+ (idx+1) +'</td>' +
            /*'<td><input type="checkbox" id="cb_geocolumn_'+idx+'" value="'+idx+'"></td>' +*/
            '<td class="text-center">'+ name +'</td>' +
            '<td class="text-center">'+ srid +'</td>' +
            '<td class="text-center">'+ type +'</td>' +
            '<td class="text-center">' +
            '<div class="dropdown">' +
            '<button class="btn btn-primary btn-sm" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
            '설정' +
            '</button>' +
            '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' +
            '<a class="dropdown-item" href="#" onclick="'+addFuction+'">데이터 추가</a>' +
            '</div>' +
            '</div>' +
            '</td>' +
            '</tr>';
};

// 지오메트리 테이블의 셋팅 함수
var settingGeoColumn = function (idx, action) {
    var data = this.geoColumnList[idx];
    if(action === 'add'){
        addGeoColumn(data)
    }
};

// 지오메트리 테이블을 데이터로 추가 화면 출력
var addGeoColumn = function(geoColumn){
    initDatInput();
    $('#input-tblNm').val(geoColumn.f_table_name);
    toggleDatGrid('show');
};

// 데이터 소스 목록을 초기화
var selDatasrcListInit = function () {
    //기본 데이터 베이스
    var $selDatasrcList = $('#'+ selDatasrcListId);
    $selDatasrcList.empty();
    $selDatasrcList.append($('<option>', {
        value: 'DB-BASE',
        text : '데이터베이스'
    }));
    cmmApi.getTcfDatSrc(_selDatasrcListInit);
};

// 데이터 소스 목록을 초기화 콜백
var _selDatasrcListInit = function (items) {
    this.tcfDatSrcList = items;
    var $selDatasrcList = $('#'+ selDatasrcListId);
    $.each(items, function (i, item) {
        //현재 지오서버만 지원
        if(item.srcType === 'geoserver'){
            $selDatasrcList.append($('<option>', {
                value: 'GEO-WFS-'+i,
                text : item.srcNm + ' WFS'
            }));
            $selDatasrcList.append($('<option>', {
                value: 'GEO-WMS-'+i,
                text : item.srcNm + ' WMS'
            }));
        }
    });
};

// 데이터 소스 목록을 선택 처리 함수
var selDatasrcListChange = function() {
    var value = $('#'+selDatasrcListId + ' option:selected').val();
    //기본데이터 베이스
    if(value === 'DB-BASE') {
        getGeoColumn();
    } else {
        var data = value.split("-");
        if(data[0] === 'GEO') {
            if(data[1]==='WFS'){
                getGeoServerWFS(Number(data[2]));
            } else if(data[1]==='WMS'){
                getGeoServerWMS(Number(data[2]));
            }
        }
    }
};

// 지오서버 WMS 목록을 가져옴
var getGeoServerWMS = function (idx) {
    var geoserverData = this.tcfDatSrcList[idx];
    mapApi.getGeoServerLayers(geoserverData,'WMS', _getGeoServerWMS);
};

// 지오서버 WFS 목록을 가져옴
var getGeoServerWFS = function (idx) {
    var geoserverData = this.tcfDatSrcList[idx];
    mapApi.getGeoServerLayers(geoserverData,'WFS', _getGeoServerWFS);
};

// 지오서버 WMS 목록 콜백함수
var _getGeoServerWMS = function (geoserverLayers, geoserverData) {
    this.geoServerLayerList = geoserverLayers;
    var tableData = $('#'+tableGeoColumId);
    tableData.empty();
    if(geoServerLayerList.length <= 0){
        tableData.append(emptyTableGeoColum());
    } else {
        var idx = 1;
        geoServerLayerList.forEach(function (item, idx) {
            tableData.append(addTableGeoColum(idx, item.Title, item.SRS.replace('EPSG:', ''), 'WMS', 'settingGeoServerWMS('+idx+','+geoserverData.srcSno+',\'add\')'));
        });
    }
};

// 지오서버 WFS 목록 콜백함수
var _getGeoServerWFS = function (geoserverLayers, geoserverData) {
    this.geoServerLayerList = geoserverLayers;
    var tableData = $('#'+tableGeoColumId);
    tableData.empty();
    if(geoServerLayerList.length <= 0){
        tableData.append(emptyTableGeoColum());
    } else {
        var idx = 1;
        geoServerLayerList.forEach(function (item, idx) {
            var srid = item.DefaultSRS.replace('urn:x-ogc:def:crs:', '').replace('EPSG:', '');
            tableData.append(addTableGeoColum(idx, item.Title, srid, 'WFS', 'settingGeoServerWFS('+idx+','+geoserverData.srcSno+',\'add\')'));
        });
    }
};

// 지오서버 WFS 셋팅 함수
var settingGeoServerWMS = function (idx,srcSno,action) {
    var layer = this.geoServerLayerList[idx];
    if(action === 'add'){
        addGeoServerLayerWMS(layer, srcSno);
    }
};

// 지오서버 WMS 셋팅 함수
var settingGeoServerWFS = function (idx,srcSno,action) {
    var layer = this.geoServerLayerList[idx];
    if(action === 'add'){
        addGeoServerLayerWFS(layer, srcSno);
    }
};

// 데이터 입력 초기화 함수
var initDatInput = function () {
    $('#input-datNm').val('');
    $('#input-datDesc').val('');
    $('#input-tblNm').val('');
    $('#input-datSrid').val('');
    $('#input-datwgs84bbox').val('');
    $('#input-datbbox').val('');
};

// 지오서버 WMS를 데이터로 추가 화면 출력
var addGeoServerLayerWMS = function(layer, srcSno){
    initDatInput();
    var tblNm = 'GEO;WMS;' + srcSno + ';' + layer.Name ;
    var bbox = layer.BoundingBox.minx + ',' + layer.BoundingBox.miny + ',' + layer.BoundingBox.maxx + ',' + layer.BoundingBox.maxy;
    var extent = layer.LatLonBoundingBox.minx + ',' + layer.LatLonBoundingBox.miny + ',' + layer.LatLonBoundingBox.maxx + ',' + layer.LatLonBoundingBox.maxy;
    $('#input-tblNm').val(tblNm);
    $('#input-datSrid').val(layer.SRS);
    $('#input-datwgs84bbox').val(extent);
    $('#input-datbbox').val(bbox);
    toggleDatGrid('show');
};

// 지오서버 WFS를 데이터로 추가 화면 출력
var addGeoServerLayerWFS = function(layer, srcSno){
    initDatInput();
    var SRS = layer.DefaultSRS.split(":")[4] + ":" + layer.DefaultSRS.split(":")[5];
    var tblNm = 'GEO;WFS;' + srcSno + ';' + layer.Name ;
    var extent = [
        layer['ows:WGS84BoundingBox']["ows:LowerCorner"].split(' ')[0],
        layer['ows:WGS84BoundingBox']["ows:LowerCorner"].split(' ')[1],
        layer['ows:WGS84BoundingBox']["ows:UpperCorner"].split(' ')[0],
        layer['ows:WGS84BoundingBox']["ows:UpperCorner"].split(' ')[1]
    ];
    $('#input-tblNm').val(tblNm);
    $('#input-datSrid').val(SRS);
    $('#input-datwgs84bbox').val(extent);
    toggleDatGrid('show');
};
