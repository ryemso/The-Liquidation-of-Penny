export function enableBossSlice(GameClass){
 if(GameClass.prototype.__chapterOneBossSlice)return;
 const originalSetRoom=GameClass.prototype.setRoom;
 const originalUpdate=GameClass.prototype.update;

 Object.defineProperty(GameClass.prototype,'__chapterOneBossSlice',{value:true,configurable:true});

 function resetBossState(game){
  game.vsBoss={
   phase2:false,desperation:false,cleared:false,
   startHp:game.player.hp,startTime:game.totalTime,lowestHp:game.player.hp
  };
 }

 GameClass.prototype.setRoom=function(index,announce=true){
  const result=originalSetRoom.call(this,index,announce);
  if(index===4){
   resetBossState(this);
   if(announce){
    this.emit('notice',{text:'상장 심사 개시 · 잠식된 선동가의 세 패턴을 읽고 생존하세요.',duration:5});
    this.log?.add?.('boss_encounter_start',{chapter:1,room:5,boss:'잠식된 선동가',hp:this.player.hp});
   }
  }
  return result;
 };

 GameClass.prototype.update=function(dt,input={}){
  const bossBefore=this.room===4?this.enemies.find(e=>e.boss&&!e.dead):null;
  const result=originalUpdate.call(this,dt,input);
  if(this.room!==4||!this.vsBoss)return result;

  const state=this.vsBoss;
  state.lowestHp=Math.min(state.lowestHp,this.player.hp);
  const boss=this.enemies.find(e=>e.boss&&!e.dead);

  if(boss&&!state.phase2&&boss.hp<=boss.maxHp*.5){
   state.phase2=true;
   this.projectiles=[];
   this.hazards=[];
   this.freeze=Math.max(this.freeze,.55);
   this.log?.add?.('boss_phase_change',{chapter:1,room:5,phase:2,boss_hp:boss.hp,player_hp:this.player.hp});
   this.emit('notice',{text:'PHASE 02 · 선동이 무너집니다. 공격 간격이 짧아집니다.',duration:4});
   this.emit('sound',{name:'roar'});
  }

  if(boss&&!state.desperation&&boss.hp<=boss.maxHp*.2){
   state.desperation=true;
   const center=this.player.x+this.player.w/2;
   const safeX=Math.max(150,Math.min(this.width-150,center+(center<this.width/2?190:-190)));
   for(let x=55;x<this.width-55;x+=100){
    if(Math.abs((x+38)-safeX)>125)this.hazards.push({x,y:620,w:76,delay:1.45,life:.38,damage:18,hit:false});
   }
   this.log?.add?.('boss_desperation_pattern',{chapter:1,room:5,safe_x:Math.round(safeX),boss_hp:boss.hp});
   this.emit('notice',{text:'최후의 선동 · 호가창 붕괴! 표시가 없는 틈 또는 높은 발판으로 이동하세요.',duration:3.5});
  }

  if(bossBefore&&!boss&&!state.cleared){
   state.cleared=true;
   const hpLost=Math.max(0,state.startHp-this.player.hp);
   const duration=Math.max(0,this.totalTime-state.startTime);
   this.log?.add?.('boss_clear_performance',{
    chapter:1,room:5,boss:'잠식된 선동가',duration,
    hp_start:state.startHp,hp_end:this.player.hp,hp_lost:hpLost,lowest_hp:state.lowestHp
   });
   this.emit('notice',{text:`상장 심사 통과 · 보스전 ${duration.toFixed(1)}초 · 남은 체력 ${Math.ceil(this.player.hp)}`,duration:5});
  }
  return result;
 };
}
