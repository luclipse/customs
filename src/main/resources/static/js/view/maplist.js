var divMapListId = 'div-map-list';
var modalMapInputId = 'modal-map-input';
var inputMapSnoId = 'input-map-sno';
var inputMapNameId = 'input-map-name';
var inputMapDescId = 'input-map-desc';
var btnInputSaveId = 'btn-input-save';

var mapList = null;

var init = function () {
    initMapList();
};

var initMapList = function(){
    cmmApi.getTcfMapList(_initMapList);
};

var _initMapList = function(maps){
    this.mapList = maps;
    var $DivMapListId = $("#"+divMapListId);
    $DivMapListId.empty();
    maps.forEach(function (map) {
        var desc = '';
        if(map.mapDesc == null || map.mapDesc == undefined ||map.mapDesc == ''){
            desc = '설명 없음';
        } else {
            desc = map.mapDesc;
        }
        $DivMapListId.append(
            '<div class="col-sm-4" style="margin-top: 20px" id="div-mapno-'+map.mapSno+'">' +
                '<div class="card">' +
                    '<div class="card-body" style="cursor:pointer" onclick="viewMap('+map.mapSno+')">' +
                        '<h5 class="card-title text-truncate">'+map.mapNm+'</h5>' +
                        '<p class="card-text text-truncate" >'+desc+'</p>' +
                    '</div>' +
                    '<div class="card-footer">' +
                        '<div style="float: right">'+
                            '<button type="button" class="btn btn-secondary mr-2" onclick="editMap('+map.mapSno+');">수정</button>' +
                            '<button type="button" class="btn btn-primary" onclick="delMap('+map.mapSno+');">삭제</button>' +
                        '</div>'+
                    '</div>' +
                '</div>' +
            '</div>'
        );
    });
};
var editMap = function(sno){
    $('#'+btnInputSaveId).html("수정");
    var map = getMapSno(sno);
    if(map == null) {
        return;
    }
    $('#'+inputMapSnoId).val(map.mapSno);
    $('#'+inputMapNameId).val(map.mapNm);
    $('#'+inputMapDescId).val(map.mapDesc);
    $('#'+ modalMapInputId).modal('show');
};
var getMapSno = function (sno) {
    var res = null;
    this.mapList.forEach(function (data) {
        if(Number(data.mapSno) == sno){
            res = data;
        }
    });
    return res;
};

var saveMap = function(){
    var mapNm = $('#'+inputMapNameId).val();
    var mapDesc = $('#'+inputMapDescId).val();
    var mapSno = $('#'+inputMapSnoId).val();
    var text = "등록";
    if(mapSno != null && mapSno != ''){
        text = "수정";
    }
    if(mapNm === ''){
        alert("지도 명을 입력해 주세요.");
        return;
    }
    var r = confirm("지도를 "+text+" 하시 겠습니까?");
    if (r == true) {
        var data = {
            mapSno : mapSno,
            mapNm : mapNm,
            mapDesc : mapDesc,
        };
        cmmApi.saveTcfMap(data, _saveMap);
    }
};

var _saveMap = function(){
    $('#'+inputMapNameId).val();
    $('#'+inputMapDescId).val();
    initMapList();
    closeInputModal();
};
var delMap = function(sno){
    var r = confirm("삭제 하시 겠습니까?");
    if (r == true) {
        var data = {
            mapSno : sno,
        };
        cmmApi.removeTcfMap(data, _delMap);
    }
};
var _delMap = function(){
    initMapList();
};

var closeInputModal = function () {
    $('#'+ modalMapInputId).modal('hide');
    $('#'+inputMapSnoId).val('');
    $('#'+inputMapNameId).val('');
    $('#'+inputMapDescId).val('');
    $('#'+btnInputSaveId).html("생성");
};

var viewMap = function (idx) {
    console.log(idx);
    location.href= baseUrl + "map/?mapSno=" + idx;
};