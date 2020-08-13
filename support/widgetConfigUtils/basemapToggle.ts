/**
 * This module contains a method to instantiate the 4.x API BasemapToggle Widget
 * using configuration variable which come from the Config Panel.
 */

import { _findNode, esriWidgetProps } from "./widgetConfigUtils";
import BasemapToggle from "esri/widgets/BasemapToggle";
import Basemap from "esri/Basemap";

//////////////////////////////
// Public Module Functions
//////////////////////////////

/** The original basemap for the Webmap */
let _originalBasemap: __esri.Basemap;
/** The alternate basemap in the BasemapToggle */
let _nextBasemap: __esri.Basemap;

/**
 * Adds BasemapToggle to Application, including logic to make 
 * integrations with the Config Panel function properly
 * @param props 
 */
export async function addBasemapToggle(props: esriWidgetProps): Promise<__esri.BasemapToggle> {

    // Variables
    const { view, config, propertyName, portal } = props;
    const { basemapToggle, basemapTogglePosition, basemapSelector, nextBasemap } = config;
    /** Depending on which is defined, use "basemapSelector"
     * (which is an id, ex: db6a43e20e09486b9444edcd77e0f906) or "nextBasemap" 
     * (which is a well-known-basemap-id: https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap).
     * The "nextBasemap" config variable is kept for backward compatibilty with the Config Panel,
     * whereas "basemapSelector" is the new config variable */
    const alternateBasemapId: string = basemapSelector || nextBasemap;
    let basemapToggleInstance: __esri.BasemapToggle;
    
    const node = _findNode("esri-basemap-toggle");
    if (node) basemapToggleInstance = view.ui.find("basemapToggle") as __esri.BasemapToggle;

    // Save original basemap
    if(!_originalBasemap) _originalBasemap = view.map.basemap;

    // Remove BasemapToggle
    if (!basemapToggle) {
        if (node) {
            _resetBasemapsInToggle(basemapToggleInstance, _originalBasemap);
            view.ui.remove(node);
            basemapToggleInstance.destroy();
        }
        return null; // BasemapToggle has been removed
    }

    // setup nextBasemap
    _nextBasemap = await _getBasemap(alternateBasemapId, portal);

    if (node && propertyName === "basemapSelector") {
        _resetBasemapsInToggle(basemapToggleInstance, _originalBasemap, _nextBasemap);
    } else if (node && propertyName === "basemapTogglePosition") {
        view.ui.move(node, basemapTogglePosition);
    } else if (propertyName === "basemapToggle") {
        basemapToggleInstance = new BasemapToggle({
            view,
            nextBasemap: _nextBasemap,
            id: "basemapToggle"
        });

        view.ui.add(
            basemapToggleInstance,    
            basemapTogglePosition
        );
    }
    return basemapToggleInstance;
}


//////////////////////////////
// Private Module Functions
//////////////////////////////

/** 
 * Creates Basemap instance properly from either a well-known-basemap-id, or
 * from a webmap id
 */
async function _getBasemap(id: string, portal?: __esri.Portal): Promise<__esri.Basemap> {
    let basemap: __esri.Basemap = Basemap.fromId(id);

    if (!basemap) {
        basemap = await new Basemap({
            portalItem: {
                id,
                portal
            }
        }).loadAll();
    }
    return basemap;
}

/**
 * Resets the Basemaps in the BasemapToggle by explicitly setting them.
 * Note: This also affects the basemap on the current Webmap being shown in the view, 
 * because when nextBasemap on the BasemapToggle gets set, then that overrides the
 * basemap property on the Webmap
 * @param primaryBasemap The Basemap desired to be set as the Webmap's Basemap
 * @param nextBasemap The Alternate Basemap in the BasemapToggle
 */
function _resetBasemapsInToggle(basemapToggle: __esri.BasemapToggle, primaryBasemap: __esri.Basemap, nextBasemap?: __esri.Basemap) {
    basemapToggle.nextBasemap = primaryBasemap; // assign original first
    basemapToggle.toggle(); // toggle to make original the current basemap
    basemapToggle.nextBasemap = nextBasemap; // assign alternate 
}