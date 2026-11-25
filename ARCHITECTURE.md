# Architecture

- index.html and style.css: responsive UI.
- src/app.js: viewer, terrain/imagery connection, state, camera and URL sharing.
- src/model.js: canonical metre values, validation, conversion and threshold predicate.
- src/geoid.js: fetches and validates the original big-endian EGM96 GTX grid, reverses latitude rows, duplicates antimeridian column and encodes N as R/G centimetres offset by 128 m.
- src/inundation.js: GPU material computes H = h - N and highlights H <= rise when rise > 0, excluding water mask where available. Slider changes update a uniform.
- tests/model.test.js: pure logic tests.

Static ES modules with pinned Cesium CDN avoid local installation. This deployment uses browser-side GTX decoding instead of shipping the derived PNG asset, adding an external data dependency. No backend. Future ocean connectivity may use a critical inundation elevation raster.