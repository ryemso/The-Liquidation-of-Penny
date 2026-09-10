// Pattern concepts: user-provided Yonsei_dent guide, pp. 4–11.
// All combat rules and values are original game design, not market probabilities.
export const GROUPS={reversal:'추세 전환형',continuation:'추세 지속형',neutral:'중립형',special:'특수형'};
export const TOTEMS=[
 {id:'double_bottom',name:'이중 바닥',group:'reversal',color:'#84d8b1',steps:2,cd:12,points:'0,10 20,55 40,25 60,55 80,25 100,5',desc:'8초 안에 대시로 실제 공격을 2번 회피 → 다음 적중으로 돌파. 공격력 60%의 추가 피해.',hint:'실제 공격 회피 2회 → 적중'},
 {id:'double_top',name:'이중 천장',group:'reversal',color:'#ef969e',steps:2,cd:14,points:'0,55 20,10 40,40 60,10 80,40 100,60',desc:'8초 안에 같은 적에게 3단 콤보 마무리 2회 → 그 적에게 익절 적중. 6초간 받는 피해 +25%.',hint:'같은 적 콤보 마무리 2회 → A 적중'},
 {id:'flag',name:'깃발형',group:'continuation',color:'#f2c779',steps:3,cd:10,points:'0,60 30,5 45,25 55,12 65,32 75,20 85,38 100,0',desc:'8초 안에 일반 공격 3회 적중 → X를 놓고 0.8초 쉬기 → 재적중. 공격력 80% 추가 피해. 피격 시 초기화.',hint:'3회 적중 → 0.8초 공격 중단 → 적중'},
 {id:'triangle',name:'삼각수렴',group:'neutral',color:'#8cc9ed',steps:4,cd:14,points:'0,0 20,60 40,12 60,48 80,24 90,36 100,5',desc:'8초 안에 적중·실제 회피를 교대로 4회. A 적중: 공격력 100% 추가 피해 / D: 5초간 피해 40% 감소.',hint:'적중·실제 회피 교대 4회 → A / D'},
 {id:'cup',name:'컵앤핸들',group:'special',color:'#bda9f1',steps:6,cd:16,points:'0,5 15,30 30,48 45,55 60,48 75,5 85,23 90,20 100,0',desc:'8초 안에 일반 공격 6회 적중 → 대시로 손잡이 형성 → 재적중. 공격력 150% 추가 피해. 피격 시 초기화.',hint:'6회 적중 → Z → 적중'}
];
export const CATALOG={reversal:['이중 바닥','이중 천장','삼중 바닥','삼중 천장','둥근 바닥','둥근 천장','머리어깨형','역머리어깨형','콰시모도'],continuation:['깃발형','상승 쐐기','하락 쐐기'],neutral:['삼각수렴','대칭 확산형'],special:['컵앤핸들','울프웨이브']};
export class TotemSystem{
 constructor(game){this.game=game;this.owned=[];this.slots=[null,null,null];this.states={};this.logs=[];this.serial=0;this.guard=0;this.guarding=0;}
 log(event,id,extra={}){this.logs.push({sequence:++this.serial,event,totem_id:id,room:this.game.room+1,time:this.game.totalTime,...extra});if(this.logs.length>5000)this.logs.shift();}
 acquire(id){if(!TOTEMS.some(t=>t.id===id)||this.owned.includes(id))return false;this.owned.push(id);this.states[id]={n:0,cd:0,time:0,last:'',target:null,ready:false,rest:0};this.log('totem_acquired',id);return true;}
 equip(id,slot){if(this.game.state!=='totems'||!this.owned.includes(id)||!Number.isInteger(slot)||slot<0||slot>2||this.slots.includes(id))return false;const old=this.slots[slot];if(old){this.reset(old,'unequipped');this.log('totem_unequipped',old,{slot});}this.slots[slot]=id;this.reset(id);this.log('totem_equipped',id,{slot});return true;}
 unequip(slot){if(this.game.state!=='totems')return;const id=this.slots[slot];if(!id)return;this.reset(id,'unequipped');this.log('totem_unequipped',id,{slot});this.slots[slot]=null;}
 reset(id,reason){const s=this.states[id];if(!s)return;if(s.n&&reason)this.log('totem_pattern_failed',id,{reason});Object.assign(s,{n:0,time:0,last:'',target:null,ready:false,rest:0});}
 roomChanged(){for(const id of this.owned)this.reset(id,'room_changed');this.guard=0;this.guarding=0;}
 advance(id){const s=this.states[id],t=TOTEMS.find(t=>t.id===id);if(!s.n){s.time=8;this.log('totem_pattern_started',id);}s.n=Math.min(t.steps,s.n+1);if(s.n===t.steps)this.log('totem_pattern_formed',id);}
 fire(t,target,defense=false){const g=this.game;this.log('totem_activated',t.id,{branch:defense?'defense':'attack'});this.reset(t.id);this.states[t.id].cd=t.cd;
  if(defense){this.guard=.4;this.guarding=5;}
  else if(t.id==='double_top'){target.totemWeak=6;}
  else {const factor={double_bottom:.6,flag:.8,triangle:1,cup:1.5}[t.id];if(target&&!target.dead)g.hitEnemy(target,g.damage()*factor,g.player.facing,false,true);}
  g.emit('notice',{text:`${t.name} · ${defense?'방어 전환':'돌파 확정'}!`,duration:2});g.burst(g.player.x,g.player.y,t.color,14);
 }
 signal(kind,target){const g=this.game;for(const id of this.slots.filter(Boolean)){const s=this.states[id],t=TOTEMS.find(t=>t.id===id);if(s.cd>0)continue;
   if(kind==='hurt'&&['flag','cup'].includes(id)){this.reset(id,'damage_taken');continue;}
   if(id==='double_bottom'){if(kind==='evade'&&s.n<2)this.advance(id);else if(kind==='hit'&&s.n===2)this.fire(t,target);}
   if(id==='double_top'){
    if(kind==='finisher'){if(s.target!==target){this.reset(id,s.n?'target_changed':undefined);s.target=target;}if(s.n<2)this.advance(id);}
    if(kind==='profit'&&s.n===2&&s.target===target)this.fire(t,target);
   }
   if(id==='flag'&&kind==='hit'){if(s.n===3&&s.rest>=.8)this.fire(t,target);else {if(s.n<3)this.advance(id);s.rest=0;}}
   if(id==='triangle'){
    if(s.n===4){if(kind==='profit')this.fire(t,target);else if(kind==='circuit')this.fire(t,null,true);}
    else if(['hit','evade'].includes(kind)&&kind!==s.last){s.last=kind;this.advance(id);}
   }
   if(id==='cup'){if(kind==='hit'){if(s.ready)this.fire(t,target);else if(s.n<6)this.advance(id);}if(kind==='dash'&&s.n===6&&!s.ready){s.ready=true;this.log('totem_handle_formed',id);}}
  }}
 update(dt,input){this.guarding=Math.max(0,this.guarding-dt);if(!this.guarding)this.guard=0;for(const e of this.game.enemies)e.totemWeak=Math.max(0,(e.totemWeak||0)-dt);
  for(const id of this.owned){const s=this.states[id];s.cd=Math.max(0,s.cd-dt);if(!this.slots.includes(id))continue;if(s.n){s.time-=dt;if(s.time<=0){this.reset(id,'timeout');continue;}if(id==='flag'&&s.n===3)s.rest=input.attack?0:s.rest+dt;}}
 }
}
