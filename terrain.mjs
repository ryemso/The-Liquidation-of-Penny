export function terrainFor(spec,index){
 if(['shop','boss'].includes(spec.kind))return {walls:[],traps:[],ledges:[],extra:[]};
 const offset=index%3*35,walls=[{x:520+offset,y:540,w:64,h:80,solid:true},{x:spec.width-670,y:508,w:72,h:112,solid:true}];
 const ledges=[{x:380+offset,y:470,w:150,h:18},{x:spec.width-820,y:414,w:150,h:18}];
 const traps=[{id:'spikes-1',type:'spikes',x:760+offset,y:606,w:72,h:14},{id:'mine-1',type:'mine',x:spec.width-470,y:610,w:24,h:10,armed:false,spent:false,timer:0}];
 if(spec.chapter>1)traps.push({id:'spikes-2',type:'spikes',x:spec.width-950,y:606,w:84,h:14});
 const extra=[[spec.chapter===1?'rubble':'shield',320,620],['ghost',spec.width*.52,360],['drone',spec.width-330,400]].slice(0,spec.chapter===1?2:3);
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
