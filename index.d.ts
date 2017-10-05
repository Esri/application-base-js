declare module 'ApplicationBase/declareDecorator' {
	/**
	 * A decorator that converts a TypeScript class into a declare constructor.
	 * This allows declare constructors to be defined as classes, which nicely
	 * hides away the `declare([], {})` boilerplate.
	 */
	export default function (...mixins: Object[]): ClassDecorator;

}
declare module 'ApplicationBase/interfaces' {
	import Portal = require("esri/portal/Portal");
	import PortalItem = require("esri/portal/PortalItem");
	import PortalQueryResult = require("esri/portal/PortalQueryResult");
	import PortalQueryParams = require("esri/portal/PortalQueryParams");

	import WebMap = require("esri/WebMap");
	import WebScene = require("esri/WebScene");

	export type Direction = "ltr" | "rtl";

	export interface ApplicationBaseItemPromises {
	  webMap?: IPromise<any>;
	  webScene?: IPromise<any>;
	  groupInfo?: IPromise<any>;
	  groupItems?: IPromise<any>;
	}

	export interface ApplicationConfigs {
	  application?: ApplicationConfig;
	  config: ApplicationConfig;
	  local?: ApplicationConfig;
	  url?: ApplicationConfig;
	}

	export interface ApplicationConfig {
	  appid?: string;
	  center?: string;
	  components?: string;
	  embed?: boolean;
	  extent?: string;
	  find?: string;
	  group?: string | string[];
	  helperServices?: any;
	  level?: string;
	  marker?: string;
	  oauthappid?: string;
	  portalUrl?: string;
	  proxyUrl?: string;
	  title?: string;
	  viewpoint?: string;
	  webmap?: string | string[];
	  webscene?: string | string[];
	  [propName: string]: any;
	}

	export interface ApplicationBaseSettings {
	  environment: {
	    isEsri?: boolean;
	    webTierSecurity?: boolean;
	  };
	  localStorage?: {
	    fetch?: boolean;
	  };
	  group?: {
	    default?: string;
	    itemParams?: PortalQueryParams;
	    fetchItems?: boolean;
	    fetchInfo?: boolean;
	    fetchMultiple?: boolean;
	  };
	  portal?: {
	    fetch?: boolean;
	  };
	  rightToLeftLocales?: string[];
	  urlParams?: string[];
	  webMap?: {
	    default?: string;
	    fetch?: boolean;
	    fetchMultiple?: boolean;
	  };
	  webScene?: {
	    default?: string;
	    fetch?: boolean;
	    fetchMultiple?: boolean;
	  }
	}

	export interface ApplicationBaseResult {
	  error?: Error;
	  value: any;
	  promise: IPromise<any>;
	}

	export interface ApplicationBasePortalItemResult extends ApplicationBaseResult {
	  value: PortalItem;
	  promise: IPromise<PortalItem>;
	}

	export interface ApplicationBasePortalQueryResult extends ApplicationBaseResult {
	  value: PortalQueryResult;
	  promise: IPromise<PortalQueryResult>;
	}

	export interface ApplicationBaseResults {
	  applicationItem?: ApplicationBasePortalItemResult;
	  applicationData?: ApplicationBaseResult;
	  groupInfos?: ApplicationBasePortalQueryResult;
	  groupItems?: ApplicationBasePortalQueryResult;
	  localStorage?: ApplicationConfig;
	  portal?: Portal;
	  urlParams?: ApplicationConfig;
	  webMapItems?: ApplicationBasePortalItemResult[];
	  webSceneItems?: ApplicationBasePortalItemResult[];
	}

	export interface ApplicationProxy {
	  sourceUrl: string,
	  proxyUrl: string,
	  proxyId: string
	}

	export interface ApplicationBaseConstructorOptions {
	  config: ApplicationConfig | string;
	  settings: ApplicationBaseSettings | string;
	}

	export interface CreateMapFromItemOptions {
	  item: PortalItem;
	  appProxies?: ApplicationProxy[];
	}


}
declare module 'ApplicationBase/ApplicationBase' {
	/// <reference types="arcgis-js-api" />
	import Portal = require("esri/portal/Portal");
	import PortalQueryParams = require("esri/portal/PortalQueryParams");
	import { Direction, ApplicationBaseConstructorOptions, ApplicationBaseResults, ApplicationBaseSettings, ApplicationConfig } from 'ApplicationBase/interfaces'; class ApplicationBase {
	    constructor(options: ApplicationBaseConstructorOptions);
	    settings: ApplicationBaseSettings;
	    config: ApplicationConfig;
	    results: ApplicationBaseResults;
	    portal: Portal;
	    direction: Direction;
	    locale: string;
	    units: string;
	    queryGroupItems(groupId: string, itemParams: PortalQueryParams, portal?: Portal): IPromise<any>;
	    load(): IPromise<ApplicationBase>;
	    private _mixinSettingsDefaults(settings);
	    private _limitItemSize(items, allowMultiple);
	    private _getPropertyArray(property);
	    private _getEsriEnvironmentPortalUrl();
	    private _getEsriEnvironmentProxyUrl(portalUrl);
	    private _getUnits(portal);
	    private _queryGroupInfo(groupId, portal);
	    private _loadItem(id);
	    private _getLocalConfig(appid);
	    private _overwriteItemsExtent(responses, applicationItem);
	    private _overwriteItemExtent(item, applicationItem);
	    private _getDefaultId(id, defaultId);
	    private _getLanguageDirection(rtlLocales?);
	    private _mixinAllConfigs(params);
	    private _setUpCORS(authorizedDomains, webTierSecurity);
	    private _setGeometryService(config, portal);
	    private _setPortalUrl(portalUrl);
	    private _setProxyUrl(proxyUrl);
	    private _registerOauthInfos(oauthappid, portalUrl);
	    private _getUrlParamValues(urlParams);
	    private _urlToObject();
	    private _formatUrlParamValue(urlParamValue);
	    private _stripStringTags(value);
	}
	export = ApplicationBase;

}
declare module 'ApplicationBase/support/domHelper' {
	export function setPageLocale(locale: string): void;
	export function setPageDirection(direction: string): void;
	export function setPageTitle(title: string): void;

}
declare module 'ApplicationBase/support/urlUtils' {
	/// <reference types="arcgis-js-api" />
	import Camera = require("esri/Camera");
	import Graphic = require("esri/Graphic");
	import Extent = require("esri/geometry/Extent");
	import Point = require("esri/geometry/Point");
	export function parseViewComponents(components: string): string[];
	export function parseViewpoint(viewpoint: string): Camera;
	export function parseCenter(center: string): Point;
	export function parseLevel(level: string): number;
	export function parseExtent(extent: string): Extent;
	export function parseMarker(marker: string): IPromise<Graphic>;

}
declare module 'ApplicationBase/support/itemUtils' {
	/// <reference types="arcgis-js-api" />
	import WebMap = require("esri/WebMap");
	import WebScene = require("esri/WebScene");
	import MapView = require("esri/views/MapView");
	import SceneView = require("esri/views/SceneView");
	import PortalItem = require("esri/portal/PortalItem");
	import { CreateMapFromItemOptions, ApplicationConfig } from 'ApplicationBase/interfaces';
	export function getConfigViewProperties(config: ApplicationConfig): any;
	export function createView(properties: any): IPromise<MapView | SceneView>;
	export function createMapFromItem(options: CreateMapFromItemOptions): IPromise<WebMap | WebScene>;
	export function createWebMapFromItem(options: CreateMapFromItemOptions): IPromise<WebMap>;
	export function createWebSceneFromItem(options: CreateMapFromItemOptions): IPromise<WebScene>;
	export function getItemTitle(item: PortalItem): string;
	export function goToMarker(marker: string, view: MapView | SceneView): IPromise<any>;
	export function findQuery(query: string, view: MapView | SceneView): IPromise<any>;

}
