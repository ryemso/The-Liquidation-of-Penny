// Only physical walls grant traversal; scenery and one-way ledges never do.
export function wallSide(body,platforms){
 if(body.grounded)return 0;
 for(const wall of platforms){
  if(!wall.solid||wall.climbable===false||body.y+body.h<=wall.y+3||body.y>=wall.y+wall.h-3)continue;
  if(Math.abs(body.x+body.w-wall.x)<=2)return 1;
  if(Math.abs(body.x-wall.x-wall.w)<=2)return -1;
 }
 return 0;
}
export function verticalCamera(current,body,top,dt){
 const look=Math.max(-65,Math.min(140,body.vy*.18));
 const focus=body.y+body.h/2+look,screen=focus-current;
 let target=current;
 if(screen<220)target=focus-220;
 if(screen>440)target=focus-440;
 target=Math.max(top-70,Math.min(0,target));
 return Math.max(top-70,Math.min(0,current+(target-current)*(1-Math.exp(-9*dt))));
}
