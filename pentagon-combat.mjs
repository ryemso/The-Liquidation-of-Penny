export const POLICY_RULES={
 rate_up:{name:'금리 인상',costs:{profit:40,leverage:15,circuit:20}},
 devalue:{name:'화폐가치 하락',costs:{profit:50,leverage:20,circuit:25}},
 rate_down:{name:'금리 인하',costs:{profit:15,leverage:0,circuit:0}}
};
export function skillCost(g,skill){const p=g.skillPolicy;const live=p&&p.remaining>0&&g.enemies.some(e=>e.id===p.owner&&!e.dead);return (live?POLICY_RULES[p.kind].costs[skill]:null)??(skill==='profit'?25:0);}
export function clearPolicy(g,reason='expired'){if(g.skillPolicy)g.log?.add('skill_policy_end',{policy:g.skillPolicy.kind,reason});g.skillPolicy=null;}
export function applyPolicy(g,e,kind){
 clearPolicy(g,'replaced');g.skillPolicy={kind,owner:e.id,remaining:6};const rule=POLICY_RULES[kind];
 g.log.add('boss_pattern',{enemy_id:e.id,pattern:kind,costs:{...rule.costs},duration:6});g.floatText(e.x+e.w/2,e.y-20,rule.name,'#efd38e',18);
 g.emit('notice',{text:`${rule.name} · 6초간 필요 수익 A ${rule.costs.profit} / S ${rule.costs.leverage} / D ${rule.costs.circuit}`,duration:4});
}
export function updatePentagon(g,dt){
 if(g.skillPolicy){g.skillPolicy.remaining-=dt;if(g.skillPolicy.remaining<=0||!g.enemies.some(e=>e.id===g.skillPolicy.owner&&!e.dead))clearPolicy(g);}
 for(const e of g.enemies){if(e.dead||e.type!=='executor')continue;
  if(!e.transformed){e.introTime+=dt;if(e.introTime<3-1e-8)continue;
   const feet=e.y+e.h,center=e.x+e.w/2;e.transformed=true;e.w=g.player.w*3;e.h=g.player.h*3;e.x=center-e.w/2;e.y=feet-e.h;e.timer=.8;e.state='recover';e.policyClock=1;e.policyIndex=0;
   g.shake=10;g.burst(center,feet-e.h/2,'#d9bc79',35);g.emit('sound',{name:'roar'});g.log.add('boss_transformed',{enemy_id:e.id,scale:3});
   g.emit('notice',{text:'집행관 변신 · 스킬 버튼의 필요 수익을 확인하세요',duration:4});
  }else if(g.freeze<=0){e.policyClock-=dt;if(e.policyClock<=0){applyPolicy(g,e,['rate_up','devalue','rate_down'][e.policyIndex++%3]);e.policyClock=8;}}
 }
}
export function paySkill(g,name){const cost=skillCost(g,name);if(g.player.profit<cost){g.emit('notice',{text:`필요 수익 ${cost} · 현재 ${Math.floor(g.player.profit)}`,duration:2});g.log.add('skill_resource_denied',{skill:name,required:cost,available:g.player.profit});return false;}if(name!=='profit'&&cost){g.player.profit-=cost;g.log.add('skill_resource_spent',{skill:name,amount:cost,policy:g.skillPolicy?.kind});}return true;}
export function updatePentagonEnemy(g,e,dt,moveBody){
 if(!['rifle','pugilist','brute','executor'].includes(e.type))return false;
 if(e.type==='executor'&&!e.transformed){e.vx=0;return true;}
 const p=g.player,dx=p.x+p.w/2-e.x-e.w/2,dy=p.y-e.y,rifle=e.type==='rifle';e.vx=0;
 if(e.state==='idle'){
  e.facing=dx<0?-1:1;const range=rifle?440:e.w/2+65;if(Math.abs(dx)>range)e.vx=e.facing*e.speed;
  if(p.y+p.h<e.y-35&&Math.abs(dx)<300&&e.grounded){e.vy=-580;e.grounded=false;}
  if(e.timer<=0&&Math.abs(dx)<=range&&Math.abs(dy)<(rifle?250:110)){e.state='windup';e.timer=rifle?.8:e.type==='brute'?.85:.6;e.lockDirection=e.facing;e.aimX=p.x+p.w/2;e.aimY=p.y+p.h/2;e.struck=false;}
 }else if(e.state==='windup'&&e.timer<=0){e.state='attack';e.timer=rifle?.12:.3;
  if(rifle){const x=e.x+e.w/2,y=e.y+e.h*.4,a=Math.atan2(e.aimY-y,e.aimX-x);g.projectiles.push({source:{id:e.id,type:e.type},x,y,vx:Math.cos(a)*320,vy:Math.sin(a)*320,r:4,damage:e.damage,life:3,color:'#e4bf76'});g.emit('sound',{name:'shot'});}
 }else if(e.state==='attack'){
  if(!rifle){e.vx=e.lockDirection*(e.boss?390:280);const hit={x:e.lockDirection>0?e.x+e.w/2:e.x-42,y:e.y,w:e.w/2+42,h:e.h};if(!e.struck&&p.x<hit.x+hit.w&&p.x+p.w>hit.x&&p.y<hit.y+hit.h&&p.y+p.h>hit.y){e.struck=true;g.hurt(e.damage,e.x,'attack',e);}}
  if(e.timer<=0){e.state='recover';e.timer=e.boss?.85:1.1;e.vx=0;}
 }else if(e.state==='recover'&&e.timer<=0){e.state='idle';e.timer=.25;}
 moveBody(e,dt,g.platforms,g.width);return true;
}
