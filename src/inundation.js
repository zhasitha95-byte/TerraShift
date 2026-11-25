// Single globe pass; derivative-filtered shoreline and shared ocean colour.
// EGM96 is interpolated by the texture sampler; no animated water normals.
export function createInundationMaterial(C,geoidImage){
 return new C.Material({fabric:{type:'TerraShiftFloodV02',uniforms:{riseMeters:10.0,geoidMap:geoidImage,solidWater:1.0,waterColor:new C.Color(0.045,0.32,0.48,1.0)},source:`
 czm_material czm_getMaterial(czm_materialInput inputData){
   czm_material mat=czm_getDefaultMaterial(inputData);
   vec3 p=(czm_inverseView*vec4(-inputData.positionToEyeEC,1.0)).xyz;
   float lon=atan(p.y,p.x);
   float lat=atan(p.z,length(p.xy)*0.99330562);
   vec2 uv=vec2((lon/6.28318530718+0.5)*1440.0+0.5,(lat/3.14159265359+0.5)*720.0+0.5)/vec2(1441.0,721.0);
   vec2 encoded=texture(geoidMap,clamp(uv,0.0,1.0)).rg*255.0;
   float geoid=(encoded.r*256.0+encoded.g)/100.0-128.0;
   float h=inputData.height-geoid;
   // Smooth the threshold over roughly one screen pixel, bounded in metres.
   float feather=clamp(fwidth(h)*0.75,0.025,250.0);
   float wet=1.0-smoothstep(riseMeters-feather,riseMeters+feather,h);
   float ocean=0.0;
   #ifdef HAS_WATER_MASK
     ocean=clamp(inputData.waterMask,0.0,1.0);
   #endif
   float enabled=step(0.000001,riseMeters);
   // Union rather than separate hard-edged land and ocean masks.
   float coverage=mix(wet*(1.0-ocean),max(wet,ocean),solidWater);
   mat.diffuse=waterColor.rgb;
   mat.alpha=enabled*coverage*mix(0.86,1.0,solidWater);
   return mat;
 }`},translucent:true});
}
