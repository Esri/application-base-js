# urlUtils

A utility containing common methods used to parse URL parameters and convert them into their appropriate class instance or formatting.

## Methods

### parseViewComponents(components: string) : string[]

Parses the components string into an array of view ui components.

### parseViewpoint(viewpoint: string) : Camera

Parses a viewpoint string into a `Camera`.

### parseCenter(center: string): Point

Parses a center string into a `Point`.

### parseLevel(level: string) : number

Parses a level string into an `integer`.

### parseExtent(extent: string) : Extent

Parses an extent string into an `Extent`.

### parseMarker(marker: string): IPromise&lt;Graphic&gt;

Parses a marker string into a `Graphic`.

### parseBasemap(basemapUrl: string, basemapReferenceUrl: string): IPromise&lt;Basemap&gt;

Parses a basemapUrl string and basemapReferenceUrl string into a `Basemap`.

