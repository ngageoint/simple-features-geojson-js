import { Point } from "@ngageoint/simple-features-js";
import { FeatureConverter } from "../lib/FeatureConverter";
import GeoJSONTestUtils from "./GeoJSONTestUtils";

describe('README Tests', function () {
	const GEOMETRY = new Point(1.0, 2.0, 3.0);
	const GeoJSON = {
		type: "Feature",
		properties: {

		},
		id: 0,
		geometry: {
			type: "Point",
			coordinates: [1.0, 2.0, 3.0]
		}
	};

	function testRead(geoJson) {
		// let geoJson = ...
		const geometry = FeatureConverter.toSimpleFeaturesGeometry(geoJson);
		const geometryType = geometry.geometryType;
		return geometry;
	}

	function testWrite(geometry) {
		// const geometry = ...
		const geoJson = FeatureConverter.toFeature(geometry);
		return geoJson;
	}

	it('test read', function () {
		const geometry = testRead(GeoJSON);
		geometry.equals(GEOMETRY).should.be.true;
	});

	it('test write', function () {
		const geoJson = testWrite(GEOMETRY);
		JSON.stringify(geoJson.geometry).should.be.equal(JSON.stringify(geoJson.geometry));
	});
});