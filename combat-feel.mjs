export function addImpact(g,e,strong=false){
 g.effects.push({type:'impact',x:e.x+e.w/2,y:e.y+e.h/2,life:strong?.28:.16,max:strong?.28:.16,strong});
 if(!e.boss){e.stagger=strong?.3:.1;if(strong){e.state='recover';e.timer=Math.max(e.timer,.45);}}
}
export function releaseCircuit(g){
 if(!g.circuitBank||g.freeze>0)return;
 g.circuitBank=false;let targets=0,total=0;
 for(const e of g.enemies){const amount=e.circuitDebt||0;e.circuitDebt=0;if(e.dead||amount<=0)continue;targets++;total+=Math.min(e.hp,amount);g.hitEnemy(e,amount,0,false,true,true);addImpact(g,e,true);}
 if(targets){g.hitstop=.07;g.shake=7;g.emit('sound',{name:'halt-release'});g.log.add('circuit_release',{targets,damage:total});}
 g.effects.push({type:'halt-ring',x:g.player.x,y:g.player.y,life:.45,max:.45});
}
export function drawCombatFeel(ctx,g,reducedMotion=false){
 const p=g.player;
 ctx.save();
 if(g.freeze>0){ctx.fillStyle='#72cedd12';ctx.fillRect(g.camera,g.cameraY,1280,720);ctx.strokeStyle='#9aebee';ctx.lineWidth=1;
  for(const e of g.enemies){if(e.dead)continue;ctx.strokeRect(e.x-5,e.y-5,e.w+10,e.h+10);if(e.circuitDebt>0){ctx.fillStyle='#b6fbff';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText(`축적 +${Math.round(e.circuitDebt)}`,e.x+e.w/2,e.y-13);}}
 }
 if(p.leverage>0){ctx.strokeStyle=p.leverage<2?'#ff8269':'#ffc56a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x+p.w/2,p.y+p.h/2,35,-Math.PI/2,-Math.PI/2+Math.PI*2*p.leverage/8);ctx.stroke();ctx.fillStyle='#ffce88';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText(`${p.leverage.toFixed(1)}s · ${Math.min(100,Math.round(Math.max(p.leverageDamage/160,p.leverageKills/2)*100))}%`,p.x+p.w/2,p.y-15);}
 for(const f of g.effects){const a=f.life/f.max;ctx.globalAlpha=a;
  if(f.type==='impact'){const r=(f.strong?27:16)*(1.4-a);ctx.strokeStyle=f.strong?'#ffe6a0':'#fff3d9';ctx.lineWidth=f.strong?4:2;for(let i=0;i<4;i++){const angle=i*Math.PI/2+Math.PI/4;ctx.beginPath();ctx.moveTo(f.x+Math.cos(angle)*4,f.y+Math.sin(angle)*4);ctx.lineTo(f.x+Math.cos(angle)*r,f.y+Math.sin(angle)*r);ctx.stroke();}}
  if(f.type==='halt-ring'||f.type==='lever-ring'){ctx.strokeStyle=f.type==='halt-ring'?'#9debf2':'#ffae68';ctx.lineWidth=3;ctx.beginPath();ctx.arc(f.x,f.y,reducedMotion?50:30+(1-a)*120,0,Math.PI*2);ctx.stroke();}
  if(f.type==='profit'){ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.facing,1);for(let i=0;i<5;i++){const x=30+i*28,y=25-i*15;ctx.fillStyle='#ffe3a1';ctx.fillRect(x,y-35,3,65);ctx.fillStyle=i%2?'#fff6da':'#efb852';ctx.fillRect(x-5,y-16,13,30);}ctx.restore();}
 }
 ctx.restore();
}
