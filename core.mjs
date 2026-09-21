// Portable data and ZIP helpers. No account, credentials or server required.
export const REPO = 'https://github.com/kyokaisin/travel-album';
export const PHOTO_NAME = /^photo-[0-9a-f-]{36}\.jpg$/;
export const MAX_EXPORT_BYTES = 90 * 1024 * 1024;
export const uid = () => crypto.randomUUID();
export const escapeHTML = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function emptyAlbum() { return {version:1,title:'海晨的旅行手账',updated:'',trips:[]}; }
export function newTrip() { return {id:uid(),title:'',start:'',end:'',note:'',published:false,stops:[]}; }
export function newStop(name='', lat=0, lng=0) {return {id:uid(),city:name,country:'',lat,lng,date:'',transport:'火车',note:'',photos:[]};}
export function text(value, max=10000) {if(typeof value!=='string'||value.length>max)throw Error('文字内容格式不正确或过长');return value;}
export function validateAlbum(value) {
  if(!value || value.version!==1 || !Array.isArray(value.trips) || value.trips.length>500)throw Error('这不是有效的相册文件');
  const a={version:1,title:text(value.title,150),updated:text(value.updated||'',100),trips:[]};
  const ids=new Set(); let count=0;
  const id=v=>{if(typeof v!=='string'||!/^[a-zA-Z0-9-]{1,80}$/.test(v)||ids.has(v))throw Error('相册中有重复或无效的编号');ids.add(v);return v;};
  const date=v=>{text(v,10);if(v&&!/^\d{4}-\d{2}-\d{2}$/.test(v))throw Error('日期格式应为 YYYY-MM-DD');return v;};
  for(const t of value.trips){
    if(!Array.isArray(t.stops)||t.stops.length>200)throw Error('旅行站点过多或格式不正确');
    const trip={id:id(t.id),title:text(t.title,150),start:date(t.start),end:date(t.end),note:text(t.note),published:t.published===true,stops:[]};
    if(trip.start&&trip.end&&trip.end<trip.start)throw Error('结束日期不能早于开始日期');
    for(const s of t.stops){
      if(!Number.isFinite(s.lat)||!Number.isFinite(s.lng)||Math.abs(s.lat)>90||Math.abs(s.lng)>180)throw Error('城市坐标不正确');
      if(!Array.isArray(s.photos)||s.photos.length>1000)throw Error('照片列表格式不正确');
      const stop={id:id(s.id),city:text(s.city,150),country:text(s.country,150),lat:s.lat,lng:s.lng,date:date(s.date),transport:text(s.transport,30),note:text(s.note),photos:[]};
      for(const p of s.photos){
        if(++count>10000||!PHOTO_NAME.test(p.file))throw Error('照片文件名不正确或照片过多');
        stop.photos.push({id:id(p.id),file:p.file,caption:text(p.caption,1000),date:date(p.date)});
      }
      trip.stops.push(stop);
    }
    a.trips.push(trip);
  }
  return a;
}
export function publicAlbum(a) {
  const result=validateAlbum(a);result.trips=result.trips.filter(t=>t.published);
  for(const t of result.trips){if(!t.title.trim()||!t.stops.length||!t.stops.some(s=>s.photos.length))throw Error('每段公开旅行需要名称、城市和至少一张照片');if(t.stops.some(s=>!s.city.trim()))throw Error('请为每个站点填写城市名');}
  result.updated=new Date().toISOString();return result;
}
export const allPhotos=a=>a.trips.flatMap(t=>t.stops.flatMap(s=>s.photos));
export function moveItem(items,from,to){if(from<0||from>=items.length||to<0||to>=items.length)return;items.splice(to,0,items.splice(from,1)[0]);}
const encoder=new TextEncoder(),decoder=new TextDecoder();
const crcTable=Array.from({length:256},(_,i)=>{let c=i;for(let n=0;n<8;n++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
export function crc32(bytes){let crc=0xffffffff;for(const b of bytes)crc=crcTable[(crc^b)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
// Standard uncompressed ZIP: iPad Files can extract it, no third-party service.
export function makeZip(files){
  let offset=0;const chunks=[],central=[];
  for(const [name,input] of files){
    const nameBytes=encoder.encode(name),data=typeof input==='string'?encoder.encode(input):input;
    const crc=crc32(data),local=new Uint8Array(30+nameBytes.length),lv=new DataView(local.buffer);
    lv.setUint32(0,0x04034b50,true);lv.setUint16(4,20,true);lv.setUint16(6,0x800,true);lv.setUint16(12,33,true);lv.setUint32(14,crc,true);lv.setUint32(18,data.length,true);lv.setUint32(22,data.length,true);lv.setUint16(26,nameBytes.length,true);local.set(nameBytes,30);
    const cd=new Uint8Array(46+nameBytes.length),cv=new DataView(cd.buffer);cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0x800,true);cv.setUint16(14,33,true);cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);cv.setUint16(28,nameBytes.length,true);cv.setUint32(42,offset,true);cd.set(nameBytes,46);
    chunks.push(local,data);central.push(cd);offset+=local.length+data.length;
  }
  const centralSize=central.reduce((n,c)=>n+c.length,0),end=new Uint8Array(22),v=new DataView(end.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,files.length,true);v.setUint16(10,files.length,true);v.setUint32(12,centralSize,true);v.setUint32(16,offset,true);
  return new Blob([...chunks,...central,end],{type:'application/zip'});
}
export function readZip(buffer){
  const bytes=new Uint8Array(buffer),view=new DataView(buffer),files=new Map();let offset=0,total=0;
  while(offset+4<=bytes.length&&view.getUint32(offset,true)===0x04034b50){
    if(offset+30>bytes.length)throw Error('备份文件不完整');
    const flags=view.getUint16(offset+6,true),method=view.getUint16(offset+8,true),size=view.getUint32(offset+18,true),rawSize=view.getUint32(offset+22,true),nameLength=view.getUint16(offset+26,true),extra=view.getUint16(offset+28,true);
    if(flags&9||method!==0||size!==rawSize)throw Error('请使用本相册导出的原始 ZIP 备份，不要重新压缩');
    const start=offset+30+nameLength+extra,end=start+size;
    if(end>bytes.length||end<=offset||(total+=size)>MAX_EXPORT_BYTES)throw Error('备份文件过大或不完整');
    const name=decoder.decode(bytes.subarray(offset+30,offset+30+nameLength));
    if(!['album.json','draft.json'].includes(name)&&!PHOTO_NAME.test(name))throw Error('备份包含不支持的文件');
    if(files.has(name))throw Error('备份包含重复文件');
    const data=bytes.slice(start,end);if(crc32(data)!==view.getUint32(offset+14,true))throw Error('备份文件校验失败');files.set(name,data);offset=end;
  }
  if(!files.size||offset+4>bytes.length||view.getUint32(offset,true)!==0x02014b50)throw Error('无法识别这个 ZIP 备份');
  return files;
}
