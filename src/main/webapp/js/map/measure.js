var measure = {
    /**
     * Currently drawn feature.
     * @type {ol.Feature}
     */
    sketch: null,

    /**
     * The help tooltip element.
     * @type {Element}
     */
    helpTooltipElement: null,

    /**
     * Overlay to show the help messages.
     * @type {ol.Overlay}
     */
    helpTooltip: null,

    /**
     * The measure tooltip element.
     * @type {Element}
     */
    measureTooltipElement: null,

    /**
     * Overlay to show the measurement.
     * @type {ol.Overlay}
     */
    measureTooltip: null,

    /**
     * Message to show when the user is drawing a polygon.
     * @type {string}
     */
    continuePolygonMsg: 'Click to continue drawing the polygon',

    /**
     * Message to show when the user is drawing a line.
     * @type {string}
     */
    continueLineMsg: 'Click to continue drawing the line',

    // global so we can remove it later
    draw: null,

    listener: null,

    addMeasure : function() {
        var source = new ol.source.Vector();
        var vector = new ol.layer.Vector({
            source: source,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });
        vector.set("name", "measure");
        vector.set("type", "measureLayer");
        vector.set("tblName", "");
        vector.set("srid", mapSrid);
        return vector
    },
    getLayer : function() {
      return this.vector;
    },

    /**
     * Format length output.
     * @param {ol.geom.LineString} line The line.
     * @return {string} The formatted length.
     */
    formatLength: function (line) {
        var length = ol.sphere.getLength(line);
        var output;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
        }
        return output;
    },

    /**
     * Format area output.
     * @param {ol.geom.Polygon} polygon The polygon.
     * @return {string} Formatted area.
     */
    formatArea: function (polygon) {
        var area = ol.sphere.getArea(polygon);
        var output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km<sup>2</sup>';
        } else {
            output = (Math.round(area * 100) / 100) +
                ' ' + 'm<sup>2</sup>';
        }
        return output;
    },

    /**
     * Handle pointer move.
     * @param {ol.MapBrowserEvent} evt The event.
     */
    pointerMoveHandler: function (evt) {
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        var helpMsg = 'Click to start drawing';

        if (measure.sketch) {
            var geom = (measure.sketch.getGeometry());
            if (geom instanceof ol.geom.Polygon) {
                helpMsg = measure.continuePolygonMsg;
            } else if (geom instanceof ol.geom.LineString) {
                helpMsg = measure.continueLineMsg;
            }
        }

        measure.helpTooltipElement.innerHTML = helpMsg;
        measure.helpTooltip.setPosition(evt.coordinate);

        measure.helpTooltipElement.classList.remove('hidden');
    },

    pointerOutHandler: function () {
        if (measure.helpTooltipElement != null)
            measure.helpTooltipElement.classList.add('hidden');
    },

    /**
     * Creates a new help tooltip
     */
    createHelpTooltip: function (olmap) {
        if (measure.helpTooltipElement) {
            measure.helpTooltipElement.parentNode.removeChild(measure.helpTooltipElement);
        }
        measure.helpTooltipElement = document.createElement('div');
        measure.helpTooltipElement.className = 'tooltip hidden';
        measure.helpTooltip = new ol.Overlay({
            element: measure.helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
        });
        olmap.addOverlay(measure.helpTooltip);
    },

    /**
     * remove help tooltip
     */
    removeHelpTooltip: function (olmap) {
        olmap.removeOverlay(measure.helpTooltip);
        measure.helpTooltipElement = null;
        measure.helpTooltip = null;
    },

    /**
     * Creates a new measure tooltip
     */
    createMeasureTooltip: function (olmap) {
        if (measure.measureTooltipElement) {
            measure.measureTooltipElement.parentNode.removeChild(measure.measureTooltipElement);
        }
        measure.measureTooltipElement = document.createElement('div');
        measure.measureTooltipElement.className = 'tooltip tooltip-measure';
        measure.measureTooltip = new ol.Overlay({
            element: measure.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        olmap.addOverlay(measure.measureTooltip);
    },

    addInteraction: function (value) {
        var src = null;
        if (value === 'None') {
            measure.removeHelpTooltip(olMap.olMap);
            return;
        }
        if(olMap.layers.measureLayer == null) {
            var vector = this.addMeasure();
            olMap.addMeasureLayer(vector);
            src = vector.getSource();
        } else {
            src = olMap.layers.measureLayer.getSource();
        }
        var type = (value === 'area' ? 'Polygon' : 'LineString');
        measure.draw = new ol.interaction.Draw({
            source: src,
            type: type,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.7)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            })
        });
        olMap.olMap.addInteraction(measure.draw);
        measure.createHelpTooltip(olMap.olMap);
        measure.createMeasureTooltip(olMap.olMap);

        measure.draw.on('drawstart',
            function (evt) {
                // set sketch
                measure.sketch = evt.feature;

                /** @type {ol.Coordinate|undefined} */
                var tooltipCoord = evt.coordinate;

                measure.listener = measure.sketch.getGeometry().on('change', function (evt) {
                    var geom = evt.target;
                    var output;
                    if (geom instanceof ol.geom.Polygon) {
                        output = measure.formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                        output = measure.formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    measure.measureTooltipElement.innerHTML = output;
                    measure.measureTooltip.setPosition(tooltipCoord);
                });
            }, this);

        measure.draw.on('drawend',
            function () {
                measure.measureTooltipElement.className = 'tooltip tooltip-static';
                measure.measureTooltip.setOffset([0, -7]);
                // unset sketch
                measure.sketch = null;
                // unset tooltip so that a new one can be created
                measure.measureTooltipElement = null;
                measure.createMeasureTooltip(olMap.olMap);
                ol.Observable.unByKey(measure.listener);
            }, this);
    },
    measureLayer : function (type) {
        if(this.draw != null) {
            olMap.olMap.removeInteraction(this.draw);
        }
        this.addInteraction(type);
        if(type !== 'None') {
            olMap.olMap.on('pointermove', measure.pointerMoveHandler);
            olMap.olMap.getViewport().addEventListener('mouseout', measure.pointerOutHandler);
        } else{
            olMap.olMap.un('pointermove', measure.pointerMoveHandler);
            olMap.olMap.getViewport().removeEventListener('mouseout', measure.pointerOutHandler);
        }
    }
};

