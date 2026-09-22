// Hand-authored pilot: a floor bypass and a climbable upper trading hall.
export function buildCrossroads(g){
 g.conceptCard=null;if(g.room!==1){g.exploration=null;return;}
 const ledge=(x,y,w)=>({x,y,w,h:18});
 const walls=[{x:650,y:180,w:64,h:260,solid:true},{x:1180,y:-40,w:64,h:260,solid:true}];
 const ledges=[ledge(310,515,180),ledge(465,410,160),ledge(714,300,120),ledge(815,190,180),ledge(980,80,180),ledge(1170,-40,160),ledge(1245,190,105),ledge(1350,130,150),ledge(1490,275,190),ledge(1740,430,190)];
 // Keep the cache's three-step approach explicit and inside playable bounds.
 ledges.push(ledge(1370,414,150),ledge(1305,318,140),ledge(1435,226,140));
 g.terrain={walls,ledges,traps:[{id:'upper-spikes',type:'spikes',x:1535,y:261,w:48,h:14},{id:'upper-mine',type:'mine',x:875,y:180,w:24,h:10,armed:false,spent:false,timer:0}],extra:[]};
 g.platforms=[{x:0,y:620,w:g.width,h:100,ground:true},...walls,...ledges];
 const spawns=[['rubble',750,620],['rubble',1150,620],['rubble',1620,620],['shield',510,410],['ghost',735,270],['drone',910,150],['ghost',1080,40],['drone',1280,100],['shield',1500,226],['ghost',1650,330],['drone',1800,370],['ghost',1400,290]];
 g.enemies=spawns.map(([type,x,y],i)=>{const e=g.makeEnemy(type,x,y);e.routeBand=i<3?'lower':'upper';e.anchorY=e.y;return e;});
 Object.assign(g.relic,{x:1505,y:201,trial:true,hidden:true});
 g.exploration={routes:[],shortcut:false,rejoined:false,switchX:1260,switchY:190,bridge:ledge(650,440,530)};
 g.conceptCard=null;
}
export function explain(g,id,title,lines){
 g.learnedConcepts??=new Set();if(g.learnedConcepts.has(id))return;g.learnedConcepts.add(id);
 g.conceptCard={title,lines,remaining:8};g.log.add('concept_exposed',{concept:id,source:'gameplay_analogy'});
}
export function updateExploration(g,dt){
 if(g.conceptCard)g.conceptCard.remaining=Math.max(0,g.conceptCard.remaining-dt);
 const r=g.exploration,p=g.player;if(!r)return;
 const route=p.x>(r.routeStart??600)&&p.x<(r.routeEnd??1740)?(p.y+p.h<460?'upper':p.y>500?'lower':null):null;
 if(route&&!r.routes.includes(route)){r.routes.push(route);g.log.add('route_selected',{route,first:r.routes.length===1});g.emit('notice',{text:route==='upper'?(r.upperName||'상층 거래소')+' · 이동 도전 / 선택 토템':(r.lowerName||'하층 배수로')+' · 적을 지나쳐 출구로 이동 가능',duration:3});}
 if(!r.rejoined&&p.x>(r.rejoinX??1800)){r.rejoined=true;g.log.add('route_rejoined',{routes:[...r.routes]});}
 if(r.shortcut&&!r.shortcutUsed&&p.x>r.bridge.x&&p.x<r.bridge.x+r.bridge.w&&Math.abs(p.y+p.h-r.bridge.y)<3){r.shortcutUsed=true;g.log.add('shortcut_used');}
}
export function interactExploration(g){
 const r=g.exploration,p=g.player;if(!r||r.shortcut||Math.hypot(p.x+p.w/2-r.switchX,p.y+p.h-r.switchY)>85)return false;
 r.shortcut=true;g.platforms.splice(1,0,r.bridge);g.log.add('shortcut_opened');
 g.emit('notice',{text:'연결교 개방 · 하층에서 상층으로 돌아오는 길이 열렸습니다.',duration:4});
 explain(g,'breakout','돌파', ['가격이 지지·저항 구간을 넘어서는 움직임입니다.','경계를 넘어 길을 여는 게임적 비유이며, 상승을 보장하지 않습니다.']);return true;
}
export function drawExploration(ctx,g){
 const r=g.exploration;
 ctx.save();ctx.font='13px sans-serif';ctx.textAlign='center';
 for(const [x,y,text]of (g.roomSigns||[])){ctx.fillStyle='#101923';ctx.fillRect(x-105,y-18,210,26);ctx.fillStyle='#d8c6a0';ctx.fillText(text,x,y);}
 if(!r){ctx.restore();return;}
 ctx.fillStyle=r.shortcut?'#8ac6ab':'#d4a977';ctx.fillRect(r.switchX-12,r.switchY-26,24,26);ctx.fillText(r.shortcut?'연결교 개방':'↑ 연결교 개방',r.switchX,r.switchY-38);
 if(!r.shortcut){ctx.strokeStyle='#b0a07870';ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(r.bridge.x,r.bridge.y);ctx.lineTo(r.bridge.x+r.bridge.w,r.bridge.y);ctx.stroke();}
 ctx.restore();
}
