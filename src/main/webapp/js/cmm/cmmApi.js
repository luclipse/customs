var cmmApi = {
    getTcfDatList : function (callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDat/getTcfDatList",
            success: function (res) {
                callback(res);
            }
        });
    },
    getTcfDat : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDat/getTcfDat",
            data : data,
            success: function (res) {
                callback(res);
            }
        });
    },
    getTcfDatBySno : function (layer, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDat/getTcfDat",
            data : {datSno : layer.datSno},
            success: function (res) {
                if(res.length > 0) {
                    callback(layer, res[0]);
                }
            }
        });
    },
    saveTcfDat : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDat/saveTcfDat",
            data : data,
            success: function (res) {
                callback(res);
            }
        });
    },
    removeTcfDat : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfDat/removeTcfDat",
            data : data,
            success: function (res) {
                callback(res);
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
            success: function (res) {
                callback(res);
            }
        });
    },
    removeTcfMap : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfMap/removeTcfMap",
            data : data,
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
    saveTcfLay : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfLay/saveTcfLay",
            data : data,
            success: function (res) {
                callback(res);
            }
        });
    },
    removeTcfLay : function (data, callback) {
        $.ajax({
            url: serverMapCmmHost + "/tcfLay/removeTcfLay",
            data : data,
            success: function (res) {
                callback(res);
            }
        });
    },
};


