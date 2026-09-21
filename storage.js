import {emptyAlbum,validateAlbum} from './core.mjs';
let connection;
function open(){return connection??=(new Promise((resolve,reject)=>{const r=indexedDB.open('somewhere-travel-album',1);r.onupgradeneeded=()=>{r.result.createObjectStore('state');r.result.createObjectStore('photos')};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);}));}
async function operation(store,mode,callback){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction(store,mode);const req=callback(tx.objectStore(store));let value;req.onsuccess=()=>value=req.result;tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('本机存储失败'));});}
export const loadDraft=()=>operation('state','readonly',s=>s.get('album'));
export const saveDraft=a=>operation('state','readwrite',s=>s.put(a,'album'));
export const getPhoto=name=>operation('photos','readonly',s=>s.get(name));
export const putPhoto=(name,blob)=>operation('photos','readwrite',s=>s.put(blob,name));
export async function importDraft(album,photos){const db=await open();await new Promise((resolve,reject)=>{const tx=db.transaction(['state','photos'],'readwrite');for(const [name,blob] of photos)tx.objectStore('photos').put(blob,name);tx.objectStore('state').put(album,'album');tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error||Error('恢复失败'));tx.onerror=()=>reject(tx.error);});}
export async function fetchPublished(){const response=await fetch('./album.json',{cache:'no-store'});if(!response.ok)throw Error('相册暂时无法加载，请联网后重试');return validateAlbum(await response.json());}
export async function preparePhoto(file){
  if(file.size>50*1024*1024)throw Error(file.name+' 超过 50 MB，请先导出较小的 JPEG');
  if(!/^image\/(jpeg|png|webp)$/.test(file.type))throw Error('请使用 JPEG、PNG 或 WebP；HEIC / RAW 请先导出为 JPEG');
  const url=URL.createObjectURL(file),img=new Image();
  try{img.src=url;await img.decode();const scale=Math.min(1,1800/Math.max(img.naturalWidth,img.naturalHeight));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.naturalWidth*scale));c.height=Math.max(1,Math.round(img.naturalHeight*scale));const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);return await new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('照片压缩失败')),'image/jpeg',.8));}finally{URL.revokeObjectURL(url);}
}
