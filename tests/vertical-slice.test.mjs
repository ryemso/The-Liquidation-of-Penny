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
