import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../engine.mjs';
import {simulate} from '../scripts/check-chapter12.mjs';

import {fixture,tick,hit,evade} from './helpers/combat.mjs';
const activations=g=>g.log.events.filter(e=>e.event==='totem_activated');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);

test('double bottom: two projectile collisions in separate dashes, then real X hit',()=>{
 const {g,e}=fixture('double_bottom');evade(g);evade(g);
 assert.equal(g.log.events.filter(e=>e.event==='dodge_success').length,2);
 assert.equal(g.player.hp,100);assert.equal(g.totems.states.double_bottom.n,2);
 const hp=e.hp;hit(g);near(hp-e.hp,18*1.6);assert.equal(activations(g).length,1);
});
test('double top: six real X attacks then A applies 25% to the triggering attack',()=>{
 const {g,e}=fixture('double_top');for(let i=0;i<6;i++)hit(g);
 assert.equal(g.totems.states.double_top.n,2);const hp=e.hp,profit=g.player.profit;
 g.action('profit');near(hp-e.hp,18*(1+profit/30)*1.25);
 assert.equal(e.totemWeak,6);assert.equal(activations(g).length,1);
 tick(g,6.1);assert.equal(e.totemWeak,0);
});
test('flag: held X cannot finish; release 0.8 seconds then real X adds 80%',()=>{
 const {g,e}=fixture('flag');tick(g,1.2,{attack:true});
 assert.equal(g.totems.states.flag.n,3);assert.equal(activations(g).length,0);
 tick(g,.81);const hp=e.hp;g.action('attack');near(hp-e.hp,18*1.8);
 assert.equal(activations(g).length,1);
});
test('cup: six real hits then dash and real X adds 150%',()=>{
 const {g,e}=fixture('cup');for(let i=0;i<6;i++)hit(g);
 assert.equal(g.totems.states.cup.n,6);evade(g);assert.equal(g.totems.states.cup.ready,true);
 const hp=e.hp;hit(g);near(hp-e.hp,18*2.5);assert.equal(activations(g).length,1);
});
for(const branch of ['profit','circuit'])test(`triangle: alternating real hits and projectile dodges, ${branch} branch`,()=>{
 const {g,e}=fixture('triangle');hit(g);evade(g);hit(g);evade(g);
 assert.equal(g.totems.states.triangle.n,4);
 if(branch==='profit'){
  // Two more normal attacks earn the A resource without consuming the pattern.
  hit(g);hit(g);const hp=e.hp,profit=g.player.profit;
  g.action('profit');near(hp-e.hp,18*(1+profit/30)+18);
 }else{
  g.action('circuit');assert.equal(g.totems.guard,.4);
  tick(g,2.1);const hp=g.player.hp;
  g.projectiles.push({x:g.player.x+15,y:g.player.y+28,vx:0,vy:0,r:6,damage:10,life:2});
  tick(g,.01);assert.equal(hp-g.player.hp,6);
  tick(g,3);assert.equal(g.totems.guard,0);
 }
 assert.equal(activations(g).length,1);
});
test('all five: real-hit pattern times out; menus freeze the formation clock',()=>{
 for(const id of ['double_bottom','double_top','flag','triangle','cup']){
  const {g}=fixture(id);if(id==='double_bottom')evade(g);else if(id==='double_top')for(let i=0;i<3;i++)hit(g);else hit(g);
  assert.ok(g.totems.states[id].n>0);const before=g.totems.states[id].time;
  g.state='totems';tick(g,20);near(g.totems.states[id].time,before);g.state='playing';
  tick(g,13);assert.equal(g.totems.states[id].n,0);assert.equal(activations(g).length,0);
  assert.ok(g.log.events.some(e=>e.event==='totem_pattern_failed'&&e.reason==='timeout'));
 }
});
for(const id of ['flag','cup'])test(`${id}: a hostile projectile clears a partially formed pattern`,()=>{
 const {g}=fixture(id);hit(g);assert.equal(g.totems.states[id].n,1);
 g.projectiles.push({x:g.player.x+15,y:g.player.y+28,vx:0,vy:0,r:6,damage:10,life:2});
 tick(g,.01);assert.equal(g.player.hp,90);assert.equal(g.totems.states[id].n,0);
 assert.ok(g.log.events.some(e=>e.event==='totem_pattern_failed'&&e.reason==='damage_taken'));
});
test('a projectile after the dash immunity window damages rather than charging a dodge',()=>{
 const {g}=fixture('double_bottom');g.action('dash');tick(g,.25);
 g.projectiles.push({x:g.player.x+15,y:g.player.y+28,vx:0,vy:0,r:6,damage:10,life:2});
 tick(g,.01);assert.equal(g.player.hp,90);assert.equal(g.totems.states.double_bottom.n,0);
 assert.equal(g.log.events.filter(e=>e.event==='dodge_success').length,0);
});
test('chapter 1–2 input journeys: ordinary movement, combat, caches, elites, rewards and promotion',()=>{
 for(const seed of [1,2,3])for(const explore of [false,true]){
  const r=simulate(seed,explore),events=r.log.events;
  assert.equal(r.stage,11,`seed ${seed}, explore ${explore}`);assert.equal(r.state,'playing');
  for(let stage=1;stage<=10;stage++)for(const event of ['stage_start','stage_clear','stage_exit'])
   assert.equal(events.filter(e=>e.stage_id===stage&&e.event===event).length,1,`${stage} ${event}`);
  assert.equal(events.filter(e=>e.event==='reward_selected').length,6);
  assert.equal(events.filter(e=>e.event==='reward_presented').length,6);
  assert.equal(events.filter(e=>e.event==='enemy_defeated').length,r.kills);
  if(explore){
   for(const id of ['double_bottom','double_top','flag','triangle','cup'])assert.ok(r.owned.includes(id));
   assert.equal(events.filter(e=>e.event==='totem_acquired').length,6);
   assert.equal(events.filter(e=>e.event==='totem_reward_selected').length,6);
   assert.equal(events.filter(e=>e.event==='elite_trial_clear').length,2);
   assert.equal(events.filter(e=>e.event==='secret_found').length,2);
  }
  assert.equal(new Set(events.map(e=>e.sequence)).size,events.length);
  assert.ok(events.every(e=>e.run_id===r.log.run_id));
 }
});
test('bomb self-explosion has exactly one defeat event and one reward',()=>{
 const g=new Game({random:()=>.99});g.start();const e=g.makeEnemy('bomb',1000,620);
 g.enemies=[e];e.state='charge';e.timer=.001;g.player.x=700;
 tick(g,.01);assert.equal(e.dead,true);assert.equal(g.kills,1);
 assert.equal(g.log.events.filter(r=>r.event==='enemy_defeated'&&r.enemy_id===e.id).length,1);
 const gold=g.player.gold;tick(g,1);g.explode(e);assert.equal(g.player.gold,gold);
 assert.equal(g.log.events.filter(r=>r.event==='enemy_defeated'&&r.enemy_id===e.id).length,1);
});
