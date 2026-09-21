import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,moveBody,ROOM_SPECS} from '../engine.mjs';
test('drop ignores only current ledge and lands on next platform',()=>{const g=new Game();g.start();g.platforms=[{x:0,y:620,w:800,h:100,ground:true},{x:100,y:300,w:200,h:18},{x:100,y:390,w:200,h:18}];Object.assign(g.player,{x:150,y:300-g.player.h,grounded:true,vx:0,vy:0});g.action('drop');assert.equal(g.player.dropPlatform,g.platforms[1]);for(let i=0;i<60;i++)moveBody(g.player,1/120,g.platforms,800);assert.equal(g.player.y+g.player.h,390);assert.equal(g.log.events.at(-1).event,'platform_drop');});
test('drop cannot pass solid walls or floor',()=>{const g=new Game();g.start();Object.assign(g.player,{x:100,y:620-g.player.h,grounded:true});g.action('drop');assert.ok(!g.player.dropPlatform);assert.equal(g.player.y+g.player.h,620);});

test('upper caches have headroom in every chapter',()=>{const g=new Game();for(let i=0;i<ROOM_SPECS.length;i++){g.setRoom(i,false);if(g.relic)assert.ok(g.relic.y+25-g.player.h>=70,`room ${i} cache is above playable ceiling`);}});
