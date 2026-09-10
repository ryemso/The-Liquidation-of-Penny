// Engine-only input simulation, NOT a browser or human playtest.
// No teleports, stat overrides, direct damage, or forced room transitions.
import {Game} from '../engine.mjs';
import {writeFileSync} from 'node:fs';
export function simulate(seed=1,explore=false){
 let rng=seed>>>0;
 const g=new Game({random:()=>((rng=(Math.imul(rng,1664525)+1013904223)>>>0)/4294967296)});
 g.start();let jumpAt=-1,room=-1,roomAt=0,ledgeIndex=0;const rooms=[];
 for(let frame=0;frame<60*1200&&g.state!=='dead'&&g.room<10;frame++){
  if(room!==g.room){if(room>=0)rooms.push({stage:room+1,seconds:+(g.totalTime-roomAt).toFixed(2),hp:g.player.hp});room=g.room;roomAt=g.totalTime;ledgeIndex=0;}
  const p=g.player;
  if(g.state==='reward'){const id=['dividend','profit','growth','value','breakout','hedge'].find(id=>g.currentOffers.includes(id))||g.currentOffers[0];g.chooseReward(id);continue;}
  if(g.state==='chapter'){g.enterNextChapter();continue;}
  if(g.state==='trial_choice'){g.chooseTrial(explore);continue;}
  if(g.state==='relic_choice'){g.chooseRelic(g.relic.offers[0]||'seed');continue;}
  if(g.state==='totems'){const id=g.totems.owned.at(-1);g.totems.equip(id,Math.max(0,g.totems.slots.indexOf(null)));g.state='playing';continue;}
  if(g.state==='shop'){while(p.hp<p.maxHp&&g.buy('heal')){};g.buy('growth');g.closeShop();continue;}
  const e=g.enemies.filter(e=>!e.dead&&(explore||!e.optional)).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0];
  let target=g.width-100,attack=false;
  if(g.spec.kind==='shop'&&!g.shopVisited){target=650;if(Math.abs(p.x-target)<100)g.action('interact');}
  else if(e){
   const dx=e.x+e.w/2-(p.x+p.w/2),dy=e.y+e.h/2-(p.y+p.h/2);
   target=e.x+(dx>=0?-60:e.w+30);attack=Math.abs(dx)<150&&Math.abs(dy)<95;
   if(dy<-45&&frame-jumpAt>18&&(p.grounded||p.jumps<2)){g.action('jump');jumpAt=frame;}
   if(attack&&p.profit>=50)g.action('profit');
   if(attack&&e.hp>100)g.action('leverage');
   if(Math.abs(dx)<200&&e.state==='windup'&&e.timer<.15){g.action('dash');}
   if(Math.abs(dx)<200&&p.hp<p.maxHp*.5)g.action('circuit');
  }else if(explore&&g.relic&&!g.relic.taken){
   const ledges=g.platforms.slice(-3),r=g.relic;
   if(p.grounded){const standing=ledges.findIndex(l=>Math.abs(p.y+p.h-l.y)<1);ledgeIndex=Math.min(2,standing+1);}
   const ledge=ledges[ledgeIndex];target=ledgeIndex===2?r.x-15:ledge.x+ledge.w/2-15;
   if((p.grounded||(p.jumps<2&&frame-jumpAt>18))&&Math.abs(p.x-target)<100&&p.y+p.h>ledge.y+1){g.action('jump');jumpAt=frame;}
  }else if(g.doorOpen&&p.x>g.width-180){g.action('interact');}
  g.update(1/60,{left:p.x>target+8,right:p.x<target-8,attack});
 }
 if(room>=0)rooms.push({stage:room+1,seconds:+(g.totalTime-roomAt).toFixed(2),hp:g.player.hp});
 const result={seed,explore,method:'engine input simulation; not browser play',state:g.state,stage:g.room+1,seconds:+g.totalTime.toFixed(2),hp:g.player.hp,kills:g.kills,position:{x:g.player.x,y:g.player.y,grounded:g.player.grounded,ledgeIndex},owned:g.totems.owned,rooms,log:g.log.export()};
 return result;
}
if(process.argv[1]?.endsWith('check-chapter12.mjs')){
 const rows=[1,2,3].flatMap(seed=>[simulate(seed),simulate(seed,true)]);
 if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(rows,null,2));
 console.log(JSON.stringify(rows.map(({log,...r})=>({...r,summary:log.summary})),null,2));
}
