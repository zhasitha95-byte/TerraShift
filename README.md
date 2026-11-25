# TerraShift V0.1

Interactive 3D global sea-level explorer using CesiumJS 1.134, terrain and imagery from Cesium ion, and the original EGM96 geoid grid.

## Browser-only launch

Enable GitHub Pages in Settings → Pages → Deploy from a branch → main → / (root). The intended site is https://zhasitha95-byte.github.io/TerraShift/ . No local software is needed.

Open the site in a WebGL 2 browser. Create a restricted public read-only Cesium ion token at https://ion.cesium.com/tokens with access to World Terrain and World Imagery and restrict allowed URLs to your deployment as supported by ion. Paste into Terrain connection and connect. The token stays in page memory only; do not use a privileged token or commit a token.

The preview does not simulate flooding until terrain is connected. The browser loads the original EGM96 grid from PROJ's public GitHub repository and converts it to an image texture in memory; failure disables the connection instead of silently assuming zero geoid correction.

## Tests and limitations

Run npm test with Node 18+ for four dependency-free logic tests. Browser rendering, texture sampling, external-service connectivity and shader compilation remain unverified for this deployment. Validate on Colombo, Maldives, Netherlands, Bangladesh and Miami. Compare fixed-camera overlays at 0, 5, 25 and 100 m against independent elevation data.

This is a static elevation threshold, not a hydraulic or scientifically validated flood model. Inland depressions may appear submerged. Coastal defenses, tides, erosion, land motion and regional sea-level variation are not modeled. Existing water is excluded where a terrain water mask is available. Low terrain LOD is coarse. The EGM96 correction is approximate and texture orientation needs verification. No property-level risk claims. The overlay tints terrain rather than creating a physically flat water surface.

See ARCHITECTURE.md, DATA_SOURCES.md and ROADMAP.md.