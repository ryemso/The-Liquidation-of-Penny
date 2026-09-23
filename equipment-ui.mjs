import {EFFECTS} from './equipment-effects.mjs';
import {SLOTS,EQUIPMENT,RARITIES,validFor,normalizeLoadout,bonuses,bonusText,readLoadout,saveLoadout} from './equipment.mjs';
export function createEquipmentUI({storage,showModal,hideModal,getState}){
 let selected=readLoadout(storage),active='weapon';
 const item=id=>EQUIPMENT.find(e=>e.id===id);
 const icon=e=>e?`<img src="${e.src}" alt="" width="48" height="48">`:'<span class="empty-slot">＋</span>';
 function renderTitle(){const root=document.getElementById('equipment-slots');root.innerHTML=SLOTS.map(([slot,label])=>{const e=item(selected[slot]);return `<button type="button" data-slot="${slot}" title="${label}: ${e?.name||'비어 있음'}" aria-label="${label}: ${e?.name||'비어 있음'}">${icon(e)}<small>${label}</small></button>`;}).join('');root.querySelectorAll('button').forEach(b=>b.onclick=()=>open(b.dataset.slot));}
 function close(){hideModal();renderTitle();document.querySelector(`#equipment-slots [data-slot="${active}"]`)?.focus();}
 function open(slot=active){if(getState()!=='title')return;active=slot;const current=item(selected[slot]);
 showModal(`<span class="eyebrow">STARTING EQUIPMENT</span><h2 id="modal-title">출발 장비 · ${SLOTS.find(s=>s[0]===slot)[1]}</h2><p>이번 데모에서는 장비 16종을 모두 시험 장착할 수 있습니다. 출발 후에는 변경할 수 없습니다.<br>신화·유물의 고유 효과는 조건을 만족하면 자동 발동합니다.</p><nav class="equipment-tabs">${SLOTS.map(([s,label])=>`<button data-tab="${s}" aria-pressed="${s===slot}">${label}</button>`).join('')}</nav><p>현재: ${current?.name||'비어 있음'} · ${bonusText(current?.bonus||{})}</p><div class="equipment-list">${EQUIPMENT.filter(e=>validFor(e,slot)).map(e=>{const other=Object.entries(selected).some(([s,id])=>s!==slot&&id===e.id);return `<button class="equipment-item" data-equip="${e.id}" ${other?'disabled':''} aria-pressed="${e.id===selected[slot]}">${icon(e)}<span><small>${RARITIES[e.rarity]}${other?' · 다른 칸에 장착 중':''}</small><strong>${e.name}</strong><small>${bonusText(e.bonus)}</small>${EFFECTS[e.id]?`<small>${EFFECTS[e.id]}</small>`:''}</span></button>`;}).join('')}</div><p id="equipment-feedback" role="status">전체 장비 합계: ${bonusText(bonuses(selected))}</p><div class="modal-actions"><button id="unequip" class="secondary">이 칸 해제</button><button id="equipment-done" class="primary">장착 완료</button></div>`,'equipment');
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>open(b.dataset.tab));
 const set=id=>{selected=normalizeLoadout({...selected,[slot]:id});const saved=saveLoadout(storage,selected);renderTitle();open(slot);if(!saved)document.getElementById('equipment-feedback').textContent='선택은 적용되었습니다. 저장할 수 없어 페이지를 닫으면 초기화됩니다.';};
 document.querySelectorAll('[data-equip]').forEach(b=>b.onclick=()=>set(b.dataset.equip));document.getElementById('unequip').onclick=()=>set(null);document.getElementById('equipment-done').onclick=close;
 }
 return {renderTitle,close,loadout:()=>({...selected})};
}
