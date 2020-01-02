var olStyle = {
    svgCircle : '<svg width="{0}" height="{1}" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
                '<circle cx="{2}" cy="{3}" r="{4}" stroke="{5}" stroke-width="{6}" fill="{7}"/>' +
                '</svg>',

    popupLineColor : null,
    lineColor : null,

    popupFillColor : null,
    fillColor : null,

    lineWidth : 0,
    radiusWidth : 0,

    divLineColorId : null,
    divFillColorId : null,
    inputStrokeWidthId : null,
    divRadiusWidthId : null,
    inputRadiusWidthId : null,

    initStyle : function(divLineColorId, divFillColorId, inputStrokeWidthId, divRadiusWidthId, inputRadiusWidthId) {
        this.divLineColorId = divLineColorId;
        this.divFillColorId = divFillColorId;
        this.inputStrokeWidthId = inputStrokeWidthId;
        this.divRadiusWidthId = divRadiusWidthId;
        this.inputRadiusWidthId = inputRadiusWidthId;
        this.initFillColor();
        this.initLineColor();
    },

    initLineColor : function(){
        this.lineColor = null;
        this.lineColor = document.querySelector('#'+this.divLineColorId);
        this.popupLineColor = null;
        this.popupLineColor = new Picker(this.lineColor);
    },

    setColorPickerLineColor : function(layer) {
        var geomType = layer.get("geomType").toUpperCase();
        if(geomType === 'MULTIPOLYGON' || geomType === 'POLYGON') {
            this.initColorPicker(this.lineColor,this.popupLineColor, this.getPolygonStrokeColor(layer));
        } else if(geomType === 'MULTIPOINT' || geomType === 'POINT'){
            var svg = xmlToJson.parse(currentLayer.getStyle().getImage().getImage().src.replace("data:image/svg+xml;utf8,", ""));
            this.initColorPicker(this.lineColor,this.popupLineColor, svg.svg.circle["stroke"]);
        } else if(geomType === 'MULTILINESTRING' || geomType === 'LINESTRING'){
            // Todo lineString Style
        }
    },

    initFillColor : function(){
        this.fillColor = null;
        this.fillColor = document.querySelector('#'+this.divFillColorId);
        this.popupFillColor = null;
        this.popupFillColor = new Picker(this.fillColor);
    },

    setColorPickerFillColor : function(layer){
        var geomType = layer.get("geomType").toUpperCase();
        if(geomType === 'MULTIPOLYGON' || geomType === 'POLYGON') {
            this.initColorPicker(this.fillColor,this.popupFillColor, this.getPolygonFillColor(layer));
        } else if(geomType === 'MULTIPOINT' || geomType === 'POINT'){
            var svg = xmlToJson.parse(currentLayer.getStyle().getImage().getImage().src.replace("data:image/svg+xml;utf8,", ""));
            this.initColorPicker(this.fillColor,this.popupFillColor, svg.svg.circle["fill"]);
        } else if(geomType === 'MULTILINESTRING' || geomType === 'LINESTRING'){
            // Todo lineString Style
        }
    },
    setStrokeWidth : function(layer){
        var geomType = layer.get("geomType").toUpperCase();
        var selStrokeWidth = $('#'+ this.inputStrokeWidthId);
        if(geomType === 'MULTIPOLYGON' || geomType === 'POLYGON') {
            selStrokeWidth.val(this.getPolygonStrokeWidth(currentLayer));
        } else if(geomType === 'MULTIPOINT' || geomType === 'POINT'){
            var svg = xmlToJson.parse(currentLayer.getStyle().getImage().getImage().src.replace("data:image/svg+xml;utf8,", ""));
            selStrokeWidth.val(svg.svg.circle["stroke-width"]);
        } else if(geomType === 'MULTILINESTRING' || geomType === 'LINESTRING'){
            // Todo lineString Style
        }
        this.lineWidth = selStrokeWidth.val();
        selStrokeWidth.change(function () {
            olStyle.lineWidth = this.value;
        });
    },

    setRadiusWidth : function(layer){
        var geomType = layer.get("geomType").toUpperCase();
        var selRadiusWidth = $('#'+ this.inputRadiusWidthId);
        if(geomType === 'MULTIPOLYGON' || geomType === 'POLYGON') {
            $('#'+ this.divRadiusWidthId).hide();
        } else if(geomType === 'MULTIPOINT' || geomType === 'POINT'){
            $('#'+ this.divRadiusWidthId).show();
            var svg = xmlToJson.parse(currentLayer.getStyle().getImage().getImage().src.replace("data:image/svg+xml;utf8,", ""));
            selRadiusWidth.val(svg.svg.circle["r"]);
        } else if(geomType === 'MULTILINESTRING' || geomType === 'LINESTRING'){
            // Todo lineString Style
        }
        this.radiusWidth = selRadiusWidth.val();
        selRadiusWidth.change(function () {
            olStyle.radiusWidth = this.value;
        });
    },

    initColorPicker : function(mColor, mPopupColor, baseColor){
        mPopupColor.onDone = null;
        mPopupColor.onDone = function(e) {
            mColor.style.background = e.rgbaString;
            //style.setColor(e.rgbaString);
            //layer.setStyle(layer.getStyle());
        };
        mPopupColor.onchange = null;
        mPopupColor.setColor(baseColor);
        mColor.style.background = mPopupColor.color.rgbaString;
    },
    setStyle : function(layer){
        if(layer == null)
            return;

        var fill = this.popupFillColor.color.rgbaString;
        var line = this.popupLineColor.color.rgbaString;

        var geomType = layer.get("geomType").toUpperCase();
        if(geomType === 'MULTIPOLYGON' || geomType === 'POLYGON') {
            this.setPolygonFillColor(layer, fill);
            this.setPolygonStrokeColor(layer, line);
            this.setPolygonStrokeWidth(layer, this.lineWidth);
        } else if(geomType === 'MULTIPOINT' || geomType === 'POINT'){
            this.getPointStyle(layer, line, this.lineWidth, fill, this.radiusWidth);
        } else if(geomType === 'MULTILINESTRING' || geomType === 'LINESTRING'){

        }

        var stClass = layer.getStyle();

        var style = layer.get("style");
        var styleStr = this.getStringStyle(stClass);
        style.styleStr = styleStr;

        layer.set("style", style);
        layer.set("styleStr", styleStr);

        var data = {
            styleSno : style.styleSno,
            styleText : styleStr
        };
        cmmApi.saveTcfLayStyle(data, null);
    },

    getFillStyle : function (rgbaString) {
        return new ol.style.Fill({
                color: rgbaString
        });
    },

    getStroke : function (rgbaString, width) {
        return new ol.style.Stroke({
            color: rgbaString, 
            width : width
        });
    },
    getSvgCircleStyle : function (strokeColor, strokeWidth, fillColor, radius) {
        strokeWidth = Number(strokeWidth);
        radius = Number(radius);
        var size = (radius * 2) + (strokeWidth * 2);
        var cxy = radius + strokeWidth;
        return new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [cxy, cxy],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                opacity: 1,
                src: 'data:image/svg+xml;utf8,' + this.svgCircle.format(size, size, cxy, cxy, radius, strokeColor, strokeWidth, fillColor)
            })
        });
    },
    getImageStyle : function (anchorX, anchorY, src) {
        return new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [anchorX, anchorY],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                opacity: 1,
                src: src
            })
        });
    },
    getPolygonStyle : function (stroke, fill) {
        return new ol.style.Style({
                stroke : stroke,
                fill : fill
        });
    },

    getLineStyle : function (stroke) {
        return new ol.style.Style({
            stroke : stroke
        });
    },

    getStringStyle : function (style) {
        return JSON.stringify(style).replace(/_/gi, "");
    },
    getStrToStyle : function (styleStr) {
        var mFill = null;
        var mStroke = null;
        var mImageAnchorX = null;
        var mImageAnchorY = null;
        var mImageSrc = null;
        var mText = null;
        $.each(JSON.parse(styleStr), function(key, value){
            if(value != null) {
                if(key === "fill") {
                    mFill = olStyle.getFillStyle(value.color);
                } else if(key === "stroke") {
                    mStroke = olStyle.getStroke(value.color, value.width);
                } else if(key === "image") {
                    mImageAnchorX = value.anchor[0];
                    mImageAnchorY = value.anchor[0];
                    mImageSrc = value.iconImage.src;
                }
            }
        });
        var res = null;
        if(mStroke !== null && mFill !== null) {
            res = this.getPolygonStyle(mStroke, mFill);
        } else if(mStroke !== null ) {
            res = this.getLineStyle(mStroke);
        } else if(mImageAnchorX !== null && mImageAnchorY !== null && mImageSrc !== null) {
            res = this.getImageStyle(mImageAnchorX, mImageAnchorY, mImageSrc);
        }
        return res;
    },
    getPointStyle : function(layer, strokeColor, strokeWidth, fillColor, radius) {
        return layer.setStyle(this.getSvgCircleStyle(strokeColor, strokeWidth, fillColor, radius));
    },
    getPolygonFillColor: function(layer) {
        return layer.getStyle().getFill().getColor();
    },
    setPolygonFillColor: function(layer, color) {
        return layer.getStyle().getFill().setColor(color);
    },
    getPolygonStrokeColor: function(layer) {
        return layer.getStyle().getStroke().getColor();
    },
    setPolygonStrokeColor: function(layer, color) {
        return layer.getStyle().getStroke().setColor(color);
    },
    getPolygonStrokeWidth: function(layer) {
        return layer.getStyle().getStroke().getWidth();
    },
    setPolygonStrokeWidth: function(layer, width) {
        return layer.getStyle().getStroke().setWidth(width);
    }
};



