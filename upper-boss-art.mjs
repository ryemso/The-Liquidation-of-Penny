// Code-native weapons use the same phase and target data as combat.
export function drawUpperBoss(ctx,e){
 if(!e.skillActive&&!e.beam?.remaining)return;
 const x=e.x+e.w/2,y=e.y+e.h*.4,dir=e.lockDirection||e.facing;
 ctx.save();ctx.lineWidth=3;
 if(e.type==='central'){
  if(e.skillState==='leap'){ctx.fillStyle='#e8b86644';ctx.fillRect(e.targetX-95,615,190,5);}
  const angle=e.skillState==='prepare'?-1.4:e.skillState==='leap'?(e.vy<0?-1.7:.65):1.25;
  ctx.translate(x,y);ctx.scale(dir,1);ctx.rotate(angle);ctx.strokeStyle='#7e5433';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(62,0);ctx.stroke();ctx.fillStyle='#c9d6d9';ctx.beginPath();ctx.moveTo(47,-26);ctx.lineTo(81,-17);ctx.lineTo(81,20);ctx.lineTo(47,29);ctx.closePath();ctx.fill();ctx.strokeStyle='#3b454e';ctx.lineWidth=3;ctx.stroke();
 }else if(e.type==='algorithm'){
  ctx.strokeStyle=e.skillState==='prepare'?'#ffbc78':'#c7f8ff';
  const splitting=e.skillState==='split';const offset=splitting?Math.sin(e.timer*45)*25:0;
  for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(x+dir*10,y+side*12);ctx.lineTo(x+dir*(splitting?70:45),y+side*(24+offset));ctx.stroke();}
  if(e.skillState==='prepare'){ctx.strokeStyle='#ffb36388';ctx.strokeRect(dir>0?x:e.x-35,e.y,e.w/2+35,e.h);}
 }else if(e.type==='market'){
  const s=e.shot,aiming=['aim','locked'].includes(e.skillState);
  if(aiming){ctx.strokeStyle=e.skillState==='locked'?'#ff7260':'#ffd16d88';ctx.setLineDash(e.skillState==='locked'?[]:[8,8]);ctx.beginPath();ctx.moveTo(s&&e.skillState==='locked'?s.x:x,s&&e.skillState==='locked'?s.y:y);ctx.lineTo(s&&e.skillState==='locked'?s.x+s.dx:e.aimX,s&&e.skillState==='locked'?s.y+s.dy:e.aimY);ctx.stroke();ctx.setLineDash([]);}
  if(e.beam?.remaining>0){ctx.strokeStyle='#fff0b4';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(e.beam.x,e.beam.y);ctx.lineTo(e.beam.x+e.beam.dx,e.beam.y+e.beam.dy);ctx.stroke();}
  const a=Math.atan2((e.aimY??y)-y,(e.aimX??x+e.facing*100)-x);ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle='#29323d';ctx.fillRect(0,-5,58,10);ctx.fillStyle='#b7c9d2';ctx.fillRect(45,-3,24,6);ctx.fillRect(20,-11,18,5);
 }
 ctx.restore();
}
