import distance from '@turf/distance';
import destination from '@turf/destination';

/** @typedef {import('@turf/helpers').Units} Units */

/**
 * @param {GeoJSON.BBox} bbox
 * @param {number} gridWidth
 * @param {number} gridHeight
 * @param {Units} units
 * @returns {GeoJSON.Feature<GeoJSON.LineString>[]}
 */
export function getGrid(bbox, gridWidth, gridHeight, units) {
  // return rectangleGrid(bbox, gridWidth, gridHeight, { units });

  const earthCircumference = Math.ceil(distance([0, 0], [180, 0], { units }) * 2);
  const maxColumns = Math.floor(earthCircumference / gridWidth);
  /** @type {(from: GeoJSON.Position, to: GeoJSON.Position, options: { units: Units }) => number} */
  const fullDistance = (from, to, options) => {
    const dist = distance(from, to, options);
    if (Math.abs(to[0] - from[0]) >= 180) {
      return earthCircumference - dist;
    }
    return dist;
  };

  /** @type {GeoJSON.Feature<GeoJSON.LineString>[]} */
  const features = [];
  const west = bbox[0];
  const south = bbox[1];
  const east = bbox[2];
  const north = bbox[3];

  // calculate grid start point
  const deltaX = (west < 0 ? -1 : 1) * fullDistance([0, 0], [west, 0], { units });
  const deltaY = (south < 0 ? -1 : 1) * fullDistance([0, 0], [0, south], { units });
  const startDeltaX = Math.ceil(deltaX / gridWidth) * gridWidth;
  const startDeltaY = Math.ceil(deltaY / gridHeight) * gridHeight;
  /** @type {GeoJSON.Position} */
  const startPoint = [
    destination([0, 0], startDeltaX, 90, { units }).geometry.coordinates[0],
    destination([0, 0], startDeltaY, 0, { units }).geometry.coordinates[1]
  ];

  // calculate grid columns and rows count
  const width = fullDistance([west, 0], [east, 0], { units });
  const height = fullDistance([0, south], [0, north], { units });
  const columns = Math.min(Math.ceil(width / gridWidth), maxColumns);
  const rows = Math.ceil(height / gridHeight);
  // console.log(startPoint, columns, rows);

  /** @type {GeoJSON.Position} */
  let currentPoint;

  // meridians
  currentPoint = startPoint;
  for (let i = 0; i < columns; i++) {
    /** @type {GeoJSON.Position[]} */
    const coordinates = [
      [currentPoint[0], south],
      [currentPoint[0], north]
    ];
    /** @type {GeoJSON.Feature<GeoJSON.LineString>} */
    const feature = { type: 'Feature', geometry: { type: 'LineString', coordinates }, properties: {}};
    features.push(feature);

    currentPoint = [
      destination([currentPoint[0], 0], gridWidth, 90, { units }).geometry.coordinates[0],
      currentPoint[1]
    ];
  }

  // parallels
  currentPoint = startPoint;
  for (let i = 0; i < rows; i++) {
    /** @type {GeoJSON.Position[]} */
    const coordinates = [
      [west, currentPoint[1]],
      [east, currentPoint[1]]
    ];
    /** @type {GeoJSON.Feature<GeoJSON.LineString>} */
    const feature = { type: 'Feature', geometry: { type: 'LineString', coordinates }, properties: {}};
    features.push(feature);

    currentPoint = [
      currentPoint[0],
      destination([0, currentPoint[1]], gridHeight, 0, { units }).geometry.coordinates[1]
    ];
  }

  return features;
}

/**
 * @param {GeoJSON.Position} point
 * @param {number} gridWidth
 * @param {number} gridHeight
 * @param {Units} units
 * @returns {GeoJSON.BBox}
 */
export function getGridCell(point, gridWidth, gridHeight, units) {
  const earthCircumference = Math.ceil(distance([0, 0], [180, 0], { units }) * 2);
  /** @type {(from: GeoJSON.Position, to: GeoJSON.Position, options: { units: Units }) => number} */
  const fullDistance = (from, to, options) => {
    const dist = distance(from, to, options);
    if (Math.abs(to[0] - from[0]) >= 180) {
      return earthCircumference - dist;
    }
    return dist;
  };

  const deltaX = (point[0] < 0 ? -1 : 1) * fullDistance([0, 0], [point[0], 0], { units });
  const deltaY = (point[1] < 0 ? -1 : 1) * fullDistance([0, 0], [0, point[1]], { units });
  const minDeltaX = Math.floor(deltaX / gridWidth) * gridWidth;
  const minDeltaY = Math.floor(deltaY / gridHeight) * gridHeight;
  const maxDeltaX = Math.ceil(deltaX / gridWidth) * gridWidth;
  const maxDeltaY = Math.ceil(deltaY / gridHeight) * gridHeight;
  const bbox = /** @type {GeoJSON.BBox} */ ([
    destination([0, 0], minDeltaX, 90, { units }).geometry.coordinates[0],
    destination([0, 0], minDeltaY, 0, { units }).geometry.coordinates[1],
    destination([0, 0], maxDeltaX, 90, { units }).geometry.coordinates[0],
    destination([0, 0], maxDeltaY, 0, { units }).geometry.coordinates[1]
  ]);

  return bbox;
}