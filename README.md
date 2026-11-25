# TerraShift V0.4

Interactive 3D global sea-level explorer using CesiumJS 1.134, terrain and imagery from Cesium ion, and the original EGM96 geoid grid.

## Browser-only launch

Enable GitHub Pages in Settings → Pages → Deploy from a branch → main → / (root). The intended site is https://zhasitha95-byte.github.io/TerraShift/ . No local software is needed.

Open the site in a WebGL 2 browser. Create a restricted public read-only Cesium ion token at https://ion.cesium.com/tokens with access to World Terrain and World Imagery and restrict allowed URLs to your deployment as supported by ion. Paste into Terrain connection and connect. The token stays in page memory only; do not use a privileged token or commit a token.

The preview does not simulate flooding until terrain is connected. The browser loads the original EGM96 grid from PROJ's public GitHub repository and converts it to an image texture in memory; failure disables the connection instead of silently assuming zero geoid correction.

## Tests and limitations

Run npm test with Node 18+ for five dependency-free logic tests. Browser rendering, texture sampling, external-service connectivity and shader compilation remain unverified for this deployment. Validate on Colombo, Maldives, Netherlands, Bangladesh and Miami. Compare fixed-camera overlays at 0, 5, 25 and 100 m against independent elevation data.

This is a static elevation threshold, not a hydraulic or scientifically validated flood model. Inland depressions may appear submerged. Coastal defenses, tides, erosion, land motion and regional sea-level variation are not modeled. Existing water is excluded where a terrain water mask is available. Low terrain LOD is coarse. The EGM96 correction is approximate and texture orientation needs verification. No property-level risk claims. The overlay tints terrain rather than creating a physically flat water surface.

See ARCHITECTURE.md, DATA_SOURCES.md and ROADMAP.md.
## V0.2 changes
- Range 0–9,000 m (about 29,528 ft), with a piecewise slider retaining 0.1 m resolution through 100 m and exact manual entry across the range.
- Solid, unanimated blue ocean and inundated land by default; original imagery preserved at zero rise. Optional overlay mode.
- Screen-space derivative feathering and FXAA; higher terrain detail, larger cache, and quality control. These mitigate aliasing and tile changes but do not guarantee a flicker-free global view; coarse source terrain remains limiting.
- Everest camera preset and extreme scenarios. No hydraulic simulation or true elevated water geometry yet.
- V0.2 browser smoke test and unit test execution pending. Compare against V0.1 at global, country and city zooms. The material shader was checked against the pinned GlobeFS source but has not been compiled in a browser here.

## V0.3 independent elevation imagery
The previous terrain material has been disabled. Flooding uses Mapzen Terrarium elevation PNG tiles from AWS Open Data, decoded in the browser and displayed as a Cesium imagery layer. It is independent of the visible terrain mesh, with fixed maximum source zoom 12 and overzoom above that level. The source tiles are cached in memory; the overlay rebuild is debounced 160 ms. Unlike the prior shader, the grid uses source orthometric elevation estimates; no EGM96 correction is applied a second time. Coverage is Web Mercator (approximately ±85.05 degrees); polar caps are not simulated. Source resolution, datum inconsistencies, tile loading and static threshold limitations remain. The overlay is not a true elevated 3D water surface. Existing ocean classification uses nonpositive elevation, which also includes inland depressions. Browser verification is pending.

## V0.4 experimental elevated water
Automatic mode selects independent DEM imagery below 500 m and an opaque global ellipsoid shell at 500–9000 m. The shell uses a single static 720×1440 tessellated geometry with scale changes, flat colour and terrain depth testing; no terrain-height fragment classification or coplanar overlay in this mode. The shell includes the poles. Raster mode remains selectable at all heights. The camera is kept 150 m above the nominal shell to prevent viewing from inside. Explicit surface selection falls back to raster below 500 m. This shell uses WGS84 ellipsoid heights, not geoid-corrected mean sea level; local datum error can reach roughly 100 m and tessellation adds further error (order tens of metres). It is intended for extreme illustrative scenarios, not coastal mapping. It fills disconnected basins. Real browser depth ordering, precision, performance and camera behaviour are not verified here. The older raster mode still uses external Mapzen tiles and is not ocean-connected.
