// EGM96 15-minute grid, north-to-south image rows, duplicate antimeridian post.
export function createInundationMaterial(C,geoidImage){
 return new C.Material({fabric:{type:'TerraShiftFloodV01',uniforms:{riseMeters:10.0,geoidMap:geoidImage,floodColor:new C.Color(0.035,0.60,0.92,0.86)},source:`
 czm_material czm_getMaterial(czm_materialInput inputData){
   czm_material mat=czm_getDefaultMaterial(inputData);
   vec3 p=(czm_inverseView*vec4(-inputData.positionToEyeEC,1.0)).xyz;
   float lon=atan(p.y,p.x);
   float lat=atan(p.z, length(p.xy)*0.99330562);
   vec2 uv=vec2((lon/6.28318530718+0.5)*1440.0+0.5,(lat/3.14159265359+0.5)*720.0+0.5)/vec2(1441.0,721.0);
   vec2 encoded=texture(geoidMap,clamp(uv,0.0,1.0)).rg*255.0;
   float geoid=(encoded.r*256.0+encoded.g)/100.0-128.0;
   float h=inputData.height-geoid;
   float land=1.0;
   #ifdef HAS_WATER_MASK
     land=1.0-step(0.5,inputData.waterMask);
   #endif
   mat.diffuse=floodColor.rgb;
   mat.alpha=floodColor.a*land*step(h,riseMeters)*step(0.00001,riseMeters);
   return mat;
 }`},translucent:true});
}