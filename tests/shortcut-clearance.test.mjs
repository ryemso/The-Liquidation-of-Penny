import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../engine.mjs';
import {shortcutSegments,interactExploration,updateExploration} from '../exploration.mjs';
test('all ten generated bridges leave headroom and never overlap platforms or walls',()=>{
 const g=new Game();g.start();
 for(const room of [0,1,5,6,10,11,15,16,20,21]){
  g.setRoom(room);const r=g.exploration,original=[...g.platforms],preview=shortcutSegments(g);
  assert.ok(preview.length>0);
  Object.assign(g.player,{x:r.switchX-g.player.w/2,y:r.switchY-g.player.h});
  assert.equal(interactExploration(g),true);assert.deepEqual(r.bridgeSegments,preview);
  for(const b of r.bridgeSegments){assert.ok(b.w>=48);for(const p of original){assert.ok(!(b.x<p.x+p.w+8&&b.x+b.w>p.x-8&&b.y-48<p.y+p.h&&b.y+b.h+8>p.y),`room ${room} overlaps existing platform`);}}
  const n=g.platforms.length;interactExploration(g);assert.equal(g.platforms.length,n);
  const b=r.bridgeSegments[0];Object.assign(g.player,{x:b.x+10,y:b.y-g.player.h});updateExploration(g,.01);assert.ok(r.shortcutUsed);
 }
});
test('fully blocked bridge cannot be opened and no tiny fragments are created',()=>{
 const g={width:500,exploration:{bridge:{x:100,y:200,w:100,h:18},switchX:0,switchY:0},player:{x:0,y:0,w:0,h:0},platforms:[{x:90,y:190,w:120,h:18}],emit:()=>{}};
 assert.deepEqual(shortcutSegments(g),[]);assert.equal(interactExploration(g),false);assert.ok(!g.exploration.shortcut);
});
