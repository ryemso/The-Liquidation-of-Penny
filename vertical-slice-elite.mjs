export function enableEliteSlice(GameClass){
 if(GameClass.prototype.__chapterOneEliteSlice)return;
 const originalSetRoom=GameClass.prototype.setRoom;
 const originalChooseTrial=GameClass.prototype.chooseTrial;
 const originalUpdate=GameClass.prototype.update;

 Object.defineProperty(GameClass.prototype,'__chapterOneEliteSlice',{value:true,configurable:true});

 function resetEliteState(game){
  game.vsElite={prompted:false,decision:null,startHp:null,bonusGiven:false,performance:null};
 }

 GameClass.prototype.setRoom=function(index,announce=true){
  const result=originalSetRoom.call(this,index,announce);
  if(index===3)resetEliteState(this);
  return result;
 };

 GameClass.prototype.chooseTrial=function(accept){
  if(this.room!==3)return originalChooseTrial.call(this,accept);
  if(!this.vsElite)resetEliteState(this);
  this.vsElite.decision=accept?'accept':'decline';
  if(accept)this.vsElite.startHp=this.player.hp;
  this.log?.add?.('elite_route_decision',{chapter:1,room:4,decision:this.vsElite.decision,hp:this.player.hp,gold:this.player.gold});
  if(!accept)this.emit('notice',{text:'안전 경로 선택 · 추가 보상 없이 원래 전투 흐름을 유지합니다.',duration:3});
  return originalChooseTrial.call(this,accept);
 };

 GameClass.prototype.update=function(dt,input={}){
  const wasComplete=Boolean(this.room===3&&this.relic?.trialComplete);
  const result=originalUpdate.call(this,dt,input);

  if(this.room!==3||!this.vsElite)return result;
  const state=this.vsElite;

  if(!state.prompted&&this.relic&&!this.relic.taken&&Math.abs(this.player.x-this.relic.x)<360){
   state.prompted=true;
   this.emit('notice',{text:'상층 보관함 감지 · 강화 드론 도전은 선택 사항입니다. 위험을 감수하면 추가 시드와 선택지를 얻습니다.',duration:5});
  }

  if(!wasComplete&&this.relic?.trialComplete&&!state.bonusGiven&&state.decision==='accept'){
   state.bonusGiven=true;
   const startHp=state.startHp??this.player.hp;
   const lost=Math.max(0,startHp-this.player.hp);
   const bonus=lost<=0?20:lost<=20?10:0;
   state.performance={damageTaken:lost,bonus};
   if(bonus>0)this.player.gold+=bonus;
   this.log?.add?.('elite_trial_performance',{chapter:1,room:4,damage_taken:lost,performance_bonus:bonus,gold_after:this.player.gold});
   this.emit('notice',{text:bonus>0?`엘리트 투자 성과 · 피해 ${Math.round(lost)} · 성과 시드 +${bonus}`:`엘리트 도전 완료 · 기본 보상 확보. 다음에는 피해를 줄이면 성과 시드를 추가로 얻습니다.`,duration:4});
  }
  return result;
 };
}
