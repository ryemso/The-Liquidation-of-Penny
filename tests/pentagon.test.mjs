import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,ROOM_SPECS} from '../engine.mjs';
import {BACKGROUND_ASSETS,locationFor} from '../backgrounds.mjs';
const make=()=>{const g=new Game({random:()=>.5});g.start();g.player.inv=999;return g;};
const settle=g=>{for(let i=0;i<150;i++)g.update(1/120);};
const exit=g=>{g.player.x=g.width-80;g.player.y=620-g.player.h;g.action('interact');};
test('Wall Street promotes into Pentagon once, keeping build and equipment',()=>{
 const g=make();g.setRoom(24);g.totems.acquire('flag');g.enemies.forEach(e=>g.hitEnemy(e,99999));settle(g);exit(g);
 assert.equal(g.state,'chapter');assert.ok(!g.log.ended);const hp=g.player.maxHp,atk=g.stats.atk;
 g.enterNextChapter();assert.equal(g.room,25);assert.equal(g.rank,'SOVEREIGN CAP');assert.equal(g.player.maxHp,hp+20);assert.equal(g.stats.atk,atk+6);assert.ok(g.totems.owned.includes('flag'));
 g.enterNextChapter();assert.equal(g.stats.atk,atk+6);
});
test('four distinct backgrounds and finite traversable Pentagon rooms',()=>{
 const g=make();const backgrounds=[];
 for(let room=25;room<29;room++){
  g.setRoom(room);assert.equal(g.spec.chapter,6);assert.ok(Number.isFinite(g.marketPeriod));assert.equal(locationFor(6).name,'펜타곤');backgrounds.push(g.spec.background);assert.ok(BACKGROUND_ASSETS.includes(g.spec.background));
  for(const p of g.platforms){assert.ok(p.x>=0&&p.x+p.w<=g.width);assert.ok(p.h>0);}
  for(const e of g.enemies)for(const w of g.terrain.walls)assert.ok(!(e.x<w.x+w.w&&e.x+e.w>w.x&&e.y<w.y+w.h&&e.y+e.h>w.y),'enemy in wall');
  g.player.inv=999;for(let i=0;i<1800&&g.player.x<g.width-160;i++)g.update(1/120,{right:true});assert.ok(g.player.x>g.width-180,'floor route blocked');exit(g);assert.equal(g.room,room);assert.equal(g.doorOpen,false);
 }
 assert.equal(new Set(backgrounds).size,4);
});
test('Pentagon fights require clearance, grant one reward and lobby recovery, then final victory',()=>{
 const g=make();g.setRoom(25);g.player.hp=40;
 for(let room=25;room<29;room++){
  assert.equal(g.room,room);g.player.inv=999;const hp=g.player.hp;
  g.enemies.forEach(e=>g.hitEnemy(e,99999));settle(g);
  if(room<28){assert.equal(g.state,'reward');assert.ok(g.currentOffers.length);if(room===26)assert.equal(g.player.hp,hp+20);g.chooseReward('growth');if(g.state==='reward')g.chooseReward(g.currentOffers[0]);}
  const amount=g.pizzaEarned;g.awardClearCurrency();assert.equal(g.pizzaEarned,amount);exit(g);
 }
 assert.equal(g.state,'victory');assert.equal(g.rank,'MARKET LEGEND');g.finish(true);assert.equal(g.log.events.filter(e=>e.event==='run_end').length,1);assert.equal(ROOM_SPECS.length,29);
});
