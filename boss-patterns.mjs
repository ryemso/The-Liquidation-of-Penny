const names={boss:'펌프 앤 덤프',enforcer:'숏 스퀴즈',algorithm:'역추적 주문',central:'긴축 파동',market:'섹터 순환'};
// Every fourth cycle replaces a normal attack. All danger lanes are locked at telegraph time.
export function updateSpecialPattern(g,e){
 if(!e.boss)return false;
 if(e.specialActive){e.vx=0;if(e.timer<=0){e.specialActive=false;e.state='recover';e.timer=1.8;}return true;}
 if(e.state!=='idle'||e.timer>0)return false;
 e.specialCycle=(e.specialCycle||0)+1;if(e.specialCycle%4!==0)return false;
 const center=g.player.x+g.player.w/2,source={id:e.id,type:e.type};
 const lane=(x,w,delay)=>g.hazards.push({source,x:Math.max(20,Math.min(g.width-w-20,x)),y:620,w,delay,life:.4,damage:16,hit:false});
 let hint='';
 if(e.type==='boss'){lane(center-180,75,1.2);lane(center+105,75,1.2);lane(center-38,76,2.2);hint='양옆 폭발 뒤 중앙 폭발 · 첫 폭발이 끝나면 옆으로';}
 if(e.type==='enforcer'){lane(center-245,90,1.2);lane(center+155,90,1.2);lane(center-135,80,2.2);lane(center+55,80,2.2);hint='조여 오는 공매도 · 중앙 틈을 지키거나 높은 발판으로';}
 if(e.type==='algorithm'){for(let i=0;i<3;i++)lane(center-35+(i-1)*140,70,1.2+i*.6);hint='과거 위치를 순서대로 공격 · 예고된 경로 밖으로';}
 if(e.type==='central'){for(let i=0;i<5;i++)lane(center-320+i*140,70,1.2+i*.3);hint='순차 긴축 · 파동이 지나간 뒤 이동';}
 if(e.type==='market'){for(let i=0;i<4;i++)lane(center-270+i*160,75,1.2+(i%2)*1.1);hint='섹터 순환 · 교대로 터지는 구역 사이로 이동';}
 e.specialActive=true;e.state='windup';e.timer=3.2;e.vx=0;
 g.log.add('boss_pattern',{enemy_id:e.id,pattern:`special_${e.type}`,name:names[e.type],phase:e.hp<e.maxHp*.5?2:1});g.emit('notice',{text:`${names[e.type]} · ${hint}`,duration:3.2});return true;
}
