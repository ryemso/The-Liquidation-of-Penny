export class RunLog {
 constructor(game){this.game=game;this.runId=globalThis.crypto?.randomUUID?.()||`run-${Date.now()}-${Math.random().toString(36).slice(2)}`;this.events=[];this.seq=0;this.started=false;this.ended=false;}
 add(event,data={}){if(!this.started||this.ended)return;const g=this.game;this.events.push({schema_version:1,run_id:this.runId,sequence:++this.seq,event,wall_time:new Date().toISOString(),time:+g.totalTime.toFixed(3),stage_id:g.room+1,chapter:g.spec?.chapter,hp:Math.ceil(g.player.hp),market:g.market,totems:g.totems.slots.filter(Boolean),...data});if(this.events.length>30000)this.events.shift();}
 start(){if(this.started)return;this.started=true;this.add('run_start',{build:'chapter3-totems16'});this.stageStart();}
 stageStart(){this.stageAt=this.game.totalTime;this.add('stage_start',{room_name:this.game.spec.name,room_kind:this.game.spec.kind});}
 end(reason){if(this.ended||!this.started)return;this.add('run_end',{reason});this.ended=true;}
 export(){return {schema_version:1,run_id:this.runId,truncated:this.seq>this.events.length,events:this.events,summary:summarize(this.events)};}
}
export function summarize(events){const count=n=>events.filter(e=>e.event===n).length;const starts=count('stage_start');return {stage_attempts:starts,stage_clears:count('stage_clear'),stage_completion_rate:starts?count('stage_clear')/starts:null,deaths:count('player_death'),attacks:count('attack'),hits:count('attack_hit'),damage_taken:events.filter(e=>e.event==='damage_taken').reduce((a,e)=>a+e.amount,0),totem_activations:count('totem_activated'),note:'한 도전의 기록입니다. 전체 사용자 이탈률·사망률이 아닙니다.'};}
