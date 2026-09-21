import {escapeHTML as h} from './core.mjs';
const TILE_URL='https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export class AtlasMap {
  constructor(host,{stops=[],route=false,onSelect,onPick,fit=false}={}){
    this.host=host;this.stops=stops;
    host.innerHTML='<div class="leaflet-canvas"></div><div class="map-tools"><button data-map="world">◎ 全球</button><button data-map="fit">查看足迹</button></div><p class="tile-error" hidden>地图暂时无法加载，请检查网络；仍可使用地点列表浏览。</p>';
    if(!window.L){host.querySelector('.tile-error').hidden=false;return;}
    const L=window.L;
    this.map=L.map(host.querySelector('.leaflet-canvas'),{minZoom:2,maxZoom:19,maxBounds:[[-85,-180],[85,180]],maxBoundsViscosity:1}).setView([23,15],2);
    this.map.zoomControl.setPosition('bottomright');
    const layer=L.tileLayer(TILE_URL,{maxZoom:19,noWrap:true,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'}).addTo(this.map);
    let failed=false;layer.on('tileerror',()=>{failed=true;host.querySelector('.tile-error').hidden=false;});layer.on('loading',()=>{failed=false;});layer.on('load',()=>{if(!failed)host.querySelector('.tile-error').hidden=true;});
    if(route)for(let i=1;i<stops.length;i++){
      const a=stops[i-1],b=stops[i];let lng=b.lng;while(lng-a.lng>180)lng-=360;while(lng-a.lng< -180)lng+=360;
      const paths=[];
      if(lng>180||lng< -180){const edge=lng>180?180:-180;const lat=a.lat+(b.lat-a.lat)*(edge-a.lng)/(lng-a.lng);paths.push([[a.lat,a.lng],[lat,edge]],[[lat,-edge],[b.lat,b.lng]]);}else paths.push([[a.lat,a.lng],[b.lat,b.lng]]);
      paths.forEach(p=>L.polyline(p,{color:'#235c49',weight:3,opacity:.85,dashArray:'7 7',interactive:false}).addTo(this.map));
    }
    const groups=new Map();stops.forEach((s,i)=>{const key=s.lat.toFixed(5)+','+s.lng.toFixed(5);if(!groups.has(key))groups.set(key,[]);groups.get(key).push({s,i});});
    for(const group of groups.values()){
      const {s,i}=group[0],label=group.length>1?String(group.length):route?String(i+1):'';
      const icon=L.divIcon({className:'travel-marker',html:'<span>'+label+'</span>',iconSize:[26,26],iconAnchor:[13,13]});
      const marker=L.marker([s.lat,s.lng],{icon,title:group.map(x=>x.s.city).join(' · '),keyboard:true}).addTo(this.map).bindTooltip(h(s.city),{direction:'top',offset:[0,-12]});
      if(group.length===1)marker.on('click',()=>onSelect?.(s));
      else{const list=document.createElement('div');group.forEach(({s,i})=>{const button=document.createElement('button');button.className='map-visit';button.textContent=(i+1)+'. '+s.city+(s.date?' · '+s.date:'');button.onclick=()=>onSelect?.(s);list.append(button);});marker.bindPopup(list);}
    }
    if(onPick)this.map.on('click',e=>onPick(Math.max(-85,Math.min(85,e.latlng.lat)),Math.max(-180,Math.min(180,e.latlng.lng))));
    this.events=new AbortController();host.querySelectorAll('[data-map]').forEach(button=>button.addEventListener('click',()=>button.dataset.map==='world'?this.map.setView([23,15],2):this.fit(),{signal:this.events.signal}));
    this.observer=new ResizeObserver(()=>this.map?.invalidateSize());this.observer.observe(host);
    if(fit)this.fit();
  }
  fit(stops=this.stops){if(this.map&&stops.length)this.map.fitBounds(stops.map(s=>[s.lat,s.lng]),{padding:[40,50],maxZoom:11});}
  destroy(){this.events?.abort();this.observer?.disconnect();this.map?.remove();this.map=null;}
}
