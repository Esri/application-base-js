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

import kernel = require("dojo/_base/kernel");

import esriConfig = require("esri/config");

import Extent = require("esri/geometry/Extent");

import promiseUtils = require("esri/core/promiseUtils");

import IdentityManager = require("esri/identity/IdentityManager");
import OAuthInfo = require("esri/identity/OAuthInfo");

import Portal = require("esri/portal/Portal");
import PortalItem = require("esri/portal/PortalItem");
import PortalQueryParams = require("esri/portal/PortalQueryParams");

import {
  ApplicationBaseConstructorOptions,
  ApplicationBaseResult,
  ApplicationBaseResults,
  ApplicationBaseSettings,
  ApplicationConfig,
  ApplicationConfigs
} from "./interfaces";

type Direction = "ltr" | "rtl";

interface ApplicationBaseItemPromises {
  webmap?: IPromise<any>;
  webscene?: IPromise<any>;
  groupInfo?: IPromise<any>;
  groupItems?: IPromise<any>;
}

const defaultConfig = {
  portalUrl: "https://www.arcgis.com",
  helperServices: {
    geometry: {},
    printTask: {},
    elevationSync: {},
    geocode: []
  }
};

const defaultSettings = {
  environment: {},
  group: {},
  localStorage: {},
  portal: {},
  rightToLeftLocales: ["ar", "he"],
  urlParams: [],
  webmap: {},
  webscene: {}
};

class ApplicationBase {

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(options: ApplicationBaseConstructorOptions) {
    const { config, settings } = options;

    const applicationConfig = typeof config === "string" ?
      JSON.parse(config) as ApplicationConfig :
      config;

    const applicationBaseSettings = typeof settings === "string" ?
      JSON.parse(settings) as ApplicationBaseSettings :
      settings;

    const configMixin = {
      ...defaultConfig,
      ...applicationConfig
    };

    const settingsMixin = {
      ...defaultSettings,
      ...applicationBaseSettings
    };

    this._mixinSettingsDefaults(settingsMixin);

    this.config = configMixin;
    this.settings = settingsMixin;
  }

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  settings
  //----------------------------------
  settings: ApplicationBaseSettings = defaultSettings;

  //----------------------------------
  //  config
  //----------------------------------
  config: ApplicationConfig = defaultConfig;

  //----------------------------------
  //  results
  //----------------------------------
  results: ApplicationBaseResults = {};

  //----------------------------------
  //  portal
  //----------------------------------
  portal: Portal = null;

  //----------------------------------
  //  direction
  //----------------------------------
  direction: Direction = null;

  //----------------------------------
  //  locale
  //----------------------------------
  locale = kernel.locale;

  //----------------------------------
  //  units
  //----------------------------------
  units: string = null;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  queryGroupItems(groupId: string, itemParams: any, portal?: Portal): IPromise<any> {
    if (!portal || !groupId) {
      portal = this.portal;
    }

    const defaultGroup = this.settings.group.default;
    groupId = this._getDefaultId(groupId, defaultGroup);

    const paramOptions = {
      query: `group:"${groupId}" AND -type:"Code Attachment"`,
      sortField: "modified",
      sortOrder: "desc",
      num: 9,
      start: 1,
      ...itemParams
    };

    const params = new PortalQueryParams(paramOptions);
    return portal.queryItems(params);
  }

  load(): IPromise<ApplicationBase> {
    const { settings } = this;
    const environmentSettings = settings.environment;
    const { isEsri, webTierSecurity } = environmentSettings;
    const localStorageSettings = settings.localStorage;
    const groupSettings = settings.group;
    const portalSettings = settings.portal;
    const webmapSettings = settings.webmap;
    const websceneSettings = settings.webscene;
    const urlParamsSettings = settings.urlParams;

    const urlParams = this._getUrlParamValues(urlParamsSettings);
    this.results.urlParams = urlParams;

    this.config = this._mixinAllConfigs({
      config: this.config,
      url: urlParams
    });

    if (isEsri) {
      const esriPortalUrl = this._getEsriEnvironmentPortalUrl();
      this.config.portalUrl = esriPortalUrl;
      this.config.proxyUrl = this._getEsriEnvironmentProxyUrl(esriPortalUrl);
    }

    const { portalUrl, proxyUrl, oauthappid, appid } = this.config;

    this._setPortalUrl(portalUrl);
    this._setProxyUrl(proxyUrl);

    const RTLLocales = this.settings.rightToLeftLocales;
    this.direction = this._getLanguageDirection(RTLLocales);

    const checkSignIn = this._checkSignIn(oauthappid, portalUrl);
    return checkSignIn.always(() => {
      const queryApplicationItem = appid ?
        this._queryItem(appid) : promiseUtils.resolve();

      const queryApplicationData = appid ?
        queryApplicationItem.then(itemInfo => {
          return itemInfo instanceof PortalItem ?
            itemInfo.fetchData() :
            undefined;
        }) :
        promiseUtils.resolve();

      const queryPortal = portalSettings.fetch ?
        this._queryPortal() :
        promiseUtils.resolve();

      return promiseUtils.eachAlways([
        queryApplicationItem,
        queryApplicationData,
        queryPortal
      ]).always(applicationArgs => {
        const [applicationItemResponse, applicationDataResponse, portalResponse] = applicationArgs;

        const applicationItem = applicationItemResponse ?
          applicationItemResponse.value :
          null;

        const applicationData = applicationDataResponse ?
          applicationDataResponse.value :
          null;

        const localStorage = localStorageSettings.fetch ?
          this._getLocalConfig(appid) :
          null;

        this.results.localStorage = localStorage;
        this.results.applicationItem = applicationItemResponse;
        this.results.applicationData = applicationDataResponse;

        const applicationConfig = applicationData ?
          applicationData.values :
          null;

        const portal = portalResponse ? portalResponse.value : null;
        this.portal = portal;

        this.units = this._getUnits(portal);

        this.config = this._mixinAllConfigs({
          config: this.config,
          url: urlParams,
          local: localStorage,
          application: applicationConfig
        });

        this._setupCORS(portal.authorizedCrossOriginDomains, webTierSecurity);
        this._setGeometryService(this.config, portal);

        const { webmap, webscene, group } = this.config;

        const webmapPromises = [];
        const webscenePromises = [];
        const groupInfoPromises = [];
        const groupItemsPromises = [];

        const isWebMapEnabled = webmapSettings.fetch && webmap;
        const isWebSceneEnabled = websceneSettings.fetch && webscene;
        const isGroupInfoEnabled = groupSettings.fetchInfo && group;
        const isGroupItemsEnabled = groupSettings.fetchItems && group;
        const itemParams = groupSettings.itemParams;
        const defaultWebMap = webmapSettings.default;
        const defaultWebScene = websceneSettings.default;
        const defaultGroup = groupSettings.default;
        const fetchMultipleWebmaps = webmapSettings.fetchMultiple;
        const fetchMultipleWebscenes = websceneSettings.fetchMultiple;
        const fetchMultipleGroups = groupSettings.fetchMultiple;

        if (isWebMapEnabled) {
          const webmaps = this._getPropertyArray(webmap);
          const allowedWebmaps = this._limitSize(webmaps, fetchMultipleWebmaps);
          allowedWebmaps.forEach(id => {
            const webMapId = this._getDefaultId(id, defaultWebMap);
            webmapPromises.push(this._queryItem(webMapId));
          });
        }

        if (isWebSceneEnabled) {
          const webscenes = this._getPropertyArray(webscene);
          const allowedWebsenes = this._limitSize(webscenes, fetchMultipleWebscenes);
          allowedWebsenes.forEach(id => {
            const webSceneId = this._getDefaultId(id, defaultWebScene);
            webscenePromises.push(this._queryItem(webSceneId));
          });
        }

        if (isGroupInfoEnabled) {
          const groups = this._getPropertyArray(group);
          const allowedGroups = this._limitSize(groups, fetchMultipleGroups);
          allowedGroups.forEach(id => {
            const groupId = this._getDefaultId(id, defaultGroup);
            groupInfoPromises.push(this._queryGroupInfo(groupId, portal));
          });
        }

        if (isGroupItemsEnabled) {
          const groups = this._getPropertyArray(group);
          groups.forEach(id => {
            groupItemsPromises.push(this.queryGroupItems(id, itemParams, portal));
          });
        }

        const promises: ApplicationBaseItemPromises = {
          webmap: webmapPromises.length ?
            promiseUtils.eachAlways(webmapPromises) :
            promiseUtils.resolve(),
          webscene: webscenePromises.length ?
            promiseUtils.eachAlways(webscenePromises) :
            promiseUtils.resolve(),
          groupInfo: groupInfoPromises.length ?
            promiseUtils.eachAlways(groupInfoPromises) :
            promiseUtils.resolve(),
          groupItems: groupItemsPromises.length ?
            promiseUtils.eachAlways(groupItemsPromises) :
            promiseUtils.resolve()
        };

        return promiseUtils.eachAlways(promises).always(itemArgs => {
          const webmapResponses = itemArgs.webmap.value || [];
          const websceneResponses = itemArgs.webscene.value || [];
          const groupInfoResponses = itemArgs.groupInfo.value || [];
          const groupItemsResponses = itemArgs.groupItems.value || [];

          const itemInfo = applicationItem ? applicationItem.itemInfo : null;
          this._overwriteItemsExtent(webmapResponses, itemInfo);
          this._overwriteItemsExtent(websceneResponses, itemInfo);

          this.results.webMapItems = webmapResponses;
          this.results.webSceneItems = websceneResponses;
          this.results.groupInfos = groupInfoResponses;
          this.results.groupItems = groupItemsResponses;

          return this;
        });
      });
    });
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private _mixinSettingsDefaults(settings: ApplicationBaseSettings): void {
    const userEnvironmentSettings = settings.environment;
    const userLocalStorageSettings = settings.localStorage;
    const userGroupSettings = settings.group;
    const userPortalSettings = settings.portal;
    const userWebmapSettings = settings.webmap;
    const userWebsceneSettings = settings.webscene;

    settings.environment = {
      isEsri: false,
      webTierSecurity: false,
      ...userEnvironmentSettings
    };

    settings.localStorage = {
      fetch: true,
      ...userLocalStorageSettings
    };

    settings.group = {
      default: "908dd46e749d4565a17d2b646ace7b1a",
      fetchInfo: true,
      fetchItems: true,
      fetchMultiple: true,
      itemParams: {
        "sortField": "modified",
        "sortOrder": "desc",
        "num": 9,
        "start": 0
      },
      ...userGroupSettings
    };

    settings.portal = {
      fetch: true,
      ...userPortalSettings
    };

    settings.webmap = {
      default: "1970c1995b8f44749f4b9b6e81b5ba45",
      fetch: true,
      fetchMultiple: true,
      ...userWebmapSettings
    };

    settings.webscene = {
      default: "e8f078ba0c1546b6a6e0727f877742a5",
      fetch: true,
      fetchMultiple: true,
      ...userWebsceneSettings
    };
  }

  private _limitSize(items: string[], allowMultiple: boolean): string[] {
    return allowMultiple || items.length < 2 ? items : [items[0]];
  }

  private _getPropertyArray(property: string | string[]): string[] {
    if (typeof property === "string") {
      return property.split(",");
    }

    if (Array.isArray(property)) {
      return property;
    }

    return [];
  }

  private _getUnits(portal: Portal): string {
    const USRegion = "US";
    const USLocale = "en-us";
    const user = portal.user;
    const userRegion = user && user.region;
    const userUnits = user && user.units;
    const responseUnits = portal.units;
    const responseRegion = portal.region;
    const ipCountryCode = portal.ipCntryCode;
    const isEnglishUnits = (userRegion === USRegion) ||
      (userRegion && responseRegion === USRegion) ||
      (userRegion && !responseRegion) ||
      (!user && ipCountryCode === USRegion) ||
      (!user && !ipCountryCode && kernel.locale === USLocale);
    const units = userUnits ? userUnits : responseUnits ? responseUnits : isEnglishUnits ? "english" : "metric";
    return units;
  }

  private _getLocalConfig(appid: string): ApplicationConfig {
    if (!window.localStorage || !appid) {
      return;
    }

    const lsItemId = `application_base_config_${appid}`;
    const lsItem = localStorage.getItem(lsItemId);
    const localConfig = lsItem && JSON.parse(lsItem);
    return localConfig;
  }

  private _queryItem(id: string): IPromise<PortalItem> {
    const item = new PortalItem({
      id: id
    });
    return item.load();
  }

  private _queryGroupInfo(groupId: string, portal: Portal): IPromise<any> {
    const params = new PortalQueryParams({
      query: `id:"${groupId}"`
    });
    return portal.queryGroups(params);
  }

  private _setupCORS(authorizedDomains: any, webTierSecurity: boolean): void {
    if (!webTierSecurity || !authorizedDomains || !authorizedDomains.length) {
      return;
    }

    authorizedDomains.forEach(authorizedDomain => {
      const isDefined = (authorizedDomain !== undefined) && (authorizedDomain !== null);
      if (isDefined && authorizedDomain.length) {
        esriConfig.request.corsEnabledServers.push({
          host: authorizedDomain,
          withCredentials: true
        });
      }
    });
  }

  private _queryPortal(): IPromise<Portal> {
    return new Portal().load();
  }

  private _overwriteItemsExtent(responses: ApplicationBaseResult[], applicationItem: PortalItem): void {
    if (!responses) {
      return;
    }

    responses.forEach(response => {
      const { value } = response;
      if (value) {
        this._overwriteItemExtent(value, applicationItem);
      }
    });
  }

  private _overwriteItemExtent(item: PortalItem, applicationItem: PortalItem): void {
    if (!item || !applicationItem) {
      return;
    }

    const applicationExtent = applicationItem.extent;
    item.extent = applicationExtent ? applicationExtent : item.extent;
  }

  private _setGeometryService(config: ApplicationConfig, ptl: Portal): void {
    const portal = ptl as any; // todo: fix next api release. helperServices are not on portal currently.
    const configHelperServices = config.helperServices;
    const portalHelperServices = portal && portal.helperServices;
    const configGeometryUrl = configHelperServices && configHelperServices.geometry && configHelperServices.geometry.url;
    const portalGeometryUrl = portalHelperServices && portalHelperServices.geometry && portalHelperServices.geometry.url;
    const geometryServiceUrl = portalGeometryUrl || configGeometryUrl;

    if (!geometryServiceUrl) {
      return;
    }

    esriConfig.geometryServiceUrl = geometryServiceUrl;
  }

  private _getDefaultId(id: string, defaultId: string): string {
    const defaultUrlParam = "default";
    const trimmedId = id ? id.trim() : "";
    const useDefaultId = (!trimmedId || trimmedId === defaultUrlParam) && defaultId;

    return useDefaultId ? defaultId : id;
  }

  private _getLanguageDirection(RTLLocales: string[] = ["ar", "he"]): Direction {
    const isRTL = RTLLocales.some(language => {
      return kernel.locale.indexOf(language) !== -1;
    });

    return isRTL ? "rtl" : "ltr";
  }

  private _mixinAllConfigs(params: ApplicationConfigs): ApplicationConfig {
    const config = params.config || null;
    const appConfig = params.application || null;
    const localConfig = params.local || null;
    const urlConfig = params.url || null;
    return {
      ...config,
      ...appConfig,
      ...localConfig,
      ...urlConfig
    };
  }

  private _setPortalUrl(portalUrl: string): void {
    if (!portalUrl) {
      return;
    }

    esriConfig.portalUrl = portalUrl;
  }

  private _setProxyUrl(proxyUrl: string): void {
    if (!proxyUrl) {
      return;
    }

    esriConfig.request.proxyUrl = proxyUrl;
  }

  private _getEsriEnvironmentPortalUrl(): string {
    const pathname = location.pathname;
    const esriAppsPath = "/apps/";
    const esriHomePath = "/home/";
    const esriAppsPathIndex = pathname.indexOf(esriAppsPath);
    const esriHomePathIndex = pathname.indexOf(esriHomePath);
    const isEsriAppsPath = esriAppsPathIndex !== -1 ? true : false;
    const isEsriHomePath = esriHomePathIndex !== -1 ? true : false;
    const appLocationIndex = isEsriAppsPath ?
      esriAppsPathIndex :
      isEsriHomePath ?
        esriHomePathIndex :
        undefined;

    if (appLocationIndex === undefined) {
      return;
    }

    const portalInstance = pathname.substr(0, appLocationIndex);
    const host = location.host;
    return `https://${host}${portalInstance}`;
  }

  private _getEsriEnvironmentProxyUrl(portalUrl: string): string {
    if (!portalUrl) {
      return;
    }

    return `${portalUrl}/sharing/proxy`;
  }

  private _checkSignIn(oauthappid: string, portalUrl: string): IPromise<void> {
    const info = oauthappid ?
      new OAuthInfo({
        appId: oauthappid,
        portalUrl: portalUrl,
        popup: true
      }) : null;

    if (info) {
      IdentityManager.registerOAuthInfos([info]);
    }

    const resUrl = `${portalUrl}/sharing`;
    const signedIn = IdentityManager.checkSignInStatus(resUrl);
    return signedIn.always(promiseUtils.resolve);
  }

  private _getUrlParamValues(urlParams: string[]): ApplicationConfig {
    const urlObject = this._urlToObject();
    const formattedUrlObject = {};

    if (!urlObject || !urlParams || !urlParams.length) {
      return;
    }

    urlParams.forEach(param => {
      const urlParamValue = urlObject[param];
      if (urlParamValue) {
        formattedUrlObject[param] = this._foramatUrlParamValue(urlParamValue);
      }
    });

    return formattedUrlObject;
  }

  private _urlToObject(): any {
    const query = (window.location.search || "?").substr(1),
      map = {};
    const urlRE = /([^&=]+)=?([^&]*)(?:&+|$)/g;
    query.replace(urlRE, (match, key, value) => {
      map[key] = this._stripStringTags(decodeURIComponent(value));
      return "";
    });
    return map;
  }

  private _foramatUrlParamValue(urlParamValue: any): any {
    if (typeof urlParamValue !== "string") {
      return urlParamValue;
    }

    const lowerCaseValue = urlParamValue.toLowerCase();

    if (lowerCaseValue === "true") {
      return true;
    }

    if (lowerCaseValue === "false") {
      return false;
    }

    return urlParamValue;
  }

  private _stripStringTags(value: string): string {
    const tagsRE = /<\/?[^>]+>/g;
    return value.replace(tagsRE, "");
  }

}

export default ApplicationBase;
