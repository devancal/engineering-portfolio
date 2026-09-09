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

// SolidWorks V8: cleaned web animation GLB, separate from the Onshape project.
const motionHost=document.getElementById('solidworks-v8-viewer');
if(motionHost){
  const hint=document.getElementById('motion-viewer-hint'),playBtn=document.getElementById('motion-play-btn'),resetBtn=document.getElementById('motion-reset-btn');
  let running=false;
  const mv=document.createElement('model-viewer');
  mv.src='/Assem1MotionWeb.glb';
  mv.setAttribute('camera-controls','');
  mv.setAttribute('shadow-intensity','1');
  mv.setAttribute('exposure','1.05');
  mv.setAttribute('interaction-prompt','auto');
  mv.setAttribute('orientation','0deg 0deg 0deg');
  mv.setAttribute('camera-orbit','auto auto 120%');
  mv.setAttribute('alt','Interactive SolidWorks V8 Motion Study');
  mv.style.position='absolute';mv.style.inset='0';mv.style.width='100%';mv.style.height='100%';mv.style.background='#e4e8de';
  motionHost.prepend(mv);

  mv.addEventListener('load',()=>{
    const animations=mv.availableAnimations||[];
    if(animations.length){mv.animationName=animations[0];hint.textContent='SolidWorks Motion Study · ready to run';playBtn.disabled=false;}
    else{hint.textContent='Interactive SolidWorks CAD · no embedded motion found';playBtn.disabled=true;}
  });
  mv.addEventListener('error',()=>{hint.textContent='SolidWorks model failed to load';playBtn.disabled=true;});

  playBtn.onclick=()=>{
    if(playBtn.disabled)return;
    running=!running;
    if(running){mv.play();playBtn.textContent='Pause';playBtn.classList.add('active');}
    else{mv.pause();playBtn.textContent='Play';playBtn.classList.remove('active');}
  };
  resetBtn.onclick=()=>{
    running=false;mv.pause();mv.currentTime=0;playBtn.textContent='Play';playBtn.classList.remove('active');
    mv.cameraOrbit='auto auto 120%';mv.jumpCameraToGoal?.();
  };
}
