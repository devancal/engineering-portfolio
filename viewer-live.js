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
/* Engine is displayed by rotating the GLB -90deg about X. These vectors are GLB-local: local +Z is visible UP, local +/-Y is visible bank/outward, local +/-X is crank-axis/front-rear. The teardown is intentionally mostly vertical, matching the supplied reference. */
function teardownMotion(name,p){const n=name.toLowerCase(),bank=p.y>=0?1:-1,axial=p.x>=0?1:-1;let dir=new THREE.Vector3(0,0,1),scale=.72;
if(n.includes('engine block')){dir.set(0,0,0);scale=0}
else if(n.includes('oil pan')){dir.set(0,0,-1);scale=1.0}
else if(n.includes('air filter')){dir.set(0,0,1);scale=1.85}
else if(n.includes('intake manifold')){dir.set(0,0,1);scale=1.42}
else if(n.includes('cam cover')||n.includes('valve cover')){dir.set(0,bank*.12,.993);scale=1.30}
else if(n.includes('cylinder head')){dir.set(0,bank*.18,.984);scale=1.05}
else if(n.includes('sparkplug')){dir.set(0,bank*.28,.96);scale=1.38}
else if(n.includes('piston')||n.includes('connecting rod')||n.includes('connecting pin')){dir.set(0,bank*.22,.976);scale=.82}
else if(n.includes('exhaust')){dir.set(0,bank,0);scale=1.12}
else if(n.includes('camshaft')){dir.set(axial,0,0);scale=1.15}
else if(n.includes('crankshaft')||n.includes('bushing')||n.includes('cam gear')||n.includes('crank gear')){dir.set(axial,0,0);scale=.92}
else {dir.set(0,bank*.08,.997);scale=.62}
if(dir.lengthSq())dir.normalize();return{dir,scale}}
new GLTFLoader().load('/V8%20engine.glb',gltf=>{const wrapper=new THREE.Group();wrapper.rotation.x=-Math.PI/2;wrapper.add(gltf.scene);scene.add(wrapper);wrapper.updateMatrixWorld(true);let box=new THREE.Box3().setFromObject(wrapper);const center=box.getCenter(new THREE.Vector3());wrapper.position.sub(center);wrapper.updateMatrixWorld(true);box=new THREE.Box3().setFromObject(wrapper);const size=box.getSize(new THREE.Vector3());maxDim=Math.max(size.x,size.y,size.z);camera.near=maxDim/500;camera.far=maxDim*30;camera.updateProjectionMatrix();defaultCamera.set(maxDim*1.45,maxDim*.9,maxDim*1.45);camera.position.copy(defaultCamera);controls.minDistance=maxDim*.45;controls.maxDistance=maxDim*7;controls.update();const engineRoot=gltf.scene.getObjectByName('V8 engine')||gltf.scene.children[0]||gltf.scene;engineRoot.updateMatrixWorld(true);const rootBox=new THREE.Box3().setFromObject(engineRoot),rootCenterWorld=rootBox.getCenter(new THREE.Vector3()),rootCenter=engineRoot.worldToLocal(rootCenterWorld.clone());const candidates=engineRoot.children.length>1?engineRoot.children:gltf.scene.children;parts=candidates.map(part=>{const pbox=new THREE.Box3().setFromObject(part),wc=pbox.getCenter(new THREE.Vector3()),lc=engineRoot.worldToLocal(wc.clone()).sub(rootCenter),motion=teardownMotion(part.name||'',lc);return{obj:part,base:part.position.clone(),dir:motion.dir,scale:motion.scale,target:part.position.clone()}});hint.textContent=`Drag to rotate · scroll to zoom · ${parts.length} groups`},undefined,()=>hint.textContent='3D model failed to load');
function setExplosion(){if(!parts.length)return;const slider=Number(explodeSlider.value)/100,amount=exploded?maxDim*(.05+.34*slider):0;for(const p of parts)p.target.copy(p.base).addScaledVector(p.dir,amount*p.scale);explodeBtn.classList.toggle('active',exploded);explodeBtn.textContent=exploded?'Assemble':'Explode'}
explodeBtn.onclick=()=>{exploded=!exploded;setExplosion()};explodeSlider.oninput=()=>{if(exploded)setExplosion()};resetBtn.onclick=()=>{exploded=false;setExplosion();camera.position.copy(defaultCamera);controls.target.set(0,0,0);controls.autoRotate=true;controls.update()};renderer.domElement.addEventListener('pointerdown',()=>controls.autoRotate=false,{passive:true});
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(host);resize();(function animate(){requestAnimationFrame(animate);for(const p of parts)p.obj.position.lerp(p.target,.085);controls.update();renderer.render(scene,camera)})();}
