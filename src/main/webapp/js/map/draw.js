var draw = {
    iDraw : null,
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
    drawLayer : function (value) {
        if(this.iDraw != null) {
            olMap.olMap.removeInteraction(this.iDraw);
        }
        this.setInteraction(value);
    },
    removeLastFeature : function () {
        var feature =olMap.layers.drawLayer.getSource().getFeatures()[olMap.layers.drawLayer.getSource().getFeatures().length-1];
        olMap.layers.drawLayer.getSource().removeFeature(feature);
    },
};

