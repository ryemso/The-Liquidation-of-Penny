import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
export function analyze(documents){
 const runs=new Map(),warnings=[];
 for(const doc of documents)for(const run of doc.runs??[doc]){
  if(!run.run_id||!Array.isArray(run.events))throw new Error('run_id와 events가 있는 로그가 필요합니다.');
  const record=runs.get(run.run_id)??{events:new Map(),truncated:false};
  record.truncated ||= !!run.truncated;
  for(const e of run.events){if(!Number.isInteger(e.sequence)||e.run_id!==run.run_id)throw new Error('이벤트 run_id 또는 sequence가 올바르지 않습니다.');const old=record.events.get(e.sequence);if(old&&JSON.stringify(old)!==JSON.stringify(e))throw new Error('같은 이벤트 번호의 내용이 다릅니다.');record.events.set(e.sequence,e);}
  runs.set(run.run_id,record);
 }
 const stages=new Map(),totems=new Map();let excluded=0;
 const totem=id=>{if(!totems.has(id))totems.set(id,{id,offered:0,selected:0,activations:0,failures:{}});return totems.get(id);};
 for(const [id,run] of runs){const events=[...run.events.values()].sort((a,b)=>a.sequence-b.sequence);
  if(!events.length||events[0].sequence!==1||events.some((e,i)=>e.sequence!==i+1)){excluded++;warnings.push(`${id}: 불완전 로그 제외`);continue;}
  const rooms=new Map(),shown=new Set(),selected=new Set();
  for(const e of events){
   if(e.event==='stage_start'){if(rooms.has(e.stage_id))throw new Error('같은 도전의 방 재진입은 현재 분석에서 지원하지 않습니다.');rooms.set(e.stage_id,{id:e.stage_id,kind:e.room_kind,name:e.room_name,clear:false,death:false,end:null,duration:null});}
   const room=rooms.get(e.stage_id);
   if(room&&e.event==='stage_clear'){room.clear=true;room.duration=e.duration;}
   if(room&&e.event==='player_death')room.death=true;
   if(room&&e.event==='run_end')room.end=e.reason;
   if(e.event==='totem_offer_shown')for(const tid of e.offers??[]){const key=`${e.stage_id}:${tid}`;if(!shown.has(key)){shown.add(key);totem(tid).offered++;}}
   if(e.event==='totem_reward_selected'){const key=`${e.stage_id}:${e.totem_id}`;if(!selected.has(key)){selected.add(key);totem(e.totem_id).selected++;}}
   if(e.event==='totem_activated')totem(e.totem_id).activations++;
   if(e.event==='totem_pattern_failed'){const t=totem(e.totem_id);t.failures[e.reason]=(t.failures[e.reason]??0)+1;}
  }
  for(const r of rooms.values()){const s=stages.get(r.id)??{id:r.id,name:r.name,kind:r.kind,attempts:0,clears:0,deaths:0,exits_before_clear:0,unresolved:0,clear_durations:[]};s.attempts++;s.clears+=+r.clear;s.deaths+=+r.death;if(!r.clear&&!r.death){if(['restart','page_exit'].includes(r.end))s.exits_before_clear++;else s.unresolved++;}if(r.clear&&Number.isFinite(r.duration))s.clear_durations.push(r.duration);stages.set(r.id,s);}
 }
 return {unique_runs:runs.size,excluded_runs:excluded,warnings,stages:[...stages.values()].sort((a,b)=>a.id-b.id).map(s=>({...s,completion_rate:s.clears/s.attempts,death_rate:s.deaths/s.attempts,mean_clear_seconds:s.clear_durations.length?s.clear_durations.reduce((a,b)=>a+b,0)/s.clear_durations.length:null})),totems:[...totems.values()].map(t=>({...t,selection_rate:t.offered?t.selected/t.offered:null})),note:'도전 단위 관측치입니다. 상점은 kind로 분리하세요. 미종료는 이탈로 단정하지 않으며 토템 효과의 인과관계를 뜻하지 않습니다.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){try{if(process.argv.length<3)throw new Error('사용법: node scripts/analyze-runs.mjs 로그1.json 로그2.json');console.log(JSON.stringify(analyze(process.argv.slice(2).map(p=>JSON.parse(readFileSync(p,'utf8')))),null,2));}catch(e){console.error(e.message);process.exitCode=1;}}
