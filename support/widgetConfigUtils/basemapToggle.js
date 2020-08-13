/**
 * This module contains a method to instantiate the 4.x API BasemapToggle Widget
 * using configuration variable which come from the Config Panel.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./widgetConfigUtils", "esri/widgets/BasemapToggle", "esri/Basemap"], function (require, exports, widgetConfigUtils_1, BasemapToggle_1, Basemap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    BasemapToggle_1 = __importDefault(BasemapToggle_1);
    Basemap_1 = __importDefault(Basemap_1);
    //////////////////////////////
    // Public Module Functions
    //////////////////////////////
    /** The original basemap for the Webmap */
    var _originalBasemap;
    /** The alternate basemap in the BasemapToggle */
    var _nextBasemap;
    /**
     * Adds BasemapToggle to Application, including logic to make
     * integrations with the Config Panel function properly
     * @param props
     */
    function addBasemapToggle(props) {
        return __awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, portal, basemapToggle, basemapTogglePosition, basemapSelector, nextBasemap, alternateBasemapId, basemapToggleInstance, node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName, portal = props.portal;
                        basemapToggle = config.basemapToggle, basemapTogglePosition = config.basemapTogglePosition, basemapSelector = config.basemapSelector, nextBasemap = config.nextBasemap;
                        alternateBasemapId = basemapSelector || nextBasemap;
                        node = widgetConfigUtils_1._findNode("esri-basemap-toggle");
                        if (node)
                            basemapToggleInstance = view.ui.find("basemapToggle");
                        // Save original basemap
                        if (!_originalBasemap)
                            _originalBasemap = view.map.basemap;
                        // Remove BasemapToggle
                        if (!basemapToggle) {
                            if (node) {
                                _resetBasemapsInToggle(basemapToggleInstance, _originalBasemap);
                                view.ui.remove(node);
                                basemapToggleInstance.destroy();
                            }
                            return [2 /*return*/, null]; // BasemapToggle has been removed
                        }
                        return [4 /*yield*/, _getBasemap(alternateBasemapId, portal)];
                    case 1:
                        // setup nextBasemap
                        _nextBasemap = _a.sent();
                        if (node && propertyName === "basemapSelector") {
                            _resetBasemapsInToggle(basemapToggleInstance, _originalBasemap, _nextBasemap);
                        }
                        else if (node && propertyName === "basemapTogglePosition") {
                            view.ui.move(node, basemapTogglePosition);
                        }
                        else if (propertyName === "basemapToggle") {
                            basemapToggleInstance = new BasemapToggle_1.default({
                                view: view,
                                nextBasemap: _nextBasemap,
                                id: "basemapToggle"
                            });
                            view.ui.add(basemapToggleInstance, basemapTogglePosition);
                        }
                        return [2 /*return*/, basemapToggleInstance];
                }
            });
        });
    }
    exports.addBasemapToggle = addBasemapToggle;
    //////////////////////////////
    // Private Module Functions
    //////////////////////////////
    /**
     * Creates Basemap instance properly from either a well-known-basemap-id, or
     * from a webmap id
     */
    function _getBasemap(id, portal) {
        return __awaiter(this, void 0, void 0, function () {
            var basemap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        basemap = Basemap_1.default.fromId(id);
                        if (!!basemap) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Basemap_1.default({
                                portalItem: {
                                    id: id,
                                    portal: portal
                                }
                            }).loadAll()];
                    case 1:
                        basemap = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, basemap];
                }
            });
        });
    }
    /**
     * Resets the Basemaps in the BasemapToggle by explicitly setting them.
     * Note: This also affects the basemap on the current Webmap being shown in the view,
     * because when nextBasemap on the BasemapToggle gets set, then that overrides the
     * basemap property on the Webmap
     * @param primaryBasemap The Basemap desired to be set as the Webmap's Basemap
     * @param nextBasemap The Alternate Basemap in the BasemapToggle
     */
    function _resetBasemapsInToggle(basemapToggle, primaryBasemap, nextBasemap) {
        basemapToggle.nextBasemap = primaryBasemap; // assign original first
        basemapToggle.toggle(); // toggle to make original the current basemap
        basemapToggle.nextBasemap = nextBasemap; // assign alternate 
    }
});
//# sourceMappingURL=basemapToggle.js.map