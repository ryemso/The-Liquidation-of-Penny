import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,moveBody,ROOM_SPECS} from '../engine.mjs';
const step=(g,seconds,input={})=>{for(let i=0;i<Math.ceil(seconds*120);i++)g.update(1/120,input);};
const game=()=>{const g=new Game({random:()=>.5});g.start();return g;};
test('fast downward motion lands on the first crossed ledge rather than tunneling to floor',()=>{
 const b={x:110,y:100,w:30,h:56,vx:0,vy:950};moveBody(b,.3,[{x:0,y:620,w:1000},{x:100,y:300,w:150}],1000);assert.equal(b.y,244);assert.equal(b.vy,0);assert.equal(b.grounded,true);
});
test('jump goes through underside, lands from above, and cannot create a third air jump',()=>{
 const b={x:110,y:340,w:30,h:56,vx:0,vy:-600};moveBody(b,.1,[{x:100,y:300,w:150}],1000);assert.ok(b.y<340);assert.equal(b.grounded,false);
 const g=game();g.enemies=[];g.rewardGiven=true;step(g,.4);g.action('jump');step(g,.1);g.action('jump');step(g,.02);assert.equal(g.player.jumps,2);const vy=g.player.vy;g.action('jump');step(g,.02);assert.equal(g.player.jumps,2);assert.ok(g.player.vy>vy);step(g,2);assert.equal(g.player.y+g.player.h,620);
});
test('movement clamps to both room edges even while dashing',()=>{const g=game();g.rewardGiven=true;g.enemies=[];g.player.x=g.width-45;g.player.facing=1;g.action('dash');step(g,.3,{right:true});assert.ok(g.player.x+g.player.w<=g.width-8);g.player.x=10;g.player.facing=-1;g.player.dashCD=0;g.action('dash');step(g,.3,{left:true});assert.ok(g.player.x>=8);});
test('attack needs a directional hitbox; profit consumes accumulated value',()=>{
 const g=game();step(g,.3);g.player.x=600;g.player.facing=1;g.enemies=[g.makeEnemy('rubble',665,620)];const e=g.enemies[0];g.action('attack');assert.ok(e.hp<e.maxHp);assert.equal(g.player.profit,8);g.player.profit=60;g.action('profit');assert.equal(g.player.profit,0);assert.ok(g.player.profitCD>0);assert.equal(e.dead,true);
});
test('damage respects invulnerability and does not destroy all accumulated profit',()=>{const g=game();g.player.inv=0;g.player.profit=80;g.hurt(12,0);assert.equal(g.player.hp,88);assert.equal(g.player.profit,60);g.hurt(12,0);assert.equal(g.player.hp,88);});
test('circuit freezes enemy actions and hostile projectiles but allows player movement',()=>{const g=game();const e=g.enemies[0];e.activated=true;e.timer=1;g.projectiles=[{x:500,y:400,vx:100,vy:0,r:5,damage:10,life:5}];g.action('circuit');const x=g.player.x;step(g,.4,{right:true});assert.ok(g.player.x>x);assert.equal(e.timer,1);assert.equal(g.projectiles[0].x,500);});
test('leverage rewards success once and failed repayment leaves at least one HP',()=>{const g=game();g.action('leverage');g.player.leverageDamage=160;const gold=g.player.gold;g.settleLeverage();assert.equal(g.player.gold,gold+18);g.player.leverageCD=0;g.action('leverage');g.player.hp=7;g.settleLeverage();assert.equal(g.player.hp,1);assert.equal(g.state,'playing');});
test('room cannot be skipped before clear and a reward unlocks exactly the next room',()=>{
 const g=game();g.player.x=g.width-80;g.action('interact');assert.equal(g.room,0);g.enemies.forEach(e=>e.dead=true);step(g,1);assert.equal(g.state,'reward');g.chooseReward('growth');assert.equal(g.stats.atk,23);g.action('interact');assert.equal(g.room,1);assert.equal(g.doorOpen,false);
});
test('shop purchase deducts real cost, failed purchase leaves funds intact, and exit works',()=>{const g=game();g.setRoom(2);g.player.x=650;g.action('interact');assert.equal(g.state,'shop');g.player.gold=70;assert.equal(g.buy('growth'),true);assert.equal(g.player.gold,5);assert.equal(g.buy('value'),false);assert.equal(g.player.gold,5);g.closeShop();g.player.x=g.width-80;g.action('interact');assert.equal(g.room,3);});
test('boss emits telegraphed patterns and defeating it opens the chapter completion gate',()=>{
 const events=[],g=new Game({random:()=>.5,onEvent:e=>events.push(e)});g.start();g.setRoom(4);g.player.x=800;g.player.inv=999;step(g,8);assert.ok(events.some(e=>e.type==='notice'&&/탄막|지지선|돌진/.test(e.text)));const boss=g.enemies[0];g.hitEnemy(boss,10000);step(g,1);assert.equal(g.doorOpen,true);assert.equal(g.state,'playing');g.player.x=g.width-80;g.action('interact');assert.equal(g.state,'chapter');assert.equal(events.filter(e=>e.type==='chapter').length,1);g.enterChapterTwo();assert.equal(g.room,5);assert.equal(g.spec.chapter,2);
});
test('paused simulation does not advance cooldowns, health, or market',()=>{const g=game();g.state='paused';g.player.profitCD=5;const x=g.player.x;step(g,3,{right:true});assert.equal(g.player.profitCD,5);assert.equal(g.marketClock,0);assert.equal(g.player.x,x);});
test('all room platforms are reachable with double jump and no mandatory floor gap',()=>{for(const r of ROOM_SPECS){assert.ok(r.width>=1280);for(const [,y]of r.platforms)assert.ok(620-y<=220);}});

test('chapter two promotes the run and institutional enemies use their defense roles',()=>{const g=game();g.setRoom(5);assert.equal(g.spec.chapter,2);const shield=g.enemies.find(e=>e.type==='shield');assert.ok(shield);const hp=shield.hp;g.player.x=500;g.hitEnemy(shield,20,false);assert.equal(shield.hp,hp-20);g.stats.guardPierce=1;g.hitEnemy(shield,20,true);assert.equal(shield.hp,hp-40);});
