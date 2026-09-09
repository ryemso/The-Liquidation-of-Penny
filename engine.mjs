export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export const MARKETS=[{name:'횡보장',detail:'기본 전투 상태',color:'#b8ccda'},{name:'상승장',detail:'공격력 +15%',color:'#ef947e'},{name:'하락장',detail:'적 피해 +15% · 시드 +35%',color:'#7dbfe8'}];
export const CARDS=[
 {id:'growth',name:'성장주',tag:'GROWTH',symbol:'↗',desc:'기본 공격력 +5. 공격 적중 시 수익을 1 더 획득합니다.',price:65},
 {id:'dividend',name:'배당주',tag:'DIVIDEND',symbol:'✚',desc:'전투방을 클리어할 때 체력 12 회복. 즉시 체력 12 회복.',price:60},
 {id:'value',name:'가치주',tag:'VALUE',symbol:'▣',desc:'최대 체력 +20, 체력 20 회복. 받는 피해 8% 감소.',price:65},
 {id:'meme',name:'밈주식',tag:'VOLATILITY',symbol:'ϟ',desc:'치명타 확률 +20%p. 치명타는 2배 피해를 줍니다.',price:60},
 {id:'liquidity',name:'유동성 공급',tag:'LIQUIDITY',symbol:'≈',desc:'이동 속도 +12%. 대시 재사용 대기시간 20% 감소.',price:55},
 {id:'short',name:'숏 포지션',tag:'SHORT',symbol:'↘',desc:'하락장에서 공격력 +30%. 익절 공격력이 항상 20% 증가.',price:60},
 {id:'circuit',name:'거래 정지권',tag:'CONTROL',symbol:'Ⅱ',desc:'서킷브레이커 지속시간 +1초, 재사용 대기시간 3초 감소.',price:70},
 {id:'profit',name:'분할 익절',tag:'TAKE PROFIT',symbol:'%',desc:'익절할 때 체력 8 회복. 공격 적중 시 수익을 4 더 획득.',price:65},
 {id:'breakout',name:'저항선 돌파',tag:'BREAKOUT',symbol:'⇥',desc:'방패의 정면 피해 감소를 35%p 무시합니다. 기본 공격력 +3.',price:85,chapter:2},
 {id:'hedge',name:'헤지 계약',tag:'HEDGE',symbol:'◇',desc:'서킷브레이커를 발동할 때 체력 10 회복. 받는 피해 5% 감소.',price:80,chapter:2},
];
export const ROOM_SPECS=[
 {name:'폐장 골목',kind:'combat',subtitle:'01 · 작은 반란',width:1780,platforms:[[440,514,220],[815,414,200],[1110,514,230]],enemies:[['rubble',660,620],['rubble',1280,620]]},
 {name:'손절 교차로',kind:'combat',subtitle:'02 · 위험을 읽는 법',width:2120,platforms:[[350,518,200],[700,414,210],[1000,512,250],[1400,418,220],[1710,520,190]],enemies:[['rubble',590,620],['bomb',1090,512],['rubble',1480,620],['ghost',1660,420]]},
 {name:'공칠의 거래소',kind:'shop',subtitle:'03 · 다음 수를 준비하라',width:1280,platforms:[[360,518,190],[700,518,220]],enemies:[]},
 {name:'폐쇄 거래소',kind:'elite',subtitle:'04 · 적대적 인수',width:2200,platforms:[[400,520,220],[760,414,240],[1150,514,240],[1550,414,220],[1850,520,190]],enemies:[['rubble',650,620],['ghost',950,420],['bomb',1220,514],['rubble',1580,620,true],['ghost',1840,420]]},
 {name:'작전세력 소굴',kind:'boss',bossName:'잠식된 선동가',subtitle:'05 · 잠식된 선동가',width:1660,platforms:[[280,502,190],[700,420,220],[1160,502,190]],enemies:[['boss',1190,620]]},
 {name:'증권사 로비',kind:'combat',subtitle:'01 · 닫힌 문을 두드려라',width:1900,platforms:[[360,520,220],[710,416,210],[1080,518,240],[1480,424,220]],enemies:[['shield',660,620],['drone',1120,452],['shield',1490,620]]},
 {name:'기관 주문센터',kind:'combat',subtitle:'02 · 주문의 흐름',width:2250,platforms:[[310,518,190],[620,420,230],[1000,520,260],[1390,418,230],[1770,516,230]],enemies:[['shield',620,620],['drone',925,430],['bomb',1100,520],['shield',1490,620],['drone',1840,420]]},
 {name:'리스크 관리실',kind:'shop',subtitle:'03 · 위험을 나눠라',width:1280,platforms:[[350,514,200],[780,514,210]],enemies:[]},
 {name:'공매도 구역',kind:'elite',subtitle:'04 · 빌린 힘의 대가',width:2300,pressure:true,platforms:[[330,520,230],[710,414,220],[1080,516,240],[1470,420,240],[1870,514,210]],enemies:[['shield',680,620,true],['drone',990,425],['ghost',1320,435],['shield',1660,620],['drone',1960,430]]},
 {name:'헤지펀드 본사',kind:'boss',bossName:'헤지펀드 집행관',subtitle:'05 · 헤지펀드 집행관',width:1840,platforms:[[270,510,220],[630,414,230],[1020,510,220],[1400,414,210]],enemies:[['enforcer',1320,620]]},
].map((room,i)=>({...room,chapter:i<5?1:2,chapterName:i<5?'잡주의 골목':'기관의 벽',localRoom:i%5+1}));
// Semi-solid ledges permit jumping from below. Swept foot crossing prevents tunneling.
export function moveBody(body,dt,platforms,width){
 const oldBottom=body.y+body.h;
 body.x=clamp(body.x+body.vx*dt,8,width-body.w-8);
 body.vy=Math.min(body.vy+1560*dt,980);
 body.y+=body.vy*dt;body.grounded=false;
 if(body.vy>=0){
  let top=Infinity;
  for(const p of platforms)if(oldBottom<=p.y+.5&&body.y+body.h>=p.y&&body.x+body.w>p.x+2&&body.x<p.x+p.w-2)top=Math.min(top,p.y);
  if(top!==Infinity){body.y=top-body.h;body.vy=0;body.grounded=true;}
 }
 if(body.y<70){body.y=70;body.vy=Math.max(0,body.vy);}
}
export class Game{
 constructor({random=Math.random,onEvent=()=>{},knowledge=0}={}){
  this.random=random;this.onEvent=onEvent;this.knowledge=knowledge;this.state='title';this.enemies=[];this.projectiles=[];this.hazards=[];this.particles=[];this.texts=[];this.effects=[];this.room=0;this.t=0;this.camera=0;this.shake=0;this.market=0;this.marketClock=0;this.freeze=0;this.hitstop=0;this.totalTime=0;this.kills=0;this.spent=0;this.build=[];this.clearedRooms=0;this.promoted=false;this.rank='PENNY STOCK';this.stats={atk:18,speed:255,crit:.05,armor:0,dividend:0,profitHeal:0,profitGain:0,short:0,circuitExtra:0,circuitReduce:0,dashFactor:1,guardPierce:0,circuitHeal:0};this.player=this.newPlayer();this.setRoom(0,false);
 }
 newPlayer(){const hp=100+Math.min(20,this.knowledge*2);return{x:120,y:540,w:30,h:56,vx:0,vy:0,grounded:false,facing:1,hp,maxHp:hp,inv:0,jumps:0,coyote:0,jumpBuffer:0,attack:0,attackCD:0,combo:0,comboClock:0,dash:0,dashCD:0,profit:0,profitCD:0,leverageCD:0,circuitCD:0,hurt:0,gold:30,leverage:0,leverageDamage:0,leverageKills:0};}
 emit(type,data={}){this.onEvent({type,...data});}
 start(){this.state='playing';this.emit('room',{room:this.spec});this.emit('notice',{text:'← → 이동 · C 2단 점프 · X 공격 · Z 대시',duration:7});}
 setRoom(index,announce=true){
  if(!ROOM_SPECS[index])return;
  this.room=index;this.spec=ROOM_SPECS[index];this.width=this.spec.width;this.platforms=[{x:0,y:620,w:this.width,h:100,ground:true},...this.spec.platforms.map(([x,y,w])=>({x,y,w,h:18}))];
  this.marketPeriod=this.spec.chapter===2?20:24;this.marketClock=Math.min(this.marketClock,this.marketPeriod-4);this.pressureClock=0;
  this.enemies=this.spec.enemies.map(([type,x,bottom,elite])=>this.makeEnemy(type,x,bottom,elite));this.projectiles=[];this.hazards=[];this.effects=[];this.particles=[];this.texts=[];this.doorOpen=this.spec.kind==='shop';this.rewardGiven=false;this.clearTimer=-1;this.camera=0;this.freeze=0;this.hitstop=0;this.shopVisited=false;
  Object.assign(this.player,{x:120,y:550,vx:0,vy:0,inv:1.3,jumps:0,dash:0,attack:0,grounded:false,jumpBuffer:0});
  if(this.player.leverage>0)this.settleLeverage();
  if(announce){this.emit('room',{room:this.spec});if(this.spec.kind==='shop')this.emit('notice',{text:`${this.spec.name} · 중앙 교환소 앞에서 ↑`,duration:5});if(this.spec.kind==='boss')this.emit('notice',{text:this.spec.chapter===1?'“내 말만 믿어. 손실은 언제나 네 몫이지.”':'“네 가치는 담보로도 부족하다. 청산을 집행한다.”',duration:5});if(index===5)this.emit('notice',{text:'방패는 뒤에서 공격하거나 익절로 관통하세요. 드론의 조준선은 발사 전에 고정됩니다.',duration:7});if(this.spec.pressure)this.emit('notice',{text:'공매도 경보 · 표시된 바닥 밖으로 이동하거나 발판으로 피하세요.',duration:6});}
 }
 enterChapterTwo(){if(this.state!=='chapter'||this.room!==4||this.promoted)return;this.promoted=true;this.rank='SMALL CAP';this.player.maxHp+=20;this.heal(45);this.stats.atk+=6;this.player.profit=50;for(const key of ['profitCD','leverageCD','circuitCD','dashCD'])this.player[key]=0;this.market=0;this.marketClock=0;this.state='playing';this.emit('resume');this.setRoom(5);this.emit('sound',{name:'reward'});}
 makeEnemy(type,x,bottom,elite=false){
  const data={rubble:{w:60,h:46,hp:52,speed:67,damage:12,gold:20},bomb:{w:50,h:50,hp:44,speed:45,damage:22,gold:24},ghost:{w:42,h:60,hp:46,speed:47,damage:10,gold:26,flying:true},boss:{w:110,h:138,hp:940,speed:55,damage:17,gold:170,boss:true},shield:{w:64,h:62,hp:105,speed:54,damage:17,gold:34,armored:true},drone:{w:48,h:42,hp:70,speed:65,damage:13,gold:32,flying:true},enforcer:{w:148,h:138,hp:1500,speed:53,damage:22,gold:250,boss:true,armored:true}}[type];
  const e={...data,type,x,y:bottom-data.h,vx:0,vy:0,facing:-1,grounded:!data.flying,elite,inv:0,flash:0,state:'idle',timer:.6+this.random(),anim:0,spawnX:x,spawnY:bottom-data.h,attackNo:0,activated:false,dead:false};if(elite){e.hp*=2;e.damage*=1.25;e.gold*=2;e.w*=1.15;e.h*=1.15;e.y=bottom-e.h;}e.maxHp=e.hp;return e;
 }
 action(name){
  if(this.state!=='playing')return;
  const p=this.player;
  if(name==='jump')p.jumpBuffer=.14;
  if(name==='attack')this.attack();
  if(name==='dash'&&p.dashCD<=0){p.dash=.19;p.dashCD=.88*this.stats.dashFactor;p.inv=Math.max(p.inv,.23);p.vy=0;this.emit('sound',{name:'dash'});this.effects.push({type:'dash',x:p.x,y:p.y,facing:p.facing,life:.22,max:.22});}
  if(name==='profit'){
   if(p.profitCD>0)return;
   if(p.profit<25){this.emit('notice',{text:'공격을 적중시켜 미실현 수익을 25 이상 모으세요.',duration:2});return;}
   const saved=p.profit;p.profit=0;p.profitCD=5;p.inv=Math.max(p.inv,.35);this.swing(185,this.damage()*(1+saved/30)*(1+this.stats.short*.2),true);this.heal(this.stats.profitHeal);this.effects.push({type:'profit',x:p.x+p.w/2,y:p.y+p.h/2,facing:p.facing,life:.45,max:.45});this.shake=8;this.emit('sound',{name:'profit'});this.emit('notice',{text:`익절! 수익 ${Math.floor(saved)}% 확정`,duration:1.8});
  }
  if(name==='leverage'&&p.leverageCD<=0){p.leverage=8;p.leverageCD=24;p.leverageDamage=0;p.leverageKills=0;this.emit('sound',{name:'lever'});this.emit('notice',{text:'8초 안에 2마리 처치 또는 피해 160! 실패 시 체력 −18 (최소 1)',duration:4});}
  if(name==='circuit'&&p.circuitCD<=0){this.freeze=2+this.stats.circuitExtra;p.circuitCD=Math.max(8,18-this.stats.circuitReduce);this.heal(this.stats.circuitHeal);this.emit('sound',{name:'circuit'});this.emit('notice',{text:'TRADING HALT · 적과 투사체 정지',duration:2});}
  if(name==='interact'){
   if(this.spec.kind==='shop'&&Math.abs(p.x-650)<170){this.state='shop';this.emit('shop');return;}
   if(p.x>this.width-180){
    if(!this.doorOpen){this.emit('notice',{text:'남은 적을 모두 처치하면 출구가 열립니다.',duration:2});return;}
    if(this.room===ROOM_SPECS.length-1){this.finish(true);return;}
    if(this.room===4){this.state='chapter';this.emit('chapter');return;}
    this.setRoom(this.room+1);
   }
  }
 }
 damage(){return this.stats.atk*(this.market===1?1.15:1)*(this.market===2?1+this.stats.short*.3:1)*(this.player.leverage>0?1.65:1);}
 attack(){const p=this.player;if(p.attackCD>0||p.dash>0)return;p.combo=p.comboClock>0?(p.combo+1)%3:0;p.comboClock=.9;p.attack=.23;p.attackCD=p.combo===2?.4:.27;const range=p.combo===2?110:85;this.swing(range,this.damage()*(p.combo===2?1.4:1),false);this.effects.push({type:'slash',x:p.x+p.w/2,y:p.y+p.h*.5,facing:p.facing,life:.22,max:.22,combo:p.combo});this.emit('sound',{name:'swing'});}
 swing(range,damage,profit){
  const p=this.player,hit={x:p.facing===1?p.x+p.w-6:p.x-range+6,y:p.y-20,w:range,h:p.h+40};let count=0;
  for(const e of this.enemies){if(e.dead||!overlap(hit,e))continue;const crit=this.random()<this.stats.crit;this.hitEnemy(e,damage*(crit?2:1),p.facing,crit,profit);count++;if(!profit)p.profit=clamp(p.profit+8+this.stats.profitGain,0,100);}
  if(count){this.hitstop=.045;this.shake=profit?8:3;this.emit('sound',{name:'hit'});}else if(!profit)this.effects.push({type:'miss',x:p.x,y:p.y,life:.01,max:.01});
 }
 hitEnemy(e,amount,direction=1,crit=false,pierce=false){
  if(e.dead)return;
  if(e.armored&&!pierce&&e.facing===-direction&&['idle','windup'].includes(e.state)){amount*=Math.min(1,.3+this.stats.guardPierce);this.floatText(e.x+e.w/2,e.y-31,'정면 방어','#82d0de',11);}
  const dealt=Math.min(e.hp,amount);e.hp-=amount;e.flash=.13;e.inv=.08;if(!e.boss)e.x=clamp(e.x+direction*20,0,this.width-e.w);
  this.floatText(e.x+e.w/2,e.y-12,String(Math.round(amount)),crit?'#fbd88e':'#edf0e8',crit?22:16);
  this.burst(e.x+e.w/2,e.y+e.h*.5,crit?'#ffd47e':'#d4dce3',7);
  if(this.player.leverage>0)this.player.leverageDamage+=dealt;
  if(e.hp<=0){e.dead=true;this.kills++;if(this.player.leverage>0)this.player.leverageKills++;const gold=Math.round(e.gold*(this.market===2?1.35:1));this.player.gold+=gold;this.floatText(e.x,e.y-40,`+${gold} 시드`,'#f0c875',13);this.burst(e.x+e.w/2,e.y+e.h/2,'#dcb96d',18);if(e.boss){this.shake=13;this.projectiles=[];this.hazards=[];this.emit('sound',{name:'bossdown'});}}
 }
 hurt(amount,sourceX){
  const p=this.player;if(p.inv>0||this.state!=='playing')return false;const real=Math.max(1,Math.round(amount*(1-clamp(this.stats.armor,0,.55))*(this.market===2?1.15:1)));p.hp=Math.max(0,p.hp-real);p.inv=.95;p.hurt=.22;p.profit=Math.floor(p.profit*.75);p.vx=(p.x>sourceX?1:-1)*240;p.vy=-220;this.shake=7;this.floatText(p.x,p.y-15,`−${real}`,'#ff8880',20);this.emit('sound',{name:'hurt'});if(p.hp<=0)this.finish(false);return true;
 }
 heal(amount){if(amount<=0)return;const p=this.player,actual=Math.min(p.maxHp-p.hp,amount);p.hp+=actual;if(actual>0)this.floatText(p.x,p.y-20,`+${actual} HP`,'#88d4ac',15);}
 settleLeverage(){const p=this.player;const ok=p.leverageDamage>=160||p.leverageKills>=2;p.leverage=0;if(ok){p.gold+=18;this.emit('notice',{text:'상환 성공 · 추가 시드 +18',duration:3});this.emit('sound',{name:'reward'});}else{p.hp=Math.max(1,p.hp-18);this.floatText(p.x,p.y-20,'상환 −18 HP','#ff9b7a',16);this.emit('notice',{text:'레버리지 상환 · 체력 −18',duration:3});}}
 chooseReward(id){if(this.state!=='reward')return;this.applyCard(id);this.state='playing';this.doorOpen=true;this.emit('resume');this.emit('notice',{text:'포트폴리오 편입 완료 · 오른쪽 출구에서 ↑',duration:4});}
 applyCard(id){const card=CARDS.find(c=>c.id===id);if(!card)return;this.build.push(id);const s=this.stats,p=this.player;
  if(id==='growth'){s.atk+=5;s.profitGain+=1;}if(id==='dividend'){s.dividend+=12;this.heal(12);}if(id==='value'){p.maxHp+=20;this.heal(20);s.armor+=.08;}if(id==='meme')s.crit=Math.min(.85,s.crit+.2);if(id==='liquidity'){s.speed*=1.12;s.dashFactor*=.8;}if(id==='short')s.short++;if(id==='circuit'){s.circuitExtra++;s.circuitReduce+=3;}if(id==='profit'){s.profitHeal+=8;s.profitGain+=4;}if(id==='breakout'){s.guardPierce=Math.min(.7,s.guardPierce+.35);s.atk+=3;}if(id==='hedge'){s.circuitHeal+=10;s.armor+=.05;}this.emit('sound',{name:'reward'});
 }
 buy(id){if(this.state!=='shop')return false;const card=CARDS.find(c=>c.id===id);const cost=id==='heal'?35:card?.price;if(cost==null||this.player.gold<cost)return false;if(id==='heal'&&this.player.hp>=this.player.maxHp)return false;this.player.gold-=cost;this.spent+=cost;if(id==='heal')this.heal(40);else this.applyCard(id);return true;}
 closeShop(){if(this.state==='shop'){this.state='playing';this.shopVisited=true;this.emit('resume');this.emit('notice',{text:this.spec.chapter===1?'“다음 거래소에는 큰놈이 기다리고 있네.” · 오른쪽 출구 ↑':'“방패 뒤의 틈을 보게. 정면만 고집하지 말고.” · 오른쪽 출구 ↑',duration:4});}}
 rewardOptions(){const pool=CARDS.filter(c=>(c.chapter||1)<=this.spec.chapter);for(let i=pool.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,3);}
 finish(won){if(['dead','victory'].includes(this.state))return;this.state=won?'victory':'dead';if(won)this.rank='MID CAP';this.emit('finish',{won,knowledge:Math.max(1,this.clearedRooms)+(won?5:0)});}
 burst(x,y,color,n){for(let i=0;i<n;i++)this.particles.push({x,y,vx:(this.random()-.5)*240,vy:-40-this.random()*180,life:.25+this.random()*.4,max:.7,color,size:2+Math.floor(this.random()*3)});}
 floatText(x,y,text,color,size){this.texts.push({x,y,text,color,size,life:1,max:1});}
 update(dt,input={}){
  dt=clamp(dt,0,1/30);this.t+=dt;
  if(this.state!=='playing')return;
  this.totalTime+=dt;
  if(this.hitstop>0){this.hitstop-=dt;return;}
  const p=this.player;
  for(const k of ['inv','hurt','attack','attackCD','comboClock','dashCD','profitCD','leverageCD','circuitCD','jumpBuffer'])p[k]=Math.max(0,p[k]-dt);
  if(p.leverage>0){p.leverage-=dt;if(p.leverage<=0)this.settleLeverage();}
  if(this.freeze>0)this.freeze=Math.max(0,this.freeze-dt);
  else if(this.spec.kind!=='shop'){this.marketClock+=dt;if(this.marketClock>=this.marketPeriod){this.marketClock-=this.marketPeriod;this.market=(this.market+1)%3;this.emit('market');}}
  p.coyote=p.grounded?.1:Math.max(0,p.coyote-dt);
  if(p.grounded)p.jumps=0;
  if(p.jumpBuffer>0&&(p.coyote>0||p.jumps<2)){if(!p.grounded&&p.coyote===0&&p.jumps===0)p.jumps=1;p.vy=-580;p.jumps++;p.jumpBuffer=0;p.coyote=0;p.grounded=false;this.emit('sound',{name:'jump'});this.burst(p.x+p.w/2,p.y+p.h,'#8394a6',5);}
  if(input.attack)this.attack();
  if(p.dash>0){p.dash=Math.max(0,p.dash-dt);p.vx=p.facing*760;p.vy=-25;}
  else if(p.hurt<=0){const dir=(input.right?1:0)-(input.left?1:0);p.vx=dir*this.stats.speed*(p.attack>0?.65:1);if(dir)p.facing=dir;}
  else p.vx*=.91;
  moveBody(p,dt,this.platforms,this.width);
  if(p.y>800){p.y=500;p.x=120;p.vy=0;this.hurt(15,p.x-1);}
  const target=clamp(p.x+p.w/2-500,0,Math.max(0,this.width-1280));this.camera+=(target-this.camera)*Math.min(1,dt*7);this.shake=Math.max(0,this.shake-dt*24);
  if(this.freeze<=0){for(const e of this.enemies)if(!e.dead)this.updateEnemy(e,dt);if(this.spec.pressure&&this.enemies.some(e=>!e.dead)){this.pressureClock+=dt;if(this.pressureClock>8){this.pressureClock=0;for(const offset of [-95,95])this.hazards.push({x:clamp(p.x+offset,40,this.width-100),y:620,w:64,delay:1.3,life:.35,damage:14,hit:false});this.emit('notice',{text:'공매도 경보 · 표시된 바닥에서 벗어나세요',duration:1.8});}}this.updateThreats(dt);}
  for(const e of this.enemies){e.flash=Math.max(0,e.flash-dt);e.inv=Math.max(0,e.inv-dt);}
  for(const fx of this.effects)fx.life-=dt;this.effects=this.effects.filter(f=>f.life>0);
  for(const v of this.particles){v.life-=dt;v.x+=v.vx*dt;v.y+=v.vy*dt;v.vy+=500*dt;}this.particles=this.particles.filter(v=>v.life>0);
  for(const v of this.texts){v.life-=dt;v.y-=32*dt;}this.texts=this.texts.filter(v=>v.life>0);
  if(this.state!=='playing')return;
  if(this.spec.kind!=='shop'&&!this.enemies.some(e=>!e.dead)&&!this.rewardGiven){
   if(this.clearTimer<0){this.clearTimer=.85;this.projectiles=[];this.hazards=[];this.heal(this.stats.dividend);this.emit('sound',{name:'clear'});}
   this.clearTimer-=dt;
   if(this.clearTimer<=0){this.rewardGiven=true;this.clearedRooms++;if(p.leverage>0)this.settleLeverage();if(this.spec.kind==='boss'){this.doorOpen=true;this.heal(25);this.emit('notice',{text:this.spec.chapter===1?'선동가 격파 · 오른쪽 출구에서 2장 진입 ↑':'집행관 격파 · 기관의 벽이 무너졌습니다. 오른쪽 출구 ↑',duration:7});}else{this.state='reward';this.emit('reward',{cards:this.rewardOptions()});}}
  }
 }
 updateEnemy(e,dt){
  const p=this.player;e.anim+=dt;e.timer-=dt;const dx=p.x+p.w/2-(e.x+e.w/2),dy=(p.y+p.h/2)-(e.y+e.h/2),dist=Math.abs(dx);
  if(!e.activated){if(dist<610)e.activated=true;else return;}
  if(e.type==='boss'){this.updateBoss(e,dt,dx);return;}
  if(e.type==='enforcer'){this.updateEnforcer(e,dt,dx);return;}
  if(e.type==='shield'){this.updateShield(e,dt,dx,dy);return;}
  if(e.type==='drone'){this.updateDrone(e,dt,dx);return;}
  if(e.type==='ghost'){
   if(e.state==='idle'){e.facing=dx<0?-1:1;e.x=clamp(e.x+Math.sign(dx)*(dist>230?e.speed:dist<135?-e.speed:0)*dt,10,this.width-e.w-10);const wanted=clamp(p.y-55,280,505);e.y+=(wanted-e.y)*dt*.9;e.y+=Math.sin(e.anim*3)*dt*10;if(e.timer<=0&&dist<530){e.state='windup';e.timer=.65;}}
   else if(e.state==='windup'&&e.timer<=0){const len=Math.hypot(dx,dy)||1;this.projectiles.push({x:e.x+e.w/2,y:e.y+e.h*.4,vx:dx/len*225,vy:dy/len*225,r:7,damage:e.damage,life:5,color:'#80c9ed'});e.state='recover';e.timer=.55;this.emit('sound',{name:'shot'});}
   else if(e.state==='recover'&&e.timer<=0){e.state='idle';e.timer=1.7;}
   if(overlap(p,e))this.hurt(e.damage,e.x);return;
  }
  e.vx=0;
  if(e.state==='idle'){e.facing=dx<0?-1:1;if(dist>75)e.vx=e.facing*e.speed;if(dist<(e.type==='bomb'?145:115)&&Math.abs(dy)<85&&e.timer<=0){e.state='windup';e.timer=e.type==='bomb'?1.15:.6;e.lockDirection=e.facing;}}
  else if(e.state==='windup'&&e.timer<=0){if(e.type==='bomb'){e.state='charge';e.timer=.6;}else{e.state='attack';e.timer=.3;}}
  else if(e.state==='attack'){e.vx=e.lockDirection*330;if(overlap({...e,x:e.x-12,w:e.w+24},p))this.hurt(e.damage,e.x);if(e.timer<=0){e.state='recover';e.timer=.7;}}
  else if(e.state==='charge'){e.vx=e.lockDirection*260;if(e.timer<=0){this.explode(e);return;}}
  else if(e.state==='recover'&&e.timer<=0){e.state='idle';e.timer=.75;}
  if(e.type==='bomb'&&e.state==='idle'&&Math.abs(dy)>95)e.vx=0;
  moveBody(e,dt,this.platforms,this.width);
  if(overlap(p,e)&&e.state!=='windup')this.hurt(e.damage*.7,e.x);
 }
 updateShield(e,dt,dx,dy){
  e.vx=0;
  if(e.state==='idle'){e.facing=dx<0?-1:1;if(Math.abs(dx)>92)e.vx=e.facing*e.speed;if(Math.abs(dx)<150&&Math.abs(dy)<100&&e.timer<=0){e.state='windup';e.timer=.9;e.lockDirection=e.facing;}}
  else if(e.state==='windup'&&e.timer<=0){e.state='attack';e.timer=.34;this.emit('sound',{name:'dash'});}
  else if(e.state==='attack'){e.vx=e.lockDirection*340;if(overlap({...e,x:e.x-8,w:e.w+16},this.player))this.hurt(e.damage,e.x);if(e.timer<=0){e.state='recover';e.timer=1.15;}}
  else if(e.state==='recover'&&e.timer<=0){e.state='idle';e.timer=.9;}
  moveBody(e,dt,this.platforms,this.width);if(overlap(e,this.player)&&e.state==='idle')this.hurt(9,e.x);
 }
 updateDrone(e,dt,dx){
  const p=this.player;
  if(e.state==='idle'){e.facing=dx<0?-1:1;const dist=Math.abs(dx);e.vx=Math.sign(dx)*(dist>260?e.speed:dist<165?-e.speed:0);e.x=clamp(e.x+e.vx*dt,15,this.width-e.w-15);e.y+=(clamp(p.y-95,340,490)-e.y)*dt*.8;e.y+=Math.sin(e.anim*4)*dt*12;if(e.timer<=0&&dist<580){e.state='windup';e.timer=.85;e.aimX=clamp(p.x+15+p.vx*.3,10,this.width-10);e.aimY=p.y+28;}}
  else if(e.state==='windup'&&e.timer<=0){const x=e.x+e.w/2,y=e.y+e.h/2,angle=Math.atan2(e.aimY-y,e.aimX-x);for(const offset of [-.08,.08])this.projectiles.push({x,y,vx:Math.cos(angle+offset)*270,vy:Math.sin(angle+offset)*270,r:6,damage:e.damage,life:5,color:'#75d9de'});e.state='recover';e.timer=.55;this.emit('sound',{name:'shot'});}
  else if(e.state==='recover'&&e.timer<=0){e.state='idle';e.timer=1.6;}
  if(overlap(e,p))this.hurt(8,e.x);
 }
 fireEnforcer(e,phase){const x=e.x+e.w/2,y=e.y+44,angle=Math.atan2(e.aimY-y,e.aimX-x);for(let i=-2;i<=2;i++)this.projectiles.push({x,y,vx:Math.cos(angle+i*.15)*(phase===2?290:255),vy:Math.sin(angle+i*.15)*(phase===2?290:255),r:8,damage:16,life:5,color:'#84dae2'});this.emit('sound',{name:'roar'});}
 updateEnforcer(e,dt,dx){
  const p=this.player,phase=e.hp<e.maxHp*.5?2:1;e.vx=0;
  if(e.state==='idle'){
   e.facing=dx<0?-1:1;if(Math.abs(dx)>260)e.vx=e.facing*e.speed;
   if(e.timer<=0){e.attackNo++;e.pattern=e.attackNo%3;e.state='windup';e.timer=1.25;e.lockDirection=e.facing;e.aimX=p.x+15;e.aimY=p.y+28;
    if(e.pattern===0)this.emit('notice',{text:'매도벽 압박 · 돌진 후 열린 방패가 공격 기회입니다.',duration:2.5});
    if(e.pattern===1)this.emit('notice',{text:'차입 매도 탄막 · 고정된 조준선에서 벗어나세요.',duration:2.5});
    if(e.pattern===2){const gap=clamp(p.x+(p.x<this.width/2?170:-170),180,this.width-180);e.safeGap=gap;for(let x=60;x<this.width-60;x+=105)if(Math.abs(x+43-gap)>120)this.hazards.push({x,y:620,w:84,delay:1.5,life:.42,damage:22,hit:false});this.emit('notice',{text:'마진콜 집행 · 표시가 없는 틈이나 높은 발판으로!',duration:2.5});}
   }
  }else if(e.state==='windup'&&e.timer<=0){e.state='attack';e.timer=e.pattern===0?.62:.95;e.secondVolley=phase===2&&e.pattern===1;if(e.pattern===1)this.fireEnforcer(e,phase);}
  else if(e.state==='attack'){
   if(e.pattern===0){e.vx=e.lockDirection*(phase===2?500:425);if(overlap({...e,x:e.x-12,w:e.w+24},p))this.hurt(e.damage,e.x);}
   if(e.secondVolley&&e.timer<.48){e.secondVolley=false;this.fireEnforcer(e,phase);}
   if(e.timer<=0){e.state='recover';e.timer=phase===2?1.05:1.5;this.floatText(e.x+e.w/2,e.y-18,'방패 개방','#e5d49c',13);}
  }else if(e.state==='recover'&&e.timer<=0){e.state='idle';e.timer=phase===2?.85:1.15;}
  moveBody(e,dt,[this.platforms[0]],this.width);if(overlap(e,p)&&e.state==='idle')this.hurt(12,e.x);
 }
 explode(e){e.dead=true;this.kills++;if(this.player.leverage>0)this.player.leverageKills++;this.player.gold+=Math.round(e.gold*(this.market===2?1.35:1));const x=e.x+e.w/2,y=e.y+e.h/2;this.effects.push({type:'explosion',x,y,life:.5,max:.5});this.burst(x,y,'#efb86f',25);this.shake=8;this.emit('sound',{name:'explosion'});if(Math.hypot(this.player.x+15-x,this.player.y+28-y)<135)this.hurt(e.damage,x);for(const other of this.enemies)if(other!==e&&!other.dead&&Math.hypot(other.x+other.w/2-x,other.y+other.h/2-y)<140)this.hitEnemy(other,60,Math.sign(other.x-x),false,true);}
 updateBoss(e,dt,dx){
  const phase=e.hp<e.maxHp*.5?2:1;e.facing=dx<0?-1:1;e.vx=0;
  if(e.state==='idle'){if(Math.abs(dx)>230)e.vx=e.facing*e.speed;if(e.timer<=0){e.attackNo++;e.pattern=e.attackNo%3;e.state='windup';e.timer=phase===2?.9:1.15;e.lockDirection=e.facing;
   if(e.pattern===0){this.emit('notice',{text:'물량 밀어내기 · 돌진을 점프하거나 대시로 회피',duration:2});}
   if(e.pattern===1){this.emit('notice',{text:'허위 매수 신호 · 확성기 탄막을 피하세요',duration:2});}
   if(e.pattern===2){const px=this.player.x;for(const offset of [-165,0,165])this.hazards.push({x:clamp(px+offset,80,this.width-100),y:620,w:72,delay:e.timer+.25,life:.45,damage:19,hit:false});this.emit('notice',{text:'거짓 지지선 · 붉은 바닥 밖으로 이동',duration:2});}
  }}else if(e.state==='windup'&&e.timer<=0){e.state='attack';e.timer=e.pattern===0?.65:.5;if(e.pattern===1){const bx=e.x+e.w/2,by=e.y+55;const angle=Math.atan2(this.player.y+28-by,this.player.x+15-bx);for(let i=-2;i<=2;i++)this.projectiles.push({x:bx,y:by,vx:Math.cos(angle+i*.2)*(phase===2?265:230),vy:Math.sin(angle+i*.2)*(phase===2?265:230),r:9,damage:15,life:5,color:'#f1b174'});this.emit('sound',{name:'roar'});}}
  else if(e.state==='attack'){if(e.pattern===0){e.vx=e.lockDirection*(phase===2?520:410);if(overlap({...e,x:e.x-10,w:e.w+20},this.player))this.hurt(22,e.x);}if(e.timer<=0){e.state='recover';e.timer=phase===2?.8:1.3;}}
  else if(e.state==='recover'&&e.timer<=0){e.state='idle';e.timer=phase===2?.9:1.35;}
  moveBody(e,dt,[this.platforms[0]],this.width);if(overlap(e,this.player)&&e.state!=='windup')this.hurt(13,e.x);
 }
 updateThreats(dt){
  for(const b of this.projectiles){b.life-=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;if(overlap({x:b.x-b.r,y:b.y-b.r,w:b.r*2,h:b.r*2},this.player)){this.hurt(b.damage,b.x);b.life=0;}if(b.x<0||b.x>this.width||b.y>640||b.y<70)b.life=0;}
  this.projectiles=this.projectiles.filter(b=>b.life>0);
  for(const h of this.hazards){h.delay-=dt;if(h.delay<=0){h.life-=dt;if(!h.hit){h.hit=true;this.burst(h.x+h.w/2,610,'#d79572',13);this.emit('sound',{name:'explosion'});}if(overlap({x:h.x,y:455,w:h.w,h:165},this.player))this.hurt(h.damage,h.x);}}
  this.hazards=this.hazards.filter(h=>h.life>0);
 }
}
