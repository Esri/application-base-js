/**
 * This module contains common functions and interfaces to be used in different
 * widgetConfigUtil files.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** Returns the first DOM node in the page which matches the className */
    function _findNode(className) {
        var mainNodes = document.getElementsByClassName(className);
        var node = null;
        for (var j = 0; j < mainNodes.length; j++) {
            node = mainNodes[j];
        }
        return node ? node : null;
    }
    exports._findNode = _findNode;
});
//# sourceMappingURL=widgetConfigUtils.js.map