// Code-native pixel scenery: palette follows each chapter's background treatment.
const palettes=[['#242630','#46434a','#817267','#bc9270'],['#192934','#334856','#6c858d','#b8b39a'],['#172737','#293e50','#557782','#65b9c1'],['#292a2c','#47473c','#827861','#c2a36e'],['#2b202d','#493143','#776174','#c78291']];
export function drawTerrain(ctx,terrain,chapter,time){
 const [dark,mid,edge,accent]=palettes[Math.min(4,Math.max(0,chapter-1))];
 const box=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
 ctx.save();
 for(const p of terrain.walls){

  box(p.x,p.y,p.w,p.h,dark);box(p.x+3,p.y+4,p.w-6,p.h-4,mid);
  for(let y=p.y+8;y<p.y+p.h-6;y+=20){box(p.x+5,y,p.w-10,2,dark);const seam=p.x+(Math.floor((y-p.y)/20)%2?20:42);box(seam,y+2,2,18,dark);}
  box(p.x-2,p.y,p.w+4,5,edge);box(p.x,p.y, p.w,2,accent);box(p.x+4,p.y+6,3,p.h-8,edge);box(p.x+p.w-7,p.y+6,3,p.h-8,dark);
  box(p.x+14,p.y+20,p.w-28,24,dark);box(p.x+17,p.y+23,p.w-34,2,edge);
  for(let i=0;i<3;i++)box(p.x+19+i*9,p.y+29,4,8,accent);
  for(const x of [p.x+7,p.x+p.w-10])for(const y of [p.y+8,p.y+p.h-10])box(x,y,2,2,accent);
  /*EDGE*/if(p.climbable!==false)for(const x of [p.x,p.x+p.w-2]){box(x,p.y+5,2,p.h-5,edge);for(let y=p.y+12;y<p.y+p.h;y+=18)box(x-1,y,4,3,accent);}
 }
 for(const t of terrain.traps){
  if(t.type==='spikes'){
   box(t.x-3,t.y+t.h-3,t.w+6,5,dark);box(t.x,t.y+t.h-2,t.w,2,edge);
   for(let x=t.x;x<t.x+t.w;x+=12){box(x+1,t.y+10,10,3,mid);box(x+3,t.y+6,6,5,edge);box(x+5,t.y+1,2,7,accent);box(x+7,t.y+8,2,4,dark);}
  }else if(t.spent){box(t.x-3,t.y+5,t.w+6,4,dark);box(t.x+5,t.y+4,3,2,edge);}
  else{
   box(t.x-2,t.y+4,t.w+4,6,dark);box(t.x,t.y+2,t.w,6,edge);box(t.x+3,t.y,t.w-6,7,mid);box(t.x+7,t.y-1,t.w-14,7,dark);
   box(t.x+10,t.y,4,3,t.armed&&Math.floor(time*12)%2?'#ff715a':accent);
   box(t.x+2,t.y+5,3,2,accent);box(t.x+t.w-5,t.y+5,3,2,accent);
   if(t.armed){ctx.strokeStyle='#f47662';ctx.setLineDash([5,5]);ctx.beginPath();ctx.ellipse(t.x+12,t.y,100,18,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
  }
 }
 ctx.restore();
}
