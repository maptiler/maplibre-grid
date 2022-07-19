import { getGrid, getGridCell } from './calc';

/** @typedef {import('maplibre-gl').Map} Map */
/** @typedef {import('maplibre-gl').GeoJSONSource} GeoJSONSource */
/** @typedef {import('maplibre-gl').LngLatBounds} LngLatBounds */
/** @typedef {import('maplibre-gl').MapMouseEvent} MapMouseEvent */
/** @typedef {import('@turf/helpers').Units} Units */
/** @typedef {import('./grid').GridConfig} GridConfig */
/** @typedef {import('./grid').GridClickEvent} GridClickEvent */

export const GRID_CLICK_EVENT = 'grid.click';

export function randomString() {
  return Math.floor(Math.random() * 10e12).toString(36);
}
export class Grid {
  /**
   * @param {GridConfig} config
   */
  constructor(config) {
    this.id = `grid-${randomString()}`;
    this.config = config;

    this.updateBound = this.update.bind(this);
    this.onMapClickBound = this.onMapClick.bind(this);
  }

  /**
   * @param {Map} map
   * @returns {HTMLElement}
   */
  onAdd(map) {
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
  onRemove() {
    if (!this.map) {
      return;
    }

    const source = this.map.getSource(this.id);
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
  update() {
    if (!this.map) {
      return;
    }

    /** @type {GeoJSON.Feature<GeoJSON.LineString>[]} */
    let grid = [];
    if (this.active) {
      grid = getGrid(this.bbox, this.config.gridWidth, this.config.gridHeight, this.config.units);
    }
    // console.log(grid);

    const source = /** @type {GeoJSONSource} */ (this.map.getSource(this.id));
    if (!source) {
      this.map.addSource(this.id, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: grid }
      });
      this.map.addLayer({
        id: this.id,
        source: this.id,
        type: 'line',
        paint: this.config.paint ?? {}
      });
    } else {
      source.setData({ type: 'FeatureCollection', features: grid });
    }
  }

  /**
   * @returns {boolean}
   */
  get active() {
    if (!this.map) {
      return false;
    }

    const minZoom = this.config.minZoom ?? 0;
    const maxZoom = this.config.maxZoom ?? 22;
    const zoom = this.map.getZoom();
    // console.log(zoom);

    return minZoom <= zoom && zoom < maxZoom;
  }

  /**
   * @returns {GeoJSON.BBox}
   */
  get bbox() {
    if (!this.map) {
      throw new Error('Invalid state');
    }

    const bounds = this.map.getBounds();
    if (bounds.getEast() - bounds.getWest() >= 360) {
      bounds.setNorthEast([bounds.getWest() + 360, bounds.getNorth()]);
    }

    const bbox = /** @type {GeoJSON.BBox} */ (bounds.toArray().flat());
    return bbox;
  }

  /**
   * @param {MapMouseEvent} event
   * @returns {void}
   */
  onMapClick(event) {
    if (!this.map || !this.active) {
      return;
    }

    const point = event.lngLat.toArray();
    const bbox = getGridCell(point, this.config.gridWidth, this.config.gridHeight, this.config.units);

    /** @type {GridClickEvent} */
    const event2 = { bbox };
    this.map.fire(GRID_CLICK_EVENT, event2);
  }
}