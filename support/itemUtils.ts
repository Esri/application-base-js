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

import requireUtils = require("esri/core/requireUtils");
import promiseUtils = require("esri/core/promiseUtils");
import watchUtils = require("esri/core/watchUtils");

import WebMap = require("esri/WebMap");
import WebScene = require("esri/WebScene");

import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");

import PortalItem = require("esri/portal/PortalItem");

import {
  CreateMapFromItemOptions,
  ApplicationConfig,
  ApplicationProxy
} from "../interfaces";

import {
  parseViewpoint,
  parseViewComponents,
  parseExtent,
  parseMarker,
  parseCenter,
  parseLevel
} from "./urlUtils";

//--------------------------------------------------------------------------
//
//  Public Methods
//
//--------------------------------------------------------------------------

export function getConfigViewProperties(config: ApplicationConfig): any {
  const { center, components, extent, level, viewpoint } = config;
  const ui = components ? { ui: { components: parseViewComponents(components) } } : null;
  const cameraProps = viewpoint ? { camera: parseViewpoint(viewpoint) } : null;
  const centerProps = center ? { center: parseCenter(center) } : null;
  const zoomProps = level ? { zoom: parseLevel(level) } : null;
  const extentProps = extent ? { extent: parseExtent(extent) } : null;

  return {
    ...ui,
    ...cameraProps,
    ...centerProps,
    ...zoomProps,
    ...extentProps
  };
}

export function createView(properties: any): IPromise<MapView | SceneView> {
  const { map } = properties;

  if (!map) {
    return promiseUtils.reject(`properties does not contain a "map"`);
  }

  const isWebMap = map.declaredClass === "esri.WebMap";
  const isWebScene = map.declaredClass === "esri.WebScene";

  if (!isWebMap && !isWebScene) {
    return promiseUtils.reject(`map is not a "WebMap" or "WebScene"`);
  }

  const viewTypePath = isWebMap ? "esri/views/MapView" : "esri/views/SceneView";

  return requireUtils.when(require, viewTypePath).then(ViewType => {
    return new ViewType(properties);
  });
}

export function createMapFromItem(options: CreateMapFromItemOptions): IPromise<WebMap | WebScene> {
  const { item, appProxies } = options;
  const isWebMap = item.type === "Web Map";
  const isWebScene = item.type === "Web Scene";

  if (!isWebMap && !isWebScene) {
    return promiseUtils.reject();
  }

  return isWebMap ? createWebMapFromItem(options) : createWebSceneFromItem(options) as IPromise<WebMap | WebScene>;
}

export function createWebMapFromItem(options: CreateMapFromItemOptions): IPromise<WebMap> {
  const { item, appProxies } = options;
  return requireUtils.when(require, "esri/WebMap").then(WebMap => {
    const wm = new WebMap({
      portalItem: item
    });
    return wm.load().then(() => {
      return _updateProxiedLayers(wm, appProxies);
    });
  });
}

export function createWebSceneFromItem(options: CreateMapFromItemOptions): IPromise<WebScene> {
  const { item, appProxies } = options;
  return requireUtils.when(require, "esri/WebScene").then(WebScene => {
    const ws = new WebScene({
      portalItem: item
    });
    return ws.load().then(() => {
      return _updateProxiedLayers(ws, appProxies);
    });
  });
}

export function getItemTitle(item: PortalItem): string {
  if (item && item.title) {
    return item.title;
  }
}

export function goToMarker(marker: string, view: MapView | SceneView): IPromise<any> {
  if (!marker || !view) {
    return promiseUtils.resolve();
  }

  return parseMarker(marker).then(graphic => {
    view.graphics.add(graphic);
    const view2 = view as any; // todo: Typings will be fixed in next release.
    return view2.goTo(graphic);
  });
}

export function findQuery(query: string, view: MapView | SceneView): IPromise<any> {
  // ?find=redlands, ca
  if (!query || !view) {
    return promiseUtils.resolve();
  }

  return requireUtils.when(require, "esri/widgets/Search/SearchViewModel").then(SearchViewModel => {
    const searchVM = new SearchViewModel({
      view: view
    });
    return searchVM.search(query).then(result => {
      watchUtils.whenFalseOnce(view, "popup.visible", () => searchVM.destroy());
      return result;
    });
  });
}

//--------------------------------------------------------------------------
//
//  Private Methods
//
//--------------------------------------------------------------------------

function _updateProxiedLayers(webItem: WebMap | WebScene, appProxies?: ApplicationProxy[]): IPromise<WebMap | WebScene> {
  if (!appProxies) {
    return webItem;
  }

  appProxies.forEach(proxy => {
    webItem.layers.forEach((layer: any) => {
      if (layer.url === proxy.sourceUrl) {
        layer.url = proxy.proxyUrl;
      }
    });
  });

  return webItem;
}
