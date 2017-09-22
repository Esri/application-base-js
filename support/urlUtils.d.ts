/// <reference types="arcgis-js-api" />
import Camera = require("esri/Camera");
import Graphic = require("esri/Graphic");
import Extent = require("esri/geometry/Extent");
import Point = require("esri/geometry/Point");
export declare function parseViewComponents(components: string): string[];
export declare function parseViewpoint(viewpoint: string): Camera;
export declare function parseCenter(center: string): Point;
export declare function parseLevel(level: string): number;
export declare function parseExtent(extent: string): Extent;
export declare function parseMarker(marker: string): IPromise<Graphic>;
