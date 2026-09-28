export const UPPER_SKILLS={algorithm:'주식분할',central:'계좌 박살내기',market:'작전주 작전시작'};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const touches=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export function releaseCapture(g){if(g.player.capture){g.player.capture=null;g.player.inv=Math.max(g.player.inv,.65);}}
export function updateCapture(g,dt){const c=g.player.capture;if(!c)return;c.remaining-=dt;if(c.remaining<=0||g.freeze>0||!g.enemies.some(e=>e.id===c.owner&&!e.dead))releaseCapture(g);}
// Slab intersection gives the first contact; no per-pixel or per-distance sampling.
export function segmentHit(x,y,dx,dy,box){let lo=0,hi=1;for(const [p,d,min,max] of [[x,dx,box.x,box.x+box.w],[y,dy,box.y,box.y+box.h]]){if(Math.abs(d)<1e-9){if(p<min||p>max)return null;continue;}let a=(min-p)/d,b=(max-p)/d;if(a>b)[a,b]=[b,a];lo=Math.max(lo,a);hi=Math.min(hi,b);if(lo>hi)return null;}return lo;}
function recover(e,seconds){e.skillState='recover';e.state='recover';e.timer=seconds;e.vx=0;}
function begin(g,e){e.skillActive=true;e.skillName=UPPER_SKILLS[e.type];e.skillState='prepare';e.state='windup';e.timer=e.type==='market'?.3:.75;e.struck=false;e.lockDirection=e.facing;g.floatText(e.x+e.w/2,e.y-35,e.skillName,'#ffd18c',18);g.log.add('boss_pattern',{enemy_id:e.id,pattern:e.skillName});}
export function updateUpperBoss(g,e,dt,moveBody){
 if(!UPPER_SKILLS[e.type])return false;
 const p=g.player,cx=e.x+e.w/2,dx=p.x+p.w/2-cx;
 if(!e.skillActive){
  e.signatureCD=Math.max(0,(e.signatureCD||0)-dt);
  if(e.state!=='idle'||e.timer>0)return false;
  if(e.signatureCD>0)return false;
  // Interleave signature moves with the close combat kit; never read player inputs.
  const distance=Math.abs(dx),eligible=e.type==='algorithm'?distance<380:e.type==='central'?distance>110:distance>260;
  if(!eligible)return false;
  e.facing=dx<0?-1:1;begin(g,e);
 }
 e.vx=0;
 if(e.skillState==='recover'){
  if(e.timer<=0){e.skillActive=false;e.skillName=null;e.skillState=null;e.state='idle';e.timer=.3;e.signatureCD=e.type==='algorithm'?5:7;}
  moveBody(e,dt,g.bossFloor,g.width);return true;
 }
 if(e.type==='algorithm'){
  if(e.skillState==='prepare'&&e.timer<=0){e.skillState='grab';e.state='attack';e.timer=.38;}
  else if(e.skillState==='grab'){
   if(e.timer<=0)recover(e,1.25);
   else{e.vx=e.lockDirection*520;moveBody(e,dt,g.bossFloor,g.width);const box={x:e.lockDirection>0?e.x+e.w/2:e.x-35,y:e.y,w:e.w/2+35,h:e.h};
    if(!e.struck&&touches(box,p)){e.struck=true;if(g.hurt(e.damage,e.x,'grab',e)&&g.state==='playing'){p.capture={owner:e.id,remaining:.55};p.attackMove=null;p.attack=0;p.jumpBuffer=0;p.dash=0;p.vx=0;p.vy=0;e.skillState='split';e.timer=.55;}else recover(e,1.1);}
    return true;
   }
  }else if(e.skillState==='split'&&e.timer<=0){releaseCapture(g);recover(e,1.35);}
  moveBody(e,dt,g.bossFloor,g.width);return true;
 }
 if(e.type==='central'){
  if(e.skillState==='prepare'&&e.timer<=0){e.skillState='leap';e.state='attack';e.targetX=clamp(p.x+p.w/2,90,g.width-90);e.vy=-700;e.grounded=false;e.airSpeed=(e.targetX-cx)/(.8974359);}
  if(e.skillState==='leap'){
   e.vx=e.airSpeed;moveBody(e,dt,g.bossFloor,g.width);
   if(e.grounded){e.skillState='impact';e.timer=.18;g.shake=10;g.emit('sound',{name:'heavy-hit'});g.burst(e.x+e.w/2,620,'#e8be70',22);const hit={x:e.x+e.w/2-95,y:545,w:190,h:75};if(touches(hit,p))g.hurt(e.damage*1.25,e.x,'axe_slam',e);}
   return true;
  }
  if(e.skillState==='impact'&&e.timer<=0)recover(e,1.8);
  moveBody(e,dt,g.bossFloor,g.width);return true;
 }
 if(e.type==='market'){
  if(e.skillState==='prepare'&&e.timer<=0){
   e.skillState='reposition';e.state='attack';e.timer=1.6;
   const wanted=clamp(cx-Math.sign(dx||1)*330,100,g.width-100);
   let perch=null;for(const platform of g.platforms){if(platform.ground||platform.solid||platform.y<300||platform.y>530||platform.y<e.y+e.h-220)continue;const px=platform.x+platform.w/2;if(Math.abs(px-wanted)<200&&Math.abs(px-cx)<550&&(!perch||Math.abs(px-wanted)<Math.abs(perch.x+perch.w/2-wanted)))perch=platform;}
   e.targetX=perch?perch.x+perch.w/2:wanted;const bottom=perch?perch.y:620;const flight=(850+Math.sqrt(Math.max(0,850*850+3120*(bottom-e.y-e.h))))/1560;
   e.vy=-850;e.grounded=false;e.airSpeed=(e.targetX-cx)/Math.max(.3,flight);
  }
  if(e.skillState==='reposition'){e.vx=e.airSpeed;moveBody(e,dt,g.platforms,g.width);if(e.grounded||e.timer<=0){e.skillState='aim';e.state='windup';e.timer=1.05;e.vx=0;}return true;}
  if(e.skillState==='aim'){
   e.aimX=p.x+p.w/2;e.aimY=p.y+p.h/2;e.facing=e.aimX<cx?-1:1;
   if(e.timer<=0){e.skillState='locked';e.timer=.4;const x=cx,y=e.y+e.h*.4,a=Math.atan2(e.aimY-y,e.aimX-x);e.shot={x,y,dx:Math.cos(a)*2000,dy:Math.sin(a)*2000};}
  }else if(e.skillState==='locked'&&e.timer<=0){
   const s=e.shot;let limit=1;for(const b of g.platforms){const hit=segmentHit(s.x,s.y,s.dx,s.dy,b);if(hit!==null)limit=Math.min(limit,hit);}
   const hit=segmentHit(s.x,s.y,s.dx,s.dy,p);if(hit!==null&&hit<limit)g.hurt(e.damage*1.2,e.x,'snipe',e);
   e.beam={...s,dx:s.dx*limit,dy:s.dy*limit,remaining:.16};e.skillState='reload';e.state='recover';e.timer=1.7;g.emit('sound',{name:'shot'});
  }else if(e.skillState==='reload'&&e.timer<=0)recover(e,.2);
  // A perch remains solid during aim/reload; movement is physical, never teleporting.
  moveBody(e,dt,g.platforms,g.width);return true;
 }
 return false;
}
