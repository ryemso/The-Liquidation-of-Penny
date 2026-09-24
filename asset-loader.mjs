// Share in-flight requests and bound transient failures without reloading the game.
export function createImageLoader({ImageClass=globalThis.Image,timeoutMs=15000,retries=1}={}){
 const cache=new Map();
 return function load(path){
  if(cache.has(path))return cache.get(path);
  const attempt=()=>new Promise((resolve,reject)=>{
   const image=new ImageClass();let timer;
   const finish=(error)=>{clearTimeout(timer);image.onload=null;image.onerror=null;error?reject(error):resolve(image);};
   timer=setTimeout(()=>finish(new Error(`Image timeout: ${path}`)),timeoutMs);
   image.onload=()=>finish();image.onerror=()=>finish(new Error(`Image load failed: ${path}`));image.src=path;
  });
  const request=(async()=>{for(let n=0;;n++){try{return await attempt();}catch(error){if(n>=retries)throw error;}}})();
  cache.set(path,request);request.catch(()=>cache.delete(path));return request;
 };
}
