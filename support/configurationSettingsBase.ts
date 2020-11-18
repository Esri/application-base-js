import Accessor from 'esri/core/Accessor'
import { property } from 'esri/core/accessorSupport/decorators'
import { ApplicationConfig } from '../interfaces'

/**
 * Base Class for all instant app's ConfigurationSettings classes. Handles
 * communication with the Config Panel for live updates during the configuration experience.
 */
class ConfigurationSettingsBase extends Accessor {
  /** Determines if the App is being run within the Config Panel's IFrame */
  @property()
  withinConfigurationExperience: boolean = 
    window?.frameElement?.getAttribute("data-embed-type") === "instant-config";

  private _draft: ApplicationConfig = null;
  private _draftMode: boolean = false;

  constructor(params?: ApplicationConfig) {
    super();
    this._draft = params?.draft;
    this._draftMode = params?.mode === 'draft';
  }

  initialize() {
    if (this.withinConfigurationExperience || this._draftMode) {
      // Apply any draft properties
      if (this._draft) {
        Object.assign(this, this._draft);
      }

      window.addEventListener(
        'message',
        function (e) {
          this._handleConfigurationUpdates(e);
        }.bind(this),
        false
      );
    }
  }

  _handleConfigurationUpdates(e) {
    if (e?.data?.type === 'cats-app') {
      Object.assign(this, e.data);
    }
  }
}
export = ConfigurationSettingsBase;
