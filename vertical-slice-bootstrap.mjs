import {Game,CARDS} from './engine.mjs';
import {enableVerticalSlice} from './vertical-slice-mode.mjs';
import {enableEliteSlice} from './vertical-slice-elite.mjs';
import {enableBossSlice} from './vertical-slice-boss.mjs';
import {enableBalanceSlice} from './vertical-slice-balance.mjs';

enableVerticalSlice(Game);
enableEliteSlice(Game);
enableBossSlice(Game);
enableBalanceSlice(Game,CARDS);

function applySlicePresentation(){
 const chapter2=document.getElementById('start-chapter2');
 if(chapter2)chapter2.classList.add('hidden');
 const modal=document.getElementById('modal-inner');
 if(!modal)return;
 const eyebrow=modal.querySelector('.eyebrow');
 if(!eyebrow||!eyebrow.textContent.includes('LISTING APPROVED'))return;

 const heading=modal.querySelector('h2');
 const summary=modal.querySelector('p');
 eyebrow.textContent='CHAPTER 01 CLEAR · 상장 승인';
 if(heading)heading.textContent='PENNY STOCK → SMALL CAP';
 if(summary)summary.textContent='잠식된 선동가를 격파하고 잡주의 골목을 돌파했습니다. Vertical Slice 한 판이 완료되었습니다.';

 if(!modal.querySelector('.slice-clear-note')){
  const note=document.createElement('p');
  note.className='slice-clear-note';
  note.innerHTML='<strong>잡주의 골목 5 / 5 구역 완료</strong><br>전투 · 회피 · 상점 · 탐험 · 엘리트 · 보스까지 1장 핵심 루프를 완주했습니다.';
  const actions=modal.querySelector('.modal-actions');
  if(actions)modal.insertBefore(note,actions);
  else modal.appendChild(note);
 }

 const retry=modal.querySelector('#retry');
 const back=modal.querySelector('#back-title');
 if(retry)retry.textContent='잡주의 골목 다시 도전 ↗';
 if(back)back.textContent='타이틀로';
}

const observer=new MutationObserver(applySlicePresentation);
observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
applySlicePresentation();

await import('./game.js');
