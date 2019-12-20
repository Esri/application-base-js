var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "esri/core/promiseUtils", "esri/core/watchUtils", "esri/views/MapView", "esri/views/SceneView", "./urlUtils"], function (require, exports, promiseUtils_1, watchUtils_1, MapView_1, SceneView_1, urlUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MapView_1 = __importDefault(MapView_1);
    SceneView_1 = __importDefault(SceneView_1);
    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------
    function getConfigViewProperties(config) {
        var center = config.center, components = config.components, extent = config.extent, level = config.level, viewpoint = config.viewpoint;
        var ui = components
            ? { ui: { components: urlUtils_1.parseViewComponents(components) } }
            : null;
        var cameraProps = viewpoint ? { camera: urlUtils_1.parseViewpoint(viewpoint) } : null;
        var centerProps = center ? { center: urlUtils_1.parseCenter(center) } : null;
        var zoomProps = level ? { zoom: urlUtils_1.parseLevel(level) } : null;
        var extentProps = extent ? { extent: urlUtils_1.parseExtent(extent) } : null;
        return __assign(__assign(__assign(__assign(__assign({}, ui), cameraProps), centerProps), zoomProps), extentProps);
    }
    exports.getConfigViewProperties = getConfigViewProperties;
    function createView(properties) {
        return __awaiter(this, void 0, void 0, function () {
            var map, isWebMap, isWebScene;
            return __generator(this, function (_a) {
                map = properties.map;
                if (!map) {
                    return [2 /*return*/, promiseUtils_1.reject("properties does not contain a \"map\"")];
                }
                isWebMap = map.declaredClass === "esri.WebMap";
                isWebScene = map.declaredClass === "esri.WebScene";
                if (!isWebMap && !isWebScene) {
                    return [2 /*return*/, promiseUtils_1.reject("map is not a \"WebMap\" or \"WebScene\"")];
                }
                return [2 /*return*/, isWebMap ? new MapView_1.default(properties) : new SceneView_1.default(properties)];
            });
        });
    }
    exports.createView = createView;
    function createMapFromItem(options) {
        var item = options.item;
        var isWebMap = item.type === "Web Map";
        var isWebScene = item.type === "Web Scene";
        if (!isWebMap && !isWebScene) {
            return promiseUtils_1.reject();
        }
        return isWebMap
            ? createWebMapFromItem(options)
            : createWebSceneFromItem(options);
    }
    exports.createMapFromItem = createMapFromItem;
    function createWebMapFromItem(options) {
        return __awaiter(this, void 0, void 0, function () {
            var item, appProxies, WebMap, wm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        item = options.item, appProxies = options.appProxies;
                        return [4 /*yield*/, new Promise(function (resolve_1, reject_1) { require(["esri/WebMap"], resolve_1, reject_1); }).then(__importStar)];
                    case 1:
                        WebMap = _a.sent();
                        wm = new WebMap.default({
                            portalItem: item
                        });
                        return [4 /*yield*/, wm.load()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, wm.basemap.load()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, _updateProxiedLayers(wm, appProxies)];
                }
            });
        });
    }
    exports.createWebMapFromItem = createWebMapFromItem;
    function createWebSceneFromItem(options) {
        return __awaiter(this, void 0, void 0, function () {
            var item, appProxies, WebScene, ws;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        item = options.item, appProxies = options.appProxies;
                        return [4 /*yield*/, new Promise(function (resolve_2, reject_2) { require(["esri/WebScene"], resolve_2, reject_2); }).then(__importStar)];
                    case 1:
                        WebScene = _a.sent();
                        ws = new WebScene.default({
                            portalItem: item
                        });
                        return [4 /*yield*/, ws.load()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, ws.basemap.load()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, _updateProxiedLayers(ws, appProxies)];
                }
            });
        });
    }
    exports.createWebSceneFromItem = createWebSceneFromItem;
    function getItemTitle(item) {
        if (item && item.title) {
            return item.title;
        }
    }
    exports.getItemTitle = getItemTitle;
    function goToMarker(marker, view) {
        return __awaiter(this, void 0, void 0, function () {
            var graphic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!marker || !view) {
                            return [2 /*return*/, promiseUtils_1.resolve()];
                        }
                        return [4 /*yield*/, urlUtils_1.parseMarker(marker)];
                    case 1:
                        graphic = _a.sent();
                        return [4 /*yield*/, view.when()];
                    case 2:
                        _a.sent();
                        view.graphics.add(graphic);
                        view.goTo(graphic);
                        return [2 /*return*/, graphic];
                }
            });
        });
    }
    exports.goToMarker = goToMarker;
    function findQuery(query, view) {
        return __awaiter(this, void 0, void 0, function () {
            var SearchViewModel, searchVM, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // ?find=redlands, ca
                        if (!query || !view) {
                            return [2 /*return*/, promiseUtils_1.resolve()];
                        }
                        return [4 /*yield*/, new Promise(function (resolve_3, reject_3) { require(["esri/widgets/Search/SearchViewModel"], resolve_3, reject_3); }).then(__importStar)];
                    case 1:
                        SearchViewModel = _a.sent();
                        searchVM = new SearchViewModel.default({
                            view: view
                        });
                        return [4 /*yield*/, searchVM.search(query)];
                    case 2:
                        result = _a.sent();
                        watchUtils_1.whenFalseOnce(view, "popup.visible", function () {
                            searchVM.destroy();
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    }
    exports.findQuery = findQuery;
    //--------------------------------------------------------------------------
    //
    //  Private Methods
    //
    //--------------------------------------------------------------------------
    function _updateProxiedLayers(webItem, appProxies) {
        if (!appProxies) {
            return webItem;
        }
        appProxies.forEach(function (proxy) {
            webItem.allLayers.forEach(function (layer) {
                if (layer.url === proxy.sourceUrl) {
                    layer.url = proxy.proxyUrl;
                }
            });
        });
        return webItem;
    }
});
//# sourceMappingURL=itemUtils.js.map