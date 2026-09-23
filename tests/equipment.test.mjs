import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../engine.mjs';
import {normalizeLoadout,readLoadout,saveLoadout} from '../equipment.mjs';
test('reject unknown, wrong-slot and duplicate equipment from saved data',()=>{
 const v=normalizeLoadout({weapon:'pizza-score',armor:'opening-dagger',special1:'buffett-ledger',special2:'buffett-ledger'});
 assert.equal(v.weapon,null);assert.equal(v.armor,null);assert.equal(v.special1,'buffett-ledger');assert.equal(v.special2,null);
});
test('starting bonuses coexist with knowledge and chapter promotion without stacking across retries',()=>{
 const equipment={weapon:'breakout-longsword',armor:'margin-call-armor',special1:'musk-imagination'};
 const g=new Game({knowledge:3,equipment});assert.equal(g.stats.atk,27);assert.equal(g.player.maxHp,114);assert.equal(g.player.hp,114);
 g.prepareChapterTwo();assert.equal(g.stats.atk,33);assert.equal(g.player.maxHp,134);
 const retry=new Game({knowledge:3,equipment});assert.equal(retry.stats.atk,27);assert.equal(retry.player.hp,114);
 assert.equal(new Game().stats.atk,18);
});
test('equipment selection round-trips, corrupt or unavailable storage degrades safely',()=>{
 const storage={value:null,getItem(){return this.value;},setItem(k,v){this.value=v;}};
 assert.equal(saveLoadout(storage,{accessory:'dividend-notebook'}),true);assert.equal(readLoadout(storage).accessory,'dividend-notebook');
 storage.value='{bad';assert.equal(readLoadout(storage).accessory,null);assert.equal(saveLoadout(undefined,{}),false);assert.equal(readLoadout(undefined).weapon,null);
});
test('run log snapshots starting equipment and equipped circuit bonus affects skill',()=>{
 const g=new Game({equipment:{special1:'einstein-mistake'}});g.start();g.action('circuit');assert.equal(g.freeze,2.5);
 const log=g.log.export().events.find(e=>e.event==='run_start');assert.equal(log.equipment.special1,'einstein-mistake');
});
