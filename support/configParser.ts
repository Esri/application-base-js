/**
 * Handles backwards compatibility for the App Configs by transforming the inputted Config into the form of the new Config.
 * So essentially, what comes out of this function should be a config that would match exactly with a brand new config that comes out of 
 * the config panel right now. This is important, because existing App's item data resemble what the config panel outputted when that 
 * App was configured last. If the config that gets outputted by the Config Panel changes, then those changes are not automatically propagated 
 * to existing App's Configs. 
 * 
 * Here's an example of backwards compatibility:
 * For property "testProp" on the config, the interface for the property value is initially:
 * 
 * testProp: { prop_a: number, prop_b: string, prop_c: { prop_c1: number } };
 * 
 * Now let's say that the Config Panel changes, which causes the new outputted interface to be:
 * 
 * testProp: { prop_a: number, prop_b_container:{ prop_b: string, prop_b_1: string }, prop_c1: number };
 * 
 * Two major things changed 
 *      1. prop_b was moved into "prop_b_container", and "prop_b_1" was added. 
 *      2. "prop_c1" was moved from inside "prop_c" into the root testProp object. 
 * So if an App was configured with the old testProp interface, then we would have to perform the proper transformations on the config to get it to make 
 * the new interface. So: 
 * 
 * testProp: { prop_a: number, prop_b: string, prop_c: { prop_c1: number } };
 * has to become =>
 * testProp: { prop_a: number, prop_b_container:{ prop_b: string, prop_b_1: string }, prop_c1: number };
 * 
 * And we can do that in this parseConfig function by moving values around, and possibly giving defaults 
 * to new values that didn't exist prior.
 * 
 * @param config - App Config
 */
export function parseConfig(config: any): any{

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