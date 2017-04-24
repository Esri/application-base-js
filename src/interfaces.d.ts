import Portal = require("esri/portal/Portal");
import PortalItem = require("esri/portal/PortalItem");

export interface ApplicationConfigs {
  application?: ApplicationConfig;
  config: ApplicationConfig;
  local?: ApplicationConfig;
  url?: ApplicationConfig;
}

export interface ApplicationConfig {
  appid?: string;
  basemapUrl?: string;
  basemapReferenceUrl?: string;
  center?: string;
  components?: string;
  embed?: boolean;
  extent?: string;
  find?: string;
  group?: string | string[];
  helperServices?: any;
  level?: string;
  marker?: string;
  oauthappid?: string;
  portalUrl?: string;
  proxyUrl?: string;
  title?: string;
  viewpoint?: string;
  webmap?: string | string[];
  webscene?: string | string[];
  [propName: string]: any;
}

export interface ApplicationBaseSettings {
  environment: {
    isEsri?: boolean;
    webTierSecurity?: boolean;
  };
  localStorage?: {
    fetch?: boolean;
  };
  group?: {
    default?: string;
    itemParams?: {
      [propname: string]: any;
    };
    fetchItems?: boolean;
    fetchInfo?: boolean;
  };
  portal?: {
    fetch?: boolean;
  };
  urlParams?: string[];
  webmap?: {
    default?: string;
    fetch?: boolean;
  };
  webscene?: {
    default?: string;
    fetch?: boolean;
  }
}

export interface ApplicationBaseResult {
  error?: Error;
  value: any;
  promise: IPromise<any>;
}

export interface ApplicationBaseResults {
  applicationItem?: ApplicationBaseResult;
  applicationData?: ApplicationBaseResult;
  groupInfos?: ApplicationBaseResult[];
  groupItems?: ApplicationBaseResult[];
  localStorage?: ApplicationConfig;
  portal?: Portal;
  urlParams?: ApplicationConfig;
  webMapItems?: ApplicationBaseResult[];
  webSceneItems?: ApplicationBaseResult[];
}
