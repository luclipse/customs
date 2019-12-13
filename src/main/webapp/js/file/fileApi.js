var fileApi = {
    zipFileToPostGis : function (callback, errCallback, dtSaveCallback) {
        var form = $('#zipFileUploadForm')[0];
        var data = new FormData(form);
        $("#btn-zipFileUpload").prop("disabled", true);
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: serverFileHost + "/gdal/zipFileToPostGis",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data) {
                console.log("SUCCESS : ", data);
                $("#btn-zipFileUpload").prop("disabled", false);
                callback(data, dtSaveCallback);
            },
            error: function (e) {
                console.log("ERROR : ", e);
                $("#btn-zipFileUpload").prop("disabled", false);
                errCallback(data);
            }
        });
    },
    zipFileDownload : function (area, row) {
        var url = serverFileHost + "/gdal/postGisToFile?geom="+encodeURIComponent(area)+"&tableNm="+encodeURIComponent(row.tblName);
        var a = document.createElement('a');
        a.setAttribute('href', /*'data:text/plain;charset=utf-8,'+*/url);
        //a.setAttribute('download', row.name + ".zip");
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};
var saveFileToDat= function(value, dtSaveCallback){
    var fileNm = value[0].split(/(\\|\/)/g).pop().split('.')[0];
    var data = {
        datNm : fileNm,
        datDesc : '',
        tblNm : fileNm.toLowerCase()
    };
    cmmApi.saveTcfDat(data, dtSaveCallback);
};
var fileApiAlert = function(data) {
    console.log(data);
};
