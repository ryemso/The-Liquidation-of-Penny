import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../engine.mjs';
import {updateSpecialPattern} from '../boss-patterns.mjs';
function cycles(room,hpRatio=1,transition=false){const g=new Game();g.start();g.setRoom(room);const e=g.enemies[0],found=[];e.hp=e.maxHp*hpRatio;for(let i=1;i<=11;i++){e.state='idle';e.timer=0;e.specialActive=false;e.advanced=null;if(transition&&i===6)e.hp=e.maxHp*.5;updateSpecialPattern(g,e);if(e.advanced)found.push(i);}return found;}
test('upper bosses debut on second cycle then repeat every three',()=>{for(const room of [14,19,24])assert.deepEqual(cycles(room),[2,5,8,11]);});
test('half HP repeats every two cycles with no consecutive phase transition attacks',()=>{for(const room of [14,19,24]){assert.deepEqual(cycles(room,.5),[2,4,6,8,10]);assert.deepEqual(cycles(room,1,true),[2,5,7,9,11]);}});
test('first two chapters do not gain advanced patterns',()=>{assert.deepEqual(cycles(4),[]);assert.deepEqual(cycles(9),[]);});
