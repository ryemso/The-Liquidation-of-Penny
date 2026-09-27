import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../engine.mjs';
function make(room=4){const g=new Game({random:()=>.5});g.start();g.setRoom(room);g.player.inv=999;return g;}
test('every chapter 1-5 boss approaches, cycles melee attacks and never creates bullets',()=>{
 for(const room of [4,9,14,19,24]){const g=make(room),e=g.enemies[0];g.player.x=e.x-300;g.player.y=620-g.player.h;const start=e.x;for(let i=0;i<2400;i++)g.update(1/120);assert.notEqual(e.x,start);for(const pattern of ['lunge','sweep','heavy'])assert.ok(g.log.events.some(x=>x.pattern===pattern),`${room}: ${pattern}`);assert.equal(g.projectiles.length,0);assert.equal(g.hazards.length,0);assert.ok(Math.abs(e.y+e.h-620)<.001);}
});
test('melee damage requires attack state, hits only once, and can be avoided above',()=>{
 const g=make(),e=g.enemies[0];g.player.inv=0;e.activated=true;e.lockDirection=1;e.pattern=2;e.timer=.2;e.state='windup';g.player.x=e.x+e.w;g.player.y=e.y;let hp=g.player.hp;g.updateEnemy(e,.01);assert.equal(g.player.hp,hp);e.state='attack';g.updateEnemy(e,.01);assert.ok(g.player.hp<hp);hp=g.player.hp;g.player.inv=0;g.updateEnemy(e,.01);assert.equal(g.player.hp,hp);e.struck=false;g.player.y=e.y-g.player.h-10;g.updateEnemy(e,.01);assert.equal(g.player.hp,hp);
});
test('attack near a wall cannot trigger auto-jump; stagger and inactive route still fall',()=>{
 const g=make(0);const e=g.makeEnemy('rubble',500,620);e.activated=true;e.state='attack';e.lockDirection=1;e.timer=.2;g.terrain.walls=[{x:530,y:500,w:40,h:120,solid:true}];g.updateEnemy(e,.01);assert.equal(e.vy,0);
 for(const mode of ['stagger','route','inactive']){const m=g.makeEnemy('rubble',500,400);m.grounded=false;m.vy=0;if(mode==='stagger')m.stagger=1;if(mode==='route')m.routeBand='upper';if(mode==='inactive')g.player.x=2000;g.player.y=580;const y=m.y;g.updateEnemy(m,.1);assert.ok(m.y>y,mode);}
});
