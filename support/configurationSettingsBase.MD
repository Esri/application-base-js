# configurationSettingsBase.ts

A Base Class for all instant app's ConfigurationSettings classes. This Base class handles communication with the Config Panel 
for live updates during the configuration experience.


## Classes

### ConfigurationSettingsBase

When Extended in the Configurable App, the app author should define all configurable app properties within that class.

Example:

```javascript
@subclass("app.ConfigurationSettings")
class ConfigurationSettings extends ConfigurationSettingsBase {

    @property()
    webmap: string; // configurable property

    @property()
    mapZoom: boolean; // configurable property

    @property()
    mapZoomPosition: UIPosition; // configurable property

    @property()
    home: boolean; // configurable property

    constructor(params?: ApplicationConfig) {
        super(params);
    }
}
```

