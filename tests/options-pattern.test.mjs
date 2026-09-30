import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../engine.mjs';
import {optionDamage} from '../options-pattern.mjs';
const step=(g,seconds)=>{for(let i=0;i<Math.ceil(seconds*120);i++)g.update(1/120);};
function setup(room=24,random=()=>.25){const g=new Game({random});g.start();g.setRoom(room);g.player.inv=999;const e=g.enemies.find(e=>e.boss);if(e.type==='executor'){step(g,3.01);e.sniperClock=100;}e.state='idle';e.timer=0;e.optionClock=0;g.update(1/120);assert.ok(g.optionContract);return {g,e};}
test('both late bosses offer readable contracts and correct choices cancel into a punish window',()=>{
 for(const room of [24,28])for(const [rand,side,arrow] of [[.25,'long','↗'],[.75,'short','↘']]){
  const {g,e}=setup(room,()=>rand);assert.ok(g.optionContract.hint.includes(arrow));g.action('option_'+side);step(g,4.05);
  assert.equal(g.optionContract,null);assert.ok(e.stagger>2.3);assert.equal(g.optionLoss,null);assert.ok(g.optionResult.success);assert.equal(optionDamage(g),1);
 }
});
test('wrong or missing prediction loses damage temporarily, preserves movement/stats, restores exactly',()=>{
 for(const choice of ['short',null]){const {g}=setup();const stats={...g.stats};g.market=0;const before=g.damage();if(choice)g.action('option_'+choice);step(g,4.05);assert.ok(g.optionLoss);assert.equal(g.damage(),before*.7);assert.deepEqual(g.stats,stats);g.stats.atk+=10;const expected=g.stats.atk;step(g,8.1);assert.equal(optionDamage(g),1);assert.equal(g.damage(),expected);assert.equal(g.stats.speed,stats.speed);}
});
test('choice can change before lock, cannot change after lock or while paused',()=>{
 const {g}=setup();g.action('option_short');g.action('option_long');assert.equal(g.optionContract.choice,'long');g.state='paused';g.action('option_short');step(g,5);assert.equal(g.optionContract.choice,'long');assert.equal(g.optionContract.remaining,3);g.state='playing';step(g,3.02);assert.equal(g.optionContract.phase,'locked');g.action('option_short');assert.equal(g.optionContract.choice,'long');
});
test('circuit freezes settlement; boss cannot attack or summon while predicting',()=>{
 const {g,e}=setup(28);e.sniperClock=0;const hp=g.player.hp;g.freeze=2;step(g,1);assert.equal(g.optionContract.remaining,3);assert.equal(g.enemies.filter(e=>e.sniper).length,0);assert.equal(g.player.hp,hp);assert.equal(e.state,'recover');
});
test('boss defeat, room exit and player death cancel contracts and losses',()=>{
 for(const exit of [g=>g.setRoom(25),g=>g.finish(false),g=>g.hitEnemy(g.enemies[0],999999,0,false,true)])for(const failed of [false,true]){
  const {g}=setup();if(failed)step(g,4.05);exit(g);assert.equal(g.optionContract,null);assert.equal(g.optionLoss,null);assert.equal(optionDamage(g),1);
 }
});
test('pattern waits for executor transformation and living sniper squad; early bosses excluded',()=>{
 const g=new Game();g.start();g.setRoom(28);g.player.inv=999;g.enemies[0].optionClock=0;step(g,2.9);assert.ok(!g.optionContract);
 const {g:h,e}=setup(28);h.optionContract=null;e.state='idle';e.optionClock=0;const m=h.makeEnemy('rifle',100,620);m.sniper=true;m.skillActive=true;m.skillState='reload';m.timer=10;h.enemies.push(m);h.update(1/120);assert.ok(!h.optionContract);
 for(const room of [4,9,14,19]){g.setRoom(room);g.enemies[0].optionClock=0;g.update(1/120);assert.ok(!g.optionContract);}
});
function nextContract(g,e){e.stagger=0;e.optionClock=0;e.state='idle';e.timer=0;g.hitstop=0;g.update(1/120);assert.ok(g.optionContract);}
test('third cumulative failure liquidates through invulnerability; success does not erase failures',()=>{
 const {g,e}=setup();g.action('option_short');step(g,4.05);assert.equal(e.optionFailures,1);
 nextContract(g,e);g.action('option_long');step(g,4.05);assert.equal(e.optionFailures,1);assert.equal(e.optionSuccesses,1);
 nextContract(g,e);step(g,4.05);assert.equal(e.optionFailures,2);assert.equal(g.state,'playing');
 nextContract(g,e);g.action('option_short');step(g,4.05);assert.equal(g.state,'dead');assert.equal(g.player.hp,0);assert.equal(g.pizzaEarned,0);assert.ok(g.log.events.some(e=>e.event==='option_liquidated'));assert.equal(g.optionContract,null);
});
test('success bonus pays only at boss clear, once, and does not carry to next boss',()=>{
 for(const room of [24,28]){const {g,e}=setup(room);for(let i=0;i<2;i++){if(i)nextContract(g,e);g.action('option_long');step(g,4.05);}assert.equal(g.pizzaEarned,0);g.hitEnemy(e,999999,0,false,true);step(g,1.2);assert.equal(g.lastClearPizza,room===24?350:420);const earned=g.pizzaEarned;step(g,2);assert.equal(g.pizzaEarned,earned);g.setRoom(room);assert.ok(!g.enemies[0].optionSuccesses);assert.ok(!g.enemies[0].optionFailures);}
});
test('death before boss clear forfeits accumulated option bonus',()=>{const {g}=setup();g.action('option_long');step(g,4.05);g.finish(false);assert.equal(g.pizzaEarned,0);});
