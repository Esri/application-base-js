import { ApplicationConfig } from "ApplicationBase/interfaces";

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
export function parseConfig(config: ApplicationConfig): ApplicationConfig{

    // old (extentSelectorConfig === __esri.MapViewConstraints) 
    // => 
    // new (extentSelectorConfig === { constraints: __esri.MapViewConstrainst, rotation: number })
    if(config?.extentSelectorConfig && (
        config?.extentSelectorConfig?.geometry ||
        config?.extentSelectorConfig?.maxScale ||
        config?.extentSelectorConfig?.minScale
    )){
        config.extentSelectorConfig = {
            constraints: config.extentSelectorConfig,
            rotation: 0
        };
    }

    return config;
}