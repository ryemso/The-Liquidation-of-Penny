// One looping track for the early chapters. Playback starts from a user gesture,
// survives room changes, and pauses with the game or a hidden document.
export class StageMusic {
 constructor({src='./degraded-signal.mp3',createAudio=url=>new Audio(url),onBlocked=()=>{},onError=()=>{}}={}) {
  this.track=createAudio(src);this.track.loop=true;this.track.preload='metadata';
  this.enabled=true;this.volume=.3;this.scene='title';this.chapter=1;this.visible=true;
  this.playing=false;this.pending=null;this.blocked=false;this.targetVolume=0;
  this.onBlocked=onBlocked;this.onError=onError;this.track.volume=0;
  this.track.addEventListener('error',()=>{this.playing=false;this.onError();});
 }
 get eligible(){return this.enabled&&this.visible&&this.chapter<=2&&['playing','reward','shop','chapter'].includes(this.scene);}
 setScene(scene,chapter=1,visible=true){const changed=this.scene!==scene||this.chapter!==chapter||this.visible!==visible;this.scene=scene;this.chapter=chapter;this.visible=visible;if(changed)this.sync();}
 setEnabled(enabled){this.enabled=Boolean(enabled);this.blocked=false;this.sync();}
 setVolume(volume){this.volume=Math.max(0,Math.min(1,Number(volume)||0));this.sync();}
 restart(){this.track.currentTime=0;this.blocked=false;}
 sync(){
  this.targetVolume=this.eligible?this.volume*(['shop','reward','chapter'].includes(this.scene)?.5:1):0;
  if(!this.eligible){this.track.pause();this.playing=false;return;}
  if(this.playing||this.pending||this.blocked)return;
  try {
   this.pending=Promise.resolve(this.track.play()).then(()=>{
    if(!this.eligible){this.track.pause();this.playing=false;}else this.playing=true;
   }).catch(error=>{this.playing=false;this.blocked=true;if(error?.name==='NotAllowedError')this.onBlocked();else this.onError();}).finally(()=>{this.pending=null;});
  } catch(error) {this.blocked=true;this.onError();}
 }
 resumeFromGesture(){this.blocked=false;this.sync();}
 update(dt){const v=this.track.volume,t=this.targetVolume;this.track.volume=Math.max(0,Math.min(1,v+(t-v)*Math.min(1,dt*6)));}
}
