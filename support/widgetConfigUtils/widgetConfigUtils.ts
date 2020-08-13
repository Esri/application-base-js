/**
 * This module contains common functions and interfaces to be used in different
 * widgetConfigUtil files.
 */


/** Returns the first DOM node in the page which matches the className */
export function _findNode(className: string): HTMLElement {
    const mainNodes = document.getElementsByClassName(className);
    let node = null;
    for (let j = 0; j < mainNodes.length; j++) {
        node = mainNodes[j] as HTMLElement;
    }
    return node ? node : null;
}


export interface esriWidgetProps extends __esri.WidgetProperties {
    config: any;
    view?: __esri.MapView;
    portal?: __esri.Portal;
    propertyName?: string;
}