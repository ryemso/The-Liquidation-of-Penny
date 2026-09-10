import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../engine.mjs';
import {enableVerticalSlice} from '../vertical-slice-mode.mjs';
import {enableEliteSlice} from '../vertical-slice-elite.mjs';

enableVerticalSlice(Game);
enableEliteSlice(Game);

const game=()=>{const g=new Game({random:()=>.5});g.start();g.setRoom(3,false);return g;};

test('elite room records decline without forcing the optional challenge',()=>{
 const g=game();
 g.state='trial_choice';
 g.relic.trial=true;
 g.chooseTrial(false);
 assert.equal(g.vsElite.decision,'decline');
 assert.equal(g.state,'playing');
 assert.equal(g.trialEnemy,null);
});

test('elite challenge stores starting HP for performance scoring',()=>{
 const g=game();
 g.state='trial_choice';
 g.relic.trial=true;
 g.player.hp=73;
 g.chooseTrial(true);
 assert.equal(g.vsElite.decision,'accept');
 assert.equal(g.vsElite.startHp,73);
 assert.ok(g.trialEnemy);
});

test('clean elite clear grants the maximum performance seed bonus',()=>{
 const g=game();
 g.state='trial_choice';
 g.relic.trial=true;
 g.player.hp=80;
 g.chooseTrial(true);
 const before=g.player.gold;
 g.relic.trialComplete=true;
 g.vsElite.startHp=80;
 g.vsElite.bonusGiven=false;
 g.update(1/120,{});
 assert.equal(g.vsElite.performance.damageTaken,0);
 assert.equal(g.vsElite.performance.bonus,20);
 assert.equal(g.player.gold,before+20);
});
