/*
  Copyright 2017 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.​
*/
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
define(["require", "exports", "esri/core/promiseUtils", "esri/identity/IdentityManager", "esri/identity/OAuthInfo", "esri/portal/Portal", "esri/portal/PortalItem", "esri/portal/PortalQueryParams", "esri/config", "esri/intl"], function (require, exports, promiseUtils_1, IdentityManager_1, OAuthInfo_1, Portal_1, PortalItem_1, PortalQueryParams_1, config_1, intl_1) {
    "use strict";
    IdentityManager_1 = __importDefault(IdentityManager_1);
    OAuthInfo_1 = __importDefault(OAuthInfo_1);
    Portal_1 = __importDefault(Portal_1);
    PortalItem_1 = __importDefault(PortalItem_1);
    PortalQueryParams_1 = __importDefault(PortalQueryParams_1);
    config_1 = __importDefault(config_1);
    var defaultConfig = {
        portalUrl: "https://www.arcgis.com",
        helperServices: {
            geometry: {},
            printTask: {},
            elevationSync: {},
            geocode: []
        }
    };
    var defaultSettings = {
        environment: {},
        group: {},
        portal: {},
        urlParams: [],
        webMap: {},
        webScene: {}
    };
    var ApplicationBase = /** @class */ (function () {
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        function ApplicationBase(options) {
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  settings
            //----------------------------------
            this.settings = defaultSettings;
            //----------------------------------
            //  config
            //----------------------------------
            this.config = defaultConfig;
            //----------------------------------
            //  results
            //----------------------------------
            this.results = {};
            //----------------------------------
            //  portal
            //----------------------------------
            this.portal = null;
            //----------------------------------
            //  direction
            //----------------------------------
            this.direction = null;
            //----------------------------------
            //  locale
            //----------------------------------
            this.locale = intl_1.getLocale();
            //----------------------------------
            //  units
            //----------------------------------
            this.units = null;
            var config = options.config, settings = options.settings;
            var applicationConfig = typeof config === "string"
                ? JSON.parse(config)
                : config;
            var applicationBaseSettings = typeof settings === "string"
                ? JSON.parse(settings)
                : settings;
            var configMixin = __assign(__assign({}, defaultConfig), applicationConfig);
            var settingsMixin = __assign(__assign({}, defaultSettings), applicationBaseSettings);
            this._mixinSettingsDefaults(settingsMixin);
            this.config = configMixin;
            this.settings = settingsMixin;
        }
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        ApplicationBase.prototype.queryGroupItems = function (groupId, itemParams, portal) {
            return __awaiter(this, void 0, void 0, function () {
                var defaultGroup, paramOptions, params, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!portal || !groupId) {
                                portal = this.portal;
                            }
                            defaultGroup = this.settings.group.default;
                            groupId = this._getDefaultId(groupId, defaultGroup);
                            paramOptions = __assign({ query: "group:\"" + groupId + "\" AND -type:\"Code Attachment\"", sortField: "modified", sortOrder: "desc", num: 9, start: 1 }, itemParams);
                            params = new PortalQueryParams_1.default(paramOptions);
                            return [4 /*yield*/, portal.queryItems(params)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        ApplicationBase.prototype.load = function () {
            var _this = this;
            var settings = this.settings;
            var environmentSettings = settings.environment, groupSettings = settings.group, portalSettings = settings.portal, webMapSettings = settings.webMap, websceneSettings = settings.webScene, urlParamsSettings = settings.urlParams;
            var isEsri = environmentSettings.isEsri;
            var urlParams = this._getUrlParamValues(urlParamsSettings);
            this.results.urlParams = urlParams;
            this.config = this._mixinAllConfigs({
                config: this.config,
                url: urlParams
            });
            if (isEsri) {
                var esriPortalUrl = this._getEsriEnvironmentPortalUrl();
                this.config.portalUrl = esriPortalUrl;
                this.config.proxyUrl = this._getEsriEnvironmentProxyUrl(esriPortalUrl);
            }
            var _a = this.config, portalUrl = _a.portalUrl, proxyUrl = _a.proxyUrl, oauthappid = _a.oauthappid, appid = _a.appid;
            this._setPortalUrl(portalUrl);
            this._setProxyUrl(proxyUrl);
            this._registerOauthInfos(oauthappid, portalUrl);
            var sharingUrl = portalUrl + "/sharing";
            var loadApplicationItem = appid ? this._loadItem(appid) : promiseUtils_1.resolve();
            var checkAppAccess = IdentityManager_1.default.checkAppAccess(sharingUrl, oauthappid)
                .catch(function (response) { return response; })
                .then(function (response) {
                return response;
            });
            var fetchApplicationData = appid
                ? loadApplicationItem.then(function (itemInfo) {
                    return itemInfo instanceof PortalItem_1.default
                        ? itemInfo.fetchData()
                        : undefined;
                })
                : promiseUtils_1.resolve();
            var loadPortal = portalSettings.fetch ? new Portal_1.default().load() : promiseUtils_1.resolve();
            return promiseUtils_1.eachAlways([
                loadApplicationItem,
                fetchApplicationData,
                loadPortal,
                checkAppAccess
            ])
                .catch(function (applicationArgs) { return applicationArgs; })
                .then(function (applicationArgs) {
                var _a;
                var applicationItemResponse = applicationArgs[0], applicationDataResponse = applicationArgs[1], portalResponse = applicationArgs[2], checkAppAccessResponse = applicationArgs[3];
                var applicationItem = applicationItemResponse
                    ? applicationItemResponse.value
                    : null;
                var applicationData = applicationDataResponse
                    ? applicationDataResponse.value
                    : null;
                var appAccess = checkAppAccessResponse
                    ? checkAppAccessResponse.value
                    : null;
                if (applicationItem &&
                    applicationItem.access &&
                    applicationItem.access !== "public") {
                    // do we have permission to access app
                    if (appAccess &&
                        appAccess.name &&
                        appAccess.name === "identity-manager:not-authorized") {
                        //identity-manager:not-authorized, identity-manager:not-authenticated, identity-manager:invalid-request
                        return promiseUtils_1.reject(appAccess.name);
                    }
                }
                else if (applicationItemResponse.error) {
                    return promiseUtils_1.reject(applicationItemResponse.error);
                }
                _this.results.applicationItem = applicationItemResponse;
                _this.results.applicationData = applicationDataResponse;
                var applicationConfig = applicationData
                    ? applicationData.values
                    : null;
                var portal = portalResponse ? portalResponse.value : null;
                _this.portal = portal;
                // Detect IE 11 and older 
                _this.isIE = _this._detectIE();
                // Update the culture if there is a url param 
                _this.locale = ((_a = _this.config) === null || _a === void 0 ? void 0 : _a.locale) || intl_1.getLocale();
                intl_1.setLocale(_this.locale);
                _this.direction = intl_1.prefersRTL(_this.locale) ? "rtl" : "ltr";
                _this.units = _this._getUnits(portal);
                _this.config = _this._mixinAllConfigs({
                    config: _this.config,
                    url: urlParams,
                    application: applicationConfig
                });
                _this._setGeometryService(_this.config, portal);
                var _b = _this.config, webmap = _b.webmap, webscene = _b.webscene, group = _b.group, draft = _b.draft;
                var webMapPromises = [];
                var webScenePromises = [];
                var groupInfoPromises = [];
                var groupItemsPromises = [];
                var isWebMapEnabled = webMapSettings.fetch && webmap;
                var isWebSceneEnabled = websceneSettings.fetch && webscene;
                var isGroupInfoEnabled = groupSettings.fetchInfo && group;
                var isGroupItemsEnabled = groupSettings.fetchItems && group;
                var itemParams = groupSettings.itemParams;
                var defaultWebMap = webMapSettings.default;
                var defaultWebScene = websceneSettings.default;
                var defaultGroup = groupSettings.default;
                var fetchMultipleWebmaps = webMapSettings.fetchMultiple;
                var fetchMultipleWebscenes = websceneSettings.fetchMultiple;
                var fetchMultipleGroups = groupSettings.fetchMultiple;
                if (isWebMapEnabled) {
                    var maps = (draft === null || draft === void 0 ? void 0 : draft.webmap) ? [draft.webmap, webmap] : webmap;
                    var webMaps = _this._getPropertyArray(maps);
                    var allowedWebmaps = _this._limitItemSize(webMaps, fetchMultipleWebmaps);
                    allowedWebmaps.forEach(function (id) {
                        var webMapId = _this._getDefaultId(id, defaultWebMap);
                        webMapPromises.push(_this._loadItem(webMapId));
                    });
                }
                if (isWebSceneEnabled) {
                    var webScenes = _this._getPropertyArray(webscene);
                    var allowedWebsenes = _this._limitItemSize(webScenes, fetchMultipleWebscenes);
                    allowedWebsenes.forEach(function (id) {
                        var webSceneId = _this._getDefaultId(id, defaultWebScene);
                        webScenePromises.push(_this._loadItem(webSceneId));
                    });
                }
                if (isGroupInfoEnabled) {
                    var groups = _this._getPropertyArray(group);
                    var allowedGroups = _this._limitItemSize(groups, fetchMultipleGroups);
                    allowedGroups.forEach(function (id) {
                        var groupId = _this._getDefaultId(id, defaultGroup);
                        groupInfoPromises.push(_this._queryGroupInfo(groupId, portal));
                    });
                }
                if (isGroupItemsEnabled) {
                    var groups = _this._getPropertyArray(group);
                    groups.forEach(function (id) {
                        groupItemsPromises.push(_this.queryGroupItems(id, itemParams, portal));
                    });
                }
                var promises = {
                    webMap: webMapPromises ? promiseUtils_1.eachAlways(webMapPromises) : promiseUtils_1.resolve(),
                    webScene: webScenePromises ? promiseUtils_1.eachAlways(webScenePromises) : promiseUtils_1.resolve(),
                    groupInfo: groupInfoPromises
                        ? promiseUtils_1.eachAlways(groupInfoPromises)
                        : promiseUtils_1.resolve(),
                    groupItems: groupItemsPromises
                        ? promiseUtils_1.eachAlways(groupItemsPromises)
                        : promiseUtils_1.resolve()
                };
                return promiseUtils_1.eachAlways(promises)
                    .catch(function (itemArgs) { return itemArgs; })
                    .then(function (itemArgs) {
                    var webMapResponses = itemArgs.webMap.value;
                    var webSceneResponses = itemArgs.webScene.value;
                    var groupInfoResponses = itemArgs.groupInfo.value;
                    var groupItemsResponses = itemArgs.groupItems.value;
                    var itemInfo = applicationItem ? applicationItem.itemInfo : null;
                    _this._overwriteItemsExtent(webMapResponses, itemInfo);
                    _this._overwriteItemsExtent(webSceneResponses, itemInfo);
                    _this.results.webMapItems = webMapResponses;
                    _this.results.webSceneItems = webSceneResponses;
                    _this.results.groupInfos = groupInfoResponses;
                    _this.results.groupItems = groupItemsResponses;
                    return _this;
                });
            });
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        ApplicationBase.prototype._mixinSettingsDefaults = function (settings) {
            var userEnvironmentSettings = settings.environment;
            var userGroupSettings = settings.group;
            var userPortalSettings = settings.portal;
            var userWebmapSettings = settings.webMap;
            var userWebsceneSettings = settings.webScene;
            settings.environment = __assign({ isEsri: false, webTierSecurity: false }, userEnvironmentSettings);
            var itemParams = {
                sortField: "modified",
                sortOrder: "desc",
                num: 9,
                start: 0
            };
            settings.group = __assign({ default: "908dd46e749d4565a17d2b646ace7b1a", fetchInfo: true, fetchItems: true, fetchMultiple: true, itemParams: itemParams }, userGroupSettings);
            settings.portal = __assign({ fetch: true }, userPortalSettings);
            settings.webMap = __assign({ default: "1970c1995b8f44749f4b9b6e81b5ba45", fetch: true, fetchMultiple: true }, userWebmapSettings);
            settings.webScene = __assign({ default: "e8f078ba0c1546b6a6e0727f877742a5", fetch: true, fetchMultiple: true }, userWebsceneSettings);
        };
        ApplicationBase.prototype._limitItemSize = function (items, allowMultiple) {
            var firstItem = items[0];
            return allowMultiple ? items : firstItem ? [firstItem] : [];
        };
        ApplicationBase.prototype._getPropertyArray = function (property) {
            if (typeof property === "string") {
                return property.split(",");
            }
            if (Array.isArray(property)) {
                return property;
            }
            return [];
        };
        ApplicationBase.prototype._getEsriEnvironmentPortalUrl = function () {
            var pathname = location.pathname;
            var esriAppsPath = "/apps/";
            var esriHomePath = "/home/";
            var esriAppsPathIndex = pathname.indexOf(esriAppsPath);
            var esriHomePathIndex = pathname.indexOf(esriHomePath);
            var isEsriAppsPath = esriAppsPathIndex !== -1;
            var isEsriHomePath = esriHomePathIndex !== -1;
            var appLocationIndex = isEsriAppsPath
                ? esriAppsPathIndex
                : isEsriHomePath
                    ? esriHomePathIndex
                    : undefined;
            if (appLocationIndex === undefined) {
                return;
            }
            var portalInstance = pathname.substr(0, appLocationIndex);
            var host = location.host;
            return "https://" + host + portalInstance;
        };
        ApplicationBase.prototype._getEsriEnvironmentProxyUrl = function (portalUrl) {
            if (!portalUrl) {
                return;
            }
            return portalUrl + "/sharing/proxy";
        };
        ApplicationBase.prototype._getUnits = function (portal) {
            var USRegion = "US";
            var USLocale = "en-us";
            var user = portal.user;
            var userRegion = user && user.region;
            var userUnits = user && user.units;
            var responseUnits = portal.units;
            var responseRegion = portal.region;
            var ipCountryCode = portal.ipCntryCode;
            var isEnglishUnits = userRegion === USRegion ||
                (userRegion && responseRegion === USRegion) ||
                (userRegion && !responseRegion) ||
                (!user && ipCountryCode === USRegion) ||
                (!user && !ipCountryCode && this.locale === USLocale);
            var units = userUnits
                ? userUnits
                : responseUnits
                    ? responseUnits
                    : isEnglishUnits
                        ? "english"
                        : "metric";
            return units;
        };
        ApplicationBase.prototype._detectIE = function () {
            return /*@cc_on!@*/ false || !!document['documentMode'];
        };
        ApplicationBase.prototype._queryGroupInfo = function (groupId, portal) {
            return __awaiter(this, void 0, void 0, function () {
                var params;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params = new PortalQueryParams_1.default({
                                query: "id:\"" + groupId + "\""
                            });
                            return [4 /*yield*/, portal.queryGroups(params)];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                });
            });
        };
        ApplicationBase.prototype._loadItem = function (id) {
            var item = new PortalItem_1.default({
                id: id
            });
            return item.load();
        };
        ApplicationBase.prototype._overwriteItemsExtent = function (responses, applicationItem) {
            var _this = this;
            if (!responses) {
                return;
            }
            responses.forEach(function (response) {
                var value = response.value;
                if (value) {
                    _this._overwriteItemExtent(value, applicationItem);
                }
            });
        };
        ApplicationBase.prototype._overwriteItemExtent = function (item, applicationItem) {
            if (!item || !applicationItem) {
                return;
            }
            var applicationExtent = applicationItem.extent;
            item.extent = applicationExtent ? applicationExtent : item.extent;
        };
        ApplicationBase.prototype._getDefaultId = function (id, defaultId) {
            var defaultUrlParam = "default";
            var trimmedId = id ? id.trim() : "";
            var useDefaultId = (!trimmedId || trimmedId === defaultUrlParam) && defaultId;
            return useDefaultId ? defaultId : id;
        };
        ApplicationBase.prototype._mixinAllConfigs = function (params) {
            var config = params.config || null;
            var appConfig = params.application || null;
            var localConfig = params.local || null;
            var urlConfig = params.url || null;
            return __assign(__assign(__assign(__assign({}, config), appConfig), localConfig), urlConfig);
        };
        ApplicationBase.prototype._setGeometryService = function (config, portal) {
            var configHelperServices = config.helperServices;
            var anyPortal = portal;
            var portalHelperServices = anyPortal && anyPortal.helperServices;
            var configGeometryUrl = configHelperServices &&
                configHelperServices.geometry &&
                configHelperServices.geometry.url;
            var portalGeometryUrl = portalHelperServices &&
                portalHelperServices.geometry &&
                portalHelperServices.geometry.url;
            var geometryServiceUrl = portalGeometryUrl || configGeometryUrl;
            if (!geometryServiceUrl) {
                return;
            }
            config_1.default.geometryServiceUrl = geometryServiceUrl;
        };
        ApplicationBase.prototype._setPortalUrl = function (portalUrl) {
            if (!portalUrl) {
                return;
            }
            config_1.default.portalUrl = portalUrl;
        };
        ApplicationBase.prototype._setProxyUrl = function (proxyUrl) {
            if (!proxyUrl) {
                return;
            }
            config_1.default.request.proxyUrl = proxyUrl;
        };
        ApplicationBase.prototype._registerOauthInfos = function (appId, portalUrl) {
            if (!appId) {
                return;
            }
            var info = new OAuthInfo_1.default({
                appId: appId,
                portalUrl: portalUrl,
                popup: true
            });
            if (!info) {
                return;
            }
            IdentityManager_1.default.registerOAuthInfos([info]);
        };
        ApplicationBase.prototype._getUrlParamValues = function (urlParams) {
            var _this = this;
            var urlObject = this._urlToObject();
            var formattedUrlObject = {};
            if (!urlObject || !urlParams || !urlParams.length) {
                return;
            }
            urlParams.forEach(function (param) {
                var urlParamValue = urlObject[param];
                if (urlParamValue) {
                    formattedUrlObject[param] = _this._formatUrlParamValue(urlParamValue);
                }
            });
            return formattedUrlObject;
        };
        ApplicationBase.prototype._urlToObject = function () {
            var _this = this;
            var query = (window.location.search || "?").substr(1), map = {};
            var urlRE = /([^&=]+)=?([^&]*)(?:&+|$)/g;
            query.replace(urlRE, function (match, key, value) {
                map[key] = _this._stripStringTags(decodeURIComponent(value));
                return "";
            });
            return map;
        };
        ApplicationBase.prototype._formatUrlParamValue = function (urlParamValue) {
            if (typeof urlParamValue !== "string") {
                return urlParamValue;
            }
            var lowerCaseValue = urlParamValue.toLowerCase();
            if (lowerCaseValue === "true") {
                return true;
            }
            if (lowerCaseValue === "false") {
                return false;
            }
            return urlParamValue;
        };
        ApplicationBase.prototype._stripStringTags = function (value) {
            var tagsRE = /<\/?[^>]+>/g;
            return value.replace(tagsRE, "");
        };
        return ApplicationBase;
    }());
    return ApplicationBase;
});
//# sourceMappingURL=ApplicationBase.js.map