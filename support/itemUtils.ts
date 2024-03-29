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
import { reject, resolve } from "esri/core/promiseUtils";
import { whenFalseOnce } from "esri/core/watchUtils";

import MapView from "esri/views/MapView";
import SceneView from "esri/views/SceneView";

import PortalItem from "esri/portal/PortalItem";

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
import esri = __esri;
//--------------------------------------------------------------------------
//
//  Public Methods
//
//--------------------------------------------------------------------------

export function getConfigViewProperties(config: ApplicationConfig): any {
  const { center, components, extent, level, viewpoint } = config;
  const ui = components
    ? { ui: { components: parseViewComponents(components) } }
    : null;
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

export async function createView(properties: any): Promise<esri.MapView | esri.SceneView> {
  const { map } = properties;

  if (!map) {
    return reject(`properties does not contain a "map"`);
  }

  const isWebMap = map.declaredClass === "esri.WebMap";
  const isWebScene = map.declaredClass === "esri.WebScene";

  if (!isWebMap && !isWebScene) {
    return reject(`map is not a "WebMap" or "WebScene"`);
  }

  return isWebMap ? new MapView(properties) : new SceneView(properties);

}

export function createMapFromItem(
  options: CreateMapFromItemOptions
): Promise<esri.WebMap | esri.WebScene> {
  const { item } = options;
  const isWebMap = item.type === "Web Map";
  const isWebScene = item.type === "Web Scene";

  if (!isWebMap && !isWebScene) {
    return reject();
  }

  return isWebMap
    ? createWebMapFromItem(options)
    : (createWebSceneFromItem(options) as Promise<esri.WebMap | esri.WebScene>);
}

export async function createWebMapFromItem(
  options: CreateMapFromItemOptions
): Promise<esri.WebMap> {
  const { item, appProxies, mapParams } = options;
  const WebMap = await import("esri/WebMap");
  const wm = new WebMap.default({
    portalItem: item,
    ...mapParams
  });
  await wm.load();
  if (wm?.basemap)
    await wm.basemap.load();
  return _updateProxiedLayers(wm, appProxies) as __esri.WebMap;
}

export async function createWebSceneFromItem(
  options: CreateMapFromItemOptions
): Promise<esri.WebScene> {
  const { item, appProxies } = options;
  const WebScene = await import("esri/WebScene");
  const ws = new WebScene.default({
    portalItem: item
  });
  await ws.load();
  if (ws?.basemap)
    await ws.basemap.load();
  return _updateProxiedLayers(ws, appProxies) as __esri.WebScene;
}

export function getItemTitle(item: PortalItem): string {
  if (item && item.title) {
    return item.title;
  }
}

export async function goToMarker(
  marker: string,
  view: esri.MapView | esri.SceneView
): Promise<any> {
  if (!marker || !view) {
    return resolve();
  }
  const graphic = await parseMarker(marker);
  await view.when();

  view.graphics.add(graphic as esri.Graphic);
  view.goTo(graphic);

  return graphic;
}

export async function findQuery(
  query: string,
  view: esri.MapView | esri.SceneView
): Promise<any> {
  // ?find=redlands, ca
  if (!query || !view) {
    return resolve();
  }

  const Search = await import("esri/widgets/Search");

  const search = new Search.default({
    view
  });
  const result = await search.search(query);
  whenFalseOnce(view, "popup.visible", () => {
    search.destroy();
  });
  return result;
}

//--------------------------------------------------------------------------
//
//  Private Methods
//
//--------------------------------------------------------------------------

function _updateProxiedLayers(
  webItem: esri.WebMap | esri.WebScene,
  appProxies?: ApplicationProxy[]
): esri.WebMap | esri.WebScene {
  if (!appProxies) {
    return webItem;
  }

  appProxies.forEach(proxy => {
    webItem.allLayers.forEach((layer: any) => {
      if (layer.url === proxy.sourceUrl) {
        layer.url = proxy.proxyUrl;
      }
    });
  });
  return webItem;
}
