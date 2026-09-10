import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../engine.mjs';
import {enableVerticalSlice} from '../vertical-slice-mode.mjs';

enableVerticalSlice(Game);

const newGame=()=>{
 const events=[];
 const game=new Game({random:()=>0.5,onEvent:event=>events.push(event)});
 game.start();
 return {game,events};
};

const step=(game,seconds,input={})=>{
 for(let i=0;i<Math.ceil(seconds*120);i++)game.update(1/120,input);
};

test('vertical slice blocks progression beyond chapter one',()=>{
 const {game}=newGame();
 game.setRoom(4,false);
 game.setRoom(5);
 assert.equal(game.room,4);
});

test('chapter one boss exit completes the run as SMALL CAP',()=>{
 const {game,events}=newGame();
 game.setRoom(4,false);
 game.doorOpen=true;
 game.player.x=game.width-100;
 game.action('interact');
 assert.equal(game.state,'victory');
 assert.equal(game.rank,'SMALL CAP');
 assert.ok(events.some(event=>event.type==='finish'&&event.won===true));
});

test('locked boss exit cannot end the slice early',()=>{
 const {game}=newGame();
 game.setRoom(4,false);
 game.doorOpen=false;
 game.player.x=game.width-100;
 game.action('interact');
 assert.equal(game.state,'playing');
});

test('room one tutorial advances movement, jump, attack, dash, then profit in order',()=>{
 const {game,events}=newGame();
 assert.equal(game.vsTutorial.step,0);
 step(game,.5,{right:true});
 assert.equal(game.vsTutorial.step,1);
 game.action('jump');
 assert.equal(game.vsTutorial.step,2);
 game.action('attack');
 assert.equal(game.vsTutorial.step,3);
 game.player.dashCD=0;
 game.action('dash');
 assert.equal(game.vsTutorial.step,4);
 game.player.profit=25;
 game.player.profitCD=0;
 game.action('profit');
 assert.equal(game.vsTutorial.complete,true);
 assert.ok(events.some(event=>event.type==='notice'&&/기초 거래 완료/.test(event.text)));
});

test('room one tutorial does not accept profit before the required profit threshold',()=>{
 const {game}=newGame();
 game.vsTutorial.step=4;
 game.player.profit=24;
 game.player.profitCD=0;
 game.action('profit');
 assert.equal(game.vsTutorial.step,4);
 assert.equal(game.vsTutorial.complete,false);
});

test('stop-loss crossroads records an evasive response to the bomb telegraph',()=>{
 const {game,events}=newGame();
 game.setRoom(1);
 const bomb=game.enemies.find(enemy=>enemy.type==='bomb');
 bomb.activated=true;
 bomb.state='windup';
 game.player.x=bomb.x-120;
 game.player.dashCD=0;
 game.action('dash');
 assert.equal(game.vsCrossroads.bombResponse,true);
 assert.ok(events.some(event=>event.type==='notice'&&/손절 대응 성공/.test(event.text)));
});

test('stop-loss crossroads records a response to a ghost aiming sequence',()=>{
 const {game,events}=newGame();
 game.setRoom(1);
 const ghost=game.enemies.find(enemy=>enemy.type==='ghost');
 ghost.activated=true;
 ghost.state='windup';
 game.player.x=ghost.x-180;
 game.action('jump');
 assert.equal(game.vsCrossroads.ghostResponse,true);
 assert.ok(events.some(event=>event.type==='notice'&&/원거리 대응 성공/.test(event.text)));
});

test('stop-loss crossroads lesson completes when bomb and ghost threats are removed',()=>{
 const {game,events}=newGame();
 game.setRoom(1);
 for(const enemy of game.enemies)if(['bomb','ghost'].includes(enemy.type))enemy.dead=true;
 step(game,.02);
 assert.equal(game.vsCrossroads.complete,true);
 assert.ok(events.some(event=>event.type==='notice'&&/손절 교차로 학습 완료/.test(event.text)));
});
