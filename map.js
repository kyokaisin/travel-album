import {escapeHTML as h} from './core.mjs';
const project=(lng,lat)=>[(lng+180)*1000/360,(90-lat)*500/180];
let geography;
async function world(){return geography??=(fetch('./world.json').then(r=>{if(!r.ok)throw Error('地图加载失败');return r.json()}).catch(e=>{geography=null;throw e}));}
export class AtlasMap {
  constructor(host,{stops=[],route=false,onSelect,onPick,fit=false}={}){
    this.host=host;this.stops=stops;this.route=route;this.onSelect=onSelect;this.onPick=onPick;this.k=1;this.x=0;this.y=0;this.pointers=new Map();this.destroyed=false;
    host.innerHTML=`<svg class="world-map" viewBox="0 0 1000 500" role="img" aria-label="可缩放的世界地图"><rect width="1000" height="500" fill="#e8efed"/><g class="geography"></g><g class="map-route"></g><g class="map-markers"></g></svg><div class="map-tools"><button data-map="world">◎ 全球</button><button data-map="fit">查看足迹</button></div><div class="zoom-tools"><button data-map="in" aria-label="放大地图">＋</button><button data-map="out" aria-label="缩小地图">−</button></div><small class="map-credit">Natural Earth · 路线为行程示意</small><div class="map-tooltip" hidden></div>`;
    this.svg=host.querySelector('svg');this.land=host.querySelector('.geography');this.lines=host.querySelector('.map-route');this.markers=host.querySelector('.map-markers');this.tip=host.querySelector('.map-tooltip');
    this.events=new AbortController();const signal=this.events.signal;
    host.addEventListener('click',e=>{const control=e.target.closest('[data-map]');if(control){const action=control.dataset.map;if(action==='world'){this.k=1;this.x=0;this.y=0;this.draw()}else if(action==='fit')this.fit();else this.zoom(action==='in'?1.6:1/1.6,500,250)}},{signal});
    const point=e=>{const m=this.svg.getScreenCTM();return {x:(e.clientX-m.e)/m.a,y:(e.clientY-m.f)/m.d}};
    this.svg.addEventListener('pointerdown',e=>{const p=point(e);this.pointers.set(e.pointerId,p);this.drag={x:this.x,y:this.y,k:this.k,points:[...this.pointers.values()],target:e.target,travel:0};this.svg.setPointerCapture(e.pointerId)},{signal});
    this.svg.addEventListener('pointermove',e=>{if(!this.pointers.has(e.pointerId)||!this.drag)return;this.pointers.set(e.pointerId,point(e));const now=[...this.pointers.values()],start=this.drag.points;if(now.length===1&&start.length===1){this.x=this.drag.x+now[0].x-start[0].x;this.y=this.drag.y+now[0].y-start[0].y;this.drag.travel=Math.max(this.drag.travel,Math.hypot(now[0].x-start[0].x,now[0].y-start[0].y));}else if(now.length>=2&&start.length>=2){const d=(a)=>Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);const k=Math.min(40,Math.max(1,this.drag.k*d(now)/Math.max(1,d(start))));const sx=(start[0].x+start[1].x)/2,sy=(start[0].y+start[1].y)/2;this.x=(now[0].x+now[1].x)/2-(sx-this.drag.x)*k/this.drag.k;this.y=(now[0].y+now[1].y)/2-(sy-this.drag.y)*k/this.drag.k;this.k=k;this.drag.travel=100;}this.draw()},{signal});
    const finish=e=>{if(!this.pointers.has(e.pointerId))return;const p=point(e);const drag=this.drag;this.pointers.delete(e.pointerId);if(drag?.travel<5&&drag.points.length===1){const marker=drag.target.closest('[data-marker]');if(marker)this.select(Number(marker.dataset.marker));else if(this.onPick){const lng=((p.x-this.x)/this.k)/1000*360-180,lat=90-((p.y-this.y)/this.k)/500*180;if(lng>=-180&&lng<=180&&lat>=-85&&lat<=85)this.onPick(lat,lng);}}this.drag=this.pointers.size?{x:this.x,y:this.y,k:this.k,points:[...this.pointers.values()],travel:100}:null;};
    this.svg.addEventListener('pointerup',finish,{signal});this.svg.addEventListener('pointercancel',e=>{this.pointers.delete(e.pointerId);this.drag=null},{signal});
    this.svg.addEventListener('wheel',e=>{e.preventDefault();const p=point(e);this.zoom(e.deltaY<0?1.2:1/1.2,p.x,p.y)},{signal,passive:false});
    this.svg.addEventListener('keydown',e=>{const marker=e.target.closest('[data-marker]');if(marker&&['Enter',' '].includes(e.key)){e.preventDefault();this.select(Number(marker.dataset.marker));}},{signal});
    world().then(data=>{if(this.destroyed)return;this.land.innerHTML=data.features.map(f=>{const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;const d=polys.map(poly=>poly.map(r=>r.map(([lng,lat],i)=>{const [x,y]=project(lng,lat);return (i?'L':'M')+x.toFixed(2)+','+y.toFixed(2)}).join('')+'Z').join('')).join('');return `<path d="${d}"/>`}).join('');if(fit)this.fit();else this.draw();}).catch(()=>{if(!this.destroyed){const message=document.createElement('p');message.className='map-error';message.textContent='底图暂时无法加载，可继续通过地点列表浏览';host.append(message);this.draw();}});
    this.draw();
  }
  zoom(f,cx,cy){const k=Math.min(40,Math.max(1,this.k*f));this.x=cx-(cx-this.x)*k/this.k;this.y=cy-(cy-this.y)*k/this.k;this.k=k;this.draw();}
  fit(stops=this.stops){if(!stops.length)return;const ps=stops.map(s=>project(s.lng,s.lat)),xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]);const loX=Math.min(...xs),hiX=Math.max(...xs),loY=Math.min(...ys),hiY=Math.max(...ys);this.k=Math.min(35,Math.max(1,Math.min(760/Math.max(hiX-loX,20),320/Math.max(hiY-loY,12))));this.x=500-(loX+hiX)/2*this.k;this.y=250-(loY+hiY)/2*this.k;this.draw();}
  select(i){const group=this.groups[i];if(!group)return;if(group.length>1&&new Set(group.map(s=>`${s.lat},${s.lng}`)).size>1&&this.k<39)this.fit(group);else this.onSelect?.(group[0]);}
  draw(){
    this.x=Math.min(900,Math.max(100-1000*this.k,this.x));this.y=Math.min(450,Math.max(50-500*this.k,this.y));
    this.land.setAttribute('transform',`translate(${this.x} ${this.y}) scale(${this.k})`);
    this.land.style.setProperty('--border-width',String(.65/this.k));
    const screen=s=>{const p=project(s.lng,s.lat);return [p[0]*this.k+this.x,p[1]*this.k+this.y]};
    let lines='';if(this.route)for(let i=1;i<this.stops.length;i++){const a=this.stops[i-1],b=this.stops[i];const p=screen(a),q=screen(b);const d=b.lng-a.lng;if(Math.abs(d)<=180)lines+=`<path d="M${p} L${q}"/>`;else {const end=project(b.lng+(d>0?-360:360),b.lat);const extended=[end[0]*this.k+this.x,end[1]*this.k+this.y];const start=project(a.lng+(d>0?360:-360),a.lat);lines+=`<path d="M${p} L${extended}"/><path d="M${[start[0]*this.k+this.x,start[1]*this.k+this.y]} L${q}"/>`;}}
    this.lines.innerHTML=lines;this.groups=[];for(const s of this.stops){const p=screen(s);const g=this.groups.find(g=>{const q=screen(g[0]);return Math.hypot(p[0]-q[0],p[1]-q[1])<24});if(g)g.push(s);else this.groups.push([s]);}
    this.markers.innerHTML=this.groups.map((g,i)=>{const [x,y]=screen(g[0]),names=[...new Set(g.map(s=>s.city))].join(' · ');const label=g.length>1?g.length:this.route?this.stops.indexOf(g[0])+1:'';return `<g data-marker="${i}" role="button" tabindex="0" aria-label="${h(names)}" transform="translate(${x} ${y})"><title>${h(names)}</title><circle class="pin-halo" r="16"/><circle class="pin" r="${label?11:6}"/>${label?`<text class="pin-number" y="4">${label}</text>`:''}<text class="pin-label" y="-24">${h(names)}</text></g>`}).join('');
  }
  destroy(){this.destroyed=true;this.events.abort();this.pointers.clear();}
}
