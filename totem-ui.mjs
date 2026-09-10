import {TOTEMS,GROUPS,CATALOG} from './totems.mjs';
export function chart(t,progress=1){const pts=t.points.split(' '),n=Math.max(1,Math.ceil(pts.length*progress));return `<svg viewBox="-4 -5 110 75" role="img" aria-label="${t.name} 차트"><path d="M0 30H100" stroke="#8e9bab" stroke-dasharray="3 3"/><polyline points="${t.points}" fill="none" stroke="#526078" stroke-width="2"/><polyline points="${pts.slice(0,n).join(' ')}" fill="none" stroke="${t.color}" stroke-width="3"/></svg>`;}
export function inventory(game,showModal,close,acquired){let selected=null;const draw=()=>{
 const sys=game.totems;
 showModal(`<span class="eyebrow">CHART TOTEMS · 이번 도전의 수집품</span><h2 id="modal-title">${acquired?TOTEMS.find(t=>t.id===acquired).name+' 발견':'차트 토템'}</h2><p>장착한 3종만 발동합니다. 교체하면 형성 과정은 초기화되고, 재사용 대기시간은 유지됩니다.</p><div class="totem-slots">${sys.slots.map((id,i)=>`<div><strong>슬롯 ${i+1} · ${TOTEMS.find(t=>t.id===id)?.name||'비어 있음'}</strong><button data-slot="${i}" ${!selected?'disabled':''}>${selected?'여기에 장착':'아래에서 토템 선택'}</button>${selected?`<p class="swap-detail">현재: ${TOTEMS.find(t=>t.id===id)?.desc||'효과 없음'}<br><br>교체 후: ${TOTEMS.find(t=>t.id===selected).desc}</p>`:''}${id?`<button data-remove="${i}">해제</button>`:''}</div>`).join('')}</div><div class="totem-collection">${TOTEMS.map(t=>{const owned=sys.owned.includes(t.id),equipped=sys.slots.includes(t.id);return `<button class="totem-card ${selected===t.id?'selected':''}" data-totem="${t.id}" ${!owned||equipped?'disabled':''}><span>${GROUPS[t.group]} · ${equipped?'장착 중':owned?'보유':'미발견'}</span>${chart(t)}<h3>${t.name}</h3><p>${t.desc}</p><small>형성 ${t.window||8}초 · 재사용 ${t.cd}초 · ${t.hint}</small></button>`;}).join('')}</div><details><summary>전체 토템 분류 · 16종 구현</summary>${Object.entries(CATALOG).map(([g,names])=>`<p><b>${GROUPS[g]}</b> — ${names.join(' · ')}</p>`).join('')}</details><div class="modal-actions"><button id="totem-log">전체 플레이 로그 다운로드</button><button class="primary" id="totem-close">전투 계속하기 · I / Esc</button></div>`,'totems');
 document.querySelectorAll('[data-totem]').forEach(b=>b.onclick=()=>{selected=b.dataset.totem;draw();});
 document.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{if(sys.equip(selected,Number(b.dataset.slot))){selected=null;draw();}});
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{sys.unequip(Number(b.dataset.remove));draw();});
 document.getElementById('totem-close').onclick=close;
 document.getElementById('totem-log').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(game.log.export(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='penny-run-events.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 };draw();}
export function hud(game,el){el.classList.toggle('hidden',['title','dead','victory'].includes(game.state));const html=game.totems.slots.map((id,i)=>{const t=TOTEMS.find(t=>t.id===id);if(!t)return `<span class="totem-mini">${i+1} · 빈 슬롯</span>`;const s=game.totems.states[id];return `<span class="totem-mini" title="${t.desc}">${chart(t,s.cd>0?0:s.n/t.steps)}<b>${t.name}</b><small>${s.cd>0?'대기 '+Math.ceil(s.cd)+'초':s.n+'/'+t.steps}${s.n?' · '+Math.ceil(s.time)+'초':''}${s.ready?' · 돌파 준비':''}<br>${nextAction(t,s)}</small></span>`;}).join('');if(el.innerHTML!==html)el.innerHTML=html;}
// Small, code-native pixel pickup icon: 24 x 18 world pixels.
export function drawRelic(game,ctx){
 const r=game.relic;if(!r||r.taken)return;if(r.hidden&&!r.revealed){if(Math.abs(game.player.x-r.x)<250){ctx.fillStyle='#a5bdc3';ctx.fillRect(r.x,r.y+12,3,3);}return;}
 ctx.save();ctx.translate(Math.round(r.x-12),Math.round(r.y+7));
 const box=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
 box(0,0,24,18,'#171b25');box(2,2,20,5,'#bd8c48');
 box(2,9,20,7,'#76502f');box(3,3,18,2,'#e3b96e');
 box(4,2,3,14,'#d0a657');box(17,2,3,14,'#d0a657');
 box(0,7,24,2,'#30251d');box(10,6,5,6,'#f0d087');box(12,8,1,2,'#493a2a');
 if(r.trial&&!r.trialComplete){ctx.fillStyle='#ff9b8a';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText(r.trialStarted?'도전 진행 중':'선택 도전',12,-8);}
 ctx.restore();
}

export function chooseRelic(game,showModal){
 const offers=game.relic.offers.map(id=>TOTEMS.find(t=>t.id===id));
 showModal(`<span class="eyebrow">탐험 보상 · 차트 보관함</span><h2 id="modal-title">이번 도전에 가져갈 토템</h2><p>하나를 선택하세요. 획득 후 장착 메뉴에서 기존 토템과 비교하고 슬롯을 정할 수 있습니다.</p><div class="totem-collection">${offers.map(t=>`<button class="totem-card" data-offer="${t.id}"><span>${GROUPS[t.group]}</span>${chart(t)}<h3>${t.name}</h3><p>${t.desc}</p><small>형성 ${t.window||8}초 · 재사용 ${t.cd}초</small></button>`).join('')}</div>${offers.length?'':'<p>이미 16종을 모두 보유하고 있습니다. 보관함을 시드 40으로 교환할 수 있습니다.</p>'}<div class="modal-actions"><button id="relic-leave">나중에 선택 · Esc</button>${offers.length?'':'<button class="primary" id="relic-seed">시드 40 받기</button>'}</div>`,'relic_choice');
 document.querySelectorAll('[data-offer]').forEach(b=>b.onclick=()=>game.chooseRelic(b.dataset.offer));
 document.getElementById('relic-leave').onclick=()=>game.chooseRelic('leave');
 const seed=document.getElementById('relic-seed');if(seed)seed.onclick=()=>game.chooseRelic('seed');
}

function nextAction(t,s){
 if(s.cd>0)return '재사용 대기';
 const key={hit:'X 적중',finisher:'3단 마무리',evade:'공격 대시 회피',profit:'A 적중',circuit:'D',dash:'Z'};
 if(t.sequence)return s.n===t.steps&&t.effect==='branch'?'A 공격 / D 방어':key[t.sequence[s.n]];
 if(t.id==='double_bottom')return s.n<2?'공격 대시 회피':'X 반격';
 if(t.id==='double_top')return s.n<2?'같은 적 3단 마무리':'같은 적 A';
 if(t.id==='flag')return s.n<3?'X 적중':s.rest<.8?'X 놓고 0.8초':'X 돌파';
 if(t.id==='triangle')return s.n===4?'A 공격 / D 방어':s.last==='hit'?'공격 대시 회피':'X 적중';
 return s.n<6?'X 적중':s.ready?'X 돌파':'Z 손잡이';
}
