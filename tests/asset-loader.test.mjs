import test from 'node:test';
import assert from 'node:assert/strict';
import {createImageLoader} from '../asset-loader.mjs';
import {hud} from '../totem-ui.mjs';
test('duplicate image requests share one load and transient errors retry once',async()=>{
 let requests=0;
 class Image {set src(value){requests++;queueMicrotask(()=>requests===1?this.onerror():this.onload());}}
 const load=createImageLoader({ImageClass:Image});const first=load('sprite.png');assert.equal(load('sprite.png'),first);await first;assert.equal(requests,2);await load('sprite.png');assert.equal(requests,2);
});
test('permanent failure releases cache and a later request can succeed',async()=>{
 let fail=true,requests=0;
 class Image {set src(value){requests++;queueMicrotask(()=>fail?this.onerror():this.onload());}}
 const load=createImageLoader({ImageClass:Image});await assert.rejects(load('sprite.png'));assert.equal(requests,2);fail=false;await load('sprite.png');assert.equal(requests,3);
});
test('stalled images time out and detach handlers',async()=>{
 const images=[];class Image {constructor(){images.push(this);}set src(value){}}
 const load=createImageLoader({ImageClass:Image,timeoutMs:5});await assert.rejects(load('stalled.png'),/timeout/);assert.equal(images.length,2);assert.ok(images.every(i=>i.onload===null&&i.onerror===null));
});
test('unchanged totem HUD avoids DOM serialization and repeated writes',()=>{
 let writes=0;const el={classList:{toggle(){}},get innerHTML(){throw new Error('DOM serialization');},set innerHTML(value){writes++;}};
 const game={state:'playing',totems:{slots:[null,null,null],states:{}}};for(let i=0;i<60;i++)hud(game,el);assert.equal(writes,1);
});
