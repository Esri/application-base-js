import jsonUtils from "esri/geometry/support/jsonUtils";
import { ApplicationConfig } from "../interfaces";

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
export function parseConfig(config: ApplicationConfig): ApplicationConfig{

    if(config.extentSelectorConfig != null){
        config.extentSelectorConfig = _extentSelectorConfigConvert(config.extentSelectorConfig);
        config.extentSelectorConfig = _extentSelectorConfigValidate(config.extentSelectorConfig);
    }

    return config;
}



export interface IExtentSelectorOutput {
    constraints: __esri.MapViewConstraints;
    mapRotation: number;
  }


/**
 * // old (extentSelectorConfig === __esri.MapViewConstraints) 
 * // => 
 * // new (extentSelectorConfig === IExtentSelectorOutput)
 * @param config 
 */
export function _extentSelectorConfigConvert(extentSelectorConfig: any): IExtentSelectorOutput{
    if(extentSelectorConfig && (
        extentSelectorConfig.geometry != null ||
        extentSelectorConfig.maxScale != null ||
        extentSelectorConfig.minScale != null
    )){ // old
        return {
            constraints: extentSelectorConfig,
            mapRotation: 0
        };
    }else{ // new
        return extentSelectorConfig;
    }
}


export function _extentSelectorConfigValidate(extentSelectorConfig: IExtentSelectorOutput): IExtentSelectorOutput{
    if(extentSelectorConfig){

        if(Object.keys(extentSelectorConfig)?.length === 0 && extentSelectorConfig?.constructor === Object){
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


        if(extentSelectorConfig?.constraints?.geometry != null){

            const geom = jsonUtils.fromJSON(extentSelectorConfig.constraints.geometry);
            if(geom.type === "polygon"){
                extentSelectorConfig.constraints.geometry = 
                    (geom as __esri.Polygon).rings.length > 0 ? 
                        extentSelectorConfig.constraints.geometry : 
                        null;
            }else if (geom.type === "extent"){
                extentSelectorConfig.constraints.geometry = 
                    (geom as __esri.Extent).width != null && (geom as __esri.Extent).height != null ?
                        extentSelectorConfig.constraints.geometry : 
                        null;
            }else {
                extentSelectorConfig.constraints.geometry = null;
            }
        }

        if(extentSelectorConfig.constraints.minScale == null){
            extentSelectorConfig.constraints.minScale = 100;
        }
        if(extentSelectorConfig.constraints.maxScale == null){
            extentSelectorConfig.constraints.maxScale = 591657528;
        }

    }

    return extentSelectorConfig;

}