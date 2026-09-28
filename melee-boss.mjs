import {updateUpperBoss} from './upper-boss.mjs';
const profiles={boss:[300,.65,1.1],enforcer:[340,.8,1.3],algorithm:[420,.5,.9],central:[260,.95,1.5],market:[390,.7,1.15]};
export function updateMeleeBoss(g,e,dt,moveBody){
 const profile=profiles[e.type];if(!profile)return false;
 if(e.beam)e.beam.remaining=Math.max(0,e.beam.remaining-dt);
 if(updateUpperBoss(g,e,dt,moveBody))return true;
 const p=g.player,dx=p.x+p.w/2-e.x-e.w/2;const [speed,windup,recovery]=profile;
 e.vx=0;
 if(e.state==='idle'){
  e.facing=dx<0?-1:1;
  if(Math.abs(dx)>e.w/2+85)e.vx=e.facing*Math.max(e.speed,120);
  if(e.timer<=0&&Math.abs(dx)<e.w/2+180&&Math.abs(p.y+p.h-e.y-e.h)<100){
   e.pattern=(e.attackNo++%3);e.state='windup';e.timer=windup;e.lockDirection=e.facing;e.struck=false;
   g.log.add('boss_pattern',{enemy_id:e.id,pattern:['lunge','sweep','heavy'][e.pattern],phase:e.hp<e.maxHp*.5?2:1});
  }
 }else if(e.state==='windup'&&e.timer<=0){e.state='attack';e.timer=e.pattern===0?.38:.24;g.emit('sound',{name:'swing'});}
 else if(e.state==='attack'){
  if(e.timer<=0){e.state='recover';e.timer=recovery+(e.pattern===2?.3:0);}
  else{
   e.vx=e.lockDirection*(e.pattern===0?speed:e.pattern===1?speed*.45:0);
   moveBody(e,dt,g.bossFloor,g.width);
   const reach=e.pattern===1?90:60,hit={x:e.lockDirection>0?e.x+e.w/2:e.x-reach,y:e.y,w:e.w/2+reach,h:e.h};
   if(!e.struck&&p.x<hit.x+hit.w&&p.x+p.w>hit.x&&p.y<hit.y+hit.h&&p.y+p.h>hit.y){e.struck=true;g.hurt(e.damage*(e.pattern===2?1.2:1),e.x,'attack',e);}
   return true;
  }
 }else if(e.state==='recover'&&e.timer<=0){e.state='idle';e.timer=.3;}
 moveBody(e,dt,g.bossFloor,g.width);return true;
}
