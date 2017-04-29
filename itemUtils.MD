# itemUtils

A utility module containing common methods used to read, create and modify a PortalItem, WebMaps, WebScenes, MapView, SceneView.

## Methods

### getConfigViewProperties(config: ApplicationConfig): Object

Returns the view poperties defined from an ApplicationConfig.

### createMapFromItem(item: PortalItem, appProxies?: ApplicationProxy[]): IPromise&lt;WebMap | WebScene&gt;

Creates a `WebMap` or `WebScene` from a `PortalItem`. You can optionally replace the `WebMap`'s or `WebScene`'s layer URLs by passing appProxies.

### createView(map: WebMap | WebScene, viewProperties: any): IPromise&lt;MapView | SceneView&gt;

Creates a `MapView` or `SceneView` with a `WebMap` or `WebScene` depending on the type of map it is.

### createWebMapFromItem(portalItem: PortalItem, appProxies?: ApplicationProxy[]): IPromise&lt;WebMap&gt;

Creates a `WebMap` from a `PortalItem`. You can optionally replace the `WebMap`'s layer URLs by passing appProxies.

### createWebSceneFromItem(portalItem: PortalItem, appProxies?: ApplicationProxy[]): IPromise&lt;WebScene&gt;

Creates a `WebScene` from a `PortalItem`. You can optionally replace the `WebScene`'s layer URLs by passing appProxies.

### getItemTitle(item: PortalItem): string

Returns the title of the `PortalItem`.

### setBasemap(map: WebMap | WebScene, config: ApplicationConfig): IPromise&lt;WebMap | WebScene&gt;

Sets the basemap on a `WebMap` or `WebScene` if a `basemapUrl` is defined in the `ApplicationConfig`.

### goToMarker(marker: string, view: MapView | SceneView): IPromise&lt;any&gt;

Adds a `Graphic` marker and animates the view to its location if a `marker` is defined.


### findQuery(query: string, view: MapView | SceneView): IPromise&lt;any&gt;

Finds a location by query string and animates to its geometry if a query string is defined.
