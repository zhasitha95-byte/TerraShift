# Architecture

- index.html and style.css: responsive UI.
- src/app.js: viewer, terrain/imagery connection, state, camera and URL sharing.
- src/model.js: canonical metre values, validation, conversion and threshold predicate.
- src/geoid.js: fetches and validates the original big-endian EGM96 GTX grid, reverses latitude rows, duplicates antimeridian column and encodes N as R/G centimetres offset by 128 m.
- src/inundation.js: GPU material computes H = h - N and highlights H <= rise when rise > 0, excluding water mask where available. Slider changes update a uniform.
- tests/model.test.js: pure logic tests.

Static ES modules with pinned Cesium CDN avoid local installation. This deployment uses browser-side GTX decoding instead of shipping the derived PNG asset, adding an external data dependency. No backend. Future ocean connectivity may use a critical inundation elevation raster.
## V0.2
The slider maps three equal control intervals to 0–100 m, 100–1,000 m and 1,000–9,000 m. The GPU shader feathers the flood threshold using fwidth(h), blends the water mask continuously, and uses one opaque colour for existing and potential water in solid mode. The globe's existing material pass is retained (no overlapping water mesh or animated waves). Higher terrain refinement and FXAA trade bandwidth/GPU usage for visual quality. Texture datum approximation and LOD-dependent elevations remain limitations.
