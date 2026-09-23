// Five locations, five compositions each. Backgrounds never affect collision.
export const LOCATIONS = [
 {id:'five-points',name:'파이브 포인츠',fog:'#201711',light:'#dab17a',rooms:['가스등 골목','세탁줄 뒷길','선술집 앞','낡은 공동주택','교차로 광장']},
 {id:'iron-city',name:'철과 벽돌의 도심',fog:'#102326',light:'#91bdb6',rooms:['고가철도 아래','창고 뒷길','주철 상가','화물 구역','철골 광장']},
 {id:'midtown',name:'유리 도심',fog:'#0a182d',light:'#79bddb',rooms:['지하철 입구','빌딩 협곡','심야 상가','서비스 통로','전광판 광장']},
 {id:'the-hole',name:'The Hole',fog:'#1a2420',light:'#a1b993',rooms:['가라앉은 거리','침수 골목','낮은 집들','철망 너머 공터','옹벽 아래']},
 {id:'wall-street',name:'월스트리트',fog:'#151b28',light:'#e1c58c',rooms:['금융가 입구','석조 빌딩 협곡','거래소 앞길','청동 황소 광장','시장의 문']}
];
export const locationFor = chapter => LOCATIONS[Math.max(0,Math.min(4,(chapter||1)-1))];
const VIEWS=[{zoom:1.12,x:0,y:.4,shade:0},{zoom:1.3,x:.8,y:.1,shade:.08},{zoom:1.2,x:.35,y:.8,shade:0},{zoom:1.38,x:.65,y:.3,shade:.14},{zoom:1.05,x:.5,y:.5,shade:.06}];
export function backgroundFrame(iw,ih,room,cam=0,cameraY=0){
 const view=VIEWS[Math.max(0,Math.min(4,(room||1)-1))];
 const scale=Math.max(1280/iw,720/ih)*view.zoom,w=iw*scale,h=ih*scale;
 const bound=(n,max)=>Math.max(0,Math.min(max,n));
 return {x:-bound((w-1280)*view.x+cam*.055,w-1280),y:-bound((h-720)*view.y+cameraY*.08,h-720),w,h,shade:view.shade};
}
export function drawLocation(ctx,images,spec,cam,time,cameraY=0){
 const theme=locationFor(spec.chapter),im=images[theme.id],room=spec.localRoom||1;
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.fillStyle=theme.fog;ctx.fillRect(0,0,1280,720);
 if(im){const f=backgroundFrame(im.width,im.height,room,cam,cameraY);ctx.drawImage(im,Math.floor(f.x),Math.floor(f.y),Math.ceil(f.w),Math.ceil(f.h));ctx.fillStyle=`rgba(3,8,15,${.12+f.shade})`;ctx.fillRect(0,0,1280,720);}
 const fog=ctx.createLinearGradient(0,380,0,720);fog.addColorStop(0,theme.fog+'00');fog.addColorStop(1,theme.fog+'e0');ctx.fillStyle=fog;ctx.fillRect(0,380,1280,340);
 // Atmospheric layers stay behind the entire playable world.
 ctx.fillStyle=theme.light+'30';
 for(let i=0;i<18;i++){const x=((i*137-cam*.12+time*3)%1320+1320)%1320,y=90+(i*73)%400;ctx.fillRect(x,y+Math.sin(time*.5+i)*5,2,2);}
 if(spec.chapter===4){ctx.fillStyle=theme.light+'18';for(let i=0;i<5;i++)ctx.fillRect(((i*311-cam*.1)%1450+1450)%1450-100,570+i*19,110+i*23,2);}
 ctx.restore();
}
