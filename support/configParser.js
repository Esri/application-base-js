define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseConfig = void 0;
    /**
     * Handles backwards compatibility for the App Configs by transforming
     * the inputted Config into a form that is equivalent to what the Config
     * Panel would produce right at this moment.
     *
     * *** NOTE:
     * For all additions below, please add a comment with the old
     * interface that is being transformed from, and the new interface that
     * is being transformed to
     * ****
     * @param config - App Config
     */
    function parseConfig(config) {
        var _a, _b, _c;
        // old (extentSelectorConfig === __esri.MapViewConstraints) 
        // => 
        // new (extentSelectorConfig === { constraints: __esri.MapViewConstrainst, rotation: number })
        if ((config === null || config === void 0 ? void 0 : config.extentSelectorConfig) && (((_a = config === null || config === void 0 ? void 0 : config.extentSelectorConfig) === null || _a === void 0 ? void 0 : _a.geometry) || ((_b = config === null || config === void 0 ? void 0 : config.extentSelectorConfig) === null || _b === void 0 ? void 0 : _b.maxScale) || ((_c = config === null || config === void 0 ? void 0 : config.extentSelectorConfig) === null || _c === void 0 ? void 0 : _c.minScale))) {
            config.extentSelectorConfig = {
                constraints: config.extentSelectorConfig,
                rotation: 0
            };
        }
        return config;
    }
    exports.parseConfig = parseConfig;
});
//# sourceMappingURL=configParser.js.map