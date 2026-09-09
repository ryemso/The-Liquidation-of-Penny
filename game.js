import {Game,MARKETS,CARDS,ROOM_SPECS,clamp} from './engine.mjs';
import {StageMusic} from './audio.mjs';
const $=id=>document.getElementById(id);
const canvas=$('game'),ctx=canvas.getContext('2d',{alpha:false});
const input={left:false,right:false,attack:false};
const assets={};let game,loaded=false,last=0,noticeUntil=0,roomUntil=0,modalCards=[],modalKind='',lastFocus=null,savedRun=false;
const stageMusic=new StageMusic({onBlocked:()=>showNotice('BGM은 첫 입력 후 재생됩니다. 상단 BGM 버튼을 눌러주세요.',4),onError:()=>showNotice('BGM 파일을 불러오지 못했습니다.',4)});
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let progress={knowledge:0,best:0,runs:0,wins:0};
try{const data=JSON.parse(localStorage.getItem('money-war-progress-v1')||'null');if(data&&typeof data==='object')for(const k of Object.keys(progress))progress[k]=clamp(Number(data[k])||0,0,100000);}catch{}
function saveProgress(){try{localStorage.setItem('money-war-progress-v1',JSON.stringify(progress));return true;}catch{return false;}}
class AudioFX{
 constructor(){this.enabled=false;this.audio=null;}
 async enable(){this.enabled=!this.enabled;if(this.enabled){try{this.audio??=new(window.AudioContext||window.webkitAudioContext)();await this.audio.resume();}catch{this.enabled=false;}}$('sound').textContent=`음향 ${this.enabled?'ON':'OFF'}`;$('sound').setAttribute('aria-label',`효과음 ${this.enabled?'끄기':'켜기'}`);$('sound').setAttribute('aria-pressed',String(this.enabled));}
 tone(freq,duration=.1,type='triangle',vol=.045,end=null,delay=0){if(!this.enabled||!this.audio)return;const a=this.audio,t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(end)o.frequency.exponentialRampToValueAtTime(Math.max(25,end),t+duration);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+duration+.02);}
 play(name){const sounds={swing:()=>this.tone(170,.08,'triangle',.035,80),hit:()=>this.tone(100,.08,'square',.024,42),jump:()=>this.tone(280,.1,'sine',.035,500),dash:()=>this.tone(400,.13,'sawtooth',.018,60),hurt:()=>this.tone(130,.2,'sawtooth',.035,35),shot:()=>this.tone(580,.16,'sine',.025,230),roar:()=>this.tone(80,.35,'sawtooth',.028,45),explosion:()=>this.tone(110,.26,'sawtooth',.05,26),circuit:()=>{this.tone(600,.24,'sine',.05,60);this.tone(55,1,'sine',.018);},profit:()=>{this.tone(280,.3,'triangle',.05,1100);this.tone(660,.35,'sine',.035,null,.06);},lever:()=>this.tone(150,.28,'sawtooth',.025,450),reward:()=>[440,550,660].forEach((f,i)=>this.tone(f,.22,'triangle',.04,null,i*.08)),clear:()=>[330,440,660,880].forEach((f,i)=>this.tone(f,.3,'sine',.035,null,i*.1)),bossdown:()=>{this.tone(90,.65,'sawtooth',.04,28);[440,660,880].forEach((f,i)=>this.tone(f,.4,'triangle',.04,null,.4+i*.15));}};sounds[name]?.();}
}
const audioFX=new AudioFX();
function clearInput(){input.left=input.right=input.attack=false;}
function showNotice(text,duration=3){$('notice').textContent=text;$('notice').classList.remove('hidden');noticeUntil=performance.now()+duration*1000;}
function showModal(html,kind){clearInput();modalKind=kind;lastFocus=document.activeElement;$('modal-inner').innerHTML=html;$('modal').classList.remove('hidden');requestAnimationFrame(()=>$('modal-inner').querySelector('button')?.focus());}
function hideModal(){modalKind='';modalCards=[];$('modal').classList.add('hidden');$('modal-inner').innerHTML='';canvas.focus({preventScroll:true});}
const fmtTime=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
const cardHTML=(card,i,shop=false)=>`<button class="card" data-card="${card.id}" ${shop&&game.player.gold<card.price?'disabled':''}><span class="card-number">${shop?'':`[${i+1}]`}</span><span class="card-symbol">${card.symbol}</span><span class="tag">${card.tag}</span><h3>${card.name}</h3><p>${card.desc}</p>${shop?`<span class="price">◈ ${card.price}</span>`:''}</button>`;
function event(e){
 if(e.type==='sound'){audioFX.play(e.name);return;}
 if(e.type==='notice')showNotice(e.text,e.duration);
 if(e.type==='room'){$('room-kicker').textContent=e.room.subtitle;$('room-title').textContent=e.room.name;$('room-toast').classList.remove('hidden');roomUntil=performance.now()+3000;$('footer-location').textContent=e.room.chapterName+' · '+e.room.name;$('chapter-tag').textContent=`CHAPTER 0${e.room.chapter} · ${e.room.chapterName}`;$('boss-hud').classList.toggle('hidden',e.room.kind!=='boss');if(e.room.kind==='boss')$('boss-name').textContent=e.room.bossName||'보스';stageMusic.setScene('playing',e.room.chapter);}
 if(e.type==='reward'){stageMusic.setScene('reward',game.spec.chapter);modalCards=e.cards;showModal(`<span class="eyebrow">ROOM CLEAR · 포트폴리오</span><h2 id="modal-title">다음 투자를 선택하세요</h2><p>하나의 종목을 편입합니다. 효과는 이번 도전이 끝날 때까지 유지됩니다.</p><div class="cards">${e.cards.map((c,i)=>cardHTML(c,i)).join('')}</div><div class="modal-actions"><small>숫자 1 · 2 · 3 또는 카드 클릭</small></div>`,'reward');$('modal-inner').querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>game.chooseReward(b.dataset.card));}
 if(e.type==='shop'){stageMusic.setScene('shop',game.spec.chapter);showShop();}
 if(e.type==='chapter'){stageMusic.setScene('chapter',1);showModal(`<span class="eyebrow">CHAPTER 01 COMPLETE · LISTING UPGRADE</span><h2 id="modal-title">기관의 벽이 열립니다</h2><p>잠식된 선동가의 확성기를 부수고 첫 번째 시장 영향력을 얻었습니다.<br>이제 기관의 주문센터로 진입합니다. 방패는 정면 방어를 하고, 드론은 발사 전 조준선을 고정합니다.</p><div class="chapter-growth"><span>SMALL CAP</span><span>최대 체력 +20</span><span>공격력 +6</span><span>미실현 수익 50%</span></div><div class="modal-actions"><button class="primary" id="enter-chapter2">기관의 벽으로 진입 →</button></div>`,'chapter');$('enter-chapter2').onclick=()=>game.enterChapterTwo();}
 if(e.type==='resume'){hideModal();stageMusic.setScene(game.state==='shop'?'shop':'playing',game.spec.chapter);}
 if(e.type==='market'){showNotice(`${MARKETS[game.market].name} 진입 · ${MARKETS[game.market].detail}`,3);audioFX.play('reward');}
 if(e.type==='finish'){stageMusic.setScene('title',game.spec.chapter);
  if(!savedRun){progress.knowledge+=e.knowledge;progress.runs++;progress.best=Math.max(progress.best,game.room+1);if(e.won)progress.wins++;savedRun=true;if(!saveProgress())showNotice('브라우저 저장이 차단되어 기록은 이 화면을 닫기 전까지만 유지됩니다.',12);}
  const won=e.won;
  showModal(`<span class="eyebrow">${won?'LISTING APPROVED · 상장 승인':'LIQUIDATED · 이번 도전 종료'}</span><h2 id="modal-title">${won?'Penny Stock → Small Cap':'청산되었습니다'}</h2><p>${won?'선동가의 확성기는 부서졌습니다. 평범한 사람의 첫 반란이 시장에 기록됩니다.<br>다음 목적지는 2장 「기관의 벽」입니다. 현재 데모는 여기까지 플레이할 수 있습니다.':'이번 손실도 다음 판단의 근거가 됩니다. 투자 지식은 다음 도전에 남습니다.'}</p><div class="stat-grid"><div><strong>${fmtTime(game.totalTime)}</strong><small>플레이 시간</small></div><div><strong>${game.kills}</strong><small>처치한 적</small></div><div><strong>+${e.knowledge}</strong><small>투자 지식</small></div></div><p>보유 투자 지식 ${progress.knowledge} · 다음 시작 체력 ${100+Math.min(20,progress.knowledge*2)}<br>이번 포트폴리오: ${game.build.length?game.build.map(id=>CARDS.find(c=>c.id===id).name).join(' · '):'없음'}</p><div class="modal-actions"><button class="secondary" id="back-title">처음으로</button><button class="primary" id="retry">다시 도전 ↗</button></div>`,'finish');$('retry').onclick=startGame;$('back-title').onclick=backToTitle;
 }
}
function showShop(){
 const offers=[CARDS[0],CARDS[1],CARDS[2]];
 showModal(`<span class="eyebrow">07 EXCHANGE · 공칠의 거래소</span><h2 id="modal-title">“살아남아야 다음 장도 보지.”</h2><p>보유 시드 <strong style="color:var(--gold)">${game.player.gold}</strong> · 체력 ${Math.ceil(game.player.hp)} / ${game.player.maxHp}<br>시드는 이번 도전에서만 사용합니다. 종목 효과는 중첩됩니다.</p><div class="cards">${offers.map((c,i)=>cardHTML(c,i,true)).join('')}</div><div class="modal-actions"><button class="secondary" id="buy-heal" ${game.player.gold<35||game.player.hp>=game.player.maxHp?'disabled':''}>체력 40 회복 · ◈ 35</button><button class="primary" id="leave-shop">거래 종료 →</button></div>`,'shop');
 $('modal-inner').querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>{if(game.buy(b.dataset.card))showShop();});$('buy-heal').onclick=()=>{if(game.buy('heal')){audioFX.play('reward');showShop();}};$('leave-shop').onclick=()=>game.closeShop();
}
function pauseGame(help=false){
 stageMusic.setScene('title',game?.spec?.chapter||1);
 if(!loaded||!game||!['playing','paused','title'].includes(game.state))return;
 const fromTitle=game.state==='title';if(!fromTitle)game.state='paused';clearInput();
 const buildText=game.build.length?game.build.map(id=>CARDS.find(c=>c.id===id).name).join(' · '):'아직 편입한 종목이 없습니다.';
 showModal(`<span class="eyebrow">${help?'HOW TO PLAY':'TRADING PAUSED'}</span><h2 id="modal-title">${help?'시장에서 살아남는 법':'잠시 거래를 멈춥니다'}</h2><div class="help-grid"><span><kbd>← →</kbd> 이동</span><span><kbd>C</kbd> 점프 / 공중에서 한 번 더</span><span><kbd>X</kbd> 3단 기본 공격 (길게 가능)</span><span><kbd>Z</kbd> 무적 대시</span><span><kbd>A</kbd> 수익 25 이상일 때 익절</span><span><kbd>S</kbd> 8초 레버리지</span><span><kbd>D</kbd> 적·투사체 일시 정지</span><span><kbd>↑</kbd> 출구 / 거래소 이용</span></div><p>공격이 적중하면 미실현 수익이 쌓이고, 피격 시 25%를 잃습니다. 익절로 수익을 소모해 강한 공격을 쓰세요.<br>레버리지는 피해 ×1.65. 8초 안에 2마리 처치 또는 피해 160을 달성하면 시드 +18, 실패하면 체력 −18입니다.</p>${!fromTitle?`<p>현재 포트폴리오 · ${buildText}</p>`:''}<div class="modal-actions">${!fromTitle?'<button class="secondary" id="restart-request">처음부터 다시</button>':''}<button class="primary" id="resume">${fromTitle?'확인':'계속하기'}</button></div>`,'pause');
 $('resume').onclick=()=>{if(!fromTitle)game.state='playing';hideModal();};if($('restart-request'))$('restart-request').onclick=()=>showRestartConfirm();
}
function showRestartConfirm(){showModal('<span class="eyebrow">RESTART RUN</span><h2 id="modal-title">이번 도전을 종료할까요?</h2><p>이번 도전에서 모은 시드와 종목은 사라집니다. 이전에 저장된 투자 지식은 유지됩니다.</p><div class="modal-actions"><button class="secondary" id="cancel-restart">돌아가기</button><button class="primary" id="confirm-restart">새로 시작</button></div>','confirm');$('cancel-restart').onclick=()=>pauseGame();$('confirm-restart').onclick=startGame;}
function startGame(chapter=1){if(!loaded)return;hideModal();clearInput();savedRun=false;game=new Game({onEvent:event,knowledge:progress.knowledge});if(chapter===2){game.promoted=true;game.rank='SMALL CAP';game.setRoom(5,false);} $('screen').classList.add('hidden');for(const id of ['hud','skills'])$(id).classList.remove('hidden');game.start();stageMusic.setScene('playing',game.spec.chapter);stageMusic.resumeFromGesture();canvas.focus({preventScroll:true});audioFX.play('reward');}
function backToTitle(){hideModal();clearInput();stageMusic.setScene('title',1);game=new Game({onEvent:event,knowledge:progress.knowledge});$('screen').classList.remove('hidden');for(const id of ['hud','skills','boss-hud','leverage','notice','room-toast'])$(id).classList.add('hidden');updateSaveNote();}
function updateSaveNote(){$('save-note').textContent=progress.runs?`누적 ${progress.runs}회 도전 · 투자 지식 ${progress.knowledge} · 시작 체력 +${Math.min(20,progress.knowledge*2)}`:'사망해도 투자 지식은 남습니다.';}
function bind(){
 $('start').onclick=startGame;$('start-chapter2').onclick=()=>startGame(2);$('sound').onclick=()=>audioFX.enable();$('music').onclick=()=>{stageMusic.setEnabled(!stageMusic.enabled);$('music').textContent=stageMusic.enabled?'BGM ON':'BGM OFF';$('music').setAttribute('aria-pressed',String(stageMusic.enabled));if(stageMusic.enabled)stageMusic.resumeFromGesture();};$('music-volume').oninput=e=>stageMusic.setVolume(e.currentTarget.value/100);$('help').onclick=()=>pauseGame(true);$('pause').onclick=()=>{if(game.state==='paused'){game.state='playing';hideModal();stageMusic.setScene('playing',game.spec.chapter);}else pauseGame();};
 $('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('stage').requestFullscreen();}catch{showNotice('이 브라우저에서는 전체 화면을 사용할 수 없습니다.',3);}};
 document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();game.action(b.dataset.action);canvas.focus({preventScroll:true});}));
 document.querySelectorAll('[data-hold]').forEach(b=>{const key=b.dataset.hold;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);input[key]=true;});for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>input[key]=false);});
 const mapping={KeyC:'jump',KeyX:'attack',KeyZ:'dash',KeyA:'profit',KeyS:'leverage',KeyD:'circuit',ArrowUp:'interact',Enter:'interact'};
 window.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='Tab'&&!$('modal').classList.contains('hidden')){const bs=[...$('modal').querySelectorAll('button:not(:disabled)')];if(bs.length){if(e.shiftKey&&document.activeElement===bs[0]){e.preventDefault();bs.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===bs.at(-1)){e.preventDefault();bs[0].focus();}}return;}
  if(e.code==='Escape'){e.preventDefault();if(modalKind==='pause')$('resume')?.click();else if(game.state==='playing')pauseGame();else if(modalKind==='shop')game.closeShop();return;}
  if(e.code==='Slash'&&!e.repeat){e.preventDefault();pauseGame(true);return;}
  if(modalKind==='reward'&&/^Digit[123]$/.test(e.code)){e.preventDefault();const card=modalCards[Number(e.code.at(-1))-1];if(card)game.chooseReward(card.id);return;}
  if(game.state==='title'&&e.code==='Enter'&&!e.repeat&&modalKind===''){e.preventDefault();startGame();return;}
  if(game.state!=='playing')return;
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space',...Object.keys(mapping)].includes(e.code))e.preventDefault();
  if(e.code==='ArrowLeft')input.left=true;if(e.code==='ArrowRight')input.right=true;if(e.code==='KeyX')input.attack=true;
  if(mapping[e.code]&&!e.repeat)game.action(mapping[e.code]);
 });
 window.addEventListener('keyup',e=>{if(e.code==='ArrowLeft')input.left=false;if(e.code==='ArrowRight')input.right=false;if(e.code==='KeyX')input.attack=false;});
 window.addEventListener('blur',()=>{clearInput();stageMusic.setScene('title',game?.spec?.chapter||1);if(game.state==='playing')pauseGame();});document.addEventListener('visibilitychange',()=>{stageMusic.setScene(document.hidden?'title':(game?.state==='playing'?'playing':'title'),game?.spec?.chapter||1);if(document.hidden){clearInput();if(game.state==='playing')pauseGame();}});
 canvas.addEventListener('pointerdown',()=>canvas.focus({preventScroll:true}));
}
async function imageLoad(path){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error(path));i.src=path;});}
// Runtime sprite masking: source PNGs stay intact. The rendering surface handles
// alpha, keyed magenta, or the neutral checkerboard baked into early concept art.
function atlas(image,cols,rows,magenta=false,customCuts=null){
 const full=document.createElement('canvas');full.width=image.width;full.height=image.height;const c=full.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);
 const pixels=c.getImageData(0,0,full.width,full.height);const d=pixels.data;
 let realAlpha=false,keyed=0;
 for(let i=3;i<d.length;i+=4)if(d[i]<20){realAlpha=true;break;}
 if(magenta){for(let i=0;i<d.length;i+=4)if(d[i]>190&&d[i+2]>170&&d[i+1]<100){d[i+3]=0;keyed++;}}
 if(!realAlpha&&keyed===0){
  const w=image.width,h=image.height,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0;
  const push=index=>{if(index<0||index>=w*h||seen[index])return;seen[index]=1;const k=index*4,r=d[k],g=d[k+1],b=d[k+2];if(Math.min(r,g,b)>86&&Math.max(r,g,b)-Math.min(r,g,b)<27){d[k+3]=0;queue[tail++]=index;}};
  for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
  while(head<tail){const index=queue[head++],x=index%w;if(x>0)push(index-1);if(x<w-1)push(index+1);push(index-w);push(index+w);}
 }
 c.putImageData(pixels,0,0);
 const frames=[];
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
  const x0=customCuts?customCuts[col]:Math.round(col*image.width/cols),x1=customCuts?customCuts[col+1]:Math.round((col+1)*image.width/cols),y0=Math.round(row*image.height/rows),y1=Math.round((row+1)*image.height/rows);
  let l=x1,r=x0,t=y1,b=y0;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(d[(y*image.width+x)*4+3]>100){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
  if(r<l){frames.push({x:x0,y:y0,w:1,h:1});continue;}frames.push({x:l,y:t,w:r-l+1,h:b-t+1});
 }
 return{image:full,frames,maxHeight:Math.max(...frames.map(f=>f.h))};
}
function sprite(name,frame,x,bottom,height,facing=1,flash=0,alpha=1){const a=assets[name];if(!a)return;const f=a.frames[clamp(frame,0,a.frames.length-1)],scale=height/a.maxHeight,w=f.w*scale,h=f.h*scale;ctx.save();ctx.globalAlpha=alpha;ctx.translate(Math.round(x),Math.round(bottom));ctx.scale(facing,1);ctx.filter=flash>0?'brightness(2.1)':'brightness(1.15)';ctx.drawImage(a.image,f.x,f.y,f.w,f.h,Math.round(-w/2),Math.round(-h),Math.ceil(w),Math.ceil(h));ctx.restore();}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));}
function label(text,x,y,color='#d4dfe7',size=12,align='center'){ctx.save();ctx.font=`600 ${size}px "Noto Sans KR", sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle='#060b13';ctx.fillText(text,Math.round(x+1),Math.round(y+2));ctx.fillStyle=color;ctx.fillText(text,Math.round(x),Math.round(y));ctx.restore();}
function drawBackground(cam,time){
 ctx.fillStyle='#101a29';ctx.fillRect(0,0,1280,720);
 if(assets.alley){const image=assets.alley;const w=1750,h=985;const drift=cam*.16;ctx.drawImage(image,-drift,-55,w,h);if(drift>180)ctx.drawImage(image,w-drift-1,-55,w,h);}
 if(game.room===4)rect(0,0,1280,720,'#36152424');
 const fog=ctx.createLinearGradient(0,430,0,720);fog.addColorStop(0,'#07111d00');fog.addColorStop(1,'#050b13a8');ctx.fillStyle=fog;ctx.fillRect(0,430,1280,290);
 // Ambient dust is a lightweight particle effect, kept away from combat silhouettes.
 for(let i=0;i<25;i++){const x=((i*137+Math.sin(i)*61-cam*.25+time*(i%3+1)*3)%1320+1320)%1320;const y=120+(i*71)%380+Math.sin(time*.5+i)*9;rect(x,y,2,2,i%3===0?'#d8b96945':'#869cb02a');}
}
function drawPlatform(p){const x=p.x,y=p.y,w=p.w;rect(x,y,w,p.h,p.ground?'#0a101b':'#192536');rect(x,y,w,4,'#6a7380');rect(x,y,w,2,'#d6bd80');rect(x,y+5,w,3,'#343d4e');rect(x,y+p.h-3,w,3,'#070d15');for(let xx=x+8;xx<x+w-4;xx+=36){rect(xx,y+8,25,5,'#273447');rect(xx+24,y+6,2,p.h-7,'#0b1320');}if(p.ground){for(let xx=x;xx<x+w;xx+=95){rect(xx,y+25,92,31,'#141e2d');rect(xx+2,y+28,87,1,'#263143');rect(xx+30,y+60,62,36,'#101a27');}rect(x,y+15,w,5,'#080e19');}}
function drawExit(){const x=game.width-100,open=game.doorOpen;ctx.save();ctx.shadowColor=open?'#d4b474':'#667a9c';ctx.shadowBlur=open?25:0;rect(x-32,520,70,100,'#0a0f18');rect(x-36,517,5,103,'#6c7178');rect(x+37,517,5,103,'#6c7178');rect(x-36,514,78,6,'#8e8572');const g=ctx.createLinearGradient(x,520,x+45,620);g.addColorStop(0,open?'#e6c27f':'#253145');g.addColorStop(1,open?'#8d6d44':'#121a29');ctx.fillStyle=g;ctx.fillRect(x-25,523,56,97);ctx.restore();rect(x-20,532,45,2,open?'#ffdf9a':'#46526a');label(open?'↑ 다음 구역':'잠김',x+2,489,open?'#f8d28b':'#8fa1b4',13);if(open&&Math.abs(game.player.x-x)<140)label(game.room===4?'↑ 상장 심사':'↑ 이동',x,470,'#fff0c6',15);if(!open){rect(x-5,554,20,18,'#121c2a');rect(x,545,10,12,'#64718a');rect(x+3,548,4,7,'#263043');}}
function drawShop(){const x=650;rect(x-80,509,160,110,'#142234');rect(x-88,505,176,12,'#7c6d4e');rect(x-74,527,148,65,'#0b1523');rect(x-67,532,134,2,'#bba675');label('07 EXCHANGE',x,550,'#d0b77e',16);label('공칠의 거래소',x,577,'#b1c1d3',12);rect(x-87,599,177,8,'#43516a');label('↑ 거래 / 회복',x,484,'#f0d49f',14);if(Math.abs(game.player.x-x)<170)label('“시드가 있다면, 아직 기회는 있지.”',x,456,'#ded4ba',13);}
function enemyFrame(e){if(e.flash>0)return 7;if(e.type==='boss'||e.type==='enforcer')return e.state==='windup'?1:e.state==='attack'?2:e.state==='recover'?3:0;if(e.type==='shield')return e.state==='attack'||e.state==='windup'?2:e.state==='recover'?3:Math.abs(e.vx)>1?1:0;if(e.type==='drone')return e.state==='windup'?2:e.state==='recover'?3:Math.floor(e.anim*2)%2;if(e.type==='boss')return e.state==='windup'?1:e.state==='attack'?2:0;if(e.state==='windup')return 4;if(e.state==='attack')return 5;if(e.state==='charge')return Math.floor(e.anim*10)%2?5:6;if(e.state==='recover')return 6;if(Math.abs(e.vx)>5||e.type==='ghost')return 2+Math.floor(e.anim*7)%2;return Math.floor(e.anim*2)%2;}
function drawEnemy(e){if(e.dead)return;const x=e.x+e.w/2,bottom=e.y+e.h;const height=e.type==='boss'||e.type==='enforcer'?178:e.type==='ghost'?96:e.type==='drone'?70:e.type==='shield'?82:e.type==='bomb'?74:e.elite?98:76;ctx.save();ctx.globalAlpha=.3;ctx.fillStyle='#02060c';ctx.beginPath();ctx.ellipse(x,e.type==='ghost'?620:bottom,e.w*.65,5,0,0,Math.PI*2);ctx.fill();ctx.restore();
 if(e.state==='windup'){const factor=1-(Math.max(0,e.timer)/(e.type==='boss'?1.15:e.type==='bomb'?1.15:.65));ctx.save();ctx.strokeStyle=e.type==='ghost'?'#78c6eaaa':'#f9b870bb';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,e.y+e.h*.4,Math.max(e.w*.7,27)+Math.sin(game.t*20)*2,-Math.PI/2,Math.PI*2*factor-Math.PI/2);ctx.stroke();ctx.restore();label('!',x,e.y-28,'#ffd185',22);if(e.type==='bomb'){ctx.fillStyle='#df6d4222';ctx.beginPath();ctx.ellipse(x,620,133,13,0,0,Math.PI*2);ctx.fill();}}
 sprite(e.type,enemyFrame(e),x,bottom,height,e.type==='boss'?-e.facing:e.facing,e.flash);
 if(e.type!=='boss'&&(e.hp<e.maxHp||e.elite)){const w=e.elite?65:46;rect(x-w/2,e.y-16,w,4,'#121820');rect(x-w/2,e.y-16,w*e.hp/e.maxHp,4,e.elite?'#d8b277':'#bc7273');if(e.elite)label('적대적 인수체',x,e.y-30,'#edca80',11);}}
function drawHero(){const p=game.player;let frame=0;if(p.hurt>0)frame=7;else if(p.attack>0)frame=6;else if(!p.grounded)frame=p.vy<0?4:5;else if(Math.abs(p.vx)>10)frame=1+Math.floor(game.t*11)%3;
 const x=p.x+p.w/2,bottom=p.y+p.h;
 if(p.dash>0){for(let i=3;i>0;i--)sprite('hero',1,x-p.facing*i*23,bottom,76,p.facing,0,.12*(4-i));}
 if(p.leverage>0){ctx.save();ctx.strokeStyle='#efa46a';ctx.lineWidth=1;ctx.globalAlpha=.4+.2*Math.sin(game.t*14);ctx.beginPath();ctx.ellipse(x,bottom-32,34,48,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
 sprite('hero',frame,x,bottom,76,p.facing,0,p.inv>0&&Math.floor(game.t*16)%2===0?.5:1);
}
function drawEffects(){
 for(const h of game.hazards){if(h.delay>0){rect(h.x,614,h.w,6,Math.sin(game.t*20)>0?'#ef8376':'#a54a4b');rect(h.x,455,h.w,160,'#e97b6814');label('!',h.x+h.w/2,600,'#ffb294',20);}else{const alpha=Math.min(1,h.life/.45);ctx.save();ctx.globalAlpha=alpha;rect(h.x,455,h.w,165,'#eab07b70');rect(h.x+20,455,h.w-40,165,'#ffd992');ctx.restore();}}
 for(const b of game.projectiles){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(game.t*3);rect(-b.r,-b.r,b.r*2,b.r*2,b.color);rect(-b.r/2,-b.r/2,b.r,b.r,'#fff4c9');ctx.restore();}
 for(const f of game.effects){const alpha=f.life/f.max;ctx.save();ctx.globalAlpha=alpha;
  if(f.type==='slash'||f.type==='profit'){const radius=f.type==='profit'?155:70;ctx.translate(f.x,f.y);ctx.scale(f.facing,1);ctx.strokeStyle=f.type==='profit'?'#ffe2a1':'#f4bc76';ctx.lineWidth=f.type==='profit'?9:4;ctx.beginPath();ctx.arc(3,0,radius,-1.05+(1-alpha)*.4,1.05+(1-alpha)*.4);ctx.stroke();if(f.type==='profit'){ctx.lineWidth=2;ctx.strokeStyle='#fff3d1';ctx.beginPath();ctx.arc(3,0,radius+17,-.95,1.1);ctx.stroke();}}
  if(f.type==='explosion'){const radius=(1-alpha)*145;ctx.fillStyle='#ef9e5738';ctx.beginPath();ctx.arc(f.x,f.y,radius,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffd091';ctx.lineWidth=5;ctx.stroke();}
  ctx.restore();
 }
 for(const v of game.particles){ctx.globalAlpha=clamp(v.life/v.max,0,1);rect(v.x,v.y,v.size,v.size,v.color);}ctx.globalAlpha=1;
 for(const v of game.texts){ctx.globalAlpha=clamp(v.life*2,0,1);label(v.text,v.x,v.y,v.color,v.size);}ctx.globalAlpha=1;
}
function render(){
 ctx.imageSmoothingEnabled=false;const title=game.state==='title',cam=title?300:game.camera;
 drawBackground(cam,game.t);ctx.save();const shake=reducedMotion?0:game.shake;ctx.translate(-Math.round(cam)+(Math.random()-.5)*shake,(Math.random()-.5)*shake*.5);
 for(const p of game.platforms)drawPlatform(p);
 if(title){sprite('hero',0,920,620,100,1);sprite('rubble',0,1300,620,105,-1);sprite('ghost',0,1480,434,110,-1);}
 else{drawExit();if(game.spec.kind==='shop')drawShop();for(const e of game.enemies)drawEnemy(e);drawHero();drawEffects();}
 ctx.restore();
 if(game.freeze>0){rect(0,0,1280,720,'#5284a91c');ctx.strokeStyle='#84c9ed88';ctx.lineWidth=5;ctx.strokeRect(3,3,1274,714);label('TRADING HALT',640,510,'#bdeaff',16);}
 const vignette=ctx.createRadialGradient(640,380,270,640,350,750);vignette.addColorStop(0,'#01050b00');vignette.addColorStop(1,'#01050b75');ctx.fillStyle=vignette;ctx.fillRect(0,0,1280,720);
}
function updateHUD(){const p=game.player;$('hp-fill').style.width=`${p.hp/p.maxHp*100}%`;$('hp-text').textContent=`${Math.ceil(p.hp)} / ${p.maxHp}`;$('profit-fill').style.width=`${p.profit}%`;$('profit-text').textContent=`${Math.floor(p.profit)}%`;$('gold').textContent=String(p.gold);$('room-number').textContent=`${String(game.spec.localRoom).padStart(2,'0')} / 05`;$('rank').textContent=game.state==='victory'?'SMALL CAP':'PENNY STOCK';const m=MARKETS[game.market];$('market-name').textContent=m.name;$('market-name').style.color=m.color;$('market-detail').textContent=m.detail;$('market-warning').textContent=game.marketClock>game.marketPeriod-4?`${Math.ceil(game.marketPeriod-game.marketClock)}초 후 ${MARKETS[(game.market+1)%3].name}`:'';
 const alive=game.enemies.filter(e=>!e.dead).length;$('enemy-count').textContent=game.spec.kind==='shop'?'안전 구역':alive?`남은 적 ${alive}`:'구역 정리 완료';
 const boss=game.enemies.find(e=>e.type==='boss');if(boss){$('boss-fill').style.width=`${Math.max(0,boss.hp)/boss.maxHp*100}%`;$('boss-phase').textContent=boss.hp<boss.maxHp*.5?'PHASE 02':'PHASE 01';}
 const skillList=[['profit',p.profitCD,'수익 25 이상'],['leverage',p.leverageCD,'8초 / 피해 ×1.65'],['circuit',p.circuitCD,`적 ${2+game.stats.circuitExtra}초 정지`]];
 for(const [name,cd,desc]of skillList){const b=$(`skill-${name}`);b.classList.toggle('cooldown',cd>0);b.classList.toggle('ready',cd<=0&&(name!=='profit'||p.profit>=25));b.querySelector('small').textContent=cd>0?`${Math.ceil(cd)}초`:desc;}
 $('leverage').classList.toggle('hidden',p.leverage<=0||game.state==='title');if(p.leverage>0)$('leverage').textContent=`레버리지 ${p.leverage.toFixed(1)}초 · 처치 ${p.leverageKills}/2 또는 피해 ${Math.floor(p.leverageDamage)}/160`;
 if(performance.now()>noticeUntil)$('notice').classList.add('hidden');if(performance.now()>roomUntil)$('room-toast').classList.add('hidden');$('rank').textContent=game.rank;
 $('start-chapter2').classList.toggle('hidden',progress.best<5);
}
function tick(now){const dt=Math.min((now-last)/1000||0,1/30);last=now;game.update(dt,input);stageMusic.update(dt);render();if(game.state!=='title')updateHUD();requestAnimationFrame(tick);}
async function init(){
 game=new Game({onEvent:event,knowledge:progress.knowledge});bind();updateSaveNote();
 try{const names=['hero','rubble','bomb','ghost','boss','alley','institution','shield','drone','enforcer'];const imgs=await Promise.all(names.map(n=>imageLoad(`./${n}.png`)));for(let i=0;i<names.length;i++){const n=names[i];assets[n]=['alley','institution'].includes(n)?imgs[i]:atlas(imgs[i],4,['boss','shield','drone','enforcer'].includes(n)?1:2,true,n==='boss'?[0,510,1040,1670,2172]:null);}loaded=true;$('start').disabled=false;$('start').textContent='시장에 진입하기 ↗';requestAnimationFrame(tick);}
 catch(err){$('start').textContent='에셋 다시 불러오기';$('start').disabled=false;$('start').onclick=()=>location.reload();$('save-note').textContent='이미지를 불러오지 못했습니다. 다시 불러오기를 눌러주세요.';console.error('Asset load failed:',err);}
}
init();
