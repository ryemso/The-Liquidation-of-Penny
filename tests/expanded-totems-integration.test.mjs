import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture,tick,hit,evade} from './helpers/combat.mjs';
// Independently specified input recipes from the displayed descriptions.
// These do not read the implementation's sequence arrays or inject signals.
const recipes={
 triple_bottom:['evade','evade','evade','hit'],
 triple_top:['combo','combo','combo','profit'],
 round_bottom:[...Array(8).fill('hit'),'profit'],
 round_top:[...Array(8).fill('hit'),'profit'],
 head_shoulders:['hit','profit','hit','hit'],
 inverse_head:['evade','circuit','evade','hit'],
 quasimodo:['evade','profit','evade','hit'],
 rising_wedge:['combo','combo','combo','profit'],
 falling_wedge:['evade','hit','evade','hit','profit'],
 broadening:['hit','evade','hit','evade','profit'],
 wolfe:['hit','evade','hit','evade','evade','profit'],
};
function prepare(id){
 const f=fixture(id);
 // A readiness is fixture setup, explicitly not an earned run resource.
 f.g.player.profit=100;f.g.player.hp=50;
 return f;
}
function input(g,step){
 if(step==='hit')hit(g);
 if(step==='combo')for(let i=0;i<3;i++)hit(g);
 if(step==='evade')evade(g);
 if(step==='profit')g.action('profit');
 if(step==='circuit'){g.action('circuit');tick(g,2.1);}
}
for(const [id,recipe] of Object.entries(recipes))test(`${id}: described inputs reach exactly one activation through combat`,()=>{
 const {g}=prepare(id);
 for(const step of recipe)input(g,step);
 assert.equal(g.log.events.filter(e=>e.event==='totem_activated'&&e.totem_id===id).length,1,id);
 assert.ok(g.totems.states[id].cd>0);
 const cd=g.totems.states[id].cd;
 g.state='totems';g.totems.unequip(0);assert.ok(g.totems.equip(id,0));
 assert.equal(g.totems.states[id].cd,cd);tick(g,20);assert.equal(g.totems.states[id].cd,cd);
 g.state='playing';for(const step of recipe)input(g,step);
 assert.equal(g.log.events.filter(e=>e.event==='totem_activated'&&e.totem_id===id).length,1,'no cooldown reset by swapping');
});
test('round bottom / round top / flag: healing is bounded and does not loop on A',()=>{
 const {g,e}=prepare('round_bottom');
 g.state='totems';for(const [slot,id] of [[1,'round_top'],[2,'flag']]){g.totems.acquire(id);g.totems.equip(id,slot);}g.state='playing';
 for(let i=0;i<8;i++)hit(g);const hp=g.player.hp;
 g.action('profit');assert.equal(g.player.hp,hp+15);assert.equal(e.attackWeak,8);
 for(let i=0;i<20;i++)g.action('profit');assert.equal(g.player.hp,hp+15);
 assert.equal(g.log.events.filter(e=>e.event==='totem_activated'&&e.totem_id==='round_bottom').length,1);
});
test('triple bottom + inverse head + quasimodo never recurse through their bonus damage',()=>{
 const {g}=prepare('triple_bottom');
 g.state='totems';for(const [slot,id] of [[1,'inverse_head'],[2,'quasimodo']]){g.totems.acquire(id);g.totems.equip(id,slot);}g.state='playing';
 evade(g);g.action('circuit');tick(g,2.1);g.action('profit');evade(g);evade(g);hit(g);
 const activations=g.log.events.filter(e=>e.event==='totem_activated');
 assert.equal(activations.length,3);assert.equal(new Set(activations.map(e=>e.totem_id)).size,3);
});
