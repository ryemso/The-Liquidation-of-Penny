export const CHAPTER_ONE_BALANCE={
 targetRunSeconds:[480,720],
 targetRooms:{
  0:[45,85],
  1:[70,120],
  2:[20,50],
  3:[85,145],
  4:[90,150]
 },
 shopPrices:{growth:85,dividend:80,value:85}
};

export function enableBalanceSlice(GameClass,cards=[]){
 if(GameClass.prototype.__chapterOneBalanceSlice)return;
 const originalSetRoom=GameClass.prototype.setRoom;
 const originalFinish=GameClass.prototype.finish;
 const originalStart=GameClass.prototype.start;

 Object.defineProperty(GameClass.prototype,'__chapterOneBalanceSlice',{value:true,configurable:true});

 for(const card of cards){
  const price=CHAPTER_ONE_BALANCE.shopPrices[card.id];
  if(price!=null)card.price=price;
 }

 function beginRoom(game){
  if(game.room<0||game.room>4)return;
  game.vsBalanceRoom={
   room:game.room,
   startedAt:game.totalTime,
   hpStart:game.player.hp,
   goldStart:game.player.gold,
   killsStart:game.kills,
   finalized:false
  };
  game.log?.add?.('balance_room_start',{
   chapter:1,room:game.room+1,hp:game.player.hp,gold:game.player.gold
  });
 }

 function targetFor(room){
  return CHAPTER_ONE_BALANCE.targetRooms[room]||[0,Infinity];
 }

 function finalizeRoom(game,reason='exit'){
  const state=game.vsBalanceRoom;
  if(!state||state.finalized||state.room<0||state.room>4)return;
  state.finalized=true;
  const duration=Math.max(0,game.totalTime-state.startedAt);
  const [minTarget,maxTarget]=targetFor(state.room);
  const hpLost=Math.max(0,state.hpStart-game.player.hp);
  const payload={
   chapter:1,room:state.room+1,reason,duration,
   target_min:minTarget,target_max:maxTarget,
   pace:duration<minTarget?'fast':duration>maxTarget?'slow':'target',
   hp_start:state.hpStart,hp_end:game.player.hp,hp_lost:hpLost,
   gold_start:state.goldStart,gold_end:game.player.gold,
   kills:Math.max(0,game.kills-state.killsStart)
  };
  game.log?.add?.('balance_room_summary',payload);
 }

 function tuneCurrentRoom(game){
  if(game.room===0){
   for(const enemy of game.enemies){
    if(enemy.type!=='rubble')continue;
    enemy.hp=Math.min(enemy.hp,46);
    enemy.maxHp=enemy.hp;
    enemy.damage=Math.min(enemy.damage,10);
   }
  }

  if(game.room===1){
   for(const enemy of game.enemies){
    if(enemy.type==='bomb'){
     enemy.hp=Math.min(enemy.hp,40);
     enemy.maxHp=enemy.hp;
     enemy.damage=Math.min(enemy.damage,18);
    }else if(enemy.type==='ghost'){
     enemy.hp=Math.min(enemy.hp,44);
     enemy.maxHp=enemy.hp;
     enemy.damage=Math.min(enemy.damage,9);
    }else if(enemy.type==='rubble')enemy.damage=Math.min(enemy.damage,11);
   }
  }

  if(game.room===3){
   for(const enemy of game.enemies){
    if(enemy.optional)continue;
    if(!enemy.elite){
     enemy.hp=Math.round(enemy.hp*.94);
     enemy.maxHp=enemy.hp;
    }
   }
  }

  if(game.room===4){
   const boss=game.enemies.find(enemy=>enemy.boss);
   if(boss){
    boss.hp=1050;
    boss.maxHp=1050;
    boss.damage=16;
   }
  }
 }

 GameClass.prototype.start=function(){
  const result=originalStart.call(this);
  this.vsBalanceRunStart=this.totalTime;
  if(!this.vsBalanceRoom)beginRoom(this);
  this.log?.add?.('balance_profile_applied',{
   chapter:1,target_run_min:CHAPTER_ONE_BALANCE.targetRunSeconds[0],
   target_run_max:CHAPTER_ONE_BALANCE.targetRunSeconds[1],
   shop_prices:{...CHAPTER_ONE_BALANCE.shopPrices}
  });
  return result;
 };

 GameClass.prototype.setRoom=function(index,announce=true){
  if(this.vsBalanceRoom&&index!==this.room)finalizeRoom(this,'exit');
  const result=originalSetRoom.call(this,index,announce);
  if(index>=0&&index<=4&&this.room===index){
   tuneCurrentRoom(this);
   beginRoom(this);
  }
  return result;
 };

 GameClass.prototype.finish=function(won){
  finalizeRoom(this,won?'victory':'death');
  const result=originalFinish.call(this,won);
  const duration=Math.max(0,this.totalTime-(this.vsBalanceRunStart??0));
  const [minTarget,maxTarget]=CHAPTER_ONE_BALANCE.targetRunSeconds;
  this.log?.add?.('balance_run_summary',{
   chapter:1,won:Boolean(won),duration,
   target_min:minTarget,target_max:maxTarget,
   pace:duration<minTarget?'fast':duration>maxTarget?'slow':'target',
   hp_end:this.player.hp,gold_end:this.player.gold,kills:this.kills,rank:this.rank
  });
  return result;
 };
}
