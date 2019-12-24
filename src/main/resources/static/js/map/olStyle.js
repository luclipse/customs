var olStyle = {
    popupLineColor : null,
    lineColor : null,

    popupFillColor : null,
    fillColor : null,

    lineWidth : 0,

    initPolygonLineColor : function(divLineColorId){
        this.lineColor = null;
        this.lineColor = document.querySelector('#'+divLineColorId);
        this.popupLineColor = null;
        this.popupLineColor = new Picker(this.lineColor);

    },
    setColorPickerLineColor : function(layer) {
        this.initColorPicker(this.lineColor,this.popupLineColor, olStyle.getPolygonStrokeColor(layer), layer.getStyle().getStroke(), layer);
    },

    initPolygonFillColor : function(divFillColorId){
        this.fillColor = document.querySelector('#'+divFillColorId);
        this.popupFillColor = new Picker(this.fillColor);
    },
    setColorPickerFillColor : function(layer){
        this.initColorPicker(this.fillColor,this.popupFillColor, olStyle.getPolygonFillColor(layer), layer.getStyle().getFill(), layer);
    },
    initStrokeWidth : function(inputStrokeWidth, layer){
        $('#'+ inputStrokeWidth).val(olStyle.getPolygonStrokeWidth(currentLayer));
        $('#'+ inputStrokeWidth).change(function () {
            olStyle.lineWidth = this.value;
            //layer.getStyle().getStroke().setWidth(this.value);
        })
    },

    initColorPicker : function(mColor, mPopupColor, baseColor, style, layer){
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
    setStyleSetting : function(layer){
        if(layer == null)
            return;

        var fill = olStyle.popupFillColor.color.rgbaString;
        var line = olStyle.popupLineColor.color.rgbaString;
        olStyle.setPolygonFillColor(layer, fill);
        olStyle.setPolygonStrokeColor(layer, line);
        olStyle.setPolygonStrokeWidth(layer, olStyle.lineWidth);
        var stClass = layer.getStyle();
        layer.setStyle(stClass);

        var style = layer.get("style");
        var styleStr = olStyle.getStringStyle(stClass);
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

    getCircle : function (strokeColor, strokeWidth, fillColor, radius) {
        return new ol.style.Circle({
            radius: radius,
            fill: this.getFillStyle(fillColor),
            stroke: this.getStroke(strokeColor, strokeWidth)
        });
    },
    getPolygonStyle : function (stroke, fill) {
        return new ol.style.Style({
                stroke : stroke,
                fill : fill
        });
    },
    getStringStyle : function (style) {
        return JSON.stringify(style).replace(/_/gi, "");
    },
    getStrToStyle : function (styleStr) {
        var mFill = null;
        var mStroke = null;
        var mImage = null;
        var mText = null;
        $.each(JSON.parse(styleStr), function(key, value){
            if(value != null) {
                if(key === "fill") {
                    mFill = olStyle.getFillStyle(value.color);
                } else if(key === "stroke") {
                    mStroke = olStyle.getStroke(value.color, value.width);
                } else if(key === "image") {
                    $.each(value, function(key, value){
                        // todo image(심벌) 개발..
                    });
                }
            }
        });
        var res = null;
        if(mImage === null) {
            res = olStyle.getPolygonStyle(mStroke, mFill);
        } else {
            // todo image(심벌) 개발..
        }
        return res;
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



