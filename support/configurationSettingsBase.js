var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/core/Accessor", "esri/core/accessorSupport/decorators"], function (require, exports, Accessor_1, decorators_1) {
    "use strict";
    Accessor_1 = __importDefault(Accessor_1);
    /**
     * Base Class for all instant app's ConfigurationSettings classes. Handles
     * communication with the Config Panel for live updates during the configuration experience.
     */
    var ConfigurationSettingsBase = /** @class */ (function (_super) {
        __extends(ConfigurationSettingsBase, _super);
        function ConfigurationSettingsBase(params) {
            var _this = _super.call(this) || this;
            /** Determines if the App is being run within the Config Panel's IFrame */
            _this.withinConfigurationExperience = _this._isWithinConfigurationExperience();
            _this._draft = null;
            _this._draftMode = false;
            _this._draft = params === null || params === void 0 ? void 0 : params.draft;
            _this._draftMode = (params === null || params === void 0 ? void 0 : params.mode) === 'draft';
            return _this;
        }
        ConfigurationSettingsBase.prototype.initialize = function () {
            if (this.withinConfigurationExperience || this._draftMode) {
                // Apply any draft properties
                if (this._draft) {
                    Object.assign(this, this._draft);
                }
                window.addEventListener('message', function (e) {
                    this._handleConfigurationUpdates(e);
                }.bind(this), false);
            }
        };
        ConfigurationSettingsBase.prototype._handleConfigurationUpdates = function (e) {
            var _a;
            if (((_a = e === null || e === void 0 ? void 0 : e.data) === null || _a === void 0 ? void 0 : _a.type) === 'cats-app') {
                Object.assign(this, e.data);
            }
        };
        ConfigurationSettingsBase.prototype._isWithinConfigurationExperience = function () {
            var frameElement = window.frameElement, location = window.location, parent = window.parent;
            return frameElement
                ? frameElement.getAttribute("data-embed-type") === "instant-config"
                    ? true
                    : false
                : location !== parent.location;
        };
        __decorate([
            decorators_1.property()
        ], ConfigurationSettingsBase.prototype, "withinConfigurationExperience", void 0);
        return ConfigurationSettingsBase;
    }(Accessor_1.default));
    return ConfigurationSettingsBase;
});
//# sourceMappingURL=configurationSettingsBase.js.map