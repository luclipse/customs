var cmmApi = {
    CD_FAILURE : 'FAILURE',
    CD_SUCCESS : 'SUCCESS',

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
    getTcfDatBySno : function (layer, style, callback, failCallback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDat/getTcfDatBySno",
            data : {datSno : layer.datSno},
            success: function (res) {
                if(res.cd === cmmApi.CD_SUCCESS) {
                    callback(layer,style,res.data);
                } else {
                    //failCallback(res.data);
                }
            }
        });
    },
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
    getTcfMapList : function (callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfMap/getTcfMapList",
            success: function (res) {
                callback(res);
            }
        });
    },
    getTcfMap : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfMap/getTcfMap",
            data : data,
            success: function (res) {
                callback(res);
            }
        });
    },
    getTcfMapBySno : function (sno, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfMap/getTcfMapBySno",
            data : {mapSno : sno},
            success: function (res) {
                callback(res);
            }
        });
    },
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
    getTcfLayList : function (mapSno, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfLay/getTcfLayList",
            data : {mapSno : mapSno},
            success: function (res) {
                callback(res);
            }
        });
    },
    getTcfLay : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfLay/getTcfLay",
            data : data,
            success: function (res) {
                callback(res);
            }
        });
    },
    getTcfLayBySno : function (sno, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfLay/getTcfLayBySno",
            data : {laySno : sno},
            success: function (res) {
                callback(res);
            }
        });
    },
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

    getTcfLayStyleBySno : function (layer, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfLayStyle/getTcfLayStyleBySno",
            data : {laySno : layer.laySno},
            success: function (style) {
                callback(layer, style);
            }
        });
    },
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

    getTcfDatSrc : function (callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDatSrc/getTcfDatSrc",
            data : {},
            success: function (res) {
                callback(res);
            }
        });
    },
};


