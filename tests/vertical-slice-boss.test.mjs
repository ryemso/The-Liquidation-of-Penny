import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../engine.mjs';
import {enableVerticalSlice} from '../vertical-slice-mode.mjs';
import {enableEliteSlice} from '../vertical-slice-elite.mjs';
import {enableBossSlice} from '../vertical-slice-boss.mjs';

enableVerticalSlice(Game);
enableEliteSlice(Game);
enableBossSlice(Game);

const newBossGame=()=>{
 const events=[];
 const game=new Game({random:()=>.5,onEvent:event=>events.push(event)});
 game.start();
 game.setRoom(4,false);
 game.player.inv=999;
 return {game,events};
};

test('chapter one boss announces phase two and clears prior threats at half HP',()=>{
 const {game,events}=newBossGame();
 const boss=game.enemies.find(enemy=>enemy.boss);
 game.projectiles=[{x:1,y:1,vx:0,vy:0,r:1,damage:1,life:2}];
 boss.hp=boss.maxHp*.49;
 game.update(1/120,{});
 assert.equal(game.vsBoss.phase2,true);
 assert.equal(game.projectiles.length,0);
 assert.ok(events.some(event=>event.type==='notice'&&/PHASE 02/.test(event.text)));
});

test('chapter one boss desperation pattern appears once below twenty percent HP',()=>{
 const {game}=newBossGame();
 const boss=game.enemies.find(enemy=>enemy.boss);
 boss.hp=boss.maxHp*.19;
 game.update(1/120,{});
 const firstCount=game.hazards.length;
 assert.equal(game.vsBoss.desperation,true);
 assert.ok(firstCount>0);
 game.update(1/120,{});
 assert.ok(game.hazards.length<=firstCount);
});

test('chapter one boss clear stores performance data',()=>{
 const {game}=newBossGame();
 const boss=game.enemies.find(enemy=>enemy.boss);
 game.player.hp=81;
 game.hitEnemy(boss,10000);
 game.update(1/120,{});
 assert.equal(game.vsBoss.cleared,true);
 assert.equal(game.doorOpen,true);
});
