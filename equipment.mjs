export const SLOTS=[['weapon','무기'],['armor','방어구'],['accessory','장신구'],['special1','특수 장비 1'],['special2','특수 장비 2']];
export const EQUIPMENT=[
 ['opening-dagger','개장 단검','common','weapon',{atk:2}],
 ['apprentice-broker-vest','수습 중개인의 조끼','common','armor',{maxHp:10}],
 ['worn-quote-watch','낡은 호가 시계','common','accessory',{crit:.02}],
 ['breakout-longsword','돌파의 장검','rare','weapon',{atk:4}],
 ['downside-defense-coat','하방 방어 코트','rare','armor',{maxHp:12,armor:.03}],
 ['dividend-notebook','배당 수첩','rare','accessory',{dividend:2}],
 ['short-squeeze-cleaver','숏 스퀴즈 절단검','unique','weapon',{atk:6,speed:-10}],
 ['margin-call-armor','마진콜 방호복','unique','armor',{maxHp:16,armor:.05}],
 ['compound-pocket-watch','복리의 회중시계','unique','accessory',{profitGain:2}],
 ['buffett-ledger','워렌 버핏의 장부','mythic','special',{armor:.04}],
 ['musk-imagination','일론 머스크의 상상','mythic','special',{atk:5,maxHp:-8}],
 ['jensen-accelerator','젠슨 황의 가속기','mythic','special',{speed:15}],
 ['fed-principles','연준의장의 원칙','mythic','special',{maxHp:12}],
 ['newton-insight','뉴턴의 깨달음','relic','special',{atk:4,maxHp:-6}],
 ['turing-algorithm','앨런 튜링의 알고리즘','relic','special',{crit:.05}],
 ['einstein-mistake','아인슈타인의 실수','relic','special',{circuitExtra:.5}]
].map(([id,name,rarity,slot,bonus])=>({id,name,rarity,slot,bonus,src:`./assets/equipment/${id}.png`}));
export const RARITIES={common:'일반',rare:'희귀',unique:'고유',mythic:'신화',relic:'유물'};
export function validFor(item,slot){return item&&item.slot===(slot.startsWith('special')?'special':slot);}
export function normalizeLoadout(value){const out={},seen=new Set();for(const [slot] of SLOTS){const item=EQUIPMENT.find(e=>e.id===value?.[slot]);out[slot]=validFor(item,slot)&&!seen.has(item.id)?item.id:null;if(out[slot])seen.add(item.id);}return out;}
export function bonuses(value){const sum={};for(const id of Object.values(normalizeLoadout(value))){const item=EQUIPMENT.find(e=>e.id===id);for(const [key,n] of Object.entries(item?.bonus||{}))sum[key]=(sum[key]||0)+n;}return sum;}
export function bonusText(b){const labels={atk:'공격력',maxHp:'최대 체력',speed:'이동 속도',crit:'치명타 확률',armor:'피해 감소',dividend:'방 완료 회복',profitGain:'적중 수익',circuitExtra:'서킷 지속시간'};return Object.entries(b).map(([k,v])=>`${labels[k]} ${v>=0?'+':''}${['crit','armor'].includes(k)?Math.round(v*100)+'%':v}${k==='circuitExtra'?'초':''}`).join(' · ')||'추가 보너스 없음';}
export function applyStartingEquipment(game,value){game.equipment=normalizeLoadout(value);for(const [key,n] of Object.entries(bonuses(game.equipment))){if(key==='maxHp'){game.player.maxHp+=n;game.player.hp+=n;}else game.stats[key]+=n;}}
export function readLoadout(storage){try{return normalizeLoadout(JSON.parse(storage.getItem('penny-equipment-v1')||'null'));}catch{return normalizeLoadout(null);}}
export function saveLoadout(storage,value){try{storage.setItem('penny-equipment-v1',JSON.stringify(normalizeLoadout(value)));return true;}catch{return false;}}
