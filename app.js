// All project content is rendered at build time. JavaScript enhances it only.
const legacy=location.hash.slice(1);
if(/^project-(v8|solidworks|pump|python|pine|rl|code)$/.test(legacy)) location.replace('/projects/'+legacy);
if(legacy==='resume') location.replace('/Calabrese_Devan_Resume.pdf');
const filters=[...document.querySelectorAll('[data-filter]')];
filters.forEach(button=>button.addEventListener('click',()=>{
 filters.forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 let count=0;document.querySelectorAll('.project-card').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++;});
 document.querySelector('#filter-count').textContent=`${count} ${count===1?'entry':'entries'}`;
}));
const tabs=[...document.querySelectorAll('[role="tab"]')];
function activate(tab){tabs.forEach(t=>{const on=t===tab;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!on;});}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',event=>{const key=event.key;if(!['ArrowLeft','ArrowRight','Home','End'].includes(key))return;event.preventDefault();const next=key==='Home'?0:key==='End'?tabs.length-1:(i+(key==='ArrowRight'?1:tabs.length-1))%tabs.length;activate(tabs[next]);tabs[next].focus();});});
document.querySelector('#copy-email')?.addEventListener('click',async()=>{const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText('Calabrese.90@osu.edu');status.textContent='Email copied.';}catch{status.textContent='Select and copy Calabrese.90@osu.edu, or use the email link.';}});
let viewerModule;
document.querySelectorAll('[data-viewer]').forEach(button=>button.addEventListener('click',async()=>{
 const kind=button.dataset.viewer;button.disabled=true;button.textContent='Loading interactive model…';
 try{
  if(kind==='pump'){
   await import('https://ajax.googleapis.com/ajax/libs/model-viewer/4.1.0/model-viewer.min.js');
   const model=document.querySelector('model-viewer');model.addEventListener('error',()=>{model.hidden=true;button.hidden=false;button.disabled=false;button.textContent='Model unavailable — retry';},{once:true});
   model.src=model.dataset.src;model.hidden=false;button.hidden=true;
  }else{
   viewerModule??=import('/viewer-live.js');const module=await viewerModule;
   button.closest('.v8-canvas').querySelector('.live-controls').hidden=false;
   await (kind==='onshape'?module.initOnshape():module.initSolidWorks());button.remove();
  }
 }catch(error){viewerModule=undefined;button.disabled=false;button.textContent='3D unavailable — retry';const host=button.closest('.v8-canvas');if(host)host.querySelector('.live-controls').hidden=true;}
}));
