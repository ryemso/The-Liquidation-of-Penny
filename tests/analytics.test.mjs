import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze} from '../scripts/analyze-runs.mjs';
const run=events=>({run_id:'r',events:events.map((e,i)=>({run_id:'r',sequence:i+1,stage_id:1,...e}))});
test('merge snapshots without double counting offers or clears',()=>{const r=run([{event:'stage_start',room_kind:'combat'},{event:'totem_offer_shown',offers:['a']},{event:'totem_offer_shown',offers:['a']},{event:'totem_reward_selected',totem_id:'a'},{event:'stage_clear',duration:12}]);const a=analyze([r,r]);assert.equal(a.stages[0].attempts,1);assert.equal(a.totems[0].selection_rate,1);assert.equal(a.stages[0].mean_clear_seconds,12);});
test('unfinished run is unresolved rather than drop off',()=>{const a=analyze([run([{event:'stage_start'}])]);assert.equal(a.stages[0].unresolved,1);assert.equal(a.stages[0].exits_before_clear,0);});
test('exclude sequence gaps and reject conflicting duplicate events',()=>{const r=run([{event:'stage_start'},{event:'stage_clear'}]);r.events.shift();assert.equal(analyze([r]).excluded_runs,1);assert.throws(()=>analyze([run([{event:'a'}]),run([{event:'b'}])]));});
