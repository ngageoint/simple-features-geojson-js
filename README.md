# Simple Features GeoJSON Javascript

#### Simple Features GeoJSON Lib ####

The Simple Features Libraries were developed at the [National Geospatial-Intelligence Agency (NGA)](http://www.nga.mil/) in collaboration with [BIT Systems](https://www.caci.com/bit-systems/). The government has "unlimited rights" and is releasing this software to increase the impact of government investments by providing developers with the opportunity to take things in new directions. The software use, modification, and distribution rights are stipulated within the [MIT license](http://choosealicense.com/licenses/mit/).

### Pull Requests ###
If you'd like to contribute to this project, please make a pull request. We'll review the pull request and discuss the changes. All pull request contributions to this project will be released under the MIT license.

Software source code previously released under an open source license and then modified by NGA staff is considered a "joint work" (see 17 USC § 101); it is partially copyrighted, partially public domain, and as a whole is protected by the copyrights of the non-government authors and must be released according to the terms of the original open source license.

### About ###

[Simple Features GeoJSON](http://ngageoint.github.io/simple-features-geojson-js/) is a Javascript library for converting between [Simple Feature](https://github.com/ngageoint/simple-features-js) Geometries and GeoJSON.


### Usage ###

View the latest [JS Docs](http://ngageoint.github.io/simple-features-geojson-js)


#### Browser Usage ####
```html
<script src="/path/to/simple-features-geojson-js/dist/sf-geojson.min.js"></script>
```
##### - Read
```javascript
const { FeatureConverter } = window.SimpleFeaturesGeoJSON;

//const geoJson = ...
const geometry = FeatureConverter.toSimpleFeaturesGeometry(geoJson);
const geometryType = geometry.getGeometryType();
```
##### - Write
```javascript
const { FeatureConverter } = window.SimpleFeaturesGeoJSON;
// const geometry = ...

const geoJson = FeatureConverter.toFeature(geometry);
```

#### Node Usage ####
[![NPM](https://img.shields.io/npm/v/@ngageoint/simple-features-geojson-js.svg)](https://www.npmjs.com/package/@ngageoint/simple-features-geojson-js)

Pull from [NPM](https://www.npmjs.com/package/@ngageoint/simple-features-geojson-js)

```install
npm install --save simple-features-geojson-js
```
##### - Read
```javascript
const { FeatureConverter } = require("@ngageoint/simple-features-geojson-js");

// const geoJson = ...
// const featureCollection = ...
const geometry = FeatureConverter.toSimpleFeaturesGeometry(geoJson);
const geometryType = geometry.geometryType;

const geometries = FeatureConverter.toSimpleFeaturesGeometryArray(featureCollection);

```
##### - Write
```javascript
const { FeatureConverter } = require("@ngageoint/simple-features-geojson-js");

// const geometry = ...
const text = FeatureConverter.toFeature(geometry);
```

### Build ###

![Build & Test](https://github.com/ngageoint/simple-features-geojson-js/actions/workflows/run-tests.yml/badge.svg)

Build this repository using Node.js:
   
    npm install
    npm run build
