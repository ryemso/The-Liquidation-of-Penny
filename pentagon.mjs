// Fictional financial-military epilogue. Room order is explicit, not five-room arithmetic.
export const PENTAGON_ROOMS=[
 {name:'펜타곤 외부',kind:'combat',subtitle:'01 · 국가 계약의 문',background:'pentagon-exterior',width:2900,platforms:[[350,515,200],[800,410,200],[1370,410,200],[2000,410,200],[2470,515,200]],enemies:[]},
 {name:'펜타곤 1층',kind:'combat',subtitle:'02 · 조달과 예산',background:'pentagon-lobby',width:2750,restHeal:20,platforms:[[330,515,200],[780,410,200],[1270,410,200],[1770,410,200],[2310,515,200]],enemies:[]},
 {name:'펜타곤 중앙회의실 가는 길',kind:'elite',subtitle:'03 · 봉쇄된 의사결정',background:'pentagon-corridor',width:3100,platforms:[[360,515,200],[940,410,200],[1560,410,200],[2190,410,200],[2690,515,200]],enemies:[]},
 {name:'펜타곤 중앙회의실',kind:'boss',bossName:'국가계약 집행관',subtitle:'04 · 최종 결재',background:'pentagon-chamber',width:2200,platforms:[[330,515,200],[850,420,200],[1330,420,200],[1750,515,200]],enemies:[['enforcer',1600,620]]}
].map((room,i)=>({...room,chapter:6,chapterName:'펜타곤 · 국가계약',localRoom:i+1}));
