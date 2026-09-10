export function enableVerticalSlice(GameClass){
 if(GameClass.prototype.__chapterOneVerticalSlice)return;
 const originalAction=GameClass.prototype.action;
 const originalSetRoom=GameClass.prototype.setRoom;
 const originalFinish=GameClass.prototype.finish;

 Object.defineProperty(GameClass.prototype,'__chapterOneVerticalSlice',{value:true,configurable:true});

 GameClass.prototype.finish=function(won){
  const chapterOneWin=Boolean(won&&this.room===4);
  originalFinish.call(this,won);
  if(chapterOneWin){
   this.rank='SMALL CAP';
   this.log?.add?.('vertical_slice_complete',{chapter:1,room:this.room+1,rank:this.rank});
  }
 };

 GameClass.prototype.action=function(name){
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
  return originalAction.call(this,name);
 };

 GameClass.prototype.setRoom=function(index,announce=true){
  if(index>4){
   if(this.room===4&&!['victory','dead'].includes(this.state))this.finish(true);
   return;
  }
  const result=originalSetRoom.call(this,index,announce);
  if(!announce)return result;
  const guidance={
   0:'첫 거래 구역 · X 기본 공격으로 수익을 쌓고, A 익절로 큰 피해를 노리세요.',
   1:'손절 교차로 · 폭탄의 경고 범위와 공매도 유령의 투사체를 보고 회피하세요.',
   2:'공칠의 거래소 · 중앙 교환소에서 ↑. 시드를 회복과 종목 편입에 사용할 수 있습니다.',
   3:'폐쇄 거래소 · 상층 보관함과 선택형 엘리트 도전은 위험하지만 더 큰 보상을 줍니다.',
   4:'작전세력 소굴 · 보스 패턴을 읽고 살아남아 SMALL CAP 승격을 완료하세요.'
  };
  this.emit('notice',{text:guidance[index],duration:index===4?6:5});
  return result;
 };
}
