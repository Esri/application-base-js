define(["require", "exports", "esri/geometry/support/jsonUtils"], function (require, exports, jsonUtils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._extentSelectorConfigValidate = exports._extentSelectorConfigConvert = exports.parseConfig = void 0;
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
        if ((config === null || config === void 0 ? void 0 : config.extentSelectorConfig) != null) {
            config.extentSelectorConfig = _extentSelectorConfigConvert(config.extentSelectorConfig);
            config.extentSelectorConfig = _extentSelectorConfigValidate(config.extentSelectorConfig);
        }
        return config;
    }
    exports.parseConfig = parseConfig;
    var MIN_SCALE_DEFAULT = 591657528;
    var MAX_SCALE_DEFAULT = 100;
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
        var _a, _b, _c, _d;
        if (extentSelectorConfig) {
            if (typeof extentSelectorConfig === "object" && ((_a = Object.keys(extentSelectorConfig)) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                return {
                    constraints: {
                        geometry: null,
                        minScale: MIN_SCALE_DEFAULT,
                        maxScale: MAX_SCALE_DEFAULT,
                        rotationEnabled: true
                    },
                    mapRotation: 0
                };
            }
            if (((_b = extentSelectorConfig === null || extentSelectorConfig === void 0 ? void 0 : extentSelectorConfig.constraints) === null || _b === void 0 ? void 0 : _b.geometry) != null) {
                var geom = jsonUtils.fromJSON(extentSelectorConfig.constraints.geometry);
                if ((geom === null || geom === void 0 ? void 0 : geom.type) === "polygon") {
                    extentSelectorConfig.constraints.geometry =
                        geom.rings.length > 0 ?
                            extentSelectorConfig.constraints.geometry :
                            null;
                }
                else if ((geom === null || geom === void 0 ? void 0 : geom.type) === "extent") {
                    extentSelectorConfig.constraints.geometry =
                        geom.width != null && geom.height != null ?
                            extentSelectorConfig.constraints.geometry :
                            null;
                }
                else {
                    extentSelectorConfig.constraints.geometry = null;
                }
            }
            if ((extentSelectorConfig === null || extentSelectorConfig === void 0 ? void 0 : extentSelectorConfig.constraints) && ((_c = extentSelectorConfig.constraints) === null || _c === void 0 ? void 0 : _c.minScale) == null) {
                extentSelectorConfig.constraints.minScale = MIN_SCALE_DEFAULT;
            }
            if ((extentSelectorConfig === null || extentSelectorConfig === void 0 ? void 0 : extentSelectorConfig.constraints) && ((_d = extentSelectorConfig.constraints) === null || _d === void 0 ? void 0 : _d.maxScale) == null) {
                extentSelectorConfig.constraints.maxScale = MAX_SCALE_DEFAULT;
            }
        }
        return extentSelectorConfig;
    }
    exports._extentSelectorConfigValidate = _extentSelectorConfigValidate;
});
//# sourceMappingURL=configParser.js.map