import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,CARDS} from '../engine.mjs';
import {enableBalanceSlice,CHAPTER_ONE_BALANCE} from '../vertical-slice-balance.mjs';

enableBalanceSlice(Game,CARDS);

const gameWithEvents=()=>{
 const events=[];
 const game=new Game({random:()=>0.5,onEvent:event=>events.push(event)});
 game.start();
 return {game,events};
};

test('chapter one shop prices are raised to preserve a real seed tradeoff',()=>{
 const byId=Object.fromEntries(CARDS.map(card=>[card.id,card]));
 assert.equal(byId.growth.price,85);
 assert.equal(byId.dividend.price,80);
 assert.equal(byId.value.price,85);
});

test('room one tuning reduces tutorial enemy durability and damage',()=>{
 const {game}=gameWithEvents();
 const rubble=game.enemies.find(enemy=>enemy.type==='rubble');
 assert.ok(rubble);
 assert.equal(rubble.maxHp,46);
 assert.equal(rubble.damage,10);
});

test('crossroads tuning keeps telegraphed threats dangerous without early spike damage',()=>{
 const {game}=gameWithEvents();
 game.setRoom(1,false);
 const bomb=game.enemies.find(enemy=>enemy.type==='bomb');
 const ghost=game.enemies.find(enemy=>enemy.type==='ghost');
 assert.equal(bomb.maxHp,40);
 assert.equal(bomb.damage,18);
 assert.equal(ghost.maxHp,44);
 assert.equal(ghost.damage,9);
});

test('boss tuning keeps enough health to expose both later phases',()=>{
 const {game}=gameWithEvents();
 game.setRoom(4,false);
 const boss=game.enemies.find(enemy=>enemy.boss);
 assert.ok(boss);
 assert.equal(boss.maxHp,1050);
 assert.equal(boss.damage,16);
 assert.equal(CHAPTER_ONE_BALANCE.targetRooms[4][0],90);
});

test('room transitions emit balance summaries for later playtest tuning',()=>{
 const {game}=gameWithEvents();
 game.totalTime=60;
 game.setRoom(1,false);
 const rows=game.log.export().events||[];
 const summary=rows.find(row=>row.event==='balance_room_summary'&&row.room===1);
 assert.ok(summary);
 assert.equal(summary.duration,60);
 assert.equal(summary.pace,'target');
});

test('finishing a run records overall balance telemetry',()=>{
 const {game}=gameWithEvents();
 game.totalTime=540;
 game.finish(true);
 const rows=game.log.export().events||[];
 const summary=rows.find(row=>row.event==='balance_run_summary');
 assert.ok(summary);
 assert.equal(summary.duration,540);
 assert.equal(summary.pace,'target');
});
