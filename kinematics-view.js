import {motion,peaks,plot,number} from './kinematics-math.js';
const root=document.querySelector('[data-kinematics]');
if(root){
 const get=id=>document.getElementById(id),rpmInput=get('kin-rpm'),angleInput=get('kin-angle'),play=get('kin-play');
 let rpm=3000,angle=45,playing=false,visible=true,last=0,frameId=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function draw(){
  const m=motion(angle,rpm),x=135+m.crankX,y=370-m.crankY,py=370-m.position;
  for(const [id,attrs] of Object.entries({'crank-line':{x2:x,y2:y},'rod-line':{x1:x,y1:y,y2:py},'crank-pin':{cx:x,cy:y},'piston-pin':{cy:py},'piston-body':{y:py-22.5}}))for(const [a,v]of Object.entries(attrs))get(id).setAttribute(a,v);
  angleInput.value=angle;get('kin-angle-value').textContent=number(angle,1)+'°';
  get('kin-displacement').textContent=number(m.displacement)+' mm';get('kin-velocity').textContent=number(m.velocity)+' m/s';get('kin-acceleration').textContent=number(m.acceleration)+' m/s²';
  root.querySelectorAll('[data-cursor]').forEach(line=>{line.setAttribute('x1',62+angle/360*426);line.setAttribute('x2',62+angle/360*426);});
 }
 function updateRPM(){rpm=Number(rpmInput.value);const p=peaks(rpm);get('kin-rpm-value').textContent=number(rpm,0)+' RPM';get('kin-peak-speed').textContent=number(p.speed)+' m/s';get('kin-peak-acceleration').textContent=number(p.acceleration)+' m/s²';get('kin-plots').innerHTML=['displacement','velocity','acceleration'].map(key=>plot(key,rpm)).join('');draw();}
 function frame(time){frameId=0;if(!playing||!visible||document.hidden){last=0;return;}if(last)angle=(angle+Math.min((time-last)/1000,.1)*rpm*6/100)%360;last=time;draw();frameId=requestAnimationFrame(frame);}
 function schedule(){if(playing&&visible&&!document.hidden&&!frameId){last=0;frameId=requestAnimationFrame(frame);}}
 function pause(){playing=false;cancelAnimationFrame(frameId);frameId=0;last=0;play.textContent='Play mechanism';play.setAttribute('aria-pressed','false');}
 play.addEventListener('click',()=>{if(playing)pause();else{playing=true;play.textContent='Pause mechanism';play.setAttribute('aria-pressed','true');schedule();}});
 angleInput.addEventListener('input',()=>{pause();angle=Number(angleInput.value);draw();});rpmInput.addEventListener('input',updateRPM);
 document.addEventListener('visibilitychange',schedule);
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();}).observe(root);
 reduced.addEventListener('change',e=>{if(e.matches)pause();});
 [rpmInput,angleInput,play].forEach(el=>el.disabled=false);play.setAttribute('aria-pressed','false');updateRPM();
 // Start paused so users can read the mechanism. Playback always requires intent.
}
