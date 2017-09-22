/// <reference types="arcgis-js-api" />
import WebMap = require("esri/WebMap");
import WebScene = require("esri/WebScene");
import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");
import PortalItem = require("esri/portal/PortalItem");
import { CreateMapFromItemOptions, ApplicationConfig } from "../interfaces";
export declare function getConfigViewProperties(config: ApplicationConfig): any;
export declare function createView(properties: any): IPromise<MapView | SceneView>;
export declare function createMapFromItem(options: CreateMapFromItemOptions): IPromise<WebMap | WebScene>;
export declare function createWebMapFromItem(options: CreateMapFromItemOptions): IPromise<WebMap>;
export declare function createWebSceneFromItem(options: CreateMapFromItemOptions): IPromise<WebScene>;
export declare function getItemTitle(item: PortalItem): string;
export declare function goToMarker(marker: string, view: MapView | SceneView): IPromise<any>;
export declare function findQuery(query: string, view: MapView | SceneView): IPromise<any>;
