// Decode the original NGA EGM96 grid distributed by PROJ.
// No generated binary asset or local installation is required.
export const GRID_URL='https://raw.githubusercontent.com/OSGeo/proj-datumgrid/master/egm96_15.gtx';
export async function loadGeoid(){
 const response=await fetch(GRID_URL);
 if(!response.ok)throw Error('EGM96 download failed: '+response.status);
 const buffer=await response.arrayBuffer(),v=new DataView(buffer);
 if(buffer.byteLength!==4153000||v.getFloat64(0)!==-90||v.getFloat64(8)!==-180||v.getFloat64(16)!==0.25||v.getFloat64(24)!==0.25||v.getInt32(32)!==721||v.getInt32(36)!==1440)throw Error('Unexpected geoid grid metadata');
 const c=document.createElement('canvas');c.width=1441;c.height=721;
 const ctx=c.getContext('2d'),image=ctx.createImageData(c.width,c.height);
 for(let y=0;y<721;y++)for(let x=0;x<1441;x++){
  const n=v.getFloat32(40+4*((720-y)*1440+(x%1440)));
  if(!Number.isFinite(n)||n< -128||n>127)throw Error('Invalid geoid sample');
  const q=Math.round((n+128)*100),i=4*(y*1441+x);
  image.data[i]=q>>8;image.data[i+1]=q&255;image.data[i+2]=0;image.data[i+3]=255;
 }
 ctx.putImageData(image,0,0);
 const img=new Image();img.src=c.toDataURL('image/png');await img.decode();return img;
}