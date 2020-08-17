/**
 * This module contains common functions and interfaces to be used in different
 * widgetConfigUtil files.
 */

export interface esriWidgetProps extends __esri.WidgetProperties {
    config: any;
    view?: __esri.MapView;
    portal?: __esri.Portal;
    propertyName?: string;
}