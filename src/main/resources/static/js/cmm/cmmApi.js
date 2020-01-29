var cmmApi = {
    CD_FAILURE : 'FAILURE',
    CD_SUCCESS : 'SUCCESS',

    // TcfDat 목록을 가져옴
    getTcfDatList : function (callback, failCallback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDat/getTcfDatList",
            success: function (res) {
                if(res.cd === cmmApi.CD_SUCCESS) {
                    callback(res.data);
                } else {
                    //failCallback(res.data);
                }
            }
        });
    },

    // TcfDat를 가져옴
    getTcfDat : function (data, callback, failCallback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDat/getTcfDat",
            data : data,
            success: function (res) {
                if(res.cd === cmmApi.CD_SUCCESS) {
                    callback(res.data);
                } else {
                    //failCallback(res.data);
                }
            }
        });
    },
    
    //sno로 TcfDat를 가져옴
    getTcfDatBySno : function (datSno, layer, style, callback, failCallback, TcfTimeSeries) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDat/getTcfDatBySno",
            data : {datSno : datSno},
            success: function (res) {
                if(res.cd === cmmApi.CD_SUCCESS) {
                    callback(layer,style,res.data,TcfTimeSeries);
                } else {
                    //failCallback(res.data);
                }
            }
        });
    },

    // TcfDat를 저장함
    saveTcfDat : function (data, callback, failCallback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDat/saveTcfDat",
            data : data,
            async : false,
            success: function (res) {
                if(res.cd === cmmApi.CD_SUCCESS) {
                    callback(res.data);
                } else {
                    //failCallback(res.data);
                }
            }
        });
    },

    // TcfDat를 삭제함
    removeTcfDat : function (data, callback, failCallback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDat/removeTcfDat",
            data : data,
            async : false,
            success: function (res) {
                if(res.cd === cmmApi.CD_SUCCESS) {
                    callback(res.data);
                } else {
                    //failCallback(res.data);
                }
            }
        });
    },

    // tcfMap 목록을 가져옴
    getTcfMapList : function (callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfMap/getTcfMapList",
            success: function (res) {
                callback(res);
            }
        });
    },

    // tcfMap을 가져옴
    getTcfMap : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfMap/getTcfMap",
            data : data,
            success: function (res) {
                callback(res);
            }
        });
    },

    // sno로 tcfMap을 가져옴
    getTcfMapBySno : function (sno, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfMap/getTcfMapBySno",
            data : {mapSno : sno},
            success: function (res) {
                callback(res);
            }
        });
    },

    // tcfMap을 저장함
    saveTcfMap : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfMap/saveTcfMap",
            data : data,
            async : false,
            success: function (res) {
                callback(res);
            }
        });
    },

    // tcfMap을 삭제함
    removeTcfMap : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfMap/removeTcfMap",
            data : data,
            async : false,
            success: function (res) {
                callback(res);
            }
        });
    },

    // tcfLay 목록을 가져옴
    getTcfLayList : function (mapSno, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfLay/getTcfLayList",
            data : {mapSno : mapSno},
            success: function (res) {
                callback(res);
            }
        });
    },
    
    // tcfLay를 가져옴
    getTcfLay : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfLay/getTcfLay",
            data : data,
            success: function (res) {
                callback(res);
            }
        });
    },

    // sno로 tcfLay를 가져옴
    getTcfLayBySno : function (sno, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfLay/getTcfLayBySno",
            data : {laySno : sno},
            success: function (res) {
                callback(res);
            }
        });
    },

    // tcfLay를 저장함
    saveTcfLay : function (data, callback, tcfDat) {
        $.ajax({
            url: serverMapCmmHost + "/tcfLay/saveTcfLay",
            data : data,
            async : false,
            success: function (res) {
                callback(res, tcfDat);
            }
        });
    },

    // tcfLay를 삭제함
    removeTcfLay : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfLay/removeTcfLay",
            data : data,
            async : false,
            success: function (res) {
                callback(res);
            }
        });
    },

    // sno로 tcfLayStyle를 가져옴
    getTcfLayStyleBySno : function (layer, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfLayStyle/getTcfLayStyleBySno",
            data : {laySno : layer.laySno},
            success: function (style) {
                callback(layer, style);
            }
        });
    },

    // tcfLayStyle를 저장함
    saveTcfLayStyle : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfLayStyle/saveTcfLayStyle",
            data : data,
            async : false,
            success: function (res) {
                if(callback !== null) {
                    callback(data);
                }
            }
        });
    },

    // tcfLayStyle를 삭제함
    removeTcfLayStyle : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfLayStyle/removeTcfLayStyle",
            data : data,
            async : false,
            success: function (res) {
                callback(res);
            }
        });
    },

    // TcfDatSrc를 가져옴
    getTcfDatSrc : function (callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDatSrc/getTcfDatSrc",
            data : {},
            success: function (res) {
                callback(res);
            }
        });
    },

    // sno로 TcfDatSrc를 가져옴
    getTcfDatSrcBySno : function (layer, style, data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDatSrc/getTcfDatSrc",
            data : {srcSno : data.tblNm.split(';')[2]},
            success: function (res) {
                callback(layer, style, data, res);
            }
        });
    },
    // TcfDatTimeSeries 목록을 가져옴
    getTcfDatTimeSeries : function (layer, data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDatTimeSeries/getTcfDatTimeSeries",
            data : data,
            success: function (res) {
                callback(layer, res);
            }
        });
    },
};


