# Data sources and terms

- CesiumJS 1.134: https://cesium.com/downloads/cesiumjs/releases/1.134/Build/Cesium/ (Apache 2.0).
- Cesium World Terrain and imagery: https://cesium.com/learn/cesiumjs-learn/cesiumjs-terrain/ ; ion and provider terms and quotas apply. Keep attribution visible. Terrain uses ellipsoidal heights; resolution varies.
- Natural Earth II bundled preview is imagery only.
- NGA public-domain EGM96 grid distributed by PROJ: https://github.com/OSGeo/proj-datumgrid/blob/master/egm96_15.gtx ; source is 721 x 1440 posts at 0.25 degrees, starting -90 latitude and -180 longitude. Browser creates 1441 x 721 texture with duplicate longitude post and north-first rows. Encoding q=round((N+128)*100), R=q>>8, G=q&255.
- Shader reference: https://raw.githubusercontent.com/CesiumGS/cesium/1.134/packages/engine/Source/Shaders/GlobeFS.glsl . Live validation outstanding.
## V0.3 active DEM
Mapzen Terrain Tiles on AWS Open Data: https://registry.opendata.aws/terrain-tiles/ ; Terrarium encoding H = R*256 + G + B/256 - 32768. Source elevations combine multiple datasets, with varying resolution and vertical references. Source URL: https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png . Attribution displayed by imagery provider. Web Mercator polar limit applies. EGM96 source above is retained for historical V0.1/V0.2 only.
