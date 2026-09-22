// Chapter-one layouts share movement rules, but each room has a different purpose.
const ledge=(x,y,w)=>({x,y,w,h:18});
function layout(g,walls,ledges,traps=[]){g.terrain={walls,ledges,traps,extra:[]};g.platforms=[{x:0,y:620,w:g.width,h:100,ground:true},...walls,...ledges];}
function spawn(g,rows){g.enemies=rows.map(([type,x,bottom,elite=false,band=null])=>{const e=g.makeEnemy(type,x,bottom,elite);e.routeBand=band;e.anchorY=e.y;e.encounterRange=360;return e;});}
function cache(g,x,y){const base=ledge(x,y,150),step=ledge(x-65,y-96,140),top=ledge(x+65,y-188,140);g.platforms.push(base,step,top);g.terrain.ledges.push(base,step,top);Object.assign(g.relic,{x:top.x+70,y:top.y-25});}
export function buildChapterOne(g){
 g.roomSigns=[];
 if(g.room===0){
  layout(g,[{x:550,y:270,w:64,h:170,solid:true},{x:1020,y:120,w:64,h:220,solid:true}],
   [ledge(300,515,190),ledge(450,410,170),ledge(660,300,190),ledge(840,200,170),ledge(1030,120,160),ledge(1270,410,170)],
   [{id:'alley-mine',type:'mine',x:1320,y:610,w:24,h:10,armed:false,spent:false,timer:0}]);
  spawn(g,[['rubble',690,620,false,'lower'],['rubble',1120,620,false,'lower'],['rubble',1480,620,false,'lower'],['rubble',680,300,false,'upper'],['ghost',855,180,false,'upper'],['ghost',1100,150,false,'upper'],['rubble',1280,410,false,'upper'],['ghost',1410,320,false,'upper']]);
  cache(g,1150,414);
  g.exploration={routes:[],shortcut:false,rejoined:false,switchX:1115,switchY:120,bridge:ledge(550,440,500),routeStart:500,routeEnd:1420,rejoinX:1460};
  g.roomSigns=[[250,565,'C 짧게 / 길게 · 점프 높이 조절'],[455,355,'벽 방향 유지 · C 벽 점프'],[740,255,'공중 ↓+X · 적중하면 반동'],[1050,565,'하층 → 출구 / 상층 → 토템']];
 }else if(g.room===1){
  // Give the switch a stable landing, reduce simultaneous upper-room pressure.
  g.exploration.routeStart=600;g.exploration.routeEnd=1740;g.exploration.rejoinX=1800;
  for(const e of g.enemies)e.encounterRange=e.routeBand==='upper'?320:380;
  g.roomSigns=[[420,565,'하층 → 출구 · 전멸 불필요'],[520,365,'상층 ↑ 선택 토템 도전'],[1800,530,'재합류 → 상점']];
 }else if(g.room===2){
  layout(g,[],[ledge(280,515,180),ledge(445,410,170),ledge(610,315,170),ledge(805,410,170),ledge(970,515,170)]);
  g.roomSigns=[[360,565,'안전 구역 · 이동을 연습하세요'],[680,260,'↓+C 내려가기 · 아래 발판에 착지'],[1040,565,'↑ 다음 전투 구역']];
 }else if(g.room===3){
  layout(g,[{x:660,y:510,w:64,h:110,solid:true},{x:1460,y:510,w:72,h:110,solid:true}],
   [ledge(350,515,200),ledge(575,405,190),ledge(840,310,210),ledge(1100,410,200),ledge(1360,405,200),ledge(1640,310,190)],
   [{id:'exchange-spikes',type:'spikes',x:950,y:606,w:60,h:14},{id:'exchange-mine',type:'mine',x:1710,y:610,w:24,h:10,armed:false,spent:false,timer:0}]);
  spawn(g,[['rubble',440,620],['shield',730,620],['ghost',850,350],['bomb',960,310],['rubble',1130,620],['ghost',1190,350],['shield',1545,620,true],['drone',1670,320],['rubble',1850,620],['ghost',1940,400],['bomb',1390,405],['rubble',2020,620]]);
  cache(g,1730,414);
  g.roomSigns=[[340,565,'봉쇄 전투 · 적을 처치하면 출구 개방'],[1060,260,'발판으로 회피 · 아래 공격으로 재진입'],[1800,180,'선택 도전 · 본 전투와 별도']];
 }else if(g.room===4){
  // Keep a clear floor for the boss charge and intermediate aerial escape steps.
  layout(g,[],[ledge(250,515,200),ledge(490,420,170),ledge(730,330,200),ledge(1000,420,170),ledge(1240,515,200)]);
  g.roomSigns=[[240,565,'보스 돌진은 점프로 · 발판에서 반격']];
 }
}
