import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const host=document.getElementById('v8-viewer');
if(host){
const hint=document.getElementById('viewer-hint'),explodeBtn=document.getElementById('explode-btn'),explodeSlider=document.getElementById('explode-slider'),resetBtn=document.getElementById('reset-btn');
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.001,100),renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;host.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff,0x3b4742,2.4));const key=new THREE.DirectionalLight(0xffffff,3.1);key.position.set(3,5,4);scene.add(key);const fill=new THREE.DirectionalLight(0xdde9ff,1.6);fill.position.set(-4,2,-3);scene.add(fill);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.autoRotate=true;controls.autoRotateSpeed=.8;controls.target.set(0,0,0);
let parts=[],exploded=false,maxDim=1,defaultCamera=new THREE.Vector3();
/* Explicit exploded destinations in GLB-local coordinates.
   Because the whole GLB is rotated -90deg around X for display:
   local +Z = visible UP, local -Z = visible DOWN,
   local +/-Y = bank/outward direction, local +/-X = crank/front-rear axis. */
function explicitOffset(name,p){
  const n=name.toLowerCase();
  const bank=p.y>=0?1:-1;
  const axial=p.x>=0?1:-1;
  const v=new THREE.Vector3(0,0,0);

  if(n.includes('engine block')) return v.set(0,0,0);
  if(n.includes('air filter')) return v.set(0,0,1.55);
  if(n.includes('intake manifold')) return v.set(0,0,1.15);
  if(n.includes('cam cover')||n.includes('valve cover')) return v.set(0,bank*.10,.88);
  if(n.includes('cylinder head')) return v.set(0,bank*.14,.66);
  if(n.includes('sparkplug')) return v.set(0,bank*.20,.94);
  if(n.includes('piston cap')) return v.set(0,bank*.16,.46);
  if(n.includes('piston ring')) return v.set(0,bank*.16,.50);
  if(n.includes('connecting rod')) return v.set(0,bank*.12,.34);
  if(n.includes('connecting pin')) return v.set(0,bank*.12,.40);
  if(n.includes('piston')) return v.set(0,bank*.15,.44);
  if(n.includes('exhaust')) return v.set(0,bank*.95,.06);
  if(n.includes('camshaft')) return v.set(axial*.92,0,.08);
  if(n.includes('crankshaft')) return v.set(axial*.74,0,-.12);
  if(n.includes('cam gear')) return v.set(axial*.62,0,.05);
  if(n.includes('crank gear')) return v.set(axial*.58,0,-.05);
  if(n.includes('bushing')) return v.set(axial*.48,0,-.04);
  if(n.includes('oil pan')) return v.set(0,0,-.82);
  if(n.includes('filter')) return v.set(0,0,-1.00);

  /* Unnamed/other hardware stays near its subsystem instead of flying outward. */
  return v.set(0,bank*.05,.24);
}
new GLTFLoader().load('/V8%20engine.glb',gltf=>{const wrapper=new THREE.Group();wrapper.rotation.x=-Math.PI/2;wrapper.add(gltf.scene);scene.add(wrapper);wrapper.updateMatrixWorld(true);let box=new THREE.Box3().setFromObject(wrapper);const center=box.getCenter(new THREE.Vector3());wrapper.position.sub(center);wrapper.updateMatrixWorld(true);box=new THREE.Box3().setFromObject(wrapper);const size=box.getSize(new THREE.Vector3());maxDim=Math.max(size.x,size.y,size.z);camera.near=maxDim/500;camera.far=maxDim*30;camera.updateProjectionMatrix();defaultCamera.set(maxDim*1.45,maxDim*.9,maxDim*1.45);camera.position.copy(defaultCamera);controls.minDistance=maxDim*.45;controls.maxDistance=maxDim*7;controls.update();const engineRoot=gltf.scene.getObjectByName('V8 engine')||gltf.scene.children[0]||gltf.scene;engineRoot.updateMatrixWorld(true);const rootBox=new THREE.Box3().setFromObject(engineRoot),rootCenterWorld=rootBox.getCenter(new THREE.Vector3()),rootCenter=engineRoot.worldToLocal(rootCenterWorld.clone());const candidates=engineRoot.children.length>1?engineRoot.children:gltf.scene.children;parts=candidates.map(part=>{const pbox=new THREE.Box3().setFromObject(part),wc=pbox.getCenter(new THREE.Vector3()),lc=engineRoot.worldToLocal(wc.clone()).sub(rootCenter),offset=explicitOffset(part.name||'',lc);return{obj:part,base:part.position.clone(),offset,target:part.position.clone()}});hint.textContent=`Drag to rotate · scroll to zoom · ${parts.length} groups`},undefined,()=>hint.textContent='3D model failed to load');
function setExplosion(){if(!parts.length)return;const t=exploded?Number(explodeSlider.value)/100:0;for(const p of parts)p.target.copy(p.base).addScaledVector(p.offset,maxDim*t);explodeBtn.classList.toggle('active',exploded);explodeBtn.textContent=exploded?'Assemble':'Explode'}
explodeBtn.onclick=()=>{exploded=!exploded;setExplosion()};explodeSlider.oninput=()=>{if(exploded)setExplosion()};resetBtn.onclick=()=>{exploded=false;setExplosion();camera.position.copy(defaultCamera);controls.target.set(0,0,0);controls.autoRotate=true;controls.update()};renderer.domElement.addEventListener('pointerdown',()=>controls.autoRotate=false,{passive:true});
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(host);resize();(function animate(){requestAnimationFrame(animate);for(const p of parts)p.obj.position.lerp(p.target,.085);controls.update();renderer.render(scene,camera)})();}
