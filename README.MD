# ApplicationBase

todo

## Purpose

The purpose of this ApplicationBase is to handle fetching and managing ArcGIS Online information used in configurable applications such as:

- Portal information
- User information
- Item data (webscene, webmap, group information, group items)
- Configured application information
- URL parameters

The ApplicationBase will handle fetching this information, store it, and perform setup when necessary.

## Features

todo

# Preview examples

todo

# Settings & Configuration

## Application Configuration

`/dist/config/application.json`

|property|description|type|default|
|---|---|---|---|
|appid|Application ID for querying application configuration|string|""|
|group|Group ID for querying a portal group|string or string[]|""|
|webscene|WebScene ID for querying a webscene|string or string[]|"19faa71a3bf6468cae35b4fce9393a7d"|
|webmap|WebMap ID for querying a webmap|string or string[]|""|
|title|Title of the application|string|""|
|portalUrl|URL to the ArcGIS Portal|string|"https://www.arcgis.com"|
|oauthappid|oAuth authentication ID|string|""|
|proxyUrl|Enter the url to the proxy if needed by the application. See the [Using the proxy page](http://developers.arcgis.com/en/javascript/jshelp/ags_proxy.html) help topic for details.|string|""|
|units|Application measurement units|string|""|
|helperServices|Object containing URLs to various helper services|Object|See below|

## ApplicationBase Configuration

`/dist/config/ApplicationBase.json`

|property|description|type|default|
|---|---|---|---|
|webscene|WebScene related settings|Object|See below|
|webscene.fetch|When true the application will query for a webscene|Boolean|true|
|webmap|WebMap related settings|Object|See below|
|webmap.fetch|When true the application will query for a webmap|Boolean|false|
|group|Group related settings|Object|See below|
|group.fetchInfo|When true the application will query for a group's information|Boolean|false|
|group.fetchItems|When true the application will query for a group's items|Boolean|false|
|group.itemParams|Defines query paramaters for fetching group items|Object|See below|
|portal|Portal related settings|Object|See below|
|portal.fetch|When true the application will query arcgis.com for default settings for helper services, units etc. If you want to use custom settings for units or any of the helper services set this to false then enter default values for any items you need using the helper services and units properties.|Boolean|true|
|urlParams|Defines which URL parameters should be captured and stored into the config for use within the application|String[]|See below|
|webTierSecurity|Support sending credentials with AJAX requests to specific domains. This will allow editing of feature services secured with web-tier authentication|Boolean|false|
|esriEnvironment|Most users will not need to modify this value. For Esri hosting environments only. Will automatically create a `portalUrl` and `proxyUrl` for the application. Only set this is to true if the app is going to be stored on Esri's hosting servers. If you are using your own custom hosted portal, set the `portalUrl` in `config.json` instead of setting this to true.|   Boolean|false|

# API

This is the API for the ApplicationBase class. `ApplicationBase.js`

## Constructor

`new ApplicationBase(ApplicationConfig, ApplicationBaseConfig)`

## Constructor Options

See [application configuration](#application-configuration) and [ApplicationBase configuration](#applicationbase-configuration) for more information.

## Properties

|property|description|type|readonly
|---|---|---|---|
|config|Config created|ApplicationConfiguration|true|
|direction|Language direction|string|true|
|locale|Locale string|string|true|
|portal|`Portal` created by ApplicationBase|`esri/portal/Portal`|true|
|results|ApplicationBase query results|ApplicationBaseResults|true|
|units|Appropriate units of measurement|string|true|

## Methods

### load()

todo

### queryGroupItems()

Query a group by parameters. `ApplicationBase.queryGroupItems(options)`.

#### Options

```js
{
  "query": "group:\"{groupid}\" AND -type:\"Code Attachment\"",
  "sortField": "modified",
  "sortOrder": "desc",
  "num": 9,
  "start": 0
}
```

# Setup

## Getting Started

todo

Review the following ArcGIS.com help topics for details on Templates:

- [Writing your first application](https://developers.arcgis.com/en/javascript/jstutorials/intro_firstmap_amd.html)
*   [Make your first app](http://doc.arcgis.com/en/arcgis-online/create-maps/make-your-first-app.htm)
*   [Create apps from maps](http://doc.arcgis.com/en/arcgis-online/create-maps/create-app-templates.htm)
*   [Add configurable parameters to templates](http://doc.arcgis.com/en/arcgis-online/create-maps/configurable-templates.htm)

## Instructions

todo

1. Download and unzip the .zip file or clone the repository.
2. Web-enable the directory.
3. Access the .html page.
4. Start writing your template!

[New to GitHub? Get started here.](https://github.com/)

## Deploying

todo

## Requirements

todo

## Resources

* [Community](https://developers.arcgis.com/en/javascript/jshelp/community.html)
* [ArcGIS for JavaScript API Resource Center](https://js.arcgis.com)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
* [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing

Copyright 2017 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt](https://raw.github.com/Esri/application-base-js/master/license.txt) file.

