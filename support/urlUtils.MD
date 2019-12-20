# urlUtils

A utility module containing common methods used to parse URL parameters and convert them into a usable instance.

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

### parseMarker(marker: string): Promise&lt;Graphic&gt;

Parses a marker string into a `Graphic`.

