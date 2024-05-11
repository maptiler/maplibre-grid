import { getGrid, getGridCell } from "./calc";
export const GRID_CLICK_EVENT = "grid.click";
export function randomString() {
  return Math.floor(Math.random() * 10e12).toString(36);
}
export class Grid {
  constructor(config) {
    this.id = `grid-${randomString()}`;
    this.config = config;
    this.updateBound = this.update.bind(this);
    this.onMapClickBound = this.onMapClick.bind(this);
    this.checker = false;
    this.status = false;
  }
  onAdd(map) {
    this.map = map;
    this.map.on("load", this.updateBound);
    this.map.on("move", this.updateBound);
    if (this.checker) {
      this.map.on("mousemove", this.onMapClickBound);
    }
    this.map.on("click", this.onMapClickBound);

    if (this.map.loaded()) {
      this.update();
    }
    return document.createElement("div");
  }
  onRemove() {
    if (!this.map) {
      return;
    }
    const source = this.map.getSource(this.id);
    if (source) {
      this.map.removeLayer(this.id);
      this.map.removeSource(this.id);
    }
    this.map.off("load", this.updateBound);
    this.map.off("move", this.updateBound);

    this.map.off("click", this.onMapClickBound);
    this.map = undefined;
  }
  update() {
    if (!this.map) {
      return;
    }
    let grid = [];
    if (this.active) {
      grid = getGrid(
        this.bbox,
        this.config.gridWidth,
        this.config.gridHeight,
        this.config.units
      );
    }
    const source = this.map.getSource(this.id);
    if (!source) {
      this.map.addSource(this.id, {
        type: "geojson",
        data: { type: "FeatureCollection", features: grid },
      });
      this.map.addLayer({
        id: this.id,
        source: this.id,
        type: "line",
        paint: this.config.paint ?? {},
      });
    } else {
      source.setData({ type: "FeatureCollection", features: grid });
    }
  }
  get active() {
    if (!this.map) {
      return false;
    }
    const minZoom = this.config.minZoom ?? 0;
    const maxZoom = this.config.maxZoom ?? 22;
    const zoom = this.map.getZoom();
    return minZoom <= zoom && zoom < maxZoom;
  }
  get bbox() {
    if (!this.map) {
      throw new Error("Invalid state");
    }
    const bounds = this.map.getBounds();

    if (bounds.getEast() - bounds.getWest() >= 360) {
      bounds.setNorthEast([bounds.getWest() + 360, bounds.getNorth()]);
    }
    const bbox = bounds.toArray().flat();
    return bbox;
  }
  onMapClick(event) {
    this.checker = true;
    if (!this.map || !this.active) {
      return;
    }
    this.onAdd(this.map);
    const point = event.lngLat.toArray();
    const bbox = getGridCell(
      point,
      this.config.gridWidth,
      this.config.gridWidth,
      this.config.units
    );
    const event2 = { bbox };

    this.map.fire(GRID_CLICK_EVENT, event2);
  }
}
