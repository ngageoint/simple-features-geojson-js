import { LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon } from '@ngageoint/simple-features-js'

const should = require('chai').should();
import GeoJSONTestUtils from './GeoJSONTestUtils';

const GEOMETRIES_PER_TEST = 10;

function geometryTesterJSONGeometry(geoJSON, expected) {
  const geometryFromGeoJSON = global.convertFromGeoJSONGeometry(geoJSON, true);
  geometryTester(geometryFromGeoJSON, expected);
}

/**
 * Test the conversion of a geometry to and from GeoJSON
 * @param geometry geometry
 * @param compareGeometry compare geometry
 * @param validateZM compare geometry
 */
function geometryTester(geometry, compareGeometry, validateZM = true) {
  if (compareGeometry == null) {
    compareGeometry = geometry;
  }

  // Write the geometry to text
  const geoJSON = global.convertToGeoJSON(geometry);

  // Test the geometry read from text
  const geometryFromGeoJSON = global.convertFromGeoJSON(geoJSON, validateZM);

  global.compareGeometries(compareGeometry, geometryFromGeoJSON);

  const envelope = compareGeometry.getEnvelope();
  const envelopeFromText = geometryFromGeoJSON.getEnvelope();

  global.compareEnvelopes(envelope, envelopeFromText);
}

describe('GeoJSON Tests', function () {
  it('test point', function () {
    for (let i = 0; i < GEOMETRIES_PER_TEST; i++) {
      // Create and test a point
      const point = global.createPoint(global.coinFlip(), global.coinFlip());
      geometryTester(point);
    }
  });

  it('test line string', function () {
    for (let i = 0; i < GEOMETRIES_PER_TEST; i++) {
      // Create and test a line string
      const lineString = global.createLineString(global.coinFlip(), global.coinFlip());
      geometryTester(lineString);
    }
  });

  it('test polygon', function () {

    for (let i = 0; i < GEOMETRIES_PER_TEST; i++) {
      // Create and test a polygon
      const polygon = global.createPolygon(global.coinFlip(), global.coinFlip());
      geometryTester(polygon);
    }

  });

  it('test multi point', function () {

    for (let i = 0; i < GEOMETRIES_PER_TEST; i++) {
      // Create and test a multi point
      const multiPoint = global.createMultiPoint(global.coinFlip(), global.coinFlip());
      geometryTester(multiPoint);
    }

  });

  it('test multi line string', function () {

    for (let i = 0; i < GEOMETRIES_PER_TEST; i++) {
      // Create and test a multi line string
      const multiLineString = global.createMultiLineString(global.coinFlip(), global.coinFlip());
      geometryTester(multiLineString);
    }

  });

  it('test multi polygon', function () {
    for (let i = 0; i < GEOMETRIES_PER_TEST; i++) {
      // Create and test a multi polygon
      const multiPolygon = global.createMultiPolygon(global.coinFlip(), global.coinFlip());
      geometryTester(multiPolygon);
    }
  });

  it('test geometry collection', function () {
    for (let i = 0; i < GEOMETRIES_PER_TEST; i++) {
      // Create and test a geometry collection
      const geometryCollection = global.createGeometryCollection(global.coinFlip(), global.coinFlip());
      geometryTester(geometryCollection);
    }

  });

  it('test feature collection', function () {
    for (let i = 0; i < GEOMETRIES_PER_TEST; i++) {
      // Create and test a geometry collection
      const featureCollection = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"GeometryCollection","geometries":[{"type":"Point","coordinates":[61.34765625,48.63290858589535]},{"type":"LineString","coordinates":[[100.0,10.0],[101.0,1.0]]}]},"properties":{}},{"type":"Feature","geometry":{"type":"Point","coordinates":[50.1,60.9]},"properties":{}}]};
      const features = global.convertFromFeatureCollection(featureCollection);
      features.forEach(f => {
        geometryTester(f);
      })
    }

  });

  it('test geometries', function () {
    const GEOMETRYCOLLECTION = {"type":"GeometryCollection","geometries":[{"type":"Point","coordinates":[61.34765625,48.63290858589535]},{"type":"LineString","coordinates":[[100.0,10.0],[101.0,1.0]]}]};
    const GEOMETRYCOLLECTION_WITH_ALT = {"type":"GeometryCollection","geometries":[{"type":"Point","coordinates":[61.34765625,48.63290858589535, 12.7843]},{"type":"LineString","coordinates":[[100.0,10.0,5.0],[101.0,1.0,10.0]]}]};
    const MULTIPOLYGON = {"type":"MultiPolygon","coordinates":[[[[0, 0],[10,0],[5, 10]], [[1, 1],[9, 1],[5, 9]]], [[[10, 0],[20,0],[15, 10]], [[11, 1],[19, 1],[15, 9]]]]};
    const multiPolygon = new MultiPolygon();
    const polygon1 = new Polygon();
    const ring1 = new LineString();
    ring1.addPoint(new Point(0, 0));
    ring1.addPoint(new Point(10, 0));
    ring1.addPoint(new Point(5, 10));
    const hole1 = new LineString();
    hole1.addPoint(new Point(1, 1));
    hole1.addPoint(new Point(9, 1));
    hole1.addPoint(new Point(5, 9));
    polygon1.addRing(ring1);
    polygon1.addRing(hole1);
    multiPolygon.addPolygon(polygon1);
    const polygon2 = new Polygon();
    const ring2 = new LineString();
    ring2.addPoint(new Point( 10, 0));
    ring2.addPoint(new Point(20, 0));
    ring2.addPoint(new Point(15, 10));
    const hole2 = new LineString();
    hole2.addPoint(new Point(11, 1));
    hole2.addPoint(new Point(19, 1));
    hole2.addPoint(new Point(15, 9));
    polygon2.addRing(ring2);
    polygon2.addRing(hole2);
    multiPolygon.addPolygon(polygon2);
    const MULTILINESTRING = {"type":"MultiLineString","coordinates":[[[0, 0],[10,0],[5, 10]], [[1, 1],[9, 1],[5, 9]]]};
    const multiLineString = new MultiLineString();
    const lineString1 = new LineString();
    lineString1.addPoint(new Point(0, 0));
    lineString1.addPoint(new Point(10, 0));
    lineString1.addPoint(new Point(5, 10));
    const lineString2 = new LineString();
    lineString2.addPoint(new Point(1, 1));
    lineString2.addPoint(new Point(9, 1));
    lineString2.addPoint(new Point(5, 9));
    multiLineString.addLineString(lineString1);
    multiLineString.addLineString(lineString2);

    const MULTIPOINT = {"type":"MultiPoint","coordinates":[[0, 0],[10,0],[5, 10]]};
    const multiPoint = new MultiPoint();
    multiPoint.addPoint(new Point(0, 0));
    multiPoint.addPoint(new Point(10, 0));
    multiPoint.addPoint(new Point(5, 10));


    const POLYGON = {"type":"Polygon","coordinates":[[[0, 0],[10,0],[5, 10]], [[1, 1],[9, 1],[5, 9]]]};
    const polygon = new Polygon();
    const ring = new LineString();
    ring.addPoint(new Point(0, 0));
    ring.addPoint(new Point(10, 0));
    ring.addPoint(new Point(5, 10));
    const hole = new LineString();
    hole.addPoint(new Point(1, 1));
    hole.addPoint(new Point(9, 1));
    hole.addPoint(new Point(5, 9));
    polygon.addRing(ring);
    polygon.addRing(hole);

    const LINESTRING = {"type":"LineString","coordinates":[[100.0,10.0],[101.0,1.0]]};
    const lineString = new LineString();
    lineString.addPoint(new Point(100.0, 10.0));
    lineString.addPoint(new Point(101.0, 1.0));

    const POINT = {"type":"Point","coordinates":[100.0,10.0]};
    const point = new Point(100.0, 10.0);

    geometryTesterJSONGeometry(GEOMETRYCOLLECTION);
    geometryTesterJSONGeometry(GEOMETRYCOLLECTION_WITH_ALT);
    geometryTesterJSONGeometry(MULTIPOLYGON, multiPolygon);
    geometryTesterJSONGeometry(MULTILINESTRING, multiLineString);
    geometryTesterJSONGeometry(MULTIPOINT, multiPoint);
    geometryTesterJSONGeometry(POLYGON, polygon);
    geometryTesterJSONGeometry(LINESTRING, lineString);
    geometryTesterJSONGeometry(POINT, point);
  });
});
