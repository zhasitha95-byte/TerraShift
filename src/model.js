export const FT_PER_M=1/0.3048;
export const MAX_M=9000;
export const PRESETS=[0,1,5,10,25,70,100,500,1000,3000,6000,9000];
export function toDisplay(m,unit){return unit==='ft'?m*FT_PER_M:m;}
export function parseRise(raw,unit='m'){
 if(typeof raw==='string'&&!raw.trim())return null;
 const value=Number(raw); if(!Number.isFinite(value)||value<0)return null;
 const metres=unit==='ft'?value/FT_PER_M:value;
 return metres<=MAX_M+1e-8?Math.min(MAX_M,metres):null;
}
export function floodCandidate(height,geoid,rise,isWater=false){return !isWater&&rise>0&&height-geoid<=rise;}
export function readScenario(search){const p=new URLSearchParams(search);const rise=parseRise(p.get('rise')??'10');const coords=['lon','lat','alt','heading','pitch','roll'].map(k=>p.has(k)?Number(p.get(k)):NaN);return {rise:rise??10,unit:p.get('unit')==='ft'?'ft':'m',camera:coords.every(Number.isFinite)&&Math.abs(coords[0])<=180&&Math.abs(coords[1])<=90&&coords[2]>0&&coords[2]<=1e8?coords:null};}
// Three equal slider sections keep the first 100 m precise.
export function sliderToMetres(position){const p=Math.max(0,Math.min(3000,Number(position)));return p<=1000?p/10:p<=2000?100+(p-1000)*0.9:1000+(p-2000)*8;}
export function metresToSlider(m){const h=Math.max(0,Math.min(MAX_M,m));return h<=100?h*10:h<=1000?1000+(h-100)/0.9:2000+(h-1000)/8;}
