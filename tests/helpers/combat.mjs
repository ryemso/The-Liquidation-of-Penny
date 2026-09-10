import {Game} from '../../engine.mjs';
// Controlled combat fixture, not a playtest: a stationary, non-attacking boss
// and spawned hostile projectiles isolate damage/collision behavior. No direct
// TotemSystem.signal(), cooldown resets, or forced pattern progress.
export function fixture(id){
 const g=new Game({random:()=>.99});g.start();g.relic=null;
 const e=g.makeEnemy('boss',400,620);e.state='windup';e.timer=1000;g.enemies=[e];
 Object.assign(g.player,{x:340,y:564,grounded:true,inv:0});
 g.state='totems';g.totems.acquire(id);g.totems.equip(id,0);g.state='playing';
 return {g,e};
}
export function tick(g,seconds,input={}){for(let i=0;i<Math.ceil(seconds*120);i++)g.update(1/120,input);}
export function hit(g){g.action('attack');tick(g,.45);}
export function evade(g){
 g.action('dash');
 for(let i=0;i<2;i++)g.projectiles.push({x:g.player.x+30,y:g.player.y+28,vx:-200,vy:0,r:6,damage:10,life:2});
 tick(g,1.1);
 for(let i=0;i<240&&Math.abs(g.player.x-340)>3;i++)g.update(1/120,{left:g.player.x>340,right:g.player.x<340});
 g.update(1/120,{right:true}); // Face the target again with ordinary input.
}
