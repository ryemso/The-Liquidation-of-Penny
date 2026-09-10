import {Game} from './engine.mjs';
import {enableVerticalSlice} from './vertical-slice-mode.mjs';

enableVerticalSlice(Game);

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
}

const observer=new MutationObserver(applySlicePresentation);
observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
applySlicePresentation();

await import('./game.js');
