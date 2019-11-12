# itemUtils

A utility module containing common methods used to read, create and modify a PortalItem, WebMap, WebScene, MapView, or SceneView.

## Methods

### getConfigViewProperties(config: ApplicationConfig): Object

Returns the view poperties defined from an ApplicationConfig.

### createMapFromItem(options: [CreateMapFromItemOptions](#createmapfromitemoptions)): Promise&lt;WebMap | WebScene&gt;

Creates a `WebMap` or `WebScene` from a `PortalItem`. You can optionally replace the `WebMap`'s or `WebScene`'s layer URLs by passing appProxies.

#### CreateMapFromItemOptions

|property|description|type|
|---|---|---|
|item|A WebMap or WebScene item|PortalItem|
|appProxies?|A list of application proxies to apply|ApplicationProxy[]|

### createWebMapFromItem(options: [CreateMapFromItemOptions](#createmapfromitemoptions)): Promise&lt;WebMap&gt;

Creates a `WebMap` from a `PortalItem`. You can optionally replace the `WebMap`'s layer URLs by passing appProxies.

### createWebSceneFromItem(options: [CreateMapFromItemOptions](#createmapfromitemoptions)): Promise&lt;WebScene&gt;

Creates a `WebScene` from a `PortalItem`. You can optionally replace the `WebScene`'s layer URLs by passing appProxies.

### createView(properties: any): Promise&lt;MapView | SceneView&gt;

Creates a `MapView` or `SceneView` with a `WebMap` or `WebScene` depending on the type of map it is.

### getItemTitle(item: PortalItem): string

Returns the title of the `PortalItem`.

### goToMarker(marker: string, view: MapView | SceneView): Promise&lt;any&gt;

Adds a `Graphic` marker and animates the view to its location if a `marker` string is defined.


### findQuery(query: string, view: MapView | SceneView): Promise&lt;any&gt;

Finds a location by query string and animates to its geometry if a query string is defined.

