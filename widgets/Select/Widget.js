// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
require({
    cache: {
        "jimu/dijit/FeatureSetChooserForMultipleLayers": function() {
            define("dojo/on dojo/sniff dojo/mouse dojo/query dojo/Evented dojo/_base/html dojo/_base/lang dojo/_base/array dojo/promise/all dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!./templates/FeatureSetChooserForMultipleLayers.html dijit/popup dijit/TooltipDialog jimu/utils jimu/dijit/DrawBox jimu/dijit/_FeatureSetChooserCore jimu/SelectionManager jimu/dijit/FeatureActionPopupMenu".split(" "),
                function(m, a, l, k, e, h, f, n, p, r, w, v, t, x, c, y, q, d, B, u, z) {
                    return r([w, v, t, e], {
                        baseClass: "jimu-multiple-layers-featureset-chooser",
                        declaredClass: "jimu.dijit.FeatureSetChooserForMultipleLayers",
                        templateString: x,
                        drawBox: null,
                        _instances: null,
                        _tooltipDialogTimeoutId1: -1,
                        _tooltipDialogClientX1: -1,
                        _tooltipDialogTimeoutId2: -1,
                        _tooltipDialogClientX2: -1,
                        _tooltipTimeout: 1E3,
                        _currentGeoTypeInfo: null,
                        _geoTypeInfos: null,
                        map: null,
                        updateSelection: !1,
                        fullyWithin: !1,
                        geoTypes: null,
                        actions: null,
                        postMixInProperties: function() {
                            this.inherited(arguments);
                            this.nls = window.jimuNls.featureSetChooser;
                            var b = "POINT EXTENT POLYGON CIRCLE POLYLINE FREEHAND_POLYGON".split(" ");
                            this.geoTypes && 0 < this.geoTypes.length && (this.geoTypes = n.filter(this.geoTypes, f.hitch(this, function(g) {
                                return 0 <= b.indexOf(g)
                            })));
                            this.geoTypes && 0 !== this.geoTypes.length || (this.geoTypes = ["EXTENT"])
                        },
                        postCreate: function() {
                            this.inherited(arguments);
                            this._instances = [];
                            this.popupMenu = z.getInstance();
                            k(".select-text", this.domNode)[0].innerHTML = this.nls.select;
                            k(".clear-text", this.domNode)[0].innerHTML =
                                window.jimuNls.common.clear;
                            this._initTooltipDialogs();
                            this._initDrawBox();
                            this._geoTypeInfos = [];
                            this.actions = [];
                            0 === this.geoTypes.length && this.geoTypes.push("EXTENT");
                            1 === this.geoTypes.length ? h.addClass(this.domNode, "single-geotype") : h.addClass(this.domNode, "multiple-geotypes");
                            var b = {
                                    POINT: ["icon-select-by-point", this.nls.selectByPoint, this.drawBox.pointIcon],
                                    EXTENT: ["icon-select-by-rect", this.nls.selectByRectangle, this.drawBox.extentIcon],
                                    POLYGON: ["icon-select-by-polygon", this.nls.selectByPolygon,
                                        this.drawBox.polygonIcon
                                    ],
                                    CIRCLE: ["icon-select-by-circle", this.nls.selectByCircle, this.drawBox.circleIcon],
                                    POLYLINE: ["icon-select-by-line", this.nls.selectByLine, this.drawBox.polylineIcon],
                                    FREEHAND_POLYGON: ["icon-select-by-freehand-polygon", this.nls.selectByFreehandPolygon, this.drawBox.freehandPolygonIcon]
                                },
                                g = -1;
                            n.forEach("POINT EXTENT POLYGON CIRCLE POLYLINE FREEHAND_POLYGON".split(" "), f.hitch(this, function(a) {
                                var d = b[a];
                                if (0 <= this.geoTypes.indexOf(a)) {
                                    var c = {
                                            geoType: a,
                                            action: {
                                                iconClass: d[0],
                                                label: d[1],
                                                data: {}
                                            },
                                            dom: d[2]
                                        },
                                        d = {
                                            iconClass: d[0],
                                            label: d[1],
                                            data: {},
                                            onExecute: f.hitch(this, this._onDrawItemClicked, c)
                                        };
                                    this._geoTypeInfos.push(c);
                                    this.actions.push(d);
                                    "EXTENT" === a && (g = this._geoTypeInfos.length - 1)
                                }
                            }));
                            this.own(m(this.btnSelect, "click", f.hitch(this, function() {
                                q.simulateClickEvent(this._currentGeoTypeInfo.dom);
                                this._hideDrawItems()
                            })));
                            0 <= g ? (this._setCurrentGeoInfo(this._geoTypeInfos[g]), h.addClass(this.geoTypeIcon, "icon-select-by-rect")) : (this._setCurrentGeoInfo(this._geoTypeInfos[0]), h.addClass(this.geoTypeIcon,
                                this._geoTypeInfos[0].action.iconClass));
                            this.deactivate()
                        },
                        _initTooltipDialogs: function() {
                            var b = a("mac") ? "\u2318" : "Ctrl",
                                g = "- " + this.nls.newSelectionTip + " (" + this.nls.dragMouse + ")",
                                d = "- " + this.nls.addSelectionTip + " (Shift+" + this.nls.dragBox + ")",
                                A = "- " + this.nls.removeSelectionTip + " (" + b + "+" + this.nls.dragBox + ")",
                                e = "- " + this.nls.newSelectionTip + " (" + this.nls.drawShap + ")",
                                n = "- " + this.nls.addSelectionTip + " (Shift+" + this.nls.darw + ")",
                                B = "- " + this.nls.removeSelectionTip + " (" + b + "+" + this.nls.darw + ")",
                                b = h.create("div", {
                                    innerHTML: '\x3cdiv class\x3d"title"\x3e\x3c/div\x3e\x3cdiv class\x3d"item new-selection-item"\x3e\x3c/div\x3e\x3cdiv class\x3d"item add-selection-item"\x3e\x3c/div\x3e\x3cdiv class\x3d"item remove-selection-item"\x3e\x3c/div\x3e',
                                    "class": "dialog-content"
                                }),
                                u = k(".title", b)[0],
                                q = k(".new-selection-item", b)[0],
                                z = k(".add-selection-item", b)[0],
                                p = k(".remove-selection-item", b)[0];
                            this.tooltipDialog1 = new y({
                                content: b
                            });
                            h.addClass(this.tooltipDialog1.domNode, "jimu-multiple-layers-featureset-chooser-tooltipdialog");
                            this.own(m(this.btnSelect, "mousemove", f.hitch(this, function(b) {
                                this._tooltipDialogClientX1 = b.clientX
                            })));
                            this.own(m(this.btnSelect, l.enter, f.hitch(this, function() {
                                clearTimeout(this._tooltipDialogTimeoutId1);
                                this._tooltipDialogTimeoutId1 = -1;
                                this._tooltipDialogTimeoutId1 = setTimeout(f.hitch(this, function() {
                                    if (this.tooltipDialog1) {
                                        var b = this._currentGeoTypeInfo.geoType;
                                        "EXTENT" === b ? (q.innerHTML = g, z.innerHTML = d, p.innerHTML = A, u.innerHTML = this.nls.selectByRectangle) : (q.innerHTML = e, z.innerHTML = n, p.innerHTML =
                                            B, "POLYGON" === b ? u.innerHTML = this.nls.selectByPolygon : "CIRCLE" === b ? u.innerHTML = this.nls.selectByCircle : "POLYLINE" === b ? u.innerHTML = this.nls.selectByLine : "FREEHAND_POLYGON" === b ? u.innerHTML = this.nls.selectByFreehandPolygon : "POINT" === b && (u.innerHTML = this.nls.selectByPoint));
                                        c.open({
                                            parent: this.getParent(),
                                            popup: this.tooltipDialog1,
                                            around: this.btnSelect,
                                            position: ["below"]
                                        });
                                        0 <= this._tooltipDialogClientX1 && (this.tooltipDialog1.domNode.parentNode.style.left = this._tooltipDialogClientX1 + "px")
                                    }
                                }), this._tooltipTimeout)
                            })));
                            this.own(m(this.btnSelect, l.leave, f.hitch(this, function() {
                                clearTimeout(this._tooltipDialogTimeoutId1);
                                this._tooltipDialogTimeoutId1 = -1;
                                this._hideTooltipDialog(this.tooltipDialog1)
                            })));
                            b = h.create("div", {
                                innerHTML: this.nls.unselectAllSelectionTip,
                                "class": "dialog-content"
                            });
                            this.tooltipDialog2 = new y({
                                content: b
                            });
                            h.addClass(this.tooltipDialog2.domNode, "jimu-multiple-layers-featureset-chooser-tooltipdialog");
                            this.own(m(this.btnClear, "mousemove", f.hitch(this, function(b) {
                                this._tooltipDialogClientX2 = b.clientX
                            })));
                            this.own(m(this.btnClear, l.enter, f.hitch(this, function() {
                                clearTimeout(this._tooltipDialogTimeoutId2);
                                this._tooltipDialogTimeoutId2 = -1;
                                this._tooltipDialogTimeoutId2 = setTimeout(f.hitch(this, function() {
                                    this.tooltipDialog2 && (c.open({
                                        parent: this.getParent(),
                                        popup: this.tooltipDialog2,
                                        around: this.btnClear,
                                        position: ["below"]
                                    }), 0 <= this._tooltipDialogClientX2 && (this.tooltipDialog2.domNode.parentNode.style.left = this._tooltipDialogClientX2 + "px"))
                                }), this._tooltipTimeout)
                            })));
                            this.own(m(this.btnClear, l.leave, f.hitch(this,
                                function() {
                                    clearTimeout(this._tooltipDialogTimeoutId2);
                                    this._tooltipDialogTimeoutId2 = -1;
                                    this._hideTooltipDialog(this.tooltipDialog2)
                                })))
                        },
                        _onArrowClicked: function(b) {
                            b.stopPropagation();
                            b = h.position(b.target);
                            this._showDrawItems(b)
                        },
                        _setCurrentGeoInfo: function(b) {
                            var g = this._currentGeoTypeInfo && this._currentGeoTypeInfo.geoType;
                            this._currentGeoTypeInfo && h.removeClass(this.currentDrawItem, this._currentGeoTypeInfo.geoType);
                            this._currentGeoTypeInfo = b;
                            h.addClass(this.currentDrawItem, this._currentGeoTypeInfo.geoType);
                            this.isActive() ? g !== this._currentGeoTypeInfo.geoType && q.simulateClickEvent(this._currentGeoTypeInfo.dom) : q.simulateClickEvent(this._currentGeoTypeInfo.dom)
                        },
                        _showDrawItems: function(b) {
                            this.popupMenu.setActions(this.actions);
                            this.popupMenu.markAsSelected(this._currentGeoTypeInfo.action);
                            this.popupMenu.show(b)
                        },
                        _hideDrawItems: function() {
                            this.popupMenu.hide()
                        },
                        _onDrawItemClicked: function(b) {
                            this._hideDrawItems();
                            this._setCurrentGeoInfo(b);
                            h.removeClass(this.geoTypeIcon, "icon-select-by-point icon-select-by-circle icon-select-by-rect icon-select-by-polygon icon-select-by-line icon-select-by-freehand-polygon".split(" "));
                            switch (b.geoType) {
                                case "POLYGON":
                                    h.addClass(this.geoTypeIcon, "icon-select-by-polygon");
                                    break;
                                case "CIRCLE":
                                    h.addClass(this.geoTypeIcon, "icon-select-by-circle");
                                    break;
                                case "POLYLINE":
                                    h.addClass(this.geoTypeIcon, "icon-select-by-line");
                                    break;
                                case "FREEHAND_POLYGON":
                                    h.addClass(this.geoTypeIcon, "icon-select-by-freehand-polygon");
                                    break;
                                case "POINT":
                                    h.addClass(this.geoTypeIcon, "icon-select-by-point");
                                    break;
                                default:
                                    h.addClass(this.geoTypeIcon, "icon-select-by-rect")
                            }
                        },
                        _initDrawBox: function() {
                            this.drawBox =
                                new d({
                                    map: this.map,
                                    showClear: !0,
                                    keepOneGraphic: !0,
                                    deactivateAfterDrawing: !1,
                                    geoTypes: this.geoTypes
                                });
                            this.own(m(this.drawBox, "user-clear", f.hitch(this, this._onDrawBoxUserClear)));
                            this.own(m(this.drawBox, "draw-end", f.hitch(this, this._onDrawEnd)));
                            this.own(m(this.drawBox, "draw-activate", f.hitch(this, function() {
                                this.map.infoWindow.hide();
                                h.addClass(this.currentDrawItem, "pressed");
                                h.addClass(this.btnSelect, "selected")
                            })));
                            this.own(m(this.drawBox, "draw-deactivate", f.hitch(this, function() {
                                h.removeClass(this.currentDrawItem,
                                    "pressed");
                                h.removeClass(this.btnSelect, "selected")
                            })));
                            this.own(m(this.btnClear, "click", f.hitch(this, function() {
                                q.simulateClickEvent(this.drawBox.btnClear)
                            })))
                        },
                        disable: function() {
                            this.drawBox.disable();
                            h.addClass(this.domNode, "disabled")
                        },
                        enable: function() {
                            this.drawBox.enable();
                            h.removeClass(this.domNode, "disabled")
                        },
                        isActive: function() {
                            return this.drawBox.isActive()
                        },
                        activate: function() {
                            if (!this.isActive()) {
                                var b = this._currentGeoTypeInfo;
                                b || (b = this._geoTypeInfos[0]);
                                this._setCurrentGeoInfo(b)
                            }
                        },
                        deactivate: function() {
                            this.drawBox.deactivate()
                        },
                        setFeatureLayers: function(b) {
                            var g = n.filter(this._instances, f.hitch(this, function(g) {
                                return 0 > b.indexOf(g.featureLayer)
                            }));
                            n.forEach(g, f.hitch(this, function(b) {
                                this._removeInstance(b)
                            }));
                            var d = n.map(this._instances, f.hitch(this, function(b) {
                                return b.featureLayer
                            }));
                            n.forEach(b, f.hitch(this, function(b) {
                                0 > d.indexOf(b) && this.addFeatureLayer(b)
                            }))
                        },
                        addFeatureLayer: function(b) {
                            "esri.layers.FeatureLayer" !== b.declaredClass || this._findInstanceByLayer(b) || (b =
                                new B({
                                    map: this.map,
                                    featureLayer: b,
                                    drawBox: this.drawBox,
                                    updateSelection: this.updateSelection,
                                    fullyWithin: this.fullyWithin
                                }), this._instances.push(b))
                        },
                        removeFeatureLayer: function(b) {
                            "esri.layers.FeatureLayer" === b.declaredClass && (b = this._findInstanceByLayer(b)) && this._removeInstance(b)
                        },
                        setDisplayLayerVisibility: function(b, g) {
                            (b = u.getInstance().getDisplayLayer(b.id)) && (g ? b.show() : b.hide())
                        },
                        _removeInstance: function(b) {
                            if (b) {
                                var g = this._instances.indexOf(b);
                                0 <= g && (b.destroy(), this._instances.splice(g,
                                    1))
                            }
                        },
                        _findInstanceByLayer: function(b) {
                            var g = null;
                            n.some(this._instances, f.hitch(this, function(d) {
                                return d.featureLayer === b ? (g = d, !0) : !1
                            }));
                            return g
                        },
                        clear: function(b) {
                            n.forEach(this._instances, f.hitch(this, function(g) {
                                g.clear(b)
                            }))
                        },
                        destroy: function() {
                            this._hideTooltipDialog(this.tooltipDialog1);
                            this._hideTooltipDialog(this.tooltipDialog2);
                            n.forEach(this._instances, f.hitch(this, function(b) {
                                b.destroy()
                            }));
                            this._instances = [];
                            this.drawBox && this.drawBox.destroy();
                            this.drawBox = null;
                            this.inherited(arguments)
                        },
                        _hideTooltipDialog: function(b) {
                            b && c.close(b)
                        },
                        _onDrawBoxUserClear: function() {
                            this.clear(!0);
                            this.emit("user-clear")
                        },
                        _onDrawEnd: function(b, g, d, a, c, k) {
                            this.drawBox.clear();
                            0 < this._instances.length && setTimeout(f.hitch(this, function() {
                                if (0 < this._instances.length) {
                                    this.emit("loading");
                                    this.disable();
                                    var e = n.map(this._instances, f.hitch(this, function(b) {
                                        return b.getFeatures()
                                    }));
                                    p(e).always(f.hitch(this, function() {
                                        this.enable();
                                        this._currentGeoTypeInfo && q.simulateClickEvent(this._currentGeoTypeInfo.dom);
                                        this.emit("unloading", b, g, d, a, c, k)
                                    }))
                                }
                            }), 50)
                        }
                    })
                })
        },
        "jimu/dijit/_FeatureSetChooserCore": function() {
            define("dojo/on dojo/sniff dojo/Evented dojo/Deferred dojo/_base/lang dojo/_base/array dojo/_base/declare jimu/utils jimu/symbolUtils jimu/SelectionManager jimu/LayerInfos/LayerInfos esri/graphic esri/tasks/query esri/tasks/QueryTask esri/layers/FeatureLayer esri/symbols/jsonUtils esri/geometry/geometryEngine".split(" "), function(m, a, l, k, e, h, f, n, p, r, w, v, t, x, c, y, q) {
                return f([l], {
                    baseClass: "jimu-featureset-chooser-core",
                    _middleFeatureLayer: null,
                    _isLoading: !1,
                    _def: null,
                    _isDestroyed: !1,
                    _handles: null,
                    selectionManager: null,
                    layerInfosObj: null,
                    map: null,
                    featureLayer: null,
                    drawBox: null,
                    updateSelection: !1,
                    fullyWithin: !1,
                    constructor: function(d) {
                        e.mixin(this, d);
                        this.layerInfosObj = w.getInstanceSync();
                        this.selectionManager = r.getInstance();
                        this.featureLayer.getSelectionSymbol() || this.selectionManager.setSelectionSymbol(this.featureLayer);
                        d = n.getFeatureLayerDefinition(this.featureLayer);
                        delete d.id;
                        this._middleFeatureLayer = new c({
                            layerDefinition: d,
                            featureSet: null
                        }, {
                            id: "featureLayer_" + n.getRandomString()
                        });
                        d = null;
                        var a = this._middleFeatureLayer.geometryType;
                        "esriGeometryPoint" === a ? d = p.getDefaultMarkerSymbol() : "esriGeometryPolyline" === a ? d = p.getDefaultLineSymbol() : "esriGeometryPolygon" === a && (d = y.fromJson({
                            style: "esriSFSSolid",
                            color: [79, 129, 189, 77],
                            type: "esriSFS",
                            outline: {
                                style: "esriSLSSolid",
                                color: [54, 93, 141, 255],
                                width: 1.5,
                                type: "esriSLS"
                            }
                        }));
                        this._middleFeatureLayer.setSelectionSymbol(d);
                        d = m(this.drawBox, "user-clear", e.hitch(this, this._onDrawBoxUserClear));
                        a = m(this.drawBox, "draw-end", e.hitch(this, this._onDrawEnd));
                        this._handles = [d, a]
                    },
                    hideMiddleFeatureLayer: function() {
                        if (this._middleFeatureLayer) {
                            this._middleFeatureLayer.hide();
                            var d = this.selectionManager.getDisplayLayer(this._middleFeatureLayer.id);
                            d && d.hide()
                        }
                    },
                    showMiddleFeatureLayer: function() {
                        if (this._middleFeatureLayer) {
                            this._middleFeatureLayer.show();
                            var d = this.selectionManager.getDisplayLayer(this._middleFeatureLayer.id);
                            d && d.show()
                        }
                    },
                    clear: function(d) {
                        this.drawBox.clear();
                        this._clearMiddleFeatureLayer();
                        d && this.selectionManager.clearSelection(this.featureLayer)
                    },
                    getFeatures: function() {
                        var d = new k,
                            a = e.hitch(this, function() {
                                var a = this.syncGetFeatures();
                                d.resolve(a)
                            }),
                            c = e.hitch(this, function(a) {
                                d.reject(a)
                            });
                        1 === this._getDeferredStatus(this._def) ? this._def.then(a, c) : a();
                        return d
                    },
                    syncGetFeatures: function() {
                        return (this.updateSelection ? this.featureLayer : this._middleFeatureLayer).getSelectedFeatures()
                    },
                    isLoading: function() {
                        return 1 === this._getDeferredStatus(this._def)
                    },
                    _onLoading: function() {
                        this.drawBox.deactivate();
                        this.emit("loading")
                    },
                    _onUnloading: function() {
                        this.emit("unloading")
                    },
                    _getDeferredStatus: function(a) {
                        var d = 0;
                        return d = a ? a.isResolved() ? 2 : a.isRejected() ? -1 : 1 : 0
                    },
                    _onDrawEnd: function(d, f, h, l, b, g) {
                        console.log(f, h);
                        if (this.isLoading()) throw "should not draw when loading";
                        if (this.featureLayer.visible) {
                            var C = new k;
                            this._def = C;
                            var A = c.SELECTION_NEW;
                            l && (A = c.SELECTION_ADD);
                            a("mac") ? g && (A = c.SELECTION_SUBTRACT) : b && (A = c.SELECTION_SUBTRACT);
                            this.emit("loading");
                            this._getFeaturesByGeometry(d.geometry).then(e.hitch(this,
                                function(b) {
                                    this.selectionManager.updateSelectionByFeatures(this.updateSelection ? this.featureLayer : this._middleFeatureLayer, b, A);
                                    this._onUnloading();
                                    C.resolve(b)
                                }), e.hitch(this, function(b) {
                                console.error(b);
                                this._onUnloading();
                                C.reject(b)
                            }))
                        }
                    },
                    _addTolerance: function(a) {
                        var d = 2.54 * this.map.getScale() / 9600;
                        return q.buffer(a, 10 * d, "meters")
                    },
                    _getFeaturesByGeometry: function(a) {
                        "point" === a.type && "esriGeometryPoint" === this.featureLayer.geometryType && (a = this._addTolerance(a));
                        var d = new k,
                            c = [];
                        if (this.featureLayer.getMap()) a =
                            this.selectionManager.getClientFeaturesByGeometry(this.featureLayer, a, this.fullyWithin), 0 < a.length && (c = h.map(a, e.hitch(this, function(b) {
                                return new v(b.toJson())
                            }))), d.resolve(c);
                        else {
                            c = new t;
                            c.geometry = a;
                            c.outSpatialReference = this.map.spatialReference;
                            c.returnGeometry = !0;
                            c.spatialRelationship = this.fullyWithin ? t.SPATIAL_REL_CONTAINS : t.SPATIAL_REL_INTERSECTS;
                            (a = this.featureLayer.getDefinitionExpression()) || (a = "1\x3d1");
                            var f = this.layerInfosObj.getLayerInfoById(this.featureLayer.id);
                            f && (f = f.getFilter()) &&
                                (a = "(" + a + ") AND (" + f + ")");
                            a && (c.where = a);
                            c.outFields = ["*"];
                            (new x(this.featureLayer.url)).execute(c).then(e.hitch(this, function(b) {
                                d.resolve(b.features)
                            }), e.hitch(this, function(b) {
                                d.reject(b)
                            }))
                        }
                        return d
                    },
                    _onDrawBoxUserClear: function() {
                        this.clear()
                    },
                    _clearMiddleFeatureLayer: function() {
                        this._middleFeatureLayer && (this._middleFeatureLayer.clear(), this.selectionManager.clearSelection(this._middleFeatureLayer))
                    },
                    destroy: function() {
                        this._isDestroyed || (h.forEach(this._handles, e.hitch(this, function(a) {
                                a.remove()
                            })),
                            this._handles = null, this.clear());
                        this._isDestroyed = !0
                    }
                })
            })
        },
        "widgets/Select/layerUtil": function() {
            define(["dojo/_base/array", "dojo/promise/all", "dojo/Deferred"], function(m, a, l) {
                return {
                    getLayerInfoArray: function(k) {
                        var e = new l,
                            h = [];
                        k.traversal(function(a) {
                            h.push(a)
                        });
                        k = m.map(h, function(a) {
                            return a.getLayerType()
                        });
                        a(k).then(function(a) {
                            var k = [];
                            m.forEach(a, function(a, f) {
                                "FeatureLayer" === a && k.push(h[f])
                            });
                            e.resolve(k)
                        });
                        return e
                    }
                }
            })
        },
        "widgets/Select/SelectableLayerItem": function() {
            define("dojo/_base/declare dojo/_base/html dojo/_base/lang dojo/_base/event dojo/on dojo/Evented dojo/dom-geometry jimu/utils jimu/dijit/FeatureActionPopupMenu dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!./SelectableLayerItem.html ./ClearSelectionAction".split(" "),
                function(m, a, l, k, e, h, f, n, p, r, w, v, t, x) {
                    return m([r, w, v, h], {
                        baseClass: "selectable-layer-item",
                        templateString: t,
                        layerName: "layer",
                        layerVisible: !0,
                        checked: !1,
                        allowExport: !1,
                        inited: !1,
                        postCreate: function() {
                            this.inherited(arguments);
                            this.popupMenu = p.getInstance()
                        },
                        init: function(c) {
                            this.featureLayer = c;
                            c = this.featureLayer.getSelectedFeatures().length;
                            this.layerName = this.layerInfo.title || "layer";
                            this.selectedCountNode.innerHTML = c;
                            0 < c ? a.removeClass(this.domNode, "no-action") : a.addClass(this.domNode, "no-action");
                            this.own(e(this.featureLayer, "selection-complete", l.hitch(this, function() {
                                var c = this.featureLayer.getSelectedFeatures().length;
                                this.selectedCountNode.innerHTML = c;
                                0 === c ? a.addClass(this.domNode, "no-action") : a.removeClass(this.domNode, "no-action")
                            })));
                            this.own(e(this.featureLayer, "selection-clear", l.hitch(this, function() {
                                this.selectedCountNode.innerHTML = 0;
                                a.addClass(this.domNode, "no-action")
                            })));
                            this.layerNameNode.innerHTML = this.layerName;
                            this.layerNameNode.title = this.layerName;
                            this.layerVisible || a.addClass(this.domNode,
                                "invisible");
                            this.checked ? a.addClass(this.selectableCheckBox, "checked") : a.removeClass(this.selectableCheckBox, "checked");
                            this.own(e(this.selectableCheckBox, "click", l.hitch(this, this._toggleChecked)));
                            this.own(e(this.layerContent, "click", l.hitch(this, this._toggleContent)));
                            this.own(e(this.actionBtn, "click", l.hitch(this, this._showActions)));
                            this.inited = !0;
                            this.emit("inited")
                        },
                        isLayerVisible: function() {
                            return this.layerVisible
                        },
                        isChecked: function() {
                            return this.checked
                        },
                        updateLayerVisibility: function() {
                            var c =
                                this.layerInfo.isShowInMap() && this.layerInfo.isInScale();
                            c !== this.layerVisible && ((this.layerVisible = c) ? a.removeClass(this.domNode, "invisible") : a.addClass(this.domNode, "invisible"), this.emit("stateChange", {
                                visible: this.layerVisible,
                                layerInfo: this.layerInfo,
                                featureLayer: this.featureLayer
                            }))
                        },
                        turnOn: function() {
                            a.addClass(this.selectableCheckBox, "checked");
                            this.checked = !0
                        },
                        turnOff: function() {
                            a.removeClass(this.selectableCheckBox, "checked");
                            this.checked = !1
                        },
                        toggleChecked: function() {
                            (this.checked = !this.checked) ?
                            a.addClass(this.selectableCheckBox, "checked"): a.removeClass(this.selectableCheckBox, "checked")
                        },
                        _toggleChecked: function(c) {
                            k.stop(c);
                            a.toggleClass(this.selectableCheckBox, "checked");
                            this.checked = a.hasClass(this.selectableCheckBox, "checked");
                            this.emit("stateChange", {
                                checked: this.checked,
                                layerInfo: this.layerInfo
                            })
                        },
                        _toggleContent: function(c) {
                            k.stop(c);
                            a.hasClass(this.domNode, "no-action") || this.emit("switchToDetails", this)
                        },
                        _showActions: function(c) {
                            k.stop(c);
                            if (!a.hasClass(this.domNode, "no-action")) {
                                var e =
                                    this.featureLayer.getSelectedFeatures(),
                                    h = n.toFeatureSet(e);
                                this.popupMenu.prepareActions(h, this.allowExport).then(l.hitch(this, function() {
                                    var a = f.position(c.target);
                                    0 < e.length && this.popupMenu.appendAction(new x({
                                        folderUrl: this.folderUrl,
                                        data: this.featureLayer
                                    }));
                                    this.popupMenu.show(a, this.nls.actionsTitle)
                                }))
                            }
                        }
                    })
                })
        },
        "widgets/Select/ClearSelectionAction": function() {
            define(["dojo/_base/declare", "jimu/BaseFeatureAction", "jimu/SelectionManager"], function(m, a, l) {
                return m(a, {
                    name: "ClearSelection",
                    iconClass: "icon-clear-selection",
                    constructor: function() {
                        this.label = window.jimuNls.featureActions.ClearSelection
                    },
                    isFeatureSupported: function(a) {
                        return 0 < a.features.length && a.geometryType
                    },
                    onExecute: function(a) {
                        l.getInstance().clearSelection(a)
                    },
                    getIcon: function(a) {
                        return this.folderUrl + "images/" + this.name + "_" + a + "." + this.iconFormat
                    }
                })
            })
        },
        "widgets/Select/FeatureItem": function() {
            define("dojo/_base/declare dojo/_base/lang dojo/_base/html dojo/_base/event dojo/on dojo/dom-geometry dijit/_WidgetBase dijit/_TemplatedMixin dojo/text!./FeatureItem.html jimu/utils jimu/symbolUtils jimu/dijit/FeatureActionPopupMenu jimu/featureActions/PanTo jimu/featureActions/ShowPopup".split(" "),
                function(m, a, l, k, e, h, f, n, p, r, w, v, t, x) {
                    return m([f, n], {
                        baseClass: "graphic-item",
                        templateString: p,
                        allowExport: !1,
                        postCreate: function() {
                            this.inherited(arguments);
                            var c;
                            this.featureLayer && this.featureLayer.renderer && this.featureLayer.renderer.getSymbol ? c = this.featureLayer.renderer.getSymbol(this.graphic) : this.graphic.symbol && (c = this.graphic.symbol);
                            c && (c = w.createSymbolNode(c, {
                                width: 36,
                                height: 36
                            }), l.place(c, this.iconNode));
                            this.popupMenu = v.getInstance();
                            c = this.featureLayer && this.featureLayer.infoTemplate &&
                                "function" === typeof this.featureLayer.infoTemplate.title ? this.featureLayer.infoTemplate.title(this.graphic) : this.graphic.attributes[this.displayField] || this.graphic.attributes[this.objectIdField];
                            this.nameNode.innerHTML = c;
                            this.nameNode.title = c;
                            this.own(e(this.actionBtn, "click", a.hitch(this, this._showActions)));
                            this.own(e(this.iconNode, "click", a.hitch(this, this._highlight)));
                            this.own(e(this.nameNode, "click", a.hitch(this, this._highlight)))
                        },
                        _highlight: function() {
                            var a = r.toFeatureSet([this.graphic]),
                                e = new t({
                                    map: this.map
                                });
                            (new x({
                                map: this.map
                            })).onExecute(a);
                            e.onExecute(a)
                        },
                        _showActions: function(c) {
                            k.stop(c);
                            var e = r.toFeatureSet([this.graphic]);
                            this.popupMenu.prepareActions(e, this.allowExport).then(a.hitch(this, function() {
                                var a = h.position(c.target);
                                this.popupMenu.show(a)
                            }))
                        }
                    })
                })
        },
        "widgets/Select/_build-generate_module": function() {
            define(["dojo/text!./Widget.html", "dojo/text!./css/style.css", "dojo/i18n!./nls/strings"], function() {})
        },
        "url:jimu/dijit/templates/FeatureSetChooserForMultipleLayers.html": '\x3cdiv class\x3d"jimu-not-selectable"\x3e\r\n  \x3cdiv class\x3d"draw-item-btn" tabindex\x3d"0"\x3e\r\n    \x3cdiv class\x3d"current-draw-item" data-dojo-attach-point\x3d"currentDrawItem"\x3e\r\n      \x3cdiv class\x3d"btn-select" data-dojo-attach-point\x3d"btnSelect"\x3e\r\n        \x3cdiv class\x3d"labels"\x3e\r\n            \x3cdiv class\x3d"feature-action" data-dojo-attach-point\x3d"geoTypeIcon"\x3e\x3c/div\x3e\r\n            \x3cdiv class\x3d"select-text"\x3e\x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"arrow feature-action icon-drop-down" data-dojo-attach-event\x3d"click:_onArrowClicked"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"btn-clear" data-dojo-attach-point\x3d"btnClear" tabindex\x3d"0"\x3e\r\n    \x3cdiv class\x3d"feature-action icon-clear-selection"\x3e\x3c/div\x3e\x3cdiv class\x3d"clear-text"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e',
        "url:widgets/Select/SelectableLayerItem.html": '\x3cdiv\x3e\r\n  \x3cdiv class\x3d"layer-row" data-dojo-attach-point\x3d"layerContent"\x3e\r\n    \x3cdiv class\x3d"selectable-check" title\x3d"${nls.toggleSelectability}"\r\n         data-dojo-attach-point\x3d"selectableCheckBox"\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"layer-name jimu-ellipsis" data-dojo-attach-point\x3d"layerNameNode"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"selected-num" data-dojo-attach-point\x3d"selectedCountNode"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"feature-action icon-more" title\x3d"${nls.showActions}"\r\n    data-dojo-attach-point\x3d"actionBtn"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e',
        "url:widgets/Select/FeatureItem.html": '\x3cdiv\x3e\r\n  \x3cdiv class\x3d"feature-item-row"\x3e\r\n    \x3cdiv class\x3d"feature-icon" data-dojo-attach-point\x3d"iconNode"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"light-label label-node jimu-ellipsis" data-dojo-attach-point\x3d"nameNode"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"action-btn feature-action icon-more" title\x3d"${nls.showActions}"\r\n     data-dojo-attach-point\x3d"actionBtn"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e',
        "url:widgets/Select/Widget.html": '\x3cdiv\x3e\r\n  \x3cdiv class\x3d"layer-node" data-dojo-attach-point\x3d"layerListNode"\x3e\r\n    \x3cdiv\x3e\r\n      \x3cdiv class\x3d"select-dijit-container" data-dojo-attach-point\x3d"selectDijitNode"\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv class\x3d"seperator"\x3e\x3c/div\x3e\r\n      \x3cdiv class\x3d"tool-section"\x3e\r\n        \x3cdiv class\x3d"jimu-float-leading label"\x3e${nls.layer}\x3c/div\x3e\r\n        \x3cdiv class\x3d"jimu-float-trailing setting feature-action icon-operation" data-dojo-attach-point\x3d"settingNode"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"layer-nodes" \x3e\r\n      \x3cdiv class\x3d"layer-items" data-dojo-attach-point\x3d"layerItemsNode"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"details-node" data-dojo-attach-point\x3d"detailsNode"\x3e\r\n    \x3cdiv class\x3d"header"\x3e\r\n      \x3cdiv class\x3d"switch-back jimu-float-leading" data-dojo-attach-point\x3d"switchBackBtn"\x3e\r\n        \x3cdiv class\x3d"feature-action" data-dojo-attach-point\x3d"switchBackIcon"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv class\x3d"layer-name jimu-ellipsis" data-dojo-attach-point\x3d"selectedLayerName"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"content" data-dojo-attach-point\x3d"featureContent"\x3e\r\n\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"shelter" data-dojo-type\x3d"jimu/dijit/LoadingShelter" data-dojo-props\x3d\'hidden:true\'\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
        "url:widgets/Select/css/style.css": '.jimu-widget-select {width: 100%; height: 100%; min-width: 280px; overflow: hidden;}.jimu-widget-select .jimu-viewstack {height: 100%;}.jimu-widget-select .jimu-viewstack .view {position: relative;}.jimu-widget-select .tool-section {height: 36px; position: relative;}.jimu-widget-select .tool-section .label {font-size: 14px; line-height: 36px; margin: 0 10px;}.jimu-widget-select .tool-section .setting {width: 16px; height: 16px; margin: 10px; cursor: pointer;}.jimu-widget-select .selectable-check {width: 36px; height: 36px; cursor: pointer; background: url(images/unchecked.svg) no-repeat center;}.jimu-widget-select .selectable-check:hover {background: url(images/unchecked_hover.svg) no-repeat center;}.jimu-widget-select .selectable-check.checked {background: url(images/checked.svg) no-repeat center;}.jimu-widget-select .selectable-check.checked:hover {background: url(images/checked_hover.svg) no-repeat center;}.jimu-widget-select .seperator {width: 100%; height: 1px; background: #D7D7D7; margin-top: 20px;}.jimu-widget-select .title {font-family: "Avenir Light"; font-size: 12px; line-height: 16px; color: #000000; margin: 20px 0;}.jimu-widget-select .normal-label, .jimu-widget-select .light-label, .jimu-widget-select .selectable-layer-item .layer-row .layer-name, .jimu-widget-select .selectable-layer-item .layer-row .selected-num, .jimu-widget-select .medium-label {line-height: 36px; height: 36px; font-size: 12px; color: #000000;}.jimu-widget-select .light-label, .jimu-widget-select .selectable-layer-item .layer-row .layer-name, .jimu-widget-select .selectable-layer-item .layer-row .selected-num {font-family: "Avenir Light";}.jimu-widget-select .medium-label {font-family: "Avenir Medium";}.jimu-widget-select .layer-nodes {position: absolute; top: 100px; bottom: 0; width: 100%; overflow: auto;}.jimu-widget-select .jimu-multiple-layers-featureset-chooser .draw-item {padding: 0;}.jimu-widget-select .jimu-multiple-layers-featureset-chooser .btn-clear {padding: 0; width: 30%;}.jimu-rtl .jimu-widget-select .jimu-multiple-layers-featureset-chooser .btn-clear {float: left;}.jimu-widget-select .selectable-layer-item {width: 100%; height: 36px; position: relative;}.jimu-widget-select .selectable-layer-item .layer-row {height: 36px; position: relative; cursor: pointer;}.jimu-widget-select .selectable-layer-item .layer-row \x3e div {display: inline-block;}.jimu-widget-select .selectable-layer-item .layer-row .layer-name {margin: 0 5px; position: absolute; left: 36px; right: 72px;}.jimu-rtl .jimu-widget-select .selectable-layer-item .layer-row .layer-name {left: 72px; right: 36px;}.jimu-widget-select .selectable-layer-item .layer-row .selected-num {width: 36px; margin: 0 5px; text-align: center; position: absolute; right: 36px;}.jimu-rtl .jimu-widget-select .selectable-layer-item .layer-row .selected-num {right: auto; left: 36px;}.jimu-widget-select .selectable-layer-item .layer-row .feature-action {position: absolute; right: 0; width: 36px; height: 36px; padding: 10px;}.jimu-rtl .jimu-widget-select .selectable-layer-item .layer-row .feature-action {right: auto; left: 0;}.jimu-widget-select .selectable-layer-item:hover {background-color: #E5E5E5;}.jimu-widget-select .selectable-layer-item:hover .selected-num {font-weight: bold;}.jimu-widget-select .selectable-layer-item.no-action .selected-num {font-weight: normal;}.jimu-widget-select .selectable-layer-item.no-action:hover {background-color: #FFFFFF;}.jimu-widget-select .selectable-layer-item.no-action .layer-row {cursor: default;}.jimu-widget-select .selectable-layer-item.no-action .layer-row .feature-action {cursor: default;}.jimu-widget-select .selectable-layer-item.no-action .layer-row .feature-action:hover {color: rgba(0, 0, 0, 0.5);}.jimu-widget-select .selectable-layer-item.no-action .selected-num {color: #B7B7B7;}.jimu-widget-select .selectable-layer-item.no-action .selected-num:hover {font-weight: normal;}.jimu-widget-select .selectable-layer-item.invisible .selectable-check {background: url(images/unchecked_invisible.svg) no-repeat center;}.jimu-widget-select .selectable-layer-item.invisible .selectable-check:hover {background: url(images/unchecked_invisible_hover.svg) no-repeat center;}.jimu-widget-select .selectable-layer-item.invisible .selectable-check.checked {background: url(images/checked_invisible.svg) no-repeat center;}.jimu-widget-select .selectable-layer-item.invisible .selectable-check.checked:hover {background: url(images/checked_invisible_hover.svg) no-repeat center;}.jimu-widget-select .selectable-layer-item.invisible .layer-name {color: #B7B7B7;}.jimu-widget-select .details-node {widows: 100%;}.jimu-widget-select .details-node .header {height: 40px; text-align: center;}.jimu-widget-select .details-node .header .switch-back {width: 40px; height: 40px;}.jimu-widget-select .details-node .header .switch-back .feature-action {margin: 12px;}.jimu-widget-select .details-node .header .layer-name {font-family: "Avenir Medium"; font-size: 14px; font-size: 14px; color: #000000; height: 40px; line-height: 40px;}.jimu-widget-select .details-node .content {position: absolute; top: 40px; bottom: 0; width: 100%; overflow: auto;}.jimu-widget-select .details-node .content .graphic-item {height: 36px; width: 100%; position: relative;}.jimu-widget-select .details-node .content .graphic-item:hover {background: #E5E5E5;}.jimu-widget-select .details-node .content .graphic-item .feature-item-row {position: relative; height: 36px; cursor: pointer;}.jimu-widget-select .details-node .content .graphic-item .feature-item-row .feature-icon {position: absolute; left: 0; width: 36px; height: 36px;}.jimu-rtl .jimu-widget-select .details-node .content .graphic-item .feature-item-row .feature-icon {left: auto; right: 0;}.jimu-widget-select .details-node .content .graphic-item .feature-item-row .action-btn {position: absolute; right: 0; padding: 10px;}.jimu-rtl .jimu-widget-select .details-node .content .graphic-item .feature-item-row .action-btn {right: auto; left: 0;}.jimu-widget-select .details-node .content .graphic-item .feature-item-row .label-node {position: absolute; left: 36px; right: 36px; margin: 0 10px;}',
        "*now": function(m) {
            m(['dojo/i18n!*preload*widgets/Select/nls/Widget*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","uk","vi","zh-hk","zh-tw","ROOT"]'])
        },
        "*noref": 1
    }
});
define("dojo/_base/declare dojo/_base/lang dojo/_base/html dojo/_base/array dojo/on dojo/promise/all dijit/_WidgetsInTemplateMixin esri/symbols/SimpleMarkerSymbol esri/symbols/SimpleLineSymbol esri/symbols/SimpleFillSymbol esri/symbols/jsonUtils esri/Color jimu/BaseWidget jimu/WidgetManager jimu/dijit/ViewStack jimu/dijit/FeatureSetChooserForMultipleLayers jimu/LayerInfos/LayerInfos jimu/SelectionManager jimu/dijit/FeatureActionPopupMenu ./layerUtil ./SelectableLayerItem ./FeatureItem jimu/dijit/LoadingShelter".split(" "), function(m,
    a, l, k, e, h, f, n, p, r, w, v, t, x, c, y, q, d, B, u, z, b) {
    return m([t, f], {
        baseClass: "jimu-widget-select",
        postMixInProperties: function() {
            this.inherited(arguments);
            a.mixin(this.nls, window.jimuNls.common)
        },
        postCreate: function() {
            this.inherited(arguments);
            var b = new v(this.config.selectionColor);
            this.defaultPointSymbol = new n(n.STYLE_CIRCLE, 16, null, b);
            this.defaultLineSymbol = new p(p.STYLE_SOLID, b, 2);
            this.defaultFillSymbol = new r(r.STYLE_SOLID, this.defaultLineSymbol, new v([b.r, b.g, b.b, .3]));
            this.popupMenu = B.getInstance();
            this.layerMapper = {};
            this.layerObjectArray = [];
            this.layerItems = [];
            this.selectDijit = new y({
                map: this.map,
                updateSelection: !0,
                fullyWithin: "wholly" === this.config.selectionMode,
                geoTypes: this.config.geometryTypes || ["EXTENT"]
            });
            l.place(this.selectDijit.domNode, this.selectDijitNode);
            this.selectDijit.startup();
            this.own(e(this.selectDijit, "user-clear", a.hitch(this, this._clearAllSelections)));
            this.own(e(this.selectDijit, "loading", a.hitch(this, function() {
                this.shelter.show()
            })));
            this.own(e(this.selectDijit, "unloading",
                a.hitch(this, function() {
                    this.shelter.hide()
                })));
            this.viewStack = new c({
                viewType: "dom",
                views: [this.layerListNode, this.detailsNode]
            });
            l.place(this.viewStack.domNode, this.domNode);
            this.own(e(this.switchBackBtn, "click", a.hitch(this, this._switchToLayerList)));
            window.isRTL ? l.addClass(this.switchBackIcon, "icon-arrow-forward") : l.addClass(this.switchBackIcon, "icon-arrow-back");
            this._switchToLayerList();
            var d = q.getInstanceSync();
            u.getLayerInfoArray(d).then(a.hitch(this, function(a) {
                this._initLayers(this._filterLayerInfo(a))
            }));
            this.own(e(d, "layerInfosChanged", a.hitch(this, function() {
                this.shelter.show();
                u.getLayerInfoArray(d).then(a.hitch(this, function(a) {
                    this._initLayers(this._filterLayerInfo(a))
                }))
            })));
            this.own(e(d, "layerInfosIsShowInMapChanged", a.hitch(this, this._layerVisibilityChanged)));
            this.own(e(this.map, "zoom-end", a.hitch(this, this._layerVisibilityChanged)));
            this.own(e(this.settingNode, "click", a.hitch(this, function(a) {
                a.stopPropagation();
                a = l.position(a.target);
                this.showPopup(a)
            })))
        },
        showPopup: function(b) {
            var g = [{
                iconClass: "no-icon",
                label: this.nls.turnonAll,
                data: {},
                onExecute: a.hitch(this, this._turnOnAllLayers)
            }, {
                iconClass: "no-icon",
                label: this.nls.turnoffAll,
                data: {},
                onExecute: a.hitch(this, this._turnOffAllLayers)
            }, {
                iconClass: "no-icon",
                label: this.nls.toggleSelect,
                data: {},
                onExecute: a.hitch(this, this._toggleAllLayers)
            }];
            this.popupMenu.setActions(g);
            this.popupMenu.show(b)
        },
        onDeActive: function() {
            this.selectDijit.isActive() && this.selectDijit.deactivate();
            this._restoreSelectionSymbol()
        },
        onActive: function() {
            this._setSelectionSymbol();
            !1 === this.config.enableByDefault || this.selectDijit.isActive() || this.selectDijit.activate()
        },
		  onOpen: function () {			  
				var panel = this.getPanel();
				panel.position.width = 400;
				panel.position.height = 200;
				panel._originalBox = {
					w: panel.position.width,
					h: panel.position.height,
					l: panel.position.left || 0,
					t: panel.position.top || 0
				};
				panel.setPosition(panel.position);
				panel.panelManager.normalizePanel(panel);

				console.log('onOpen');
				x.getInstance().activateWidget(this)
			},
        onDestroy: function() {
            this.selectDijit.isActive() && this.selectDijit.deactivate();
            this._clearAllSelections()
        },
        _filterLayerInfo: function(b) {
            if (!this.config.layerState) return b;
            var g = q.getInstanceSync().getLayerInfoArrayOfWebmap();
            return k.filter(b, a.hitch(this, function(a) {
                return this.config.layerState[a.id] && !1 === this.config.layerState[a.id].selected ? !1 !==
                    this.config.includeRuntimeLayers ? k.every(g, function(b) {
                        return a.getRootLayerInfo().id !== b.id
                    }) : !1 : !0
            }))
        },
        _initLayers: function(b) {
            this.layerObjectArray = [];
            this.layerItems = [];
            this.selectionSymbols = {};
            l.empty(this.layerItemsNode);
            this.shelter.show();
            h(this._obtainLayerObjects(b)).then(a.hitch(this, function(g) {
                k.forEach(g, a.hitch(this, function(g, c) {
                    if (g && g.objectIdField && g.geometryType) {
                        c = b[c];
                        var d = c.isShowInMap() && c.isInScale();
                        c = new z({
                            layerInfo: c,
                            checked: d,
                            layerVisible: d,
                            folderUrl: this.folderUrl,
                            allowExport: this.config ? this.config.allowExport : !1,
                            map: this.map,
                            nls: this.nls
                        });
                        this.own(e(c, "switchToDetails", a.hitch(this, this._switchToDetails)));
                        this.own(e(c, "stateChange", a.hitch(this, function(a) {
                            this.shelter.show();
                            "visible" in a && this.selectDijit.setDisplayLayerVisibility(a.featureLayer, a.visible);
                            this.selectDijit.setFeatureLayers(this._getSelectableLayers());
                            this.shelter.hide()
                        })));
                        c.init(g);
                        l.place(c.domNode, this.layerItemsNode);
                        c.startup();
                        this.layerItems.push(c);
                        this.layerObjectArray.push(g);
                        g.getSelectionSymbol() || this._setDefaultSymbol(g);
                        c = g.getSelectionSymbol();
                        this.selectionSymbols[g.id] = c.toJson()
                    }
                }));
                this.selectDijit.setFeatureLayers(this._getSelectableLayers());
                this._setSelectionSymbol();
                this.shelter.hide()
            }))
        },
        _turnOffAllLayers: function() {
            this.shelter.show();
            k.forEach(this.layerItems, a.hitch(this, function(a) {
                a.turnOff()
            }));
            this.selectDijit.setFeatureLayers([]);
            this.shelter.hide()
        },
        _turnOnAllLayers: function() {
            this.shelter.show();
            k.forEach(this.layerItems, a.hitch(this, function(a) {
                a.turnOn()
            }));
            this.selectDijit.setFeatureLayers(this._getSelectableLayers());
            this.shelter.hide()
        },
        _toggleAllLayers: function() {
            this.shelter.show();
            k.forEach(this.layerItems, a.hitch(this, function(a) {
                a.toggleChecked()
            }));
            this.selectDijit.setFeatureLayers(this._getSelectableLayers());
            this.shelter.hide()
        },
        _setSelectionSymbol: function() {
            k.forEach(this.layerObjectArray, function(a) {
                this._setDefaultSymbol(a)
            }, this)
        },
        _setDefaultSymbol: function(a) {
            "esriGeometryPoint" === a.geometryType || "esriGeometryMultipoint" === a.geometryType ?
                a.setSelectionSymbol(this.defaultPointSymbol) : "esriGeometryPolyline" === a.geometryType ? a.setSelectionSymbol(this.defaultLineSymbol) : "esriGeometryPolygon" === a.geometryType ? a.setSelectionSymbol(this.defaultFillSymbol) : console.warn("unknown geometryType: " + a.geometryType)
        },
        _restoreSelectionSymbol: function() {
            k.forEach(this.layerObjectArray, function(a) {
                var b = this.selectionSymbols[a.id];
                b && a.setSelectionSymbol(w.fromJson(b))
            }, this)
        },
        _layerVisibilityChanged: function() {
            k.forEach(this.layerItems, function(a) {
                    a.updateLayerVisibility()
                },
                this)
        },
        _getSelectableLayers: function() {
            var a = [];
            k.forEach(this.layerItems, function(b) {
                b.isLayerVisible() && b.isChecked() && a.push(b.featureLayer)
            }, this);
            return a
        },
        _clearAllSelections: function() {
            var a = d.getInstance();
            k.forEach(this.layerObjectArray, function(b) {
                a.clearSelection(b)
            })
        },
        _obtainLayerObjects: function(a) {
            return k.map(a, function(a) {
                return a.getLayerObject()
            })
        },
        _switchToDetails: function(c) {
            l.empty(this.featureContent);
            this.viewStack.switchView(1);
            this.selectedLayerName.innerHTML = c.layerName;
            this.selectedLayerName.title = c.layerName;
            c.layerInfo.getLayerObject().then(a.hitch(this, function(c) {
                var d = c.getSelectedFeatures();
                0 < d.length && k.forEach(d, a.hitch(this, function(a) {
                    a = new b({
                        graphic: a,
                        map: this.map,
                        featureLayer: c,
                        displayField: c.displayField,
                        objectIdField: c.objectIdField,
                        allowExport: this.config ? this.config.allowExport : !1,
                        nls: this.nls
                    });
                    l.place(a.domNode, this.featureContent);
                    a.startup()
                }))
            }))
        },
        _switchToLayerList: function() {
            this.viewStack.switchView(0)
        }
    })
});