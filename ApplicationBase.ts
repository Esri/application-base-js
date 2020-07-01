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

import {
  ApplicationBaseConstructorOptions,
  ApplicationBaseItemPromises,
  ApplicationBaseResult,
  ApplicationBaseResults,
  ApplicationBaseSettings,
  ApplicationConfig,
  ApplicationConfigs,
  Direction
} from "./interfaces";
import { eachAlways, reject, resolve } from "esri/core/promiseUtils";

import IdentityManager from "esri/identity/IdentityManager";
import OAuthInfo from "esri/identity/OAuthInfo";
import Portal from "esri/portal/Portal";
import PortalItem from "esri/portal/PortalItem";
import PortalQueryParams from "esri/portal/PortalQueryParams";
import esriConfig from "esri/config";
import { getLocale, setLocale, prefersRTL } from "esri/intl";

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
  portal: {},
  urlParams: [],
  webMap: {},
  webScene: {}
};

class ApplicationBase {
  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(options: ApplicationBaseConstructorOptions) {
    const { config, settings } = options;

    const applicationConfig =
      typeof config === "string"
        ? (JSON.parse(config) as ApplicationConfig)
        : config;

    const applicationBaseSettings =
      typeof settings === "string"
        ? (JSON.parse(settings) as ApplicationBaseSettings)
        : settings;

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
  locale: string = getLocale();

  //----------------------------------
  //  Detect IE
  //----------------------------------
  isIE: boolean;

  //----------------------------------
  //  units
  //----------------------------------
  units: string = null;


  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  async queryGroupItems(
    groupId: string,
    itemParams: PortalQueryParams,
    portal?: Portal
  ): Promise<__esri.PortalQueryResult> {
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
    const result = await portal.queryItems(params);
    return result as __esri.PortalQueryResult;
  }

  load(): Promise<ApplicationBase> {
    const { settings } = this;
    const {
      environment: environmentSettings,
      group: groupSettings,
      portal: portalSettings,
      webMap: webMapSettings,
      webScene: websceneSettings,
      urlParams: urlParamsSettings
    } = settings;


    const { isEsri } = environmentSettings;
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

    this._registerOauthInfos(oauthappid, portalUrl);
    const sharingUrl = `${portalUrl}/sharing`;

    const loadApplicationItem = appid ? this._loadItem(appid) : resolve();
    const checkAppAccess = IdentityManager.checkAppAccess(
      sharingUrl,
      oauthappid
    )
      .catch(response => response)
      .then(response => {
        return response;
      });

    const fetchApplicationData = appid
      ? loadApplicationItem.then(itemInfo => {
        return itemInfo instanceof PortalItem
          ? itemInfo.fetchData()
          : undefined;
      })
      : resolve();
    const loadPortal = portalSettings.fetch ? new Portal().load() : resolve();

    return eachAlways([
      loadApplicationItem,
      fetchApplicationData,
      loadPortal,
      checkAppAccess
    ])
      .catch(applicationArgs => applicationArgs)
      .then(applicationArgs => {
        const [
          applicationItemResponse,
          applicationDataResponse,
          portalResponse,
          checkAppAccessResponse
        ] = applicationArgs;
        const applicationItem = applicationItemResponse
          ? applicationItemResponse.value
          : null;

        const applicationData = applicationDataResponse
          ? applicationDataResponse.value
          : null;

        const appAccess = checkAppAccessResponse
          ? checkAppAccessResponse.value
          : null;
        if (
          applicationItem &&
          applicationItem.access &&
          applicationItem.access !== "public"
        ) {
          // do we have permission to access app
          if (
            appAccess &&
            appAccess.name &&
            appAccess.name === "identity-manager:not-authorized"
          ) {
            //identity-manager:not-authorized, identity-manager:not-authenticated, identity-manager:invalid-request
            return reject(appAccess.name);
          }
        } else if (applicationItemResponse.error) {
          return reject(applicationItemResponse.error);
        }

        this.results.applicationItem = applicationItemResponse;
        this.results.applicationData = applicationDataResponse;

        const applicationConfig = applicationData
          ? applicationData.values
          : null;

        const portal = portalResponse ? portalResponse.value : null;
        this.portal = portal;

        // Detect IE 11 and older 
        this.isIE = this._detectIE();
        // Update the culture if there is a url param 
        this.locale = this.config?.locale || getLocale();
        setLocale(this.locale);
        this.direction = prefersRTL(this.locale) ? "rtl" : "ltr";

        this.units = this._getUnits(portal);

        this.config = this._mixinAllConfigs({
          config: this.config,
          url: urlParams,
          application: applicationConfig
        });

        this._setGeometryService(this.config, portal);

        const { webmap, webscene, group, draft } = this.config;

        const webMapPromises = [];
        const webScenePromises = [];
        const groupInfoPromises = [];
        const groupItemsPromises = [];

        const isWebMapEnabled = webMapSettings.fetch && webmap;
        const isWebSceneEnabled = websceneSettings.fetch && webscene;
        const isGroupInfoEnabled = groupSettings.fetchInfo && group;
        const isGroupItemsEnabled = groupSettings.fetchItems && group;
        const itemParams = groupSettings.itemParams;
        const defaultWebMap = webMapSettings.default;
        const defaultWebScene = websceneSettings.default;
        const defaultGroup = groupSettings.default;
        const fetchMultipleWebmaps = webMapSettings.fetchMultiple;
        const fetchMultipleWebscenes = websceneSettings.fetchMultiple;
        const fetchMultipleGroups = groupSettings.fetchMultiple;

        if (isWebMapEnabled) {
          const maps = draft?.webmap ? [draft.webmap, webmap] : webmap;
          const webMaps = this._getPropertyArray(maps);

          const allowedWebmaps = this._limitItemSize(
            webMaps,
            fetchMultipleWebmaps
          );
          allowedWebmaps.forEach(id => {
            const webMapId = this._getDefaultId(id, defaultWebMap);
            webMapPromises.push(this._loadItem(webMapId));
          });
        }

        if (isWebSceneEnabled) {
          const webScenes = this._getPropertyArray(webscene);
          const allowedWebsenes = this._limitItemSize(
            webScenes,
            fetchMultipleWebscenes
          );
          allowedWebsenes.forEach(id => {
            const webSceneId = this._getDefaultId(id, defaultWebScene);
            webScenePromises.push(this._loadItem(webSceneId));
          });
        }

        if (isGroupInfoEnabled) {
          const groups = this._getPropertyArray(group);
          const allowedGroups = this._limitItemSize(
            groups,
            fetchMultipleGroups
          );
          allowedGroups.forEach(id => {
            const groupId = this._getDefaultId(id, defaultGroup);
            groupInfoPromises.push(this._queryGroupInfo(groupId, portal));
          });
        }

        if (isGroupItemsEnabled) {
          const groups = this._getPropertyArray(group);
          groups.forEach(id => {
            groupItemsPromises.push(
              this.queryGroupItems(id, itemParams, portal)
            );
          });
        }

        const promises: ApplicationBaseItemPromises = {
          webMap: webMapPromises ? eachAlways(webMapPromises) : resolve(),
          webScene: webScenePromises ? eachAlways(webScenePromises) : resolve(),
          groupInfo: groupInfoPromises
            ? eachAlways(groupInfoPromises)
            : resolve(),
          groupItems: groupItemsPromises
            ? eachAlways(groupItemsPromises)
            : resolve()
        };

        return eachAlways(promises)
          .catch(itemArgs => itemArgs)
          .then(itemArgs => {
            const webMapResponses = itemArgs.webMap.value;
            const webSceneResponses = itemArgs.webScene.value;
            const groupInfoResponses = itemArgs.groupInfo.value;
            const groupItemsResponses = itemArgs.groupItems.value;

            const itemInfo = applicationItem ? applicationItem.itemInfo : null;
            this._overwriteItemsExtent(webMapResponses, itemInfo);
            this._overwriteItemsExtent(webSceneResponses, itemInfo);

            this.results.webMapItems = webMapResponses;
            this.results.webSceneItems = webSceneResponses;
            this.results.groupInfos = groupInfoResponses;
            this.results.groupItems = groupItemsResponses;

            return this;
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
    const userGroupSettings = settings.group;
    const userPortalSettings = settings.portal;
    const userWebmapSettings = settings.webMap;
    const userWebsceneSettings = settings.webScene;

    settings.environment = {
      isEsri: false,
      webTierSecurity: false,
      ...userEnvironmentSettings
    };

    const itemParams = {
      sortField: "modified",
      sortOrder: "desc",
      num: 9,
      start: 0
    } as PortalQueryParams;

    settings.group = {
      default: "908dd46e749d4565a17d2b646ace7b1a",
      fetchInfo: true,
      fetchItems: true,
      fetchMultiple: true,
      itemParams: itemParams,
      ...userGroupSettings
    };

    settings.portal = {
      fetch: true,
      ...userPortalSettings
    };

    settings.webMap = {
      default: "1970c1995b8f44749f4b9b6e81b5ba45",
      fetch: true,
      fetchMultiple: true,
      ...userWebmapSettings
    };

    settings.webScene = {
      default: "e8f078ba0c1546b6a6e0727f877742a5",
      fetch: true,
      fetchMultiple: true,
      ...userWebsceneSettings
    };
  }

  private _limitItemSize(items: string[], allowMultiple: boolean): string[] {
    const firstItem = items[0];
    return allowMultiple ? items : firstItem ? [firstItem] : [];
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

  private _getEsriEnvironmentPortalUrl(): string {
    const pathname = location.pathname;
    const esriAppsPath = "/apps/";
    const esriHomePath = "/home/";
    const esriAppsPathIndex = pathname.indexOf(esriAppsPath);
    const esriHomePathIndex = pathname.indexOf(esriHomePath);
    const isEsriAppsPath = esriAppsPathIndex !== -1;
    const isEsriHomePath = esriHomePathIndex !== -1;
    const appLocationIndex = isEsriAppsPath
      ? esriAppsPathIndex
      : isEsriHomePath
        ? esriHomePathIndex
        : undefined;

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

  private _getUnits(portal: Portal): string {
    const USRegion = "US";
    const USLocale = "en-us";
    const user = portal.user;
    const userRegion = user && user.region;
    const userUnits = user && user.units;
    const responseUnits = portal.units;
    const responseRegion = portal.region;
    const ipCountryCode = portal.ipCntryCode;
    const isEnglishUnits =
      userRegion === USRegion ||
      (userRegion && responseRegion === USRegion) ||
      (userRegion && !responseRegion) ||
      (!user && ipCountryCode === USRegion) ||
      (!user && !ipCountryCode && this.locale === USLocale);
    const units = userUnits
      ? userUnits
      : responseUnits
        ? responseUnits
        : isEnglishUnits
          ? "english"
          : "metric";
    return units;
  }

  private _detectIE() {
    return /*@cc_on!@*/false || !!document['documentMode'];

  }

  private async _queryGroupInfo(
    groupId: string,
    portal: Portal
  ): Promise<__esri.PortalQueryResult> {
    const params = new PortalQueryParams({
      query: `id:"${groupId}"`
    });
    return (await portal.queryGroups(params)) as __esri.PortalQueryResult;
  }

  private _loadItem(id: string): IPromise<PortalItem> {
    const item = new PortalItem({
      id
    });
    return item.load();
  }

  private _overwriteItemsExtent(
    responses: ApplicationBaseResult[],
    applicationItem: PortalItem
  ): void {
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

  private _overwriteItemExtent(
    item: PortalItem,
    applicationItem: PortalItem
  ): void {
    if (!item || !applicationItem) {
      return;
    }

    const applicationExtent = applicationItem.extent;
    item.extent = applicationExtent ? applicationExtent : item.extent;
  }

  private _getDefaultId(id: string, defaultId: string): string {
    const defaultUrlParam = "default";
    const trimmedId = id ? id.trim() : "";
    const useDefaultId =
      (!trimmedId || trimmedId === defaultUrlParam) && defaultId;

    return useDefaultId ? defaultId : id;
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

  private _setGeometryService(config: ApplicationConfig, portal: Portal): void {
    const configHelperServices = config.helperServices;
    const anyPortal = portal as any;
    const portalHelperServices = anyPortal && anyPortal.helperServices;
    const configGeometryUrl =
      configHelperServices &&
      configHelperServices.geometry &&
      configHelperServices.geometry.url;
    const portalGeometryUrl =
      portalHelperServices &&
      portalHelperServices.geometry &&
      portalHelperServices.geometry.url;
    const geometryServiceUrl = portalGeometryUrl || configGeometryUrl;

    if (!geometryServiceUrl) {
      return;
    }

    esriConfig.geometryServiceUrl = geometryServiceUrl;
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

  private _registerOauthInfos(appId: string, portalUrl: string): void {
    if (!appId) {
      return;
    }

    const info = new OAuthInfo({
      appId,
      portalUrl,
      popup: true
    });

    if (!info) {
      return;
    }

    IdentityManager.registerOAuthInfos([info]);
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
        formattedUrlObject[param] = this._formatUrlParamValue(urlParamValue);
      }
    });

    return formattedUrlObject;
  }

  private _urlToObject(): Object {
    const query = (window.location.search || "?").substr(1),
      map = {};
    const urlRE = /([^&=]+)=?([^&]*)(?:&+|$)/g;
    query.replace(urlRE, (match, key, value) => {
      map[key] = this._stripStringTags(decodeURIComponent(value));
      return "";
    });
    return map;
  }

  private _formatUrlParamValue(urlParamValue: string): string | boolean {
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

export = ApplicationBase;