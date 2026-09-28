import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../engine.mjs';
import {inventory} from '../totem-ui.mjs';
test('title catalog shows all totems without starting play or offering run-log export',()=>{
 const original=globalThis.document;let html='',closed=0;const closeButton={};
 globalThis.document={querySelectorAll:()=>[],getElementById:id=>id==='modal-inner'?{querySelectorAll:()=>[]}:id==='totem-close'?closeButton:null};
 try{const g=new Game(),before=JSON.stringify(g.totems.slots);inventory(g,markup=>{html=markup;},()=>closed++);assert.equal(g.state,'title');assert.equal((html.match(/data-totem=/g)||[]).length,16);assert.ok(html.includes('토템 도감'));assert.ok(html.includes('메인화면으로'));assert.ok(!html.includes('id="totem-log"'));assert.equal(JSON.stringify(g.totems.slots),before);closeButton.onclick();assert.equal(closed,1);}finally{globalThis.document=original;}
});
