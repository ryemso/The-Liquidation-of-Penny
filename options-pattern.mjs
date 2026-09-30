// Game-only directional option contract. Base stats never change, so restoration
// remains exact even when equipment or rewards change during the temporary loss.
export const OPTION_RULES={choose:3,settle:1,loss:8,multiplier:.7,stagger:2.5,cooldown:16,maxFailures:3,rewardPerSuccess:.2};
export function clearOptions(g){g.optionContract=null;g.optionLoss=null;g.optionResult=null;}
export function optionDamage(g){return g.optionLoss?.remaining>0?OPTION_RULES.multiplier:1;}
export function chooseOption(g,side){
 const c=g.optionContract;
 if(g.state!=='playing'||!c||c.phase!=='choose'||!['long','short'].includes(side))return false;
 if(c.choice===side)return true;c.choice=side;
 g.log.add('option_selected',{enemy_id:c.owner,choice:side});return true;
}
function begin(g,e){
 const side=g.random()<.5?'long':'short';
 const hint=e.type==='market'?(side==='long'?'매수 주문 누적 · 저점이 높아진다 ↗':'매도 주문 누적 · 고점이 낮아진다 ↘'):(side==='long'?'유동성 공급 명령 · 매수세 유입 ↗':'유동성 회수 명령 · 매도세 유입 ↘');
 g.optionContract={owner:e.id,phase:'choose',remaining:OPTION_RULES.choose,choice:null,outcome:side,hint};
 e.vx=0;e.state='recover';e.timer=0;
 g.log.add('boss_pattern',{enemy_id:e.id,pattern:'옵션 만기',outcome:side});
 g.emit('notice',{text:'옵션 만기 · 단서를 보고 Q 롱 / E 숏 선택 · 선택 마감 전 변경 가능',duration:3});
}
export function updateOptions(g,dt){
 if(g.optionResult){g.optionResult.remaining-=dt;if(g.optionResult.remaining<=0)g.optionResult=null;}
 if(g.optionLoss){g.optionLoss.remaining-=dt;if(g.optionLoss.remaining<=0||!g.enemies.some(e=>e.id===g.optionLoss.owner&&!e.dead))g.optionLoss=null;}
 const c=g.optionContract;
 if(c){
  const e=g.enemies.find(e=>e.id===c.owner&&!e.dead);
  if(!e){clearOptions(g);return;}
  if(g.freeze>0)return;
  c.remaining-=dt;if(c.remaining>1e-8)return;
  if(c.phase==='choose'){c.phase='locked';c.remaining=OPTION_RULES.settle;return;}
  const success=c.choice===c.outcome;
  e.optionSuccesses=(e.optionSuccesses||0)+(success?1:0);
  e.optionFailures=(e.optionFailures||0)+(success?0:1);
  const liquidated=e.optionFailures>=OPTION_RULES.maxFailures;
  const bonus=Math.round(e.optionSuccesses*OPTION_RULES.rewardPerSuccess*100);
  const text=`만기 ${c.outcome==='long'?'상승 ↑':'하락 ↓'} · ${success?`예측 성공! 클리어 피자스코어 +${bonus}% · 반격 기회`:c.choice?'예측 실패 · 공격력 −30% / 8초':'미선택 · 공격력 −30% / 8초'}`;
  if(liquidated){g.log.add('option_resolved',{enemy_id:e.id,choice:c.choice,outcome:c.outcome,success:false,failures:e.optionFailures,liquidated:true});g.log.add('option_liquidated',{enemy_id:e.id,failures:e.optionFailures});g.player.hp=0;g.deathReason='option_liquidation';g.finish(false);g.emit('notice',{text:'옵션 3회 실패 · 강제 청산',duration:7});return;}
  g.optionResult={text,remaining:3,success};
  if(success){e.stagger=OPTION_RULES.stagger;g.burst(e.x+e.w/2,e.y,'#84dfbb',18);}
  else g.optionLoss={owner:e.id,remaining:OPTION_RULES.loss};
  e.state='recover';e.timer=success?.3:1;e.optionClock=OPTION_RULES.cooldown;
  g.log.add('option_resolved',{enemy_id:e.id,choice:c.choice,outcome:c.outcome,success,failures:e.optionFailures,successes:e.optionSuccesses,reward_bonus_percent:bonus,loss_duration:success?0:OPTION_RULES.loss});
  g.optionContract=null;return;
 }
 if(g.freeze>0||g.spec.kind!=='boss'||g.spec.chapter<5)return;
 for(const e of g.enemies){
  if(e.dead||!['market','executor'].includes(e.type)||(e.type==='executor'&&!e.transformed))continue;
  e.optionClock=(e.optionClock??(e.type==='market'?7:10))-dt;
  if(e.optionClock>0||e.stagger>0||e.state!=='idle'||e.skillActive||g.enemies.some(m=>m.sniper&&!m.dead))continue;
  begin(g,e);break;
 }
}

export function optionRewardMultiplier(g){const boss=g.enemies.find(e=>e.boss&&['market','executor'].includes(e.type));return boss?.dead?1+(boss.optionSuccesses||0)*OPTION_RULES.rewardPerSuccess:1;}
