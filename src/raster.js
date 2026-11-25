// Independent Mapzen Terrarium DEM tiles. H = R*256 + G + B/256 - 32768.
// Raster classification is deliberately independent of Cesium terrain geometry.
const SIZE=256, MAX_Z=12, cache=new Map(), LIMIT=256;
const endpoint=(x,y,z)=>'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/'+z+'/'+x+'/'+y+'.png';
export function decodeHeight(r,g,b){return r*256+g+b/256-32768;}
async function getTile(x,y,z){
 const key=z+'/'+x+'/'+y;if(cache.has(key)){const p=cache.get(key);cache.delete(key);cache.set(key,p);return p;}
 const p=(async()=>{const res=await fetch(endpoint(x,y,z));if(!res.ok)throw Error('DEM tile unavailable: '+res.status);const bitmap=await createImageBitmap(await res.blob(),{colorSpaceConversion:'none',premultiplyAlpha:'none'});const c=document.createElement('canvas');c.width=c.height=SIZE;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0);bitmap.close();return ctx.getImageData(0,0,SIZE,SIZE).data;})();
 cache.set(key,p);if(cache.size>LIMIT)cache.delete(cache.keys().next().value);p.catch(()=>{if(cache.get(key)===p)cache.delete(key);});return p;
}
export class FloodImageryProvider{
 constructor(C,rise,solid){
  this.rise=rise;this.solid=solid;this.tileWidth=SIZE;this.tileHeight=SIZE;this.minimumLevel=0;this.maximumLevel=MAX_Z;this.tilingScheme=new C.WebMercatorTilingScheme();this.rectangle=this.tilingScheme.rectangle;this.errorEvent=new C.Event();this.credit=new C.Credit('Elevation: Mapzen / AWS Open Data (Terrarium)');this.hasAlphaChannel=true;this.ready=true;this.readyPromise=Promise.resolve(true);this.proxy=undefined;this.tileDiscardPolicy=undefined;
 }
 getTileCredits(){return undefined;}
 pickFeatures(){return undefined;}
 async requestImage(x,y,z){
  const data=await getTile(x,y,z);const c=document.createElement('canvas');c.width=c.height=SIZE;const ctx=c.getContext('2d');const out=ctx.createImageData(SIZE,SIZE);
  for(let i=0;i<data.length;i+=4){
   const h=decodeHeight(data[i],data[i+1],data[i+2]);
   // In solid mode paint current oceans as well; otherwise preserve existing ocean imagery.
   const wet=this.rise>0&&h<=this.rise&&(this.solid||h>0);
   if(wet){out.data[i]=13;out.data[i+1]=78;out.data[i+2]=112;out.data[i+3]=this.solid?255:218;}
  }
  ctx.putImageData(out,0,0);return c;
 }
}
