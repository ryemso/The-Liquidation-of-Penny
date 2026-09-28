import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../engine.mjs';
import {summonSnipers} from '../pentagon-combat.mjs';
import {drawUpperBoss} from '../upper-boss-art.mjs';
const step=(g,n)=>{for(let i=0;i<n;i++)g.update(1/120);};
const make=()=>{const g=new Game({random:()=>.5});g.start();g.setRoom(28);g.player.inv=999;step(g,361);return g;};
test('executor summons exactly five snipers after transformation and cannot stack waves',()=>{
 const g=make(),boss=g.enemies[0];assert.ok(summonSnipers(g,boss));const troops=g.enemies.filter(e=>e.sniper);assert.equal(troops.length,5);assert.ok(troops.every(e=>e.type==='rifle'&&e.gold===0&&e.summoner===boss.id));assert.equal(summonSnipers(g,boss),false);
 for(let i=0;i<700;i++){g.update(1/120);assert.ok(g.enemies.filter(e=>e.sniper&&!e.dead).length<=5);}assert.ok(troops.every(e=>e.dead));
});
test('five troops lock independent aims, fire once and retire; owner defeat removes them',()=>{
 const g=make(),boss=g.enemies[0];summonSnipers(g,boss);const troops=g.enemies.filter(e=>e.sniper);const beams=new Set();for(let i=0;i<600;i++){g.update(1/120);for(const e of troops)if(e.beam)beams.add(e.id);}assert.equal(beams.size,5);assert.ok(troops.every(e=>e.dead));summonSnipers(g,boss);g.hitEnemy(boss,99999,0,false,true);assert.ok(g.enemies.every(e=>e.dead));
});
test('automatic summon and policies coexist, pause freezes the wave, room change removes it',()=>{
 const g=make();step(g,740);assert.ok(g.log.events.some(e=>e.pattern==='작전주 작전시작'));assert.ok(g.log.events.some(e=>e.pattern==='rate_up'));g.state='paused';const timers=g.enemies.map(e=>e.timer);step(g,300);assert.deepEqual(g.enemies.map(e=>e.timer),timers);g.state='playing';g.setRoom(25);assert.ok(!g.enemies.some(e=>e.sniper));
});
test('fifth chapter never uses the summon or sniper signature',()=>{const g=new Game();g.start();g.setRoom(24);g.player.inv=999;step(g,4800);assert.ok(!g.enemies.some(e=>e.sniper));assert.ok(!g.log.events.some(e=>e.pattern==='작전주 작전시작'));});
test('split and axe effects do not draw rectangular axis or landing guides',()=>{for(const type of ['algorithm','central'])for(const skillState of ['prepare','leap','split','impact']){const calls=[];const ctx=new Proxy({}, {get:(_,k)=>(...a)=>calls.push(k),set:()=>true});drawUpperBoss(ctx,{type,skillState,skillActive:true,x:10,y:20,w:30,h:40,timer:.3,facing:1});assert.ok(!calls.includes('strokeRect'));assert.ok(!calls.includes('fillRect'));}});
