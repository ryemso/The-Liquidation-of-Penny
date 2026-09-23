export const EFFECTS={
 'buffett-ledger':'장기 보유: 적이 있는 동안 무피격 6초마다 방어 3%, 최대 9%. 피격·방 이동 시 초기화.',
 'musk-imagination':'위험 투자: 레버리지 시작 시 8초간 공격 +20%, 받는 피해 +10%.',
 'jensen-accelerator':'병렬 가속: 기본 공격 5회 적중 시 4초간 공격 간격 25% 단축. 재발동 대기 10초.',
 'fed-principles':'손실 제한: 피격 시 미실현 수익 손실을 25%에서 10%로 줄임.',
 'newton-insight':'반작용: 실제 피격 후 4초간 공격 +25%. 재발동 대기 8초.',
 'turing-algorithm':'패턴 예측: 정확한 대시 회피 후 5초 이내 다음 1회 적중 피해 +40%. 재발동 대기 8초.',
 'einstein-mistake':'시간 오차: 체력 30% 이하로 피격되면 적을 1.5초 정지. 재발동 대기 20초. 사망은 막지 못함.'
};
export class EquipmentEffects{
 constructor(game){this.g=game;this.ids=new Set(Object.values(game.equipment));this.cd={};this.buff={};this.hits=0;this.hold=0;this.stacks=0;}
 has(id){return this.ids.has(id);}
 proc(id){this.g.log.add('equipment_activated',{equipment_id:id});this.g.floatText(this.g.player.x,this.g.player.y-45,({ 'buffett-ledger':'장기 보유','musk-imagination':'위험 투자','jensen-accelerator':'병렬 가속','fed-principles':'손실 제한','newton-insight':'반작용','turing-algorithm':'패턴 예측','einstein-mistake':'시간 오차'})[id],'#d7afff',13);}
 resetRoom(){this.hold=0;this.stacks=0;this.hits=0;this.buff={};}
 update(dt){for(const k in this.cd)this.cd[k]=Math.max(0,this.cd[k]-dt);for(const k in this.buff)this.buff[k]=Math.max(0,this.buff[k]-dt);if(this.has('buffett-ledger')&&this.g.enemies.some(e=>!e.dead&&e.activated)&&this.stacks<3){this.hold+=dt;if(this.hold>=6){this.hold-=6;this.stacks++;this.proc('buffett-ledger');}}}
 trigger(id,duration,cooldown){if(!this.has(id)||this.cd[id]>0)return;this.buff[id]=duration;this.cd[id]=cooldown;this.proc(id);}
 leverage(){this.trigger('musk-imagination',8,0);}
 hit(){if(this.has('jensen-accelerator')&&!(this.cd['jensen-accelerator']>0)&&++this.hits>=5){this.hits=0;this.trigger('jensen-accelerator',4,10);}}
 evade(){this.trigger('turing-algorithm',5,8);}
 hurt(){this.hold=0;this.stacks=0;if(this.g.player.hp<=0)return;this.trigger('newton-insight',4,8);const p=this.g.player;if(p.hp>0&&p.hp<=p.maxHp*.3&&this.has('einstein-mistake')&&!(this.cd['einstein-mistake']>0)){this.cd['einstein-mistake']=20;this.g.freeze=Math.max(this.g.freeze,1.5);this.proc('einstein-mistake');}}
 get armor(){return this.stacks*.03;}
 get incoming(){return this.buff['musk-imagination']>0?1.1:1;}
 get attackInterval(){return this.buff['jensen-accelerator']>0?.75:1;}
 get damage(){return (this.buff['musk-imagination']>0?1.2:1)*(this.buff['newton-insight']>0?1.25:1);}
 consumePrediction(){if(this.buff['turing-algorithm']>0){this.buff['turing-algorithm']=0;return 1.4;}return 1;}
 profitRetention(){if(this.has('fed-principles')){this.proc('fed-principles');return .9;}return .75;}
}
