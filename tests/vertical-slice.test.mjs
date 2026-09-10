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
