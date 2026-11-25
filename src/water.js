// A separate opaque, depth-tested global water shell. No terrain material or waves.
export const SHELL_MIN=500;
export function chooseWaterMode(rise,choice){
 if(rise<=0)return 'none';
 return choice==='raster'||rise<SHELL_MIN?'raster':'surface';
}
export function shellScale(radii,rise){return {x:1+rise/radii.x,y:1+rise/radii.y,z:1+rise/radii.z};}
export class WaterSurface{
 constructor(C,viewer){this.C=C;this.viewer=viewer;this.radii=C.Ellipsoid.WGS84.radii;this.rise=0;this.primitive=undefined;this.applied=NaN;
 // Apply a new scale after asynchronous geometry creation and keep the camera outside water.
 this.removeListener=viewer.scene.preUpdate.addEventListener(()=>this.sync());
 }
 setRise(rise){
  this.rise=rise;
  const C=this.C;
  if(rise>0&&!this.primitive){
   const geometry=new C.EllipsoidGeometry({radii:this.radii,stackPartitions:720,slicePartitions:1440,vertexFormat:C.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT});
   this.primitive=this.viewer.scene.primitives.add(new C.Primitive({
    geometryInstances:new C.GeometryInstance({geometry,attributes:{color:C.ColorGeometryInstanceAttribute.fromColor(C.Color.fromCssColorString('#124f70'))}}),
    appearance:new C.PerInstanceColorAppearance({flat:true,translucent:false,closed:true}),
    asynchronous:true,compressVertices:false,allowPicking:false,scene3DOnly:true,
    modelMatrix:this.matrix(rise)
   }));
   this.applied=NaN;
  }
  if(this.primitive)this.primitive.show=rise>0;
  this.sync();
  this.viewer.scene.requestRender();
 }
 matrix(rise){const C=this.C,s=shellScale(this.radii,rise);return C.Matrix4.fromScale(new C.Cartesian3(s.x,s.y,s.z));}
 sync(){
  if(!this.primitive||!this.rise)return;
  if(this.primitive.ready&&this.applied!==this.rise){this.primitive.modelMatrix=this.matrix(this.rise);this.applied=this.rise;this.viewer.scene.requestRender();}
  const C=this.C,c=this.viewer.camera,p=c.positionCartographic;
  if(p&&p.height<this.rise+150){
   c.setView({destination:C.Cartesian3.fromRadians(p.longitude,p.latitude,this.rise+150),orientation:{heading:c.heading,pitch:c.pitch,roll:c.roll}});
   this.viewer.scene.requestRender();
  }
 }
 destroy(){this.removeListener();if(this.primitive)this.viewer.scene.primitives.remove(this.primitive);this.primitive=undefined;}
}
