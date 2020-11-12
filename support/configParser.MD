# configParser

A helper module that contains a method to handle backwards compatibility for the Application Configs for configurable ArcGIS applications.


## Methods

### parseConfig(config: any): any

Handles backwards compatibility for the App Configs by transforming the inputted Config into the form of the new Config.
So essentially, what comes out of this function should be a config that would match exactly with a brand new config that comes out of 
the config panel right at this moment. This is important, because existing App's item data resemble what the config panel outputted when that 
App was configured last. If the config that gets outputted by the Config Panel changes, then those changes are not automatically propagated 
to existing App's Configs. 

Here's an example of backwards compatibility:
For property "testProp" on the config, the interface for the property value is initially:

```javascript
testProp: { 
    prop_a: number, 
    prop_b: string, 
    prop_c: { prop_c1: number } 
};
```

Now let's say that the Config Panel changes, which causes the new outputted interface to be:

```javascript
testProp: { 
    prop_a: number, 
    prop_b_container:{ 
        prop_b: string, 
        prop_b_1: string 
    }, 
    prop_c1: number 
};
```

Two major things changed:

1. prop_b was moved into "prop_b_container", and "prop_b_1" was added to that container. 
    
2. "prop_c1" was moved from inside "prop_c" into the root testProp object. 

So if an App was configured with the old testProp interface, then we would have to perform the proper transformations on the config to make it comform with 
the new interface. So: 

``` javascript
testProp: { 
    prop_a: number, 
    prop_b: string, 
    prop_c: { prop_c1: number } 
};
```
has to become =>
``` javascript
testProp: { 
    prop_a: number, 
    prop_b_container:{ 
        prop_b: string, 
        prop_b_1: string 
    }, 
    prop_c1: number 
};
```

And we can do this transformation in this `parseConfig` function by both, moving values around, and possibly giving defaults to new values that didn't exist prior.



