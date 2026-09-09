import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const host=document.getElementById('v8-viewer');
if(host){
  const hint=document.getElementById('viewer-hint');
  const playBtn=document.getElementById('play-btn');
  const explodeBtn=document.getElementById('explode-btn');
  const explodeSlider=document.getElementById('explode-slider');
  const resetBtn=document.getElementById('reset-btn');
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,.001,100);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2)); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.12; host.prepend(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xffffff,0x3b4742,2.4)); const key=new THREE.DirectionalLight(0xffffff,3.1);key.position.set(3,5,4);scene.add(key); const fill=new THREE.DirectionalLight(0xdde9ff,1.6);fill.position.set(-4,2,-3);scene.add(fill);
  const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true; controls.dampingFactor=.07; controls.autoRotate=true; controls.autoRotateSpeed=.8;
  let mixer=null,action=null,running=false,maxDim=1,model=null; const clock=new THREE.Clock(); const defaultCamera=new THREE.Vector3();

  new GLTFLoader().load('/Assem1.glb',gltf=>{
    model=new THREE.Group(); model.rotation.x=-Math.PI/2; model.add(gltf.scene); scene.add(model); model.updateMatrixWorld(true);
    let box=new THREE.Box3().setFromObject(model); const center=box.getCenter(new THREE.Vector3()); model.position.sub(center); model.updateMatrixWorld(true); box=new THREE.Box3().setFromObject(model); const size=box.getSize(new THREE.Vector3()); maxDim=Math.max(size.x,size.y,size.z);
    camera.near=maxDim/500; camera.far=maxDim*40; camera.updateProjectionMatrix(); defaultCamera.set(maxDim*1.45,maxDim*.9,maxDim*1.45); camera.position.copy(defaultCamera); controls.minDistance=maxDim*.45; controls.maxDistance=maxDim*9; controls.target.set(0,0,0); controls.update();
    if(gltf.animations.length){ mixer=new THREE.AnimationMixer(gltf.scene); action=mixer.clipAction(gltf.animations[0]); action.setLoop(THREE.LoopRepeat,Infinity); action.play(); action.paused=true; hint.textContent='Drag to rotate · scroll to zoom · Motion Study ready'; }
    else { playBtn.disabled=true; hint.textContent='Interactive CAD · no embedded motion found'; }
    // Motion-study transforms and manual exploded transforms target many of the same nodes.
    // Keep explode unavailable while this animated SolidWorks study is active rather than corrupting the authored motion.
    explodeBtn.disabled=true; explodeSlider.disabled=true; explodeBtn.title='Exploded view tuning coming next';
  },undefined,()=>{ hint.textContent='3D model failed to load'; playBtn.disabled=true; });

  playBtn.onclick=()=>{ if(!action)return; running=!running; action.paused=!running; playBtn.textContent=running?'Pause':'Play'; playBtn.classList.toggle('active',running); if(running) controls.autoRotate=false; };
  resetBtn.onclick=()=>{ if(action){running=false;action.paused=true;action.reset().play();action.paused=true;playBtn.textContent='Play';playBtn.classList.remove('active');mixer.update(0);} camera.position.copy(defaultCamera);controls.target.set(0,0,0);controls.autoRotate=true;controls.update(); };
  renderer.domElement.addEventListener('pointerdown',()=>controls.autoRotate=false,{passive:true});
  function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();} new ResizeObserver(resize).observe(host);resize();
  (function animate(){requestAnimationFrame(animate);const dt=clock.getDelta();if(mixer&&running)mixer.update(dt);controls.update();renderer.render(scene,camera);})();
}
