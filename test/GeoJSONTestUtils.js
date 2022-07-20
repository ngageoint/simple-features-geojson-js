const should = require('chai').should();
const { Point, LineString, Polygon, MultiPoint, MultiLineString, GeometryCollection, GeometryType, MultiPolygon } = require('@ngageoint/simple-features-js');
const { FeatureConverter } = require('../lib/FeatureConverter')

const module = {
	exports: {}
};

global.compareEnvelopes = module.exports.compareEnvelopes = function(expected, actual) {
	if (expected == null) {
		should.not.exist(actual);
	} else {
		should.exist(actual);
		expected.minX.should.be.equal(actual.minX);
		expected.maxX.should.be.equal(actual.maxX);
		expected.minY.should.be.equal(actual.minY);
		expected.maxY.should.be.equal(actual.maxY);
		(expected.minZ === actual.minZ).should.be.true;
		(expected.maxZ === actual.maxZ).should.be.true;
		(expected.hasZ === actual.hasZ).should.be.true;
		// Do not compare M as it is lost in conversion
		// (expected.minM === actual.minM).should.be.true;
		// (expected.maxM === actual.maxM).should.be.true;
		// (expected.hasM === actual.hasM).should.be.true;
	}
}

/**
 * Compare two geometries and verify they are equal
 * @param expected
 * @param actual
 */
global.compareGeometries = module.exports.compareGeometries = function(expected, actual) {
	if (expected == null) {
		should.not.exist(actual);
	} else {
		should.exist(actual);

		const geometryType = expected.geometryType;
		switch (geometryType) {
			case GeometryType.POINT:
				comparePoint(actual, expected);
				break;
			case GeometryType.LINESTRING:
				compareLineString(expected, actual);
				break;
			case GeometryType.POLYGON:
				comparePolygon(expected, actual);
				break;
			case GeometryType.MULTIPOINT:
				compareMultiPoint(expected, actual);
				break;
			case GeometryType.MULTILINESTRING:
				compareMultiLineString(expected, actual);
				break;
			case GeometryType.MULTIPOLYGON:
				compareMultiPolygon(expected, actual);
				break;
			case GeometryType.GEOMETRYCOLLECTION:
			case GeometryType.MULTICURVE:
			case GeometryType.MULTISURFACE:
				compareGeometryCollection(expected, actual);
				break;
			default:
				throw new Error("Geometry Type not supported: " + geometryType);
		}
	}
}

/**
 * Compare to the base attributes of two geometries
 *
 * @param expected
 * @param actual
 */
global.compareBaseGeometryAttributes = module.exports.compareBaseGeometryAttributes = function(expected, actual) {
	expected.geometryType.should.be.equal(actual.geometryType);
	expected.hasZ.should.be.equal(actual.hasZ);
}

/**
 * Compare the two points for equality
 *
 * @param expected
 * @param actual
 */
global.comparePoint = module.exports.comparePoint = function(expected, actual) {
	compareBaseGeometryAttributes(expected, actual);
	(expected.x === actual.x).should.be.true;
	(expected.y === actual.y).should.be.true;
	(expected.z === actual.z).should.be.true;
}

/**
 * Compare the two line strings for equality
 *
 * @param expected
 * @param actual
 */
global.compareLineString = module.exports.compareLineString = function(expected, actual) {
	compareBaseGeometryAttributes(expected, actual);
	expected.numPoints().should.be.equal(actual.numPoints());
	for (let i = 0; i < expected.numPoints(); i++) {
		comparePoint(expected.getPoint(i), actual.getPoint(i));
	}
}

/**
 * Compare the two polygons for equality
 *
 * @param expected
 * @param actual
 */
global.comparePolygon = module.exports.comparePolygon = function(expected, actual) {
	compareBaseGeometryAttributes(expected, actual);
	expected.numRings().should.be.equal(actual.numRings());
	for (let i = 0; i < expected.numRings(); i++) {
		compareLineString(expected.getRing(i), actual.getRing(i));
	}
}

/**
 * Compare the two multi points for equality
 *
 * @param expected
 * @param actual
 */
global.compareMultiPoint = module.exports.compareMultiPoint = function(expected, actual) {
	compareBaseGeometryAttributes(expected, actual);
	expected.numPoints().should.be.equal(actual.numPoints());
	for (let i = 0; i < expected.numPoints(); i++) {
		comparePoint(expected.points[i], actual.points[i]);
	}
}

/**
 * Compare the two multi line strings for equality
 *
 * @param expected
 * @param actual
 */
global.compareMultiLineString = module.exports.compareMultiLineString = function(expected, actual) {
	compareBaseGeometryAttributes(expected, actual);
	expected.numLineStrings().should.be.equal(actual.numLineStrings());
	for (let i = 0; i < expected.numLineStrings(); i++) {
		compareLineString(expected.lineStrings[i], actual.lineStrings[i]);
	}
}

/**
 * Compare the two multi polygons for equality
 *
 * @param expected
 * @param actual
 */
global.compareMultiPolygon = module.exports.compareMultiPolygon = function(expected, actual) {
	compareBaseGeometryAttributes(expected, actual);
	expected.numPolygons().should.be.equal(actual.numPolygons());
	for (let i = 0; i < expected.numPolygons(); i++) {
		comparePolygon(expected.polygons[i], actual.polygons[i]);
	}
}

/**
 * Compare the two geometry collections for equality
 *
 * @param expected
 * @param actual
 */
global.compareGeometryCollection = module.exports.compareGeometryCollection = function(expected, actual) {
	compareBaseGeometryAttributes(expected, actual);
	expected.numGeometries().should.be.equal(actual.numGeometries());
	for (let i = 0; i < expected.numGeometries(); i++) {
		compareGeometries(expected.getGeometry(i), actual.getGeometry(i));
	}
}

/**
 * Create a random point
 *
 * @param hasZ
 * @param hasM
 * @return Point
 */
global.createPoint = module.exports.createPoint = function(hasZ, hasM) {
	let x = Math.random() * 180.0 * (Math.random() < .5 ? 1 : -1);
	let y = Math.random() * 90.0 * (Math.random() < .5 ? 1 : -1);
	let point = new Point(hasZ, hasM, x, y);
	if (hasZ) {
		point.z = Math.random() * 1000.0;
	}
	if (hasM) {
		point.m = Math.random() * 1000.0;
	}
	return point;
}

/**
 * Create a random line string
 *
 * @param hasZ
 * @param hasM
 * @param ring
 * @return LineString
 */
global.createLineString = module.exports.createLineString = function(hasZ, hasM, ring = false) {
	const lineString = new LineString(hasZ, hasM);
	const num = 2 + Math.round(Math.random() * 9);
	for (let i = 0; i < num; i++) {
		lineString.addPoint(createPoint(hasZ, hasM));
	}
	if (ring) {
		lineString.addPoint(lineString.points[0]);
	}
	return lineString;
}

/**
 * Create a random polygon
 * @param hasZ
 * @param hasM
 * @return Polygon
 */
global.createPolygon = module.exports.createPolygon = function(hasZ, hasM) {
	const polygon = new Polygon(hasZ, hasM);
	const num = 1 + Math.round(Math.random() * 5);
	for (let i = 0; i < num; i++) {
		polygon.addRing(createLineString(hasZ, hasM, true));
	}
	return polygon;
}

/**
 * Create a random multi point
 *
 * @param hasZ
 * @param hasM
 * @return MultiPoint
 */
global.createMultiPoint = module.exports.createMultiPoint = function(hasZ, hasM) {
	const multiPoint = new MultiPoint(hasZ, hasM);
	const num = 1 + Math.round(Math.random() * 5);
	for (let i = 0; i < num; i++) {
		multiPoint.addPoint(createPoint(hasZ, hasM));
	}
	return multiPoint;
}

/**
 * Create a random multi line string
 *
 * @param hasZ
 * @param hasM
 * @return MultiLineString
 */
global.createMultiLineString = module.exports.createMultiLineString = function(hasZ, hasM) {
	const multiLineString = new MultiLineString(hasZ, hasM);
	const num = 1 + Math.round(Math.random() * 5);
	for (let i = 0; i < num; i++) {
		multiLineString.addLineString(createLineString(hasZ, hasM));
	}
	return multiLineString;
}

/**
 * Create a random multi polygon
 *
 * @param hasZ
 * @param hasM
 * @return MultiPolygon
 */
global.createMultiPolygon = module.exports.createMultiPolygon = function(hasZ, hasM) {
	const multiPolygon = new MultiPolygon(hasZ, hasM);
	const num = 1 + Math.round(Math.random() * 5);
	for (let i = 0; i < num; i++) {
		multiPolygon.addPolygon(createPolygon(hasZ, hasM));
	}
	return multiPolygon;
}

/**
 * Create a random geometry collection
 *
 * @param hasZ
 * @param hasM
 * @return GeometryCollection
 */
global.createGeometryCollection = module.exports.createGeometryCollection = function(hasZ, hasM) {
	const geometryCollection = new GeometryCollection(hasZ, hasM);
	const num = 1 + Math.round(Math.random() * 5);
	for (let i = 0; i < num; i++) {
		let geometry = null;
		let randomGeometry = Math.floor(Math.random() * 6);
		switch (randomGeometry) {
			case 0:
				geometry = createPoint(hasZ, hasM);
				break;
			case 1:
				geometry = createLineString(hasZ, hasM);
				break;
			case 2:
				geometry = createPolygon(hasZ, hasM);
				break;
			case 3:
				geometry = createMultiPoint(hasZ, hasM);
				break;
			case 4:
				geometry = createMultiLineString(hasZ, hasM);
				break;
			case 5:
				geometry = createMultiPolygon(hasZ, hasM);
				break;
		}

		geometryCollection.addGeometry(geometry);
	}

	return geometryCollection;
}

/**
 * Creates a random point
 * @param minX
 * @param minY
 * @param xRange
 * @param yRange
 * @returns Point
 */
global.createRandomPoint = module.exports.createPoint = function(minX, minY, xRange, yRange) {
	const x = minX + (Math.random() * xRange);
	const y = minY + (Math.random() * yRange);
	return new Point(x, y);
}


/**
 * Randomly return true or false
 * @return true or false
 */
global.coinFlip = module.exports.coinFlip = function() {
	return Math.random() < 0.5;
}

global.convertFromFeatureCollection = module.exports.convertFromFeatureCollection = function (featureCollection) {
	return FeatureConverter.toSimpleFeaturesGeometryArray(featureCollection);
}

global.convertFromGeoJSONGeometry = module.exports.convertFromGeoJSONGeometry = function(geoJSON) {
	return FeatureConverter.toSimpleFeaturesGeometryFromGeometryObject(geoJSON);
}

global.convertFromGeoJSON = module.exports.convertFromGeoJSON = function(geoJSON) {
	return FeatureConverter.toSimpleFeaturesGeometry(geoJSON);
}
global.convertToGeoJSON = module.exports.convertToGeoJSON = function(geometry) {
	return FeatureConverter.toFeature(geometry);
}
