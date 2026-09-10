import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../engine.mjs';
import {tick} from './helpers/combat.mjs';

test('fatal bomb splash records collateral defeat before the terminal run event',()=>{
 let archived;
 const g=new Game({random:()=>.99,onEvent:event=>{if(event.type==='finish')archived=JSON.parse(JSON.stringify(g.log.export()));}});
 g.start();Object.assign(g.player,{x:400,y:564,hp:5,inv:0});
 const bomb=g.makeEnemy('bomb',400,620),other=g.makeEnemy('rubble',455,620);
 bomb.state='charge';bomb.timer=.001;g.enemies=[bomb,other];
 tick(g,.01);assert.equal(g.state,'dead');assert.equal(other.dead,true);
 assert.equal(g.log.events.at(-1).event,'run_end');
 assert.equal(g.log.events.filter(e=>e.event==='enemy_defeated').length,2);
 assert.equal(archived.events.filter(e=>e.event==='enemy_defeated').length,2);
 assert.equal(archived.events.filter(e=>e.event==='player_death').length,1);
 assert.equal(archived.events.filter(e=>e.event==='run_end').length,1);
 assert.deepEqual(archived,g.log.export());
});
test('ended sessions reject late events; a fresh run has its own identity',()=>{
 const g=new Game();g.start();g.log.end('restart');const snapshot=JSON.stringify(g.log.export());
 g.log.add('attack',{skill:'basic'});g.log.end('page_exit');
 assert.equal(JSON.stringify(g.log.export()),snapshot);
 const next=new Game();next.start();assert.notEqual(next.log.runId,g.log.runId);
 assert.equal(next.log.events.filter(e=>e.event==='run_start').length,1);
 assert.equal(next.log.events.filter(e=>e.event==='stage_start').length,1);
});
