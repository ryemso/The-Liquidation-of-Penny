export const ADVANCED={algorithm:['sidekick','short_long'],central:['paid_issue','bonus_issue'],market:['takeover','short_long']};
export function beginAdvanced(g,e){
 const list=ADVANCED[e.type];if(!list)return false;
 e.advancedCount=(e.advancedCount||0)+1;e.advanced=list[(e.advancedCount-1)%list.length];e.advancedFired=false;e.specialActive=true;e.state='windup';e.timer=3.2;e.vx=0;e.aimX=g.player.x+g.player.w/2;
 g.log.add('boss_pattern',{enemy_id:e.id,pattern:e.advanced,phase:e.hp<e.maxHp*.5?2:1});return true;
}
export function fireAdvanced(g,e){
 if(!e.advanced||e.advancedFired||e.timer>1.8)return;e.advancedFired=true;
 const spawn=(type,offset)=>{if(g.enemies.filter(x=>!x.dead&&x.summoner===e.id).length>=2)return;const x=Math.max(60,Math.min(g.width-100,e.x+offset));const m=g.makeEnemy(type,x,type==='drone'?460:620);m.summoner=e.id;m.optional=true;m.gold=0;m.hp=Math.round(m.hp*.65);m.maxHp=m.hp;m.damage=Math.round(m.damage*.75);m.activated=true;m.state='recover';m.timer=.8;g.enemies.push(m);};
 if(e.advanced==='sidekick'){spawn('drone',-180);spawn('drone',180);}
 if(e.advanced==='paid_issue'){const cost=Math.min(e.hp-1,e.maxHp*.03);e.hp-=Math.max(0,cost);spawn('shield',-180);spawn('shield',180);}
 if(e.advanced==='bonus_issue'){spawn('rubble',-160);spawn('rubble',160);}
 if(e.advanced==='takeover'){spawn('shield',-180);spawn('drone',180);e.takeoverShield=true;}
 if(e.advanced==='short_long'){
  const source={id:e.id,type:e.type};for(let i=-3;i<=3;i++){if(i===0)continue;const x=Math.max(30,Math.min(g.width-30,e.aimX+i*100));g.projectiles.push({source,x,y:i%2===0?110:605,vx:0,vy:i%2===0?210:-210,r:7,damage:17,life:3,color:i%2===0?'#e78d9b':'#7ad5cc'});}
 }
 g.floatText(e.x+e.w/2,e.y-30,({sidekick:'사이드킥',short_long:'숏 / 롱',paid_issue:'유상증자',bonus_issue:'무상증자',takeover:'적대적 인수'})[e.advanced],'#c7d9ed',15);
 g.effects.push({type:'halt-ring',x:e.x+e.w/2,y:e.y+e.h/2,life:.4,max:.4});
}
