import { Grid } from "./grid";
import React from "react";
import mapboxgl from "mapbox-gl";
// import * as MaplibreGrid from "maplibre-grid";
// import "maplibre-gl/dist/maplibre-gl.css";

function App() {
  const map = React.useRef(null);
  const mapContainer = React.useRef(null);
  React.useEffect(() => {
    mapboxgl.accessToken ="";  // add mapbox api key
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-122.4194, 37.7749],
      zoom: 16.5,
      scrollZoom: true,
      preserveDrawingBuffer: true,
    });
    const grid1 = new Grid({
      gridWidth: 0.02,
      gridHeight: 0.02,
      units: "kilometers",
      minZoom: 15.5,
      maxZoom: 22,
      active: false,
      paint: {
        "line-opacity": 0.5,
        "line-color": "red",
      },
    });
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    map.current.addControl(grid1);

    const selectedCells = [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          bbox: [
            -122.41710668683882, 37.776851198612945, -122.41692682276607,
            37.77703106268569,
          ],
          coordinates: [
            [
              [-122.41710668683882, 37.776851198612945],
              [-122.41692682276607, 37.776851198612945],
              [-122.41692682276607, 37.77703106268569],
              [-122.41710668683882, 37.77703106268569],
              [-122.41710668683882, 37.776851198612945],
            ],
          ],
        },
      },
    ];

    map.current.on("load", () => {
      const selectedCellsId = "selected-cells";
      map.current.addSource(selectedCellsId, {
        type: "geojson",
        data: { type: "FeatureCollection", features: selectedCells },
      });
      map.current.addLayer({
        id: selectedCellsId,
        source: selectedCellsId,
        type: "fill",
        paint: {
          "fill-color": "##4e1609",
          "fill-opacity": 0.2,
          "fill-outline-color": "transparent",
        },
      });
    });
  }, []);

  return (
    <>
      <div
        id="map"
        ref={mapContainer}
        style={{ height: "100vh", width: "100%" }}
      />
      <div id="info2"/>
    </>
  );
}

export default App;
