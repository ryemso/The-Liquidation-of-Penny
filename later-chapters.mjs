// Shared traversal contract, chapter-specific elevation, encounters and signage.
const profiles={
 2:{upper:'기관 주문 데크',lower:'로비 우회로',heights:[515,410,305,210,305,210,320,420],types:['shield','drone','shield','ghost'],hint:'방패 뒤로 이동 · 조준선이 고정되면 회피'},
 3:{upper:'알고리즘 전송 회랑',lower:'캐시 우회로',heights:[515,405,295,185,75,185,295,405],types:['drone','ghost','drone','bomb'],hint:'조준을 유도한 뒤 대시 · 높은 발판으로 이동'},
 4:{upper:'지급준비 상층 금고',lower:'국채 하부 통로',heights:[515,415,315,215,115,215,315,415],types:['shield','shield','drone','ghost'],hint:'단단한 방패는 뒤에서 · 익절로 관통'},
 5:{upper:'버블 상층 균열',lower:'가격발견 우회로',heights:[515,405,300,190,300,190,300,405],types:['bomb','ghost','drone','shield'],hint:'폭탄의 준비 동작을 보고 이탈 · 공중 재진입'}
};
const ledge=(x,y,w=190)=>({x:Math.round(x),y,w,h:18});
export function buildLaterChapters(g){
 if(g.spec.chapter<2)return;
 const profile=profiles[g.spec.chapter],kind=g.spec.kind,local=g.room%5;
 const floor={x:0,y:620,w:g.width,h:100,ground:true};
 if(kind==='shop'||kind==='boss'){
  const heights=kind==='shop'?[515,410,315,410,515]:[515,420,330,420,515];
  const platforms=heights.map((y,i)=>ledge(250+i*(g.width-680)/4,y,180));
  g.terrain={walls:[],ledges:platforms,traps:[],extra:[]};g.platforms=[floor,...platforms];
  g.roomSigns=[[g.width/2,kind==='shop'?265:275,kind==='shop'?'안전 구역 · 점프와 내려가기 연습':profile.hint]];return;
 }
 const heights=profile.heights.map((y,i)=>local===1&&i>1&&i<6?y-30:y);
 const ledges=heights.map((y,i)=>ledge(300+i*(g.width-950)/7,y));
 const walls=[2,5].map(i=>({x:ledges[i].x-64,y:ledges[i].y,w:64,h:440-ledges[i].y,solid:true}));
 const mineLedge=ledges[6];
 const traps=[{id:'route-mine',type:'mine',x:mineLedge.x+90,y:mineLedge.y-10,w:24,h:10,armed:false,spent:false,timer:0},
 {id:'route-spikes',type:'spikes',x:ledges[3].x+120,y:ledges[3].y-14,w:48,h:14}];
 g.terrain={walls,ledges,traps,extra:[]};g.platforms=[floor,...walls,...ledges];
 const rows=[];
 for(let i=0;i<4;i++)rows.push([g.spec.chapter===5&&i===2?'bomb':'shield',540+i*(g.width-900)/3,620,false,'lower']);
 for(let i=0;i<8;i++){const p=ledges[i],type=profile.types[i%4],flying=['ghost','drone'].includes(type);rows.push([type,p.x+8,p.y-(flying?45:0),kind==='elite'&&i===5,'upper']);}
 g.enemies=rows.map(([type,x,bottom,elite,band])=>{const e=g.makeEnemy(type,x,bottom,elite);e.anchorY=e.y;e.encounterRange=kind==='elite'?400:320;e.routeBand=kind==='elite'?null:band;return e;});
 const base=ledge(g.width-560,414,150),step=ledge(base.x-65,318,140),top=ledge(base.x+65,226,140);
 g.platforms.push(base,step,top);g.terrain.ledges.push(base,step,top);
 Object.assign(g.relic,{x:top.x+70,y:201,trial:local!==0,hidden:local===1});
 g.roomSigns=[[410,565,kind==='elite'?'봉쇄 전투 · 본 전투 처치 후 출구 개방':profile.lower+' → 출구'],[ledges[2].x+95,ledges[2].y-40,profile.upper],[g.width-380,530,profile.hint]];
 if(kind==='elite')return;
 const switchLedge=ledges[5];
 g.exploration={routes:[],shortcut:false,rejoined:false,switchX:switchLedge.x+100,switchY:switchLedge.y,bridge:ledge(walls[0].x,440,switchLedge.x+190-walls[0].x),routeStart:500,routeEnd:g.width-380,rejoinX:g.width-300,upperName:profile.upper,lowerName:profile.lower};
}
