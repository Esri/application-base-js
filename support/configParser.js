var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/geometry/support/jsonUtils"], function (require, exports, jsonUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._extentSelectorConfigValidate = exports._extentSelectorConfigConvert = exports.parseConfig = void 0;
    jsonUtils_1 = __importDefault(jsonUtils_1);
    /**
     * "Convert" functions handle backwards compatibility for the App Configs by transforming
     * the inputted Config into a form that is equivalent to what the Config
     * Panel would produce right at this moment.
     *
     * "Validate" functions handle turning potentially invalid app item JSON into a valid
     * form, which will not cause the template app to error.
     *
     * *** NOTE:
     * For all "Convert" additions below, please add a comment with the old
     * interface that is being transformed from, and the new interface that
     * is being transformed to
     * ****
     * @param config - App Config
     */
    function parseConfig(config) {
        if (config.extentSelectorConfig != null) {
            config.extentSelectorConfig = _extentSelectorConfigConvert(config.extentSelectorConfig);
            config.extentSelectorConfig = _extentSelectorConfigValidate(config.extentSelectorConfig);
        }
        return config;
    }
    exports.parseConfig = parseConfig;
    /**
     * // old (extentSelectorConfig === __esri.MapViewConstraints)
     * // =>
     * // new (extentSelectorConfig === IExtentSelectorOutput)
     * @param config
     */
    function _extentSelectorConfigConvert(extentSelectorConfig) {
        if (extentSelectorConfig && (extentSelectorConfig.geometry != null ||
            extentSelectorConfig.maxScale != null ||
            extentSelectorConfig.minScale != null)) { // old
            return {
                constraints: extentSelectorConfig,
                mapRotation: 0
            };
        }
        else { // new
            return extentSelectorConfig;
        }
    }
    exports._extentSelectorConfigConvert = _extentSelectorConfigConvert;
    function _extentSelectorConfigValidate(extentSelectorConfig) {
        var _a, _b;
        if (extentSelectorConfig) {
            if (((_a = Object.keys(extentSelectorConfig)) === null || _a === void 0 ? void 0 : _a.length) === 0 && (extentSelectorConfig === null || extentSelectorConfig === void 0 ? void 0 : extentSelectorConfig.constructor) === Object) {
                return {
                    constraints: {
                        geometry: null,
                        minScale: 100,
                        maxScale: 591657528,
                        rotationEnabled: true
                    },
                    mapRotation: 0
                };
            }
            if (((_b = extentSelectorConfig === null || extentSelectorConfig === void 0 ? void 0 : extentSelectorConfig.constraints) === null || _b === void 0 ? void 0 : _b.geometry) != null) {
                var geom = jsonUtils_1.default.fromJSON(extentSelectorConfig.constraints.geometry);
                if (geom.type === "polygon") {
                    extentSelectorConfig.constraints.geometry =
                        geom.rings.length > 0 ?
                            extentSelectorConfig.constraints.geometry :
                            null;
                }
                else if (geom.type === "extent") {
                    extentSelectorConfig.constraints.geometry =
                        geom.width != null && geom.height != null ?
                            extentSelectorConfig.constraints.geometry :
                            null;
                }
                else {
                    extentSelectorConfig.constraints.geometry = null;
                }
            }
            if (extentSelectorConfig.constraints.minScale == null) {
                extentSelectorConfig.constraints.minScale = 100;
            }
            if (extentSelectorConfig.constraints.maxScale == null) {
                extentSelectorConfig.constraints.maxScale = 591657528;
            }
        }
        return extentSelectorConfig;
    }
    exports._extentSelectorConfigValidate = _extentSelectorConfigValidate;
});
//# sourceMappingURL=configParser.js.map