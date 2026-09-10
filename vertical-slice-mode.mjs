export function enableVerticalSlice(GameClass){
 if(GameClass.prototype.__chapterOneVerticalSlice)return;
 const originalAction=GameClass.prototype.action;
 const originalSetRoom=GameClass.prototype.setRoom;
 const originalFinish=GameClass.prototype.finish;
 const originalStart=GameClass.prototype.start;
 const originalUpdate=GameClass.prototype.update;

 Object.defineProperty(GameClass.prototype,'__chapterOneVerticalSlice',{value:true,configurable:true});

 const tutorialPrompts=[
  '← → 로 이동해 적에게 접근하세요.',
  'C를 눌러 점프하세요. 공중에서 한 번 더 누르면 2단 점프합니다.',
  'X로 기본 공격을 적중시키세요. 연속 공격은 3단 콤보로 이어집니다.',
  'Z 대시로 공격을 회피하세요. 짧은 무적 시간이 있습니다.',
  '미실현 수익이 25 이상이면 A 익절을 사용해 큰 피해를 주세요.'
 ];

 function resetTutorial(game){
  game.vsTutorial={step:0,startX:game.player.x,complete:false};
 }

 function tutorialNotice(game){
  if(game.room!==0||!game.vsTutorial||game.vsTutorial.complete)return;
  const text=tutorialPrompts[game.vsTutorial.step];
  if(text)game.emit('notice',{text:`기초 거래 ${game.vsTutorial.step+1}/5 · ${text}`,duration:5});
 }

 function advanceTutorial(game,expectedStep,action){
  const tutorial=game.vsTutorial;
  if(game.room!==0||!tutorial||tutorial.complete||tutorial.step!==expectedStep)return false;
  game.log?.add?.('tutorial_step_complete',{chapter:1,room:1,step:expectedStep+1,action});
  tutorial.step++;
  if(tutorial.step>=tutorialPrompts.length){
   tutorial.complete=true;
   game.log?.add?.('tutorial_complete',{chapter:1,room:1});
   game.emit('notice',{text:'기초 거래 완료 · 이제 보상과 시장 흐름을 이용해 자유롭게 싸우세요.',duration:5});
  }else tutorialNotice(game);
  return true;
 }

 GameClass.prototype.start=function(){
  const result=originalStart.call(this);
  if(this.room===0){
   if(!this.vsTutorial)resetTutorial(this);
   tutorialNotice(this);
  }
  return result;
 };

 GameClass.prototype.finish=function(won){
  const chapterOneWin=Boolean(won&&this.room===4);
  originalFinish.call(this,won);
  if(chapterOneWin){
   this.rank='SMALL CAP';
   this.log?.add?.('vertical_slice_complete',{chapter:1,room:this.room+1,rank:this.rank});
  }
 };

 GameClass.prototype.action=function(name){
  const tutorial=this.vsTutorial;
  const room=this.room;
  const canProfit=Boolean(room===0&&tutorial?.step===4&&this.player.profit>=25&&this.player.profitCD<=0);

  if(name==='interact'&&this.state==='playing'&&this.room===4){
   const p=this.player;
   if(p.x>this.width-180){
    if(!this.doorOpen){
     this.emit('notice',{text:'잠식된 선동가를 처치하면 상장 심사 출구가 열립니다.',duration:2});
     return;
    }
    this.finish(true);
    return;
   }
  }

  const result=originalAction.call(this,name);
  if(room===0&&this.state==='playing'&&tutorial&&!tutorial.complete){
   if(name==='jump')advanceTutorial(this,1,'jump');
   else if(name==='attack')advanceTutorial(this,2,'attack');
   else if(name==='dash')advanceTutorial(this,3,'dash');
   else if(name==='profit'&&canProfit)advanceTutorial(this,4,'profit');
  }
  return result;
 };

 GameClass.prototype.update=function(dt,input={}){
  const result=originalUpdate.call(this,dt,input);
  const tutorial=this.vsTutorial;
  if(this.room===0&&this.state==='playing'&&tutorial&&!tutorial.complete&&tutorial.step===0){
   if(Math.abs(this.player.x-tutorial.startX)>=90)advanceTutorial(this,0,'move');
  }
  return result;
 };

 GameClass.prototype.setRoom=function(index,announce=true){
  if(index>4){
   if(this.room===4&&!['victory','dead'].includes(this.state))this.finish(true);
   return;
  }
  const result=originalSetRoom.call(this,index,announce);
  if(index===0)resetTutorial(this);
  if(!announce)return result;
  const guidance={
   0:'첫 거래 구역 · 기본 조작을 순서대로 익힌 뒤 적을 정리하세요.',
   1:'손절 교차로 · 폭탄의 경고 범위와 공매도 유령의 투사체를 보고 회피하세요.',
   2:'공칠의 거래소 · 중앙 교환소에서 ↑. 시드를 회복과 종목 편입에 사용할 수 있습니다.',
   3:'폐쇄 거래소 · 상층 보관함과 선택형 엘리트 도전은 위험하지만 더 큰 보상을 줍니다.',
   4:'작전세력 소굴 · 보스 패턴을 읽고 살아남아 SMALL CAP 승격을 완료하세요.'
  };
  this.emit('notice',{text:guidance[index],duration:index===4?6:5});
  if(index===0)tutorialNotice(this);
  return result;
 };
}
