var draw = {
    iDraw : null,
    // draw 를 추가함.
    addDraw : function () {
        var source = new ol.source.Vector({wrapX: false});
        var vector = new ol.layer.Vector({
            source: source
        });
        vector.set("name", "draw");
        vector.set("type", "drawLayer");
        vector.set("tblName", "");
        vector.set("srid", mapSrid);
        return vector;
    },
    // draw를 하기 위한 Interaction을 설정
    setInteraction : function(value) {
        var src = null;
        if(olMap.layers.drawLayer == null) {
            var vector = this.addDraw();
            olMap.addDrawVectorLayer(vector);
            src = vector.getSource();
        }
        else {
            src = olMap.layers.drawLayer.getSource();
        }
        if (value !== 'None') {
            this.iDraw = new ol.interaction.Draw({
                source: src,
                type: value
            });
            this.iDraw.on('drawstart', function (evt) {}, this);
            this.iDraw.on('drawend',function () {}, this);

            olMap.olMap.addInteraction(this.iDraw);
        }
    },
    // draw 를 시작함
    drawLayer : function (value) {
        if(this.iDraw != null) {
            olMap.olMap.removeInteraction(this.iDraw);
        }
        this.setInteraction(value);
    },
    // 마지막 draw feature를 추가함
    removeLastFeature : function () {
        var feature =olMap.layers.drawLayer.getSource().getFeatures()[olMap.layers.drawLayer.getSource().getFeatures().length-1];
        olMap.layers.drawLayer.getSource().removeFeature(feature);
    },
};

