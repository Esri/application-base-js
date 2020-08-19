/**
 * This module contains a methods to assist with creation of the 4.x API BasemapToggle Widget
 * using configuration variables that come from the Config Panel.
 */

import { esriWidgetProps } from "./widgetConfigUtils";
import Basemap from "esri/Basemap";

//////////////////////////////
// Public Interfaces
//////////////////////////////

export interface IBasemapToggleState {
    originalBasemap: __esri.Basemap;
    nextBasemap: __esri.Basemap;
}

//////////////////////////////
// Public Functions
//////////////////////////////

/**
 * Gets the proper Basemaps for the BasemapToggle (internally tracks the 
 * original Map's Basemap)
 * @param props 
 */
export async function getBasemaps(props: esriWidgetProps): Promise<IBasemapToggleState> {

    // Variables
    const { view, config, portal } = props;
    const { basemapSelector, nextBasemap } = config;
    /** Depending on which is defined, use "basemapSelector"
     * (which is an id, ex: db6a43e20e09486b9444edcd77e0f906) or "nextBasemap" 
     * (which is a well-known-basemap-id: https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap).
     * The "nextBasemap" config variable is kept for backward compatibilty with the Config Panel,
     * whereas "basemapSelector" is the new config variable */
    const alternateBasemapId: string = basemapSelector || nextBasemap;

    // Save original basemap
    if (!_basemapToggleState.originalBasemap) _basemapToggleState.originalBasemap = view.map.basemap;

    // setup nextBasemap
    _basemapToggleState.nextBasemap = await _getBasemap(alternateBasemapId, portal);

    return _basemapToggleState;
}


/**
 * Resets the Basemaps in the BasemapToggle by explicitly setting them.
 * Note: This also affects the basemap on the current Webmap being shown in the view, 
 * because when nextBasemap on the BasemapToggle gets set, then that overrides the
 * basemap property on the Webmap
 * @param primaryBasemap The Basemap desired to be set as the Webmap's Basemap
 * @param nextBasemap The Alternate Basemap in the BasemapToggle
 */
export function resetBasemapsInToggle(basemapToggle: __esri.BasemapToggle, primaryBasemap: __esri.Basemap, nextBasemap?: __esri.Basemap) {
    basemapToggle.nextBasemap = primaryBasemap; // assign original first
    basemapToggle.toggle(); // toggle to make original the current basemap
    basemapToggle.nextBasemap = nextBasemap; // assign alternate 
}


//////////////////////////////
// Private Variables
//////////////////////////////

const _basemapToggleState: IBasemapToggleState = {
    originalBasemap: null,
    nextBasemap: null
}

//////////////////////////////
// Private Functions
//////////////////////////////

/** 
 * Creates Basemap instance properly from either a well-known-basemap-id, or
 * from a webmap id
 */
async function _getBasemap(id: string, portal?: __esri.Portal): Promise<__esri.Basemap> {
    return Basemap.fromId(id) || new Basemap({
        portalItem: {
            id,
            portal
        }
    }).loadAll();
}
