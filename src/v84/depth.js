// Approved v84 motion, with React lifecycle cleanup.
export function mountDepth(root) {
 const abort = new AbortController();
 const document = { addEventListener: (type, fn) => root.addEventListener(type, fn, {signal:abort.signal}) };
 const window = { addEventListener: (type, fn) => globalThis.window.addEventListener(type, fn, {signal:abort.signal}) };
 const $$ = selector => [...root.querySelectorAll(selector)];
 // Pointer-led depth on image planes and all enabled boxed action buttons.
const depthAllowed=()=>matchMedia('(hover: hover) and (pointer: fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
let depthFrame=0,depthPending=null;
function depthAngles(x,y,strength){return {x:(.5-Math.max(0,Math.min(1,y)))*strength*2,y:(Math.max(0,Math.min(1,x))-.5)*strength*2};}
function resetDepth(card){const plane=card.matches('.depth-button,.btn')?card:card.querySelector('.depth-plane,.product-image');if(plane){plane.style.removeProperty('--depth-x');plane.style.removeProperty('--depth-y');plane.style.removeProperty('--light-x');plane.style.removeProperty('--light-y');}if(depthPending?.card===card)depthPending=null;}
document.addEventListener('pointermove',e=>{if(!depthAllowed())return;const card=e.target.closest('.world-card,.product-card,.btn:not(:disabled),.depth-button:not(:disabled)');if(!card)return;const plane=card.matches('.depth-button,.btn')?card:card.querySelector('.depth-plane,.product-image');if(!plane)return;const box=plane.getBoundingClientRect();if(!box.width||!box.height)return;const x=Math.max(0,Math.min(1,(e.clientX-box.left)/box.width)),y=Math.max(0,Math.min(1,(e.clientY-box.top)/box.height));depthPending={card,plane,x,y};if(depthFrame)return;depthFrame=requestAnimationFrame(()=>{depthFrame=0;const p=depthPending;if(!p||!p.plane.isConnected)return;const angle=depthAngles(p.x,p.y,p.card.classList.contains('world-card')?1.6:3);p.plane.style.setProperty('--depth-x',angle.x.toFixed(2)+'deg');p.plane.style.setProperty('--depth-y',angle.y.toFixed(2)+'deg');p.plane.style.setProperty('--light-x',(p.x*100).toFixed(1)+'%');p.plane.style.setProperty('--light-y',(p.y*100).toFixed(1)+'%');});});
document.addEventListener('pointerout',e=>{const card=e.target.closest('.world-card,.product-card,.btn:not(:disabled),.depth-button:not(:disabled)');if(card&&!card.contains(e.relatedTarget))resetDepth(card);});
window.addEventListener('blur',()=>$$('.world-card,.product-card,.btn:not(:disabled),.depth-button:not(:disabled)').forEach(resetDepth));


 return () => { abort.abort(); cancelAnimationFrame(depthFrame); $$('.world-card,.product-card,.btn,.depth-button').forEach(resetDepth); };
}
