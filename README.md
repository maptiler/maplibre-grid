<img src="https://www.maptiler.com/styles/style/logo/maptiler-logo-adaptive.svg?123#maptilerLogo" alt="Company Logo" height="32"/>

# maplibre-grid

Grid / graticule plugin for [MapLibre GL JS](https://docs.maptiler.com/maplibre/) / Mapbox GL JS

[![](https://img.shields.io/npm/v/maplibre-grid?style=for-the-badge&labelColor=D3DBEC&color=f2f6ff&logo=npm&logoColor=333359)](https://www.npmjs.com/package/maplibre-grid) [![](https://img.shields.io/badge/-white?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)[![](https://img.shields.io/badge/-white?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

📖 [Documentation](https://docs.maptiler.com/) &nbsp; 📦 [NPM Package](https://www.npmjs.com/package/maplibre-grid) &nbsp; 🌐 [Website](https://www.maptiler.com/) &nbsp; 🔑 [Get API Key](https://cloud.maptiler.com/account/keys/)

---

> ⚠️ **DEPRECATED:** This repository is no longer actively maintained. Please consider using an alternative solution.

<br>

<details> <summary><b>Table of Contents</b></summary>
<ul>
<li><a href="#-installation">Installation</a></li>
<li><a href="#-basic-usage">Basic Usage</a></li>
<li><a href="#-api-reference">API Reference</a></li>
<li><a href="#-support">Support</a></li>
<li><a href="#-contributing">Contributing</a></li>
<li><a href="#-license">License</a></li>
<li><a href="#-acknowledgements">Acknowledgements</a></li>
</ul>
</details>

<p align="center">   <img src="docs/screenshot@2x.jpg" alt="Demo Screenshot" width="80%"/>  <br />  <a href="https://labs.maptiler.com/maplibre-grid/">See live interactive demo</a> </p>
<br>

## 📦 Installation

```shell
npm install maplibre-gl maplibre-grid
```

or

```html
<script src="https://unpkg.com/maplibre-gl@1.13.0-rc.5/dist/maplibre-gl.js"></script>
<link
  href="https://unpkg.com/maplibre-gl@1.13.0-rc.5/dist/maplibre-gl.css"
  rel="stylesheet"
/>
<script src="https://unpkg.com/maplibre-grid@1.0.0/dist/maplibre-grid.js"></script>
```

<br>

## 🚀 Basic Usage

```js
import Maplibre from "maplibre-gl";
import * as MaplibreGrid from "maplibre-grid";
```

```js
const grid = new MaplibreGrid.Grid({
  gridWidth: 10,
  gridHeight: 10,
  units: "degrees",
  paint: {
    "line-opacity": 0.2,
  },
});
map.addControl(grid);
```

### Multiple grids

```js
const grid1 = new MaplibreGrid.Grid({
  gridWidth: 10,
  gridHeight: 10,
  units: "degrees",
  paint: {
    "line-opacity": 0.2,
  },
});
map.addControl(grid1);

const grid2 = new MaplibreGrid.Grid({
  gridWidth: 5,
  gridHeight: 5,
  units: "degrees",
  paint: {
    "line-opacity": 0.2,
  },
});
map.addControl(grid2);
```

<br>

## 📘 API Reference

```ts
export interface GridConfig {
  gridWidth: number;
  gridHeight: number;
  units: Units;
  minZoom?: number;
  maxZoom?: number;
  paint?: maplibregl.LinePaint;
}

const grid = new MaplibreGrid.Grid(config: GridConfig);
```

- `gridWidth` - number, **required**
- `gridHeight` - number, **required**
- `units` - 'degrees' | 'radians' | 'miles' | 'kilometers', grid width/height units, **required**
- `minZoom` - number, min zoom to display the grid
- `maxZoom` - number, max zoom to display the grid
- `paint` - maplibregl.LinePaint, layer line paint properties

Multiple grids can be added to display major and minor grid together, or different grids depending on zoom level.

### Click event

```js
map.on(MaplibreGrid.GRID_CLICK_EVENT, (event) => {
  console.log(event.bbox);
});
```

Click event can be used to implement grid cell selection. Create a polygon feature from `event.bbox`, and add it to your custom layer. See [demo](https://labs.maptiler.com/maplibre-grid/) for details.

### Destroy

```js
map.removeControl(grid);
```

<br>

## 💬 Support

- 📚 [Documentation](https://docs.maptiler.com) - Comprehensive guides and API reference
- ✉️ [Contact us](https://maptiler.com/contact) - Get in touch or submit a request
- 🐦 [Twitter/X](https://twitter.com/maptiler) - Follow us for updates

<br>

---

<br>

## 🤝 Contributing

We love contributions from the community! Whether it's bug reports, feature requests, or pull requests, all contributions are welcome:

- Fork the repository and create your branch from `main`
- If you've added code, add tests that cover your changes
- Open a pull request with a clear summary and comprehensive description

<br>

## 📄 License

This project is licensed under the BSD 3-Clause License – see the [LICENSE](./LICENSE) file for details.

<br>

## 🙏 Acknowledgements

This project is built on the shoulders of giants:

- [MapLibre GL JS](https://maplibre.org/) – Open-source TypeScript library for publishing maps on your website

<br>

<p align="center" style="margin-top:20px;margin-bottom:20px;"> <a href="https://cloud.maptiler.com/account/keys/" style="display:inline-block;padding:12px 32px;background:#F2F6FF;color:#000;font-weight:bold;border-radius:6px;text-decoration:none;"> Get Your API Key <sup style="background-color:#0000ff;color:#fff;padding:2px 6px;font-size:12px;border-radius:3px;">FREE</sup><br /> <span style="font-size:90%;font-weight:400;">Start building with 100,000 free map loads per month ・ No credit card required.</span> </a> </p>

<br>

<p align="center"> 💜 Made with love by the <a href="https://www.maptiler.com/">MapTiler</a> team <br />
<p align="center">
  <a href="https://www.maptiler.com/">Website</a> •
  <a href="https://docs.maptiler.com/">Documentation</a> •
  <a href="https://github.com/maptiler/maplibre-grid">GitHub</a>
</p>
