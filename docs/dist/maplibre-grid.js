(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MaplibreGrid = {}));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * @module helpers
   */

  /**
   * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
   *
   * @memberof helpers
   * @type {number}
   */
  var earthRadius = 6371008.8;
  /**
   * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
   *
   * @memberof helpers
   * @type {Object}
   */

  var factors = {
    centimeters: earthRadius * 100,
    centimetres: earthRadius * 100,
    degrees: earthRadius / 111325,
    feet: earthRadius * 3.28084,
    inches: earthRadius * 39.37,
    kilometers: earthRadius / 1000,
    kilometres: earthRadius / 1000,
    meters: earthRadius,
    metres: earthRadius,
    miles: earthRadius / 1609.344,
    millimeters: earthRadius * 1000,
    millimetres: earthRadius * 1000,
    nauticalmiles: earthRadius / 1852,
    radians: 1,
    yards: earthRadius / 1.0936
  };
  /**
   * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
   *
   * @name feature
   * @param {Geometry} geometry input geometry
   * @param {Object} [properties={}] an Object of key-value pairs to add as properties
   * @param {Object} [options={}] Optional Parameters
   * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
   * @param {string|number} [options.id] Identifier associated with the Feature
   * @returns {Feature} a GeoJSON Feature
   * @example
   * var geometry = {
   *   "type": "Point",
   *   "coordinates": [110, 50]
   * };
   *
   * var feature = turf.feature(geometry);
   *
   * //=feature
   */

  function feature(geom, properties, options) {
    if (options === void 0) {
      options = {};
    }

    var feat = {
      type: "Feature"
    };

    if (options.id === 0 || options.id) {
      feat.id = options.id;
    }

    if (options.bbox) {
      feat.bbox = options.bbox;
    }

    feat.properties = properties || {};
    feat.geometry = geom;
    return feat;
  }
  /**
   * Creates a {@link Point} {@link Feature} from a Position.
   *
   * @name point
   * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
   * @param {Object} [properties={}] an Object of key-value pairs to add as properties
   * @param {Object} [options={}] Optional Parameters
   * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
   * @param {string|number} [options.id] Identifier associated with the Feature
   * @returns {Feature<Point>} a Point feature
   * @example
   * var point = turf.point([-75.343, 39.984]);
   *
   * //=point
   */

  function point(coordinates, properties, options) {
    if (options === void 0) {
      options = {};
    }

    if (!coordinates) {
      throw new Error("coordinates is required");
    }

    if (!Array.isArray(coordinates)) {
      throw new Error("coordinates must be an Array");
    }

    if (coordinates.length < 2) {
      throw new Error("coordinates must be at least 2 numbers long");
    }

    if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) {
      throw new Error("coordinates must contain numbers");
    }

    var geom = {
      type: "Point",
      coordinates: coordinates
    };
    return feature(geom, properties, options);
  }
  /**
   * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
   * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
   *
   * @name radiansToLength
   * @param {number} radians in radians across the sphere
   * @param {string} [units="kilometers"] can be degrees, radians, miles, inches, yards, metres,
   * meters, kilometres, kilometers.
   * @returns {number} distance
   */

  function radiansToLength(radians, units) {
    if (units === void 0) {
      units = "kilometers";
    }

    var factor = factors[units];

    if (!factor) {
      throw new Error(units + " units is invalid");
    }

    return radians * factor;
  }
  /**
   * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
   * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
   *
   * @name lengthToRadians
   * @param {number} distance in real units
   * @param {string} [units="kilometers"] can be degrees, radians, miles, inches, yards, metres,
   * meters, kilometres, kilometers.
   * @returns {number} radians
   */

  function lengthToRadians(distance, units) {
    if (units === void 0) {
      units = "kilometers";
    }

    var factor = factors[units];

    if (!factor) {
      throw new Error(units + " units is invalid");
    }

    return distance / factor;
  }
  /**
   * Converts an angle in radians to degrees
   *
   * @name radiansToDegrees
   * @param {number} radians angle in radians
   * @returns {number} degrees between 0 and 360 degrees
   */

  function radiansToDegrees(radians) {
    var degrees = radians % (2 * Math.PI);
    return degrees * 180 / Math.PI;
  }
  /**
   * Converts an angle in degrees to radians
   *
   * @name degreesToRadians
   * @param {number} degrees angle between 0 and 360 degrees
   * @returns {number} angle in radians
   */

  function degreesToRadians(degrees) {
    var radians = degrees % 360;
    return radians * Math.PI / 180;
  }
  /**
   * isNumber
   *
   * @param {*} num Number to validate
   * @returns {boolean} true/false
   * @example
   * turf.isNumber(123)
   * //=true
   * turf.isNumber('foo')
   * //=false
   */

  function isNumber(num) {
    return !isNaN(num) && num !== null && !Array.isArray(num);
  }

  /**
   * Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.
   *
   * @name getCoord
   * @param {Array<number>|Geometry<Point>|Feature<Point>} coord GeoJSON Point or an Array of numbers
   * @returns {Array<number>} coordinates
   * @example
   * var pt = turf.point([10, 10]);
   *
   * var coord = turf.getCoord(pt);
   * //= [10, 10]
   */

  function getCoord(coord) {
    if (!coord) {
      throw new Error("coord is required");
    }

    if (!Array.isArray(coord)) {
      if (coord.type === "Feature" && coord.geometry !== null && coord.geometry.type === "Point") {
        return coord.geometry.coordinates;
      }

      if (coord.type === "Point") {
        return coord.coordinates;
      }
    }

    if (Array.isArray(coord) && coord.length >= 2 && !Array.isArray(coord[0]) && !Array.isArray(coord[1])) {
      return coord;
    }

    throw new Error("coord must be GeoJSON Point or an Array of numbers");
  }

  //http://www.movable-type.co.uk/scripts/latlong.html

  /**
   * Calculates the distance between two {@link Point|points} in degrees, radians, miles, or kilometers.
   * This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
   *
   * @name distance
   * @param {Coord} from origin point
   * @param {Coord} to destination point
   * @param {Object} [options={}] Optional parameters
   * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
   * @returns {number} distance between the two points
   * @example
   * var from = turf.point([-75.343, 39.984]);
   * var to = turf.point([-75.534, 39.123]);
   * var options = {units: 'miles'};
   *
   * var distance = turf.distance(from, to, options);
   *
   * //addToMap
   * var addToMap = [from, to];
   * from.properties.distance = distance;
   * to.properties.distance = distance;
   */

  function distance(from, to, options) {
    if (options === void 0) {
      options = {};
    }

    var coordinates1 = getCoord(from);
    var coordinates2 = getCoord(to);
    var dLat = degreesToRadians(coordinates2[1] - coordinates1[1]);
    var dLon = degreesToRadians(coordinates2[0] - coordinates1[0]);
    var lat1 = degreesToRadians(coordinates1[1]);
    var lat2 = degreesToRadians(coordinates2[1]);
    var a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    return radiansToLength(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), options.units);
  }

  // http://en.wikipedia.org/wiki/Haversine_formula
  /**
   * Takes a {@link Point} and calculates the location of a destination point given a distance in
   * degrees, radians, miles, or kilometers; and bearing in degrees.
   * This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
   *
   * @name destination
   * @param {Coord} origin starting point
   * @param {number} distance distance from the origin point
   * @param {number} bearing ranging from -180 to 180
   * @param {Object} [options={}] Optional parameters
   * @param {string} [options.units='kilometers'] miles, kilometers, degrees, or radians
   * @param {Object} [options.properties={}] Translate properties to Point
   * @returns {Feature<Point>} destination point
   * @example
   * var point = turf.point([-75.343, 39.984]);
   * var distance = 50;
   * var bearing = 90;
   * var options = {units: 'miles'};
   *
   * var destination = turf.destination(point, distance, bearing, options);
   *
   * //addToMap
   * var addToMap = [point, destination]
   * destination.properties['marker-color'] = '#f00';
   * point.properties['marker-color'] = '#0f0';
   */

  function destination(origin, distance, bearing, options) {
    if (options === void 0) {
      options = {};
    } // Handle input


    var coordinates1 = getCoord(origin);
    var longitude1 = degreesToRadians(coordinates1[0]);
    var latitude1 = degreesToRadians(coordinates1[1]);
    var bearingRad = degreesToRadians(bearing);
    var radians = lengthToRadians(distance, options.units); // Main

    var latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(radians) + Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearingRad));
    var longitude2 = longitude1 + Math.atan2(Math.sin(bearingRad) * Math.sin(radians) * Math.cos(latitude1), Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2));
    var lng = radiansToDegrees(longitude2);
    var lat = radiansToDegrees(latitude2);
    return point([lng, lat], options.properties);
  }

  /** @typedef {import('@turf/helpers').Units} Units */

  /**
   * @param {GeoJSON.BBox} bbox
   * @param {number} gridWidth
   * @param {number} gridHeight
   * @param {Units} units
   * @returns {GeoJSON.Feature<GeoJSON.LineString>[]}
   */

  function getGrid(bbox, gridWidth, gridHeight, units) {
    // return rectangleGrid(bbox, gridWidth, gridHeight, { units });
    var earthCircumference = Math.ceil(distance([0, 0], [180, 0], {
      units: units
    }) * 2);
    var maxColumns = Math.floor(earthCircumference / gridWidth);
    /** @type {(from: GeoJSON.Position, to: GeoJSON.Position, options: { units: Units }) => number} */

    var fullDistance = function fullDistance(from, to, options) {
      var dist = distance(from, to, options);

      if (Math.abs(to[0] - from[0]) >= 180) {
        return earthCircumference - dist;
      }

      return dist;
    };
    /** @type {GeoJSON.Feature<GeoJSON.LineString>[]} */


    var features = [];
    var west = bbox[0];
    var south = bbox[1];
    var east = bbox[2];
    var north = bbox[3]; // calculate grid start point

    var deltaX = (west < 0 ? -1 : 1) * fullDistance([0, 0], [west, 0], {
      units: units
    });
    var deltaY = (south < 0 ? -1 : 1) * fullDistance([0, 0], [0, south], {
      units: units
    });
    var startDeltaX = Math.ceil(deltaX / gridWidth) * gridWidth;
    var startDeltaY = Math.ceil(deltaY / gridHeight) * gridHeight;
    /** @type {GeoJSON.Position} */

    var startPoint = [destination([0, 0], startDeltaX, 90, {
      units: units
    }).geometry.coordinates[0], destination([0, 0], startDeltaY, 0, {
      units: units
    }).geometry.coordinates[1]]; // calculate grid columns and rows count

    var width = fullDistance([west, 0], [east, 0], {
      units: units
    });
    var height = fullDistance([0, south], [0, north], {
      units: units
    });
    var columns = Math.min(Math.ceil(width / gridWidth), maxColumns);
    var rows = Math.ceil(height / gridHeight); // console.log(startPoint, columns, rows);

    /** @type {GeoJSON.Position} */

    var currentPoint; // meridians

    currentPoint = startPoint;

    for (var i = 0; i < columns; i++) {
      /** @type {GeoJSON.Position[]} */
      var coordinates = [[currentPoint[0], south], [currentPoint[0], north]];
      /** @type {GeoJSON.Feature<GeoJSON.LineString>} */

      var feature = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        },
        properties: {}
      };
      features.push(feature);
      currentPoint = [destination([currentPoint[0], 0], gridWidth, 90, {
        units: units
      }).geometry.coordinates[0], currentPoint[1]];
    } // parallels


    currentPoint = startPoint;

    for (var _i = 0; _i < rows; _i++) {
      /** @type {GeoJSON.Position[]} */
      var _coordinates = [[west, currentPoint[1]], [east, currentPoint[1]]];
      /** @type {GeoJSON.Feature<GeoJSON.LineString>} */

      var _feature = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: _coordinates
        },
        properties: {}
      };
      features.push(_feature);
      currentPoint = [currentPoint[0], destination([0, currentPoint[1]], gridHeight, 0, {
        units: units
      }).geometry.coordinates[1]];
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

  function getGridCell(point, gridWidth, gridHeight, units) {
    var earthCircumference = Math.ceil(distance([0, 0], [180, 0], {
      units: units
    }) * 2);
    /** @type {(from: GeoJSON.Position, to: GeoJSON.Position, options: { units: Units }) => number} */

    var fullDistance = function fullDistance(from, to, options) {
      var dist = distance(from, to, options);

      if (Math.abs(to[0] - from[0]) >= 180) {
        return earthCircumference - dist;
      }

      return dist;
    };

    var deltaX = (point[0] < 0 ? -1 : 1) * fullDistance([0, 0], [point[0], 0], {
      units: units
    });
    var deltaY = (point[1] < 0 ? -1 : 1) * fullDistance([0, 0], [0, point[1]], {
      units: units
    });
    var minDeltaX = Math.floor(deltaX / gridWidth) * gridWidth;
    var minDeltaY = Math.floor(deltaY / gridHeight) * gridHeight;
    var maxDeltaX = Math.ceil(deltaX / gridWidth) * gridWidth;
    var maxDeltaY = Math.ceil(deltaY / gridHeight) * gridHeight;
    var bbox =
    /** @type {GeoJSON.BBox} */
    [destination([0, 0], minDeltaX, 90, {
      units: units
    }).geometry.coordinates[0], destination([0, 0], minDeltaY, 0, {
      units: units
    }).geometry.coordinates[1], destination([0, 0], maxDeltaX, 90, {
      units: units
    }).geometry.coordinates[0], destination([0, 0], maxDeltaY, 0, {
      units: units
    }).geometry.coordinates[1]];
    return bbox;
  }

  /** @typedef {import('maplibre-gl').Map} Map */

  /** @typedef {import('maplibre-gl').GeoJSONSource} GeoJSONSource */

  /** @typedef {import('maplibre-gl').LngLatBounds} LngLatBounds */

  /** @typedef {import('maplibre-gl').MapMouseEvent} MapMouseEvent */

  /** @typedef {import('@turf/helpers').Units} Units */

  /** @typedef {import('./grid').GridConfig} GridConfig */

  /** @typedef {import('./grid').GridClickEvent} GridClickEvent */

  var GRID_CLICK_EVENT = 'grid.click';
  function randomString() {
    return Math.floor(Math.random() * 10e12).toString(36);
  }
  var Grid = /*#__PURE__*/function () {
    /**
     * @param {GridConfig} config
     */
    function Grid(config) {
      _classCallCheck(this, Grid);

      this.id = "grid-".concat(randomString());
      this.config = config;
      this.updateBound = this.update.bind(this);
      this.onMapClickBound = this.onMapClick.bind(this);
    }
    /**
     * @param {Map} map
     * @returns {HTMLElement}
     */


    _createClass(Grid, [{
      key: "onAdd",
      value: function onAdd(map) {
        this.map = map;
        this.map.on('load', this.updateBound);
        this.map.on('move', this.updateBound);
        this.map.on('click', this.onMapClickBound);

        if (this.map.loaded()) {
          this.update();
        }

        return document.createElement('div');
      }
      /**
       * @returns {void}
       */

    }, {
      key: "onRemove",
      value: function onRemove() {
        if (!this.map) {
          return;
        }

        var source = this.map.getSource(this.id);

        if (source) {
          this.map.removeLayer(this.id);
          this.map.removeSource(this.id);
        }

        this.map.off('load', this.updateBound);
        this.map.off('move', this.updateBound);
        this.map.off('click', this.onMapClickBound);
        this.map = undefined;
      }
      /**
       * @returns {void}
       */

    }, {
      key: "update",
      value: function update() {
        if (!this.map) {
          return;
        }
        /** @type {GeoJSON.Feature<GeoJSON.LineString>[]} */


        var grid = [];

        if (this.active) {
          grid = getGrid(this.bbox, this.config.gridWidth, this.config.gridHeight, this.config.units);
        } // console.log(grid);


        var source =
        /** @type {GeoJSONSource} */
        this.map.getSource(this.id);

        if (!source) {
          var _this$config$paint;

          this.map.addSource(this.id, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: grid
            }
          });
          this.map.addLayer({
            id: this.id,
            source: this.id,
            type: 'line',
            paint: (_this$config$paint = this.config.paint) !== null && _this$config$paint !== void 0 ? _this$config$paint : {}
          });
        } else {
          source.setData({
            type: 'FeatureCollection',
            features: grid
          });
        }
      }
      /**
       * @returns {boolean}
       */

    }, {
      key: "active",
      get: function get() {
        var _this$config$minZoom, _this$config$maxZoom;

        if (!this.map) {
          return false;
        }

        var minZoom = (_this$config$minZoom = this.config.minZoom) !== null && _this$config$minZoom !== void 0 ? _this$config$minZoom : 0;
        var maxZoom = (_this$config$maxZoom = this.config.maxZoom) !== null && _this$config$maxZoom !== void 0 ? _this$config$maxZoom : 22;
        var zoom = this.map.getZoom(); // console.log(zoom);

        return minZoom <= zoom && zoom < maxZoom;
      }
      /**
       * @returns {GeoJSON.BBox}
       */

    }, {
      key: "bbox",
      get: function get() {
        if (!this.map) {
          throw new Error('Invalid state');
        }

        var bounds = this.map.getBounds();

        if (bounds.getEast() - bounds.getWest() >= 360) {
          bounds.setNorthEast([bounds.getWest() + 360, bounds.getNorth()]);
        }

        var bbox =
        /** @type {GeoJSON.BBox} */
        bounds.toArray().flat();
        return bbox;
      }
      /**
       * @param {MapMouseEvent} event
       * @returns {void}
       */

    }, {
      key: "onMapClick",
      value: function onMapClick(event) {
        if (!this.map || !this.active) {
          return;
        }

        var point = event.lngLat.toArray();
        var bbox = getGridCell(point, this.config.gridWidth, this.config.gridWidth, this.config.units);
        /** @type {GridClickEvent} */

        var event2 = {
          bbox: bbox
        };
        this.map.fire(GRID_CLICK_EVENT, event2);
      }
    }]);

    return Grid;
  }();

  exports.GRID_CLICK_EVENT = GRID_CLICK_EVENT;
  exports.Grid = Grid;
  exports.randomString = randomString;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=maplibre-grid.js.map
