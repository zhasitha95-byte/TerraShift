export const FT_PER_M=1/0.3048;
export const MAX_M=1000;
export const PRESETS=[0,1,2,5,10,25,70,100];
export function toDisplay(m,unit){return unit==='ft'?m*FT_PER_M:m;}
export function parseRise(raw,unit='m'){
 if(typeof raw==='string'&&!raw.trim())return null;
 const value=Number(raw); if(!Number.isFinite(value)||value<0)return null;
 const metres=unit==='ft'?value/FT_PER_M:value;
 return metres<=MAX_M+1e-8?Math.min(MAX_M,metres):null;
}
export function floodCandidate(height,geoid,rise,isWater=false){return !isWater&&rise>0&&height-geoid<=rise;}
export function readScenario(search){const p=new URLSearchParams(search);const rise=parseRise(p.get('rise')??'10');const coords=['lon','lat','alt','heading','pitch','roll'].map(k=>p.has(k)?Number(p.get(k)):NaN);return {rise:rise??10,unit:p.get('unit')==='ft'?'ft':'m',camera:coords.every(Number.isFinite)&&Math.abs(coords[0])<=180&&Math.abs(coords[1])<=90&&coords[2]>0&&coords[2]<=1e8?coords:null};}