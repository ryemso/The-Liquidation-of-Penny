export function terrainFor(spec,index){
 if(['shop','boss'].includes(spec.kind))return {walls:[],traps:[],ledges:[],extra:[]};
 const offset=index%3*35,walls=[{x:520+offset,y:540,w:64,h:80,solid:true},{x:spec.width-670,y:508,w:72,h:112,solid:true}];
 const ledges=[{x:380+offset,y:470,w:150,h:18},{x:spec.width-820,y:414,w:150,h:18}];
 const traps=[{id:'spikes-1',type:'spikes',x:760+offset,y:606,w:72,h:14},{id:'mine-1',type:'mine',x:spec.width-470,y:610,w:24,h:10,armed:false,spent:false,timer:0}];
 if(spec.chapter>1)traps.push({id:'spikes-2',type:'spikes',x:spec.width-950,y:606,w:84,h:14});
 const extra=[[spec.chapter===1?'rubble':'shield',320,620],['ghost',spec.width*.52,360],['drone',spec.width-330,400]].slice(0,spec.chapter===1?2:3);
 extra.push(['ghost',spec.width*.68,350]);
 // Three ascending branch layouts; gaps remain available for drop shortcuts.
 const variant=index%3;
 for(let i=0;i<4;i++)ledges.unshift({x:260+i*(spec.width-650)/4+variant*24,y:[390,290,350,250][(i+variant)%4],w:145,h:18});
 const count=spec.kind==='elite'?6:5;
 for(let i=0;i<count;i++){let x=420+i*(spec.width-760)/(count-1);if(i%2===0)for(const wall of walls)if(x+40>wall.x&&x<wall.x+wall.w)x=wall.x+wall.w+32;extra.push([i%2?'ghost':(spec.chapter===1?'rubble':'shield'),x,i%2?310:620]);}
 return {walls,traps,ledges,extra};
}
export function collideWalls(body,oldX,oldY,walls){
 for(const w of walls){
  const vertical=oldY<w.y+w.h&&oldY+body.h>w.y;
  if(vertical&&oldX+body.w<=w.x&&body.x+body.w>w.x){body.x=w.x-body.w;body.vx=0;}
  else if(vertical&&oldX>=w.x+w.w&&body.x<w.x+w.w){body.x=w.x+w.w;body.vx=0;}
  if(body.x<w.x+w.w&&body.x+body.w>w.x&&body.vy<0&&oldY>=w.y+w.h&&body.y<w.y+w.h){body.y=w.y+w.h;body.vy=0;}
 }
}
