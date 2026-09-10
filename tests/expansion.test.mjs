import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,ROOM_SPECS} from '../engine.mjs';
import {TOTEMS} from '../totems.mjs';
const make=()=>{const g=new Game({random:()=>.5});g.start();return g;};
for(const t of TOTEMS.filter(t=>t.sequence))test(`${t.name}: pattern completes and effect changes combat once`,()=>{
 const g=make();g.state='totems';g.totems.acquire(t.id);g.totems.equip(t.id,0);g.state='playing';g.player.hp=50;const e=g.makeEnemy('boss',g.player.x+70,620);g.enemies=[e];const hp=e.hp;
 for(const signal of t.sequence)g.totems.signal(signal,e);
 if(t.effect==='branch')g.totems.signal('profit',e);
 assert.equal(g.totems.states[t.id].cd,t.cd);assert.equal(g.log.events.filter(x=>x.event==='totem_activated').length,1);
 if(t.effect==='heal')assert.equal(g.player.hp,65);
 else if(t.effect==='weak')assert.equal(e.totemWeak,t.value);
 else if(t.effect==='weaken'){g.player.inv=0;g.hurt(20,e.x);assert.equal(g.player.hp,35);}
 else assert.ok(e.hp<hp);
 g.totems.signal(t.sequence.at(-1),e);assert.equal(g.log.events.filter(x=>x.event==='totem_activated').length,1);
});
test('non-attack contact cannot charge evasion while final dash immunity can',()=>{const g=make();g.totems.acquire('double_bottom');g.state='totems';g.totems.equip('double_bottom',0);g.state='playing';g.action('dash');g.hurt(20,0,'contact');assert.equal(g.totems.states.double_bottom.n,0);g.player.dash=0;g.hurt(20,0);assert.equal(g.totems.states.double_bottom.n,1);});
test('optional trial can be declined, accepted, completed and abandoned without exit lock',()=>{const g=make();g.setRoom(3);g.player.x=g.relic.x-15;g.player.y=g.relic.y-28;g.checkRelicPickup();assert.equal(g.state,'trial_choice');g.chooseTrial(false);assert.equal(g.state,'playing');assert.equal(g.checkRelicPickup(),false);g.player.x-=100;g.checkRelicPickup();g.player.x+=100;g.checkRelicPickup();g.chooseTrial(true);assert.ok(g.trialEnemy.optional);g.hitEnemy(g.trialEnemy,9999);g.update(.01);assert.equal(g.relic.trialComplete,true);assert.equal(g.relic.offers.length,3);});
test('hidden cache reveals only near the player',()=>{const g=make();g.setRoom(1);g.update(.01);assert.ok(!g.relic.revealed);g.player.x=g.relic.x-15;g.player.y=g.relic.y-28;g.update(.01);assert.equal(g.relic.revealed,true);assert.equal(g.state,'relic_choice');});
test('chapter 2 transitions into chapter 3 and final boss has three avoidable telegraphs',()=>{const g=make();g.setRoom(9);g.state='chapter';g.enterNextChapter();assert.equal(g.room,10);assert.equal(g.rank,'MID CAP');g.setRoom(14);g.player.x=1300;g.player.inv=999;for(let i=0;i<3000;i++)g.update(1/120);assert.equal(new Set(g.log.events.filter(e=>e.event==='boss_pattern').map(e=>e.pattern)).size,3);g.hitEnemy(g.enemies[0],99999);for(let i=0;i<180;i++)g.update(1/120);g.player.x=g.width-80;g.action('interact');assert.equal(g.state,'victory');assert.equal(g.rank,'BLUE CHIP');assert.equal(g.log.events.filter(e=>e.event==='run_end').length,1);});
test('logs join run, stage, reward and totem; invalid reward is rejected',()=>{const g=make();g.enemies.forEach(e=>e.dead=true);for(let i=0;i<180;i++)g.update(1/120);g.chooseReward('invalid');assert.equal(g.state,'reward');g.chooseReward(g.currentOffers[0]);const exported=g.log.export();assert.ok(exported.events.every(e=>e.run_id===g.log.runId));assert.equal(exported.summary.stage_completion_rate,1);assert.ok(exported.events.some(e=>e.event==='reward_presented'));assert.ok(exported.events.some(e=>e.event==='reward_selected'));assert.equal(ROOM_SPECS.length,15);assert.equal(TOTEMS.length,16);});
