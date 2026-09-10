// Pattern concepts: user-provided Yonsei_dent guide, pp. 4–11.
// All combat rules and values are original game design, not market probabilities.
export const GROUPS={reversal:'추세 전환형',continuation:'추세 지속형',neutral:'중립형',special:'특수형'};
export const TOTEMS=[
 {id:'double_bottom',window:12,name:'이중 바닥',group:'reversal',color:'#84d8b1',steps:2,cd:12,points:'0,10 20,55 40,25 60,55 80,25 100,5',desc:'12초 안에 대시로 실제 공격을 2번 회피 → 다음 적중으로 돌파. 공격력 60%의 추가 피해.',hint:'실제 공격 회피 2회 → 적중'},
 {id:'double_top',window:12,name:'이중 천장',group:'reversal',color:'#ef969e',steps:2,cd:14,points:'0,55 20,10 40,40 60,10 80,40 100,60',desc:'12초 안에 같은 적에게 3단 콤보 마무리 2회 → 그 적에게 익절 적중. 6초간 받는 피해 +25%.',hint:'같은 적 콤보 마무리 2회 → A 적중'},
 {id:'flag',name:'깃발형',group:'continuation',color:'#f2c779',steps:3,cd:10,points:'0,60 30,5 45,25 55,12 65,32 75,20 85,38 100,0',desc:'8초 안에 일반 공격 3회 적중 → X를 놓고 0.8초 쉬기 → 재적중. 공격력 80% 추가 피해. 피격 시 초기화.',hint:'3회 적중 → 0.8초 공격 중단 → 적중'},
 {id:'triangle',window:12,name:'삼각수렴',group:'neutral',color:'#8cc9ed',steps:4,cd:14,points:'0,0 20,60 40,12 60,48 80,24 90,36 100,5',desc:'12초 안에 적중·실제 회피를 교대로 4회. A 적중: 공격력 100% 추가 피해 / D: 5초간 피해 40% 감소.',hint:'적중·실제 회피 교대 4회 → A / D'},
 {id:'cup',window:10,name:'컵앤핸들',group:'special',color:'#bda9f1',steps:6,cd:16,points:'0,5 15,30 30,48 45,55 60,48 75,5 85,23 90,20 100,0',desc:'10초 안에 일반 공격 6회 적중 → 대시로 손잡이 형성 → 재적중. 공격력 150% 추가 피해. 피격 시 초기화.',hint:'6회 적중 → Z → 적중'}
];
TOTEMS.push(...[{"id": "triple_bottom", "name": "삼중 바닥", "group": "reversal", "sequence": ["evade", "evade", "evade", "hit"], "window": 16, "steps": 3, "cd": 16, "effect": "burst", "value": 1.2, "hint": "회피 3회 → 적중", "desc": "16초 안에 회피 3회 → 적중. 공격력 120% 관통 추가 피해.", "points": "0,5 15,55 30,25 45,55 60,25 75,55 90,25 100,0", "color": "#84d8b1"}, {"id": "triple_top", "name": "삼중 천장", "group": "reversal", "sequence": ["finisher", "finisher", "finisher", "profit"], "window": 18, "steps": 3, "cd": 18, "effect": "weak", "value": 8, "hint": "같은 적 콤보 마무리 3회 → A", "desc": "18초 안에 같은 적 콤보 마무리 3회 → A. 8초간 대상이 받는 피해 +25%.", "points": "0,60 15,5 30,40 45,5 60,40 75,5 90,40 100,60", "color": "#84d8b1"}, {"id": "round_bottom", "name": "둥근 바닥", "group": "reversal", "sequence": ["hit", "hit", "hit", "hit", "hit", "hit", "hit", "hit", "profit"], "window": 16, "steps": 8, "cd": 16, "effect": "heal", "value": 15, "hint": "8회 적중 → A: 체력 15 회복", "desc": "16초 안에 8회 적중 → A: 체력 15 회복. 체력 15 회복.", "points": "0,5 15,25 30,45 50,55 70,45 85,25 100,0", "color": "#84d8b1"}, {"id": "round_top", "name": "둥근 천장", "group": "reversal", "sequence": ["hit", "hit", "hit", "hit", "hit", "hit", "hit", "hit", "profit"], "window": 16, "steps": 8, "cd": 16, "effect": "weaken", "value": 8, "hint": "같은 적 8회 적중 → A: 적 공격 약화", "desc": "16초 안에 같은 적 8회 적중 → A: 적 공격 약화. 8초간 대상의 직접 공격 피해 -25%.", "points": "0,55 15,35 30,15 50,5 70,15 85,35 100,60", "color": "#84d8b1"}, {"id": "head_shoulders", "name": "머리어깨형", "group": "reversal", "sequence": ["hit", "profit", "hit", "finisher"], "window": 15, "steps": 3, "cd": 16, "effect": "weak", "value": 7, "hint": "X 적중 → A → X → 콤보 마무리", "desc": "15초 안에 X 적중 → A → X → 콤보 마무리. 7초간 대상이 받는 피해 +25%.", "points": "0,55 20,25 35,45 50,0 65,45 80,25 100,60", "color": "#84d8b1"}, {"id": "inverse_head", "name": "역머리어깨형", "group": "reversal", "sequence": ["evade", "circuit", "evade", "hit"], "window": 18, "steps": 3, "cd": 18, "effect": "burst", "value": 1.5, "hint": "회피 → D → 회피 → 적중", "desc": "18초 안에 회피 → D → 회피 → 적중. 공격력 150% 관통 추가 피해.", "points": "0,5 20,35 35,15 50,60 65,15 80,35 100,0", "color": "#84d8b1"}, {"id": "quasimodo", "name": "콰시모도", "group": "reversal", "sequence": ["evade", "profit", "evade", "hit"], "window": 16, "steps": 3, "cd": 14, "effect": "burst", "value": 1.3, "hint": "회피 → A → 회피 → 반격", "desc": "16초 안에 회피 → A → 회피 → 반격. 공격력 130% 관통 추가 피해.", "points": "0,5 20,35 35,15 50,60 70,0 85,35 100,5", "color": "#84d8b1"}, {"id": "rising_wedge", "name": "상승 쐐기", "group": "continuation", "sequence": ["finisher", "finisher", "finisher", "profit"], "window": 16, "steps": 3, "cd": 14, "effect": "weaken", "value": 7, "hint": "콤보 마무리 3회 → A: 적 공격 약화", "desc": "16초 안에 콤보 마무리 3회 → A: 적 공격 약화. 7초간 대상의 직접 공격 피해 -25%.", "points": "0,60 20,10 40,45 60,5 80,25 90,0 100,60", "color": "#f2c779"}, {"id": "falling_wedge", "name": "하락 쐐기", "group": "continuation", "sequence": ["evade", "hit", "evade", "hit", "profit"], "window": 16, "steps": 4, "cd": 14, "effect": "burst", "value": 1.4, "hint": "회피·적중 2쌍 → A: 관통 추가 피해", "desc": "16초 안에 회피·적중 2쌍 → A: 관통 추가 피해. 공격력 140% 관통 추가 피해.", "points": "0,0 20,50 40,15 60,55 80,35 90,60 100,0", "color": "#f2c779"}, {"id": "broadening", "name": "대칭 확산형", "group": "neutral", "sequence": ["hit", "evade", "hit", "evade"], "window": 14, "steps": 4, "cd": 16, "effect": "branch", "value": 1.8, "hint": "적중·회피 2쌍 → A 공격 / D 방어", "desc": "14초 안에 적중·회피 2쌍 → A 공격 / D 방어. A: 공격력 180% 추가 피해 / D: 5초간 피해 40% 감소.", "points": "0,30 20,20 40,40 60,10 80,55 100,0", "color": "#8cc9ed"}, {"id": "wolfe", "name": "울프웨이브", "group": "special", "sequence": ["hit", "evade", "hit", "evade", "dash", "profit"], "window": 20, "steps": 5, "cd": 20, "effect": "wave", "value": 1.6, "hint": "X → 회피 → X → 회피 → Z → A", "desc": "20초 안에 X → 회피 → X → 회피 → Z → A. 전방 360 범위에 공격력 160% 관통 파동.", "points": "0,15 20,50 40,5 60,40 80,60 100,0", "color": "#bda9f1"}]);
export const CATALOG={reversal:['이중 바닥','이중 천장','삼중 바닥','삼중 천장','둥근 바닥','둥근 천장','머리어깨형','역머리어깨형','콰시모도'],continuation:['깃발형','상승 쐐기','하락 쐐기'],neutral:['삼각수렴','대칭 확산형'],special:['컵앤핸들','울프웨이브']};
export class TotemSystem{
 constructor(game){this.game=game;this.owned=[];this.slots=[null,null,null];this.states={};this.logs=[];this.serial=0;this.guard=0;this.guarding=0;}
 log(event,id,extra={}){this.game.log?.add(event,{totem_id:id,...extra});this.logs.push({sequence:++this.serial,event,totem_id:id,room:this.game.room+1,time:this.game.totalTime,...extra});if(this.logs.length>5000)this.logs.shift();}
 acquire(id){if(!TOTEMS.some(t=>t.id===id)||this.owned.includes(id))return false;this.owned.push(id);this.states[id]={n:0,cd:0,time:0,last:'',target:null,ready:false,rest:0};this.log('totem_acquired',id);return true;}
 equip(id,slot){if(this.game.state!=='totems'||!this.owned.includes(id)||!Number.isInteger(slot)||slot<0||slot>2||this.slots.includes(id))return false;const old=this.slots[slot];if(old){this.reset(old,'unequipped');this.log('totem_unequipped',old,{slot});}this.slots[slot]=id;this.reset(id);this.log('totem_equipped',id,{slot});return true;}
 unequip(slot){if(this.game.state!=='totems')return;const id=this.slots[slot];if(!id)return;this.reset(id,'unequipped');this.log('totem_unequipped',id,{slot});this.slots[slot]=null;}
 reset(id,reason){const s=this.states[id];if(!s)return;if(s.n&&reason)this.log('totem_pattern_failed',id,{reason});Object.assign(s,{n:0,time:0,last:'',target:null,ready:false,rest:0});}
 roomChanged(){for(const id of this.owned)this.reset(id,'room_changed');this.guard=0;this.guarding=0;}
 advance(id){const s=this.states[id],t=TOTEMS.find(t=>t.id===id);if(!s.n){s.time=t.window||8;this.log('totem_pattern_started',id);}s.n=Math.min(t.steps,s.n+1);if(s.n===t.steps)this.log('totem_pattern_formed',id);}
 fire(t,target,defense=false){const g=this.game;if(!defense&&(!target||target.dead))return;this.log('totem_activated',t.id,{branch:defense?'defense':'attack'});this.reset(t.id);this.states[t.id].cd=t.cd;
  if(defense){this.guard=.4;this.guarding=5;}
  else if(t.effect==='weak')target.totemWeak=t.value;
  else if(t.effect==='weaken')target.attackWeak=t.value;
  else if(t.effect==='heal')g.heal(t.value);
  else if(t.effect==='wave'){for(const e of g.enemies)if(!e.dead&&(e.x-g.player.x)*g.player.facing>=0&&Math.abs(e.x-g.player.x)<360&&Math.abs(e.y-g.player.y)<180)g.hitEnemy(e,g.damage()*t.value,g.player.facing,false,true);g.effects.push({type:'profit',x:g.player.x,y:g.player.y+28,facing:g.player.facing,life:.5,max:.5});}
  else if(t.effect)g.hitEnemy(target,g.damage()*t.value,g.player.facing,false,true);
  else if(t.id==='double_top'){target.totemWeak=6;}
  else {const factor={double_bottom:.6,flag:.8,triangle:1,cup:1.5}[t.id];if(target&&!target.dead)g.hitEnemy(target,g.damage()*factor,g.player.facing,false,true);}
  g.emit('notice',{text:`${t.name} · ${defense?'방어 전환':'돌파 확정'}!`,duration:2});g.burst(g.player.x,g.player.y,t.color,14);
 }
 signal(kind,target){const g=this.game;for(const id of this.slots.filter(Boolean)){const s=this.states[id],t=TOTEMS.find(t=>t.id===id);if(s.cd>0)continue;
   if(t.sequence){
    if(kind==='hurt'){this.reset(id,'damage_taken');continue;}
    if(['triple_top','round_top'].includes(id)&&['hit','finisher','profit'].includes(kind)){
     if(s.target&&s.target!==target)this.reset(id,'target_changed');s.target=target;
    }
    if(s.n===t.steps){
     if(t.effect==='branch'){if(kind==='profit')this.fire(t,target);if(kind==='circuit')this.fire(t,null,true);}
     else if(kind===t.sequence.at(-1))this.fire(t,target);
    }else if(kind===t.sequence[s.n])this.advance(id);
    continue;
   }
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
 update(dt,input){this.guarding=Math.max(0,this.guarding-dt);if(!this.guarding)this.guard=0;for(const e of this.game.enemies){e.totemWeak=Math.max(0,(e.totemWeak||0)-dt);e.attackWeak=Math.max(0,(e.attackWeak||0)-dt);}
  for(const id of this.owned){const s=this.states[id];s.cd=Math.max(0,s.cd-dt);if(!this.slots.includes(id))continue;if(s.n){s.time-=dt;if(s.time<=0){this.reset(id,'timeout');continue;}if(id==='flag'&&s.n===3)s.rest=input.attack?0:s.rest+dt;}}
 }
}
