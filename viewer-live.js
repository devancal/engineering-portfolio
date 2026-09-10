import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

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

  function setExplosion(){
    const t=exploded?Number(explodeSlider.value)/100:0;
    explodeBtn.classList.toggle('active',exploded);explodeBtn.textContent=exploded?'Assemble':'Explode';
    for(const p of parts)p.target.copy(p.offset).multiplyScalar(t);
  }

  new GLTFLoader().load('/Assem1MotionWebFixed-Colored.glb',gltf=>{
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
