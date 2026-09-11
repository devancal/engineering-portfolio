import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

// Hero: broad engineering identity study instead of duplicating a project render.
const heroStage=document.querySelector('.hero-engine-stage');
if(heroStage){
  heroStage.innerHTML=`<div class="identity-study" aria-hidden="true">
    <svg viewBox="0 0 520 340" role="img" aria-label="Mechanical design and computation study">
      <g fill="none" stroke="currentColor" stroke-width="1">
        <circle cx="260" cy="166" r="76" opacity=".72"/><circle cx="260" cy="166" r="52" opacity=".35"/><circle cx="260" cy="166" r="15" opacity=".8"/>
        <path d="M260 90v-24M260 266v-24M184 166h-25M361 166h-25M206 112l-18-18M314 220l18 18M314 112l18-18M206 220l-18 18" opacity=".55"/>
        <path d="M260 90l17 13 21-4 10 20 21 6-1 22 16 19-16 18 1 23-21 6-10 20-21-4-17 13-17-13-21 4-10-20-21-6 1-23-16-18 16-19-1-22 21-6 10-20 21 4z" opacity=".82"/>
        <path d="M242 151l18-11 18 11v30l-18 11-18-11z" opacity=".9"/>
        <path d="M260 140v52M242 151l36 30M278 151l-36 30" opacity=".35"/>
        <path d="M56 95h104M56 95v46M56 141h78" opacity=".48"/><path d="M360 88h104M386 88v43M386 131h78" opacity=".48"/>
        <path d="M57 254h114M57 254v-47M57 207h74" opacity=".48"/><path d="M352 257h112M464 257v-48M390 209h74" opacity=".48"/>
        <path d="M113 95l74 48M407 88l-77 54M113 254l75-52M408 257l-77-55" stroke-dasharray="4 5" opacity=".42"/>
        <circle cx="187" cy="143" r="3" fill="currentColor"/><circle cx="330" cy="142" r="3" fill="currentColor"/><circle cx="188" cy="202" r="3" fill="currentColor"/><circle cx="331" cy="202" r="3" fill="currentColor"/>
      </g>
      <g fill="currentColor" font-family="monospace" font-size="9" letter-spacing="1.2">
        <text x="56" y="80">PARAMETRIC CAD</text><text x="56" y="153" opacity=".55">PART → ASSEMBLY</text>
        <text x="360" y="73">MECHANICAL SYSTEMS</text><text x="386" y="143" opacity=".55">MOTION / FIT</text>
        <text x="57" y="276">ENGINEERING COMPUTATION</text><text x="57" y="198" opacity=".55">PYTHON / JS</text>
        <text x="352" y="278">ITERATE + BUILD</text><text x="390" y="200" opacity=".55">DESIGN → REFINE</text>
      </g>
      <g fill="currentColor" font-family="monospace" text-anchor="middle"><text x="260" y="308" font-size="8" letter-spacing="2" opacity=".55">DESIGN · MOTION · COMPUTATION</text></g>
    </svg>
  </div>`;
  const heroArt=heroStage.closest('.hero-art');
  if(heroArt){
    const top=heroArt.querySelector('.art-topline span:first-child');if(top)top.textContent='ENGINEERING STUDIES';
    const link=heroArt.querySelector('.art-project');if(link){link.href='#work';const copy=link.querySelector('span:first-child');if(copy)copy.innerHTML='<small>DESIGN APPROACH</small>Mechanical design + computation';}
    const note=heroArt.querySelector('.art-disclaimer');if(note)note.textContent='CAD · MECHANICAL SYSTEMS · CODE · ITERATION';
  }
  const style=document.createElement('style');style.textContent=`
    .identity-study{position:absolute;inset:42px 10px 0;display:grid;place-items:center;color:#c5d2c8}
    .identity-study svg{width:100%;height:100%;max-height:310px;overflow:visible}
    .identity-study:before{content:'+';position:absolute;left:50%;top:48%;transform:translate(-50%,-50%);font:12px var(--mono);color:#bc382a;z-index:2}
    .identity-study:after{content:'SYSTEM / 001';position:absolute;right:19px;bottom:14px;font:6px var(--mono);letter-spacing:1.4px;color:#7f9588}
    @media(max-width:720px){.identity-study{inset:42px 0 0}.identity-study svg{max-height:280px}}
  `;document.head.appendChild(style);
}

function makeBaseViewer(host){
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,.001,100);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;host.prepend(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xffffff,0x3b4742,2.4));
  const key=new THREE.DirectionalLight(0xffffff,3.1);key.position.set(3,5,4);scene.add(key);
  const fill=new THREE.DirectionalLight(0xdde9ff,1.6);fill.position.set(-4,2,-3);scene.add(fill);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.autoRotate=true;controls.autoRotateSpeed=.8;
  const defaultCamera=new THREE.Vector3();
  function frame(model){model.updateMatrixWorld(true);let box=new THREE.Box3().setFromObject(model);const center=box.getCenter(new THREE.Vector3());model.position.sub(center);model.updateMatrixWorld(true);box=new THREE.Box3().setFromObject(model);const size=box.getSize(new THREE.Vector3());const maxDim=Math.max(size.x,size.y,size.z);camera.near=maxDim/500;camera.far=maxDim*40;camera.updateProjectionMatrix();defaultCamera.set(maxDim*1.45,maxDim*.9,maxDim*1.45);camera.position.copy(defaultCamera);controls.minDistance=maxDim*.45;controls.maxDistance=maxDim*9;controls.target.set(0,0,0);controls.update();return maxDim;}
  function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);resize();
  renderer.domElement.addEventListener('pointerdown',()=>controls.autoRotate=false,{passive:true});
  return {scene,camera,renderer,controls,defaultCamera,frame};
}

// Original Onshape V8: preserve the accepted 66-component exploded viewer.
const host=document.getElementById('v8-viewer');
if(host){
  const hint=document.getElementById('viewer-hint'),explodeBtn=document.getElementById('explode-btn'),explodeSlider=document.getElementById('explode-slider'),resetBtn=document.getElementById('reset-btn');
  const V=makeBaseViewer(host);let parts=[],exploded=false,maxDim=1;
  const cleanName=o=>(o.name||'').toLowerCase().replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();
  const isOccurrence=o=>cleanName(o).startsWith('occurrence of ');
  function teardownOffset(obj){const n=cleanName(obj),p=obj.position,bank=p.y>=0?1:-1,v=new THREE.Vector3();if(n.includes('engine block'))return v;if(n.includes('air filter'))return v.set(0,0,1.55);if(n.includes('intake manifold'))return v.set(0,0,1.15);if(n.includes('cam cover'))return v.set(0,bank*.60,1.18);if(n.includes('cylinder head'))return v.set(0,bank*.46,.88);if(n.includes('exhaust'))return v.set(0,bank*1.25,.18);if(n.includes('sparkplug'))return v.set(0,bank*.66,1.02);if(n.includes('piston ring'))return v.set(0,bank*.54,.82);if(n.includes('piston cap'))return v.set(0,bank*.50,.69);if(n.includes('connecting pin'))return v.set(0,bank*.43,.54);if(n.includes('connecting rod'))return v.set(0,bank*.36,.38);if(n.includes('camshaft'))return v.set(p.x>-0.3?1.12:-1.12,bank*.24,.48);if(n.includes('cam gear'))return v.set(1.38,bank*.28,.53);if(n.includes('crankshaft bushing'))return v.set(p.x>-0.3?1.02:-1.02,0,-.10);if(n.includes('crankshaft'))return v.set(-1.25,0,-.08);if(n.includes('crank gear'))return v.set(1.28,0,-.03);if(n.includes('oil pan'))return v.set(0,0,-1.02);return v.set(0,bank*.18,.25);}
  new GLTFLoader().load('/V8%20engine.glb',gltf=>{const wrapper=new THREE.Group();wrapper.rotation.x=-Math.PI/2;wrapper.add(gltf.scene);V.scene.add(wrapper);maxDim=V.frame(wrapper);const engineRoot=gltf.scene.getObjectByName('V8 engine')||gltf.scene.children[0]||gltf.scene,occ=[];for(const child of engineRoot.children){if(isOccurrence(child))occ.push(child);else for(const nested of child.children||[])if(isOccurrence(nested))occ.push(nested);}parts=occ.map(obj=>({obj,base:obj.position.clone(),offset:teardownOffset(obj).multiplyScalar(maxDim),target:obj.position.clone()}));hint.textContent=`Drag to rotate · scroll to zoom · ${parts.length} controllable components`;},undefined,()=>hint.textContent='3D model failed to load');
  function setExplosion(){const t=exploded?Number(explodeSlider.value)/100:0;explodeBtn.classList.toggle('active',exploded);explodeBtn.textContent=exploded?'Assemble':'Explode';for(const p of parts)p.target.copy(p.base).addScaledVector(p.offset,t);}
  explodeBtn.onclick=()=>{exploded=!exploded;setExplosion()};explodeSlider.oninput=()=>{if(exploded)setExplosion()};resetBtn.onclick=()=>{exploded=false;setExplosion();V.camera.position.copy(V.defaultCamera);V.controls.target.set(0,0,0);V.controls.autoRotate=true;V.controls.update();};
  (function animate(){requestAnimationFrame(animate);for(const p of parts)p.obj.position.lerp(p.target,.085);V.controls.update();V.renderer.render(V.scene,V.camera);})();
}

// SolidWorks V8: repaired Motion Study with independent explode controls.
const motionHost=document.getElementById('solidworks-v8-viewer');
if(motionHost){
  const hint=document.getElementById('motion-viewer-hint');
  const controlsBar=motionHost.querySelector('.live-controls');
  const oldPlay=document.getElementById('motion-play-btn');
  const oldReset=document.getElementById('motion-reset-btn');
  if(oldPlay)oldPlay.remove();if(oldReset)oldReset.remove();
  const playBtn=document.createElement('button');playBtn.type='button';playBtn.textContent='Play';
  const explodeBtn=document.createElement('button');explodeBtn.type='button';explodeBtn.textContent='Explode';
  const explodeSlider=document.createElement('input');explodeSlider.type='range';explodeSlider.min='0';explodeSlider.max='100';explodeSlider.value='55';explodeSlider.setAttribute('aria-label','SolidWorks explosion distance');
  const resetBtn=document.createElement('button');resetBtn.type='button';resetBtn.textContent='Reset';
  controlsBar?.append(playBtn,explodeBtn,explodeSlider,resetBtn);

  const V=makeBaseViewer(motionHost);
  const clock=new THREE.Clock();
  let mixer=null,action=null,running=false,exploded=false,maxDim=1,parts=[];

  function makeExplodeParts(root){
    root.updateMatrixWorld(true);
    const overall=new THREE.Box3().setFromObject(root);const center=overall.getCenter(new THREE.Vector3());
    const assembly=root.getObjectByName('Assem1')||root.children[0]||root;
    const candidates=[...assembly.children];
    return candidates.map((obj,i)=>{
      obj.updateMatrixWorld(true);
      const box=new THREE.Box3().setFromObject(obj);const c=box.getCenter(new THREE.Vector3());
      const dir=c.clone().sub(center);
      if(dir.lengthSq()<1e-8){const a=(i/candidates.length)*Math.PI*2;dir.set(Math.cos(a),Math.sin(a),((i%3)-1)*.25);}
      dir.normalize();
      const wrapper=new THREE.Group();wrapper.name=`explode-wrapper-${i}`;
      assembly.add(wrapper);wrapper.add(obj);
      return {wrapper,target:new THREE.Vector3(),offset:dir.multiplyScalar(maxDim*.72)};
    });
  }

  function ghostOuterShell(root){
    const targets=[
      {match:'engine block',opacity:.30},
      {match:'cylinder head',opacity:.34},
      {match:'cam cover',opacity:.26}
    ];
    root.traverse(obj=>{
      const n=(obj.name||'').toLowerCase().replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();
      const t=targets.find(x=>n.includes(x.match));
      if(!t)return;
      obj.traverse(child=>{
        if(!child.isMesh||!child.material)return;
        const mats=Array.isArray(child.material)?child.material:[child.material];
        const cloned=mats.map(m=>{
          const c=m.clone();
          c.transparent=true;c.opacity=t.opacity;c.depthWrite=false;c.side=THREE.DoubleSide;
          if('roughness' in c)c.roughness=.78;
          if('metalness' in c)c.metalness=0;
          if(c.color)c.color.lerp(new THREE.Color(0xeeeeea),.45);
          c.needsUpdate=true;
          return c;
        });
        child.material=Array.isArray(child.material)?cloned:cloned[0];
        child.renderOrder=2;
      });
    });
  }

  function setExplosion(){
    const t=exploded?Number(explodeSlider.value)/100:0;
    explodeBtn.classList.toggle('active',exploded);explodeBtn.textContent=exploded?'Assemble':'Explode';
    for(const p of parts)p.target.copy(p.offset).multiplyScalar(t);
  }

  new GLTFLoader().load('/Assem1MotionWebFixed-Final.glb',gltf=>{
    ghostOuterShell(gltf.scene);
    V.scene.add(gltf.scene);maxDim=V.frame(gltf.scene);
    parts=makeExplodeParts(gltf.scene);
    if(gltf.animations.length){mixer=new THREE.AnimationMixer(gltf.scene);action=mixer.clipAction(gltf.animations[0]);action.setLoop(THREE.LoopRepeat,Infinity);hint.textContent=`SolidWorks Motion Study · ${parts.length} expandable component groups`;}
    else{playBtn.disabled=true;hint.textContent='Interactive SolidWorks CAD · no embedded motion found';}
  },undefined,()=>{hint.textContent='SolidWorks model failed to load';playBtn.disabled=true;explodeBtn.disabled=true;});

  playBtn.onclick=()=>{if(!action)return;running=!running;if(running){action.paused=false;action.play();playBtn.textContent='Pause';playBtn.classList.add('active');}else{action.paused=true;playBtn.textContent='Play';playBtn.classList.remove('active');}};
  explodeBtn.onclick=()=>{exploded=!exploded;setExplosion();};
  explodeSlider.oninput=()=>{if(exploded)setExplosion();};
  resetBtn.onclick=()=>{running=false;exploded=false;if(action){action.stop();action.reset();}playBtn.textContent='Play';playBtn.classList.remove('active');setExplosion();V.camera.position.copy(V.defaultCamera);V.controls.target.set(0,0,0);V.controls.autoRotate=true;V.controls.update();};

  (function animate(){requestAnimationFrame(animate);const dt=clock.getDelta();if(mixer&&running)mixer.update(dt);for(const p of parts)p.wrapper.position.lerp(p.target,.085);V.controls.update();V.renderer.render(V.scene,V.camera);})();
}
