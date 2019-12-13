var dataGrid;
var zipFileInput = document.getElementById("zipFile");
var sridInput = document.getElementById("input-srid");
var fileList = [];
var fileType = "";

var init = function () {
    dataGrid = new tui.Grid({
        el: document.getElementById('dataGrid'), // Container element
        scrollX: false,
        scrollY: false,
        columns: [
            {
                header: '데이터명',
                name: 'datNm'
            },
            {
                header: '최종 수정 시간',
                name: 'mdfDt'
            },
            {
                header: '데이터수',
                name: 'datCnt'
            },

        ],
    });
    tui.Grid.applyTheme('clean');
    gridDataSet(null);

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
};

var saveDat = function (inputs) {
    var data = {};
    Object.keys(inputs).forEach(function (value) {
        data[value] = $('#'+inputs[value]).val();
    });
    cmmApi.saveTcfDat(data, cbSaveDat);
};

var cbSaveDat = function(res){
    alert(res.cd);
    gridDataSet(null);
};

var gridLayerSet = function (data) {
    if(data == null){
        cmmApi.getTcfDatList(cbGridDataSet);
    } else {
        cmmApi.getTcfDat(data, cbGridDataSet);
    }
};
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
var hasExtension = function(fileNm, exts) {
    //exts = "docx|doc|pdf|xml|bmp|ppt|xls";
    var val = fileNm.toLowerCase();
    var regex = new RegExp("(.*?)\.("+exts+")$");
    return regex.test(val);
};
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


var zipFileUpload = function (saveFileToDat, fileApiAlert, cbSaveDat) {
    if(zipFileInput.files.length <= 0) {
        alert("select Zip File");
    } else if(fileType !== "shp" && fileType !== "kml" && fileType !== "geojson" ) {
        alert(fileType);
    }
    fileApi.zipFileToPostGis(saveFileToDat, fileApiAlert, cbSaveDat)
};

var toggleDatGrid = function() {
    $('#div-upload-grid').hide();
    $('#div-dat-grid').toggle();
};
var toggleUploadGrid = function() {
    $('#div-dat-grid').hide();
    $('#div-upload-grid').toggle();
};
