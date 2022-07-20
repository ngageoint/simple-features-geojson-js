import {
	Geometry,
	GeometryCollection,
	GeometryType,
	LineString,
	MultiLineString,
	MultiPoint,
	MultiPolygon,
	Point,
	Polygon,
	SFException,
} from "@ngageoint/simple-features-js";
import {
	Feature,
	FeatureCollection,
	Geometry as gjGeometry,
	Point as gjPoint,
	LineString as gjLineString,
	Polygon as gjPolygon,
	MultiPoint as gjMultiPoint,
	MultiLineString as gjMultiLineString,
	MultiPolygon as gjMultiPolygon,
	GeometryCollection as gjGeometryCollection,
	Position, GeometryObject
} from "geojson";


/**
 * SimpleFeatures to GeoJSON Geometry Converter
 */
export class FeatureConverter {

	/**
	 * Converts a GeoJSON Feature to a SimpleFeatures Geometry
	 * @param geoJson
	 */
	public static toSimpleFeaturesGeometryFromGeometryObject (geoJson: GeometryObject): Geometry {
		return FeatureConverter.convertFeatureGeometry(geoJson);
	}
	/**
	 * Converts a GeoJSON Feature to a SimpleFeatures Geometry
	 * @param geoJson
	 */
	public static toSimpleFeaturesGeometry (geoJson: Feature): Geometry {
		return FeatureConverter.convertFeatureGeometry(geoJson.geometry);
	}

	/**
	 * Converts a FeatureCollection into an array of
	 * @param geoJson
	 * @return Array<Geometry>
	 */
	public static toSimpleFeaturesGeometryArray (geoJson: FeatureCollection): Array<Geometry> {
		const geometries: Array<Geometry> = [];
		geoJson.features.forEach(feature => {
			geometries.push(FeatureConverter.toSimpleFeaturesGeometry(feature));
		})
		return geometries;
	}

	/**
	 * Converts a SimpleFeatures Geometry into GeoJSON Geometry
	 * @param geometry
	 */
	public static toFeatureGeometry (geometry: Geometry): gjGeometry {
		let geoJson: gjGeometry = null;

		switch (geometry.geometryType) {
			case GeometryType.POINT:
				geoJson = FeatureConverter.convertPoint(geometry as Point);
				break;
			case GeometryType.LINESTRING:
				geoJson = FeatureConverter.convertLineString(geometry as LineString);
				break;
			case GeometryType.POLYGON:
				geoJson = FeatureConverter.convertPolygon(geometry as Polygon);
				break;
			case GeometryType.MULTIPOINT:
				geoJson = FeatureConverter.convertMultiPoint(geometry as MultiPoint);
				break;
			case GeometryType.MULTILINESTRING:
				geoJson = FeatureConverter.convertMultiLineString(geometry as MultiLineString);
				break;
			case GeometryType.MULTIPOLYGON:
				geoJson = FeatureConverter.convertMultiPolygon(geometry as MultiPolygon);
				break;
			case GeometryType.GEOMETRYCOLLECTION:
				geoJson = FeatureConverter.convertGeometryCollection(geometry as GeometryCollection<Geometry>);
				break;
			default:
				throw new SFException("Unsupported Geometry type " + GeometryType.nameFromType(geometry.geometryType));
				break;

		}

		return geoJson;
	}

	/**
	 * Converts a SimpleFeature Geometry into a GeoJSON Feature
	 * @param geometry
	 */
	public static toFeature (geometry: Geometry): Feature {
		const feature: Feature = {
			type: "Feature",
			properties: {},
			geometry: FeatureConverter.toFeatureGeometry(geometry)
		};
		return feature;
	}

	/**
	 * Converts a SimpleFeature Geometry into a GeoJSON Feature Collection
	 * @param geometry
	 */
	public static toFeatureCollection (geometry: Geometry): FeatureCollection {
		const featureCollection: FeatureCollection = {
			type: "FeatureCollection",
			features: [FeatureConverter.toFeature(geometry)]
		};

		return featureCollection;
	}

	/**
	 * Converts a GeoJSON geometry into a SimpleFeatures Geometry
	 * @param geoJsonGeometry
	 * @private
	 */
	private static convertFeatureGeometry (geoJsonGeometry: gjGeometry): Geometry {
		let geometry: Geometry = null;
		switch (geoJsonGeometry.type) {
			case "Point":
				geometry = FeatureConverter.convertFeaturePoint(geoJsonGeometry as gjPoint);
				break;
			case "LineString":
				geometry = FeatureConverter.convertFeatureLineString(geoJsonGeometry as gjLineString);
				break;
			case "Polygon":
				geometry = FeatureConverter.convertFeaturePolygon(geoJsonGeometry as gjPolygon);
				break;
			case "MultiPoint":
				geometry = FeatureConverter.convertFeatureMultiPoint(geoJsonGeometry as gjMultiPoint);
				break;
			case "MultiLineString":
				geometry = FeatureConverter.convertFeatureMultiLineString(geoJsonGeometry as gjMultiLineString);
				break;
			case "MultiPolygon":
				geometry = FeatureConverter.convertFeatureMultiPolygon(geoJsonGeometry as gjMultiPolygon);
				break;
			case "GeometryCollection":
				geometry = FeatureConverter.convertFeatureGeometryCollection(geoJsonGeometry as gjGeometryCollection);
				break;
		}
		return geometry;
	}

	/**
	 * Converts a GeoJSON Position into a Simple Features Point
	 * @param position
	 * @private
	 */
	private static convertFeaturePosition (position: Position): Point {
		let point: Point = null;

		if (position != null && position.length != null && position.length >= 2) {
			point = new Point(position[0], position[1]);
			if (position.length >= 3) {
				point.z = position[2];
				point.hasZ = true;
			}
		}

		return point;
	}

	/**
	 * Converts a GeoJSON Point feature into a Simple Features Point
	 * @param geoJson
	 * @private
	 */
	private static convertFeaturePoint (geoJson: gjPoint): Point {
		let point: Point = null;

		if (geoJson.coordinates != null) {
			point = FeatureConverter.convertFeaturePosition(geoJson.coordinates);
		}

		return point;
	}

	/**
	 * Converts a GeoJSON Position into a Simple Features Point
	 * @param positions
	 * @private
	 */
	private static convertFeaturePositionArray (positions: Array<Position>): Array<Point> {
		let points: Array<Point> = [];

		if (positions != null && positions.length != null) {
			positions.forEach(position => {
				points.push(FeatureConverter.convertFeaturePosition(position));
			})
		}

		return points;
	}

	/**
	 * Converts a GeoJSON Position into a Simple Features Point
	 * @param positions
	 * @private
	 */
	private static convertArrayOfFeaturePositionArray (positions: Array<Array<Position>>): Array<LineString> {
		let lineStrings: Array<LineString> = [];

		if (positions != null && positions.length != null) {
			positions.forEach(positions => {
				lineStrings.push(new LineString(FeatureConverter.convertFeaturePositionArray(positions)));
			})
		}

		return lineStrings;
	}

	/**
	 * Converts a GeoJSON LineString into a Simple Features LineString
	 * @param geoJson
	 * @private
	 */
	private static convertFeatureLineString (geoJson: gjLineString): LineString {
		let lineString: LineString = null;

		if (geoJson.coordinates != null) {
			lineString = new LineString(FeatureConverter.convertFeaturePositionArray(geoJson.coordinates));
		}

		return lineString;
	}

	/**
	 * Converts a GeoJSON Polygon into a Simple Features Polygon
	 * @param geoJson
	 * @private
	 */
	private static convertFeaturePolygon (geoJson: gjPolygon): Polygon {
		let polygon: Polygon = null;

		if (geoJson.coordinates != null) {
			polygon = new Polygon();
			polygon.rings = FeatureConverter.convertArrayOfFeaturePositionArray(geoJson.coordinates);
		}

		return polygon;
	}

	/**
	 * Converts a GeoJSON MultiPoint into a Simple Features MultiPoint
	 * @param geoJson
	 * @private
	 */
	private static convertFeatureMultiPoint (geoJson: gjMultiPoint): MultiPoint {
		let multiPoint: MultiPoint = null;

		if (geoJson.coordinates != null) {
			multiPoint = new MultiPoint();
			multiPoint.points = FeatureConverter.convertFeaturePositionArray(geoJson.coordinates);
		}

		return multiPoint;
	}

	/**
	 * Converts a GeoJSON MultiLineString into a Simple Features MultiLineString
	 * @param geoJson
	 * @private
	 */
	private static convertFeatureMultiLineString (geoJson: gjMultiLineString): MultiLineString {
		let multiLineString: MultiLineString = null;

		if (geoJson.coordinates != null) {
			multiLineString = new MultiLineString();
			multiLineString.lineStrings = FeatureConverter.convertArrayOfFeaturePositionArray(geoJson.coordinates);
		}

		return multiLineString;
	}

	/**
	 * Converts a GeoJSON MultiPolygon into a Simple Features MultiPolygon
	 * @param geoJson
	 * @private
	 */
	private static convertFeatureMultiPolygon (geoJson: gjMultiPolygon): MultiPolygon {
		let multiPolygon: MultiPolygon = null;

		if (geoJson.coordinates != null) {
			multiPolygon = new MultiPolygon();
			geoJson.coordinates.forEach(polygonCoordinates => {
				multiPolygon.addPolygon(new Polygon(FeatureConverter.convertArrayOfFeaturePositionArray(polygonCoordinates)));
			})
		}

		return multiPolygon;
	}

	/**
	 * Converts a GeoJSON GeometryCollection into a Simple Features GeometryCollection
	 * @param geoJson
	 * @private
	 */
	private static convertFeatureGeometryCollection (geoJson: gjGeometryCollection): GeometryCollection<any> {
		let geometryCollection: GeometryCollection<any> = null;

		if (geoJson.geometries != null) {
			geometryCollection = new GeometryCollection<Geometry>();
			geoJson.geometries.forEach(geometry => {
				geometryCollection.addGeometry(FeatureConverter.convertFeatureGeometry(geometry));
			})
		}

		return geometryCollection;
	}

	/**
	 * Converts a Point into a position
	 * @param geometry
	 */
	private static convertPosition (geometry: Point): Position {
		const coordinate: Position = [];
		if (geometry.x != null && geometry.y != null) {
			coordinate.push(geometry.x);
			coordinate.push(geometry.y);
			if (geometry.hasZ) {
				coordinate.push(geometry.z);
			}
		}
		return coordinate;
	}

	/**
	 * Convert a Point
	 * @return point
	 */
	private static convertPoint(geometry: Point): gjPoint {
		let point: gjPoint = {
			type: "Point",
			coordinates: FeatureConverter.convertPosition(geometry)
		};
		return point;
	}

	/**
	 * Converts a line string into an array of positions
	 * @param geometry
	 */
	private static convertPositionArray(geometry: LineString): Array<Position> {
		const positions: Array<Position> = [];

		geometry.points.forEach(point => {
			positions.push(FeatureConverter.convertPosition(point));
		});

		return positions;
	}

	/**
	 * Convert a Line String
	 * @return line string
	 */
	private static convertLineString(geometry: LineString): gjLineString {
		let lineString: gjLineString = {
			type: "LineString",
			coordinates: FeatureConverter.convertPositionArray(geometry)
		};
		return lineString;
	}

	/**
	 * Converts an array of line strings into an array of array of positions
	 * @param lineStrings
	 */
	private static convertPositionRings(lineStrings: Array<LineString>): Array<Array<Position>> {
		const positionRings: Array<Array<Position>> = [];

		lineStrings.forEach(lineString => {
			positionRings.push(FeatureConverter.convertPositionArray(lineString));
		});

		return positionRings;
	}

	/**
	 * Convert a Polygon
	 * @return polygon
	 */
	private static convertPolygon(geometry: Polygon): gjPolygon {
		let polygon: gjPolygon = {
			type: "Polygon",
			coordinates: FeatureConverter.convertPositionRings(geometry.rings)
		};
		return polygon;
	}

	/**
	 * Convert a Multi Point
	 * @return multi point
	 */
	private static convertMultiPoint(geometry: MultiPoint): gjMultiPoint {
		let multiPoint: gjMultiPoint = {
			type: "MultiPoint",
			coordinates: []
		};
		geometry.points.forEach(point => {
			multiPoint.coordinates.push(FeatureConverter.convertPosition(point));
		})
		return multiPoint;
	}

	/**
	 * Convert a Multi Line String
	 * @return multi line string
	 */
	private static convertMultiLineString(geometry: MultiLineString): gjMultiLineString {
		let multiLineString: gjMultiLineString = {
			type: "MultiLineString",
			coordinates: []
		};
		geometry.lineStrings.forEach(lineString => {
			multiLineString.coordinates.push(FeatureConverter.convertPositionArray(lineString));
		})
		return multiLineString;
	}

	/**
	 * Convert a Multi Polygon
	 * @return multi polygon
	 */
	private static convertMultiPolygon(geometry: MultiPolygon): gjMultiPolygon {
		let multiPolygon: gjMultiPolygon = {
			type: "MultiPolygon",
			coordinates: []
		};
		geometry.polygons.forEach(polygon => {
			multiPolygon.coordinates.push(FeatureConverter.convertPositionRings(polygon.rings));
		})
		return multiPolygon;
	}
	
	/**
	 * Read a Geometry Collection
	 * @return geometry collection
	 */
	private static convertGeometryCollection(geometry: GeometryCollection<Geometry>): gjGeometryCollection<gjGeometry> {
		let multiLineString: gjGeometryCollection<gjGeometry> = {
			type: "GeometryCollection",
			geometries: []
		};
		geometry.geometries.forEach(geometry => {
			multiLineString.geometries.push(FeatureConverter.toFeatureGeometry(geometry));
		})
		return multiLineString;
	}
}
