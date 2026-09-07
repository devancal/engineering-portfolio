import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const host=document.getElementById('v8-viewer');
if(host){
  const hint=document.getElementById('viewer-hint');
  const explodeBtn=document.getElementById('explode-btn');
  const explodeSlider=document.getElementById('explode-slider');
  const resetBtn=document.getElementById('reset-btn');

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,.001,100);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.12;
  host.prepend(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff,0x3b4742,2.4));
  const key=new THREE.DirectionalLight(0xffffff,3.1);key.position.set(3,5,4);scene.add(key);
  const fill=new THREE.DirectionalLight(0xdde9ff,1.6);fill.position.set(-4,2,-3);scene.add(fill);

  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;
  controls.dampingFactor=.07;
  controls.autoRotate=true;
  controls.autoRotateSpeed=.8;
  controls.target.set(0,0,0);

  let parts=[];
  let exploded=false;
  let maxDim=1;
  const defaultCamera=new THREE.Vector3();

  function cleanName(obj){
    return (obj.name||'').toLowerCase().replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();
  }

  function teardownOffset(obj){
    const n=cleanName(obj);
    const p=obj.position;
    const bank=p.y>=0?1:-1;
    const v=new THREE.Vector3();

    if(n.includes('engine block')) return v.set(0,0,0);
    if(n.includes('air filter')) return v.set(0,0,1.55);
    if(n.includes('intake manifold')) return v.set(0,0,1.15);
    if(n.includes('cam cover')) return v.set(0,bank*.60,1.18);
    if(n.includes('cylinder head')) return v.set(0,bank*.46,.88);
    if(n.includes('exhaust')) return v.set(0,bank*1.25,.18);
    if(n.includes('sparkplug')) return v.set(0,bank*.66,1.02);
    if(n.includes('piston ring')) return v.set(0,bank*.54,.82);
    if(n.includes('piston cap')) return v.set(0,bank*.50,.69);
    if(n.includes('connecting pin')) return v.set(0,bank*.43,.54);
    if(n.includes('connecting rod')) return v.set(0,bank*.36,.38);
    if(n.includes('camshaft')) return v.set(p.x>-0.3?1.12:-1.12,bank*.24,.48);
    if(n.includes('cam gear')) return v.set(1.38,bank*.28,.53);
    if(n.includes('crankshaft bushing')) return v.set(p.x>-0.3?1.02:-1.02,0,-.10);
    if(n.includes('crankshaft')) return v.set(-1.25,0,-.08);
    if(n.includes('crank gear')) return v.set(1.28,0,-.03);
    if(n.includes('oil pan')) return v.set(0,0,-1.02);
    return v.set(0,bank*.18,.25);
  }

  function isOccurrence(obj){
    return cleanName(obj).startsWith('occurrence of ');
  }

  new GLTFLoader().load('/V8%20engine.glb',gltf=>{
    const wrapper=new THREE.Group();
    wrapper.rotation.x=-Math.PI/2;
    wrapper.add(gltf.scene);
    scene.add(wrapper);

    wrapper.updateMatrixWorld(true);
    let box=new THREE.Box3().setFromObject(wrapper);
    const center=box.getCenter(new THREE.Vector3());
    wrapper.position.sub(center);
    wrapper.updateMatrixWorld(true);
    box=new THREE.Box3().setFromObject(wrapper);
    const size=box.getSize(new THREE.Vector3());
    maxDim=Math.max(size.x,size.y,size.z);

    camera.near=maxDim/500;
    camera.far=maxDim*40;
    camera.updateProjectionMatrix();
    defaultCamera.set(maxDim*1.45,maxDim*.9,maxDim*1.45);
    camera.position.copy(defaultCamera);
    controls.minDistance=maxDim*.45;
    controls.maxDistance=maxDim*9;
    controls.update();

    const engineRoot=gltf.scene.getObjectByName('V8 engine')||gltf.scene.children[0]||gltf.scene;
    const occurrenceNodes=[];

    // The exported GLB has 62 direct children under V8 engine. 61 are actual
    // occurrence wrappers. The remaining piston assembly contains 5 more
    // occurrence wrappers. Target those wrappers directly so repeated meshes
    // remain independent and nothing is guessed from recursive name matching.
    for(const child of engineRoot.children){
      if(isOccurrence(child)){
        occurrenceNodes.push(child);
      }else{
        for(const nested of child.children||[]){
          if(isOccurrence(nested)) occurrenceNodes.push(nested);
        }
      }
    }

    parts=occurrenceNodes.map(obj=>({
      obj,
      base:obj.position.clone(),
      offset:teardownOffset(obj).multiplyScalar(maxDim),
      target:obj.position.clone()
    }));

    hint.textContent=`Drag to rotate · scroll to zoom · ${parts.length} controllable components`;
  },undefined,()=>{
    hint.textContent='3D model failed to load';
  });

  function setExplosion(){
    const t=exploded?Number(explodeSlider.value)/100:0;
    explodeBtn.classList.toggle('active',exploded);
    explodeBtn.textContent=exploded?'Assemble':'Explode';
    for(const p of parts) p.target.copy(p.base).addScaledVector(p.offset,t);
  }

  explodeBtn.onclick=()=>{exploded=!exploded;setExplosion()};
  explodeSlider.oninput=()=>{if(exploded)setExplosion()};
  resetBtn.onclick=()=>{
    exploded=false;
    setExplosion();
    camera.position.copy(defaultCamera);
    controls.target.set(0,0,0);
    controls.autoRotate=true;
    controls.update();
  };
  renderer.domElement.addEventListener('pointerdown',()=>controls.autoRotate=false,{passive:true});

  function resize(){
    const w=host.clientWidth,h=host.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);
  resize();

  (function animate(){
    requestAnimationFrame(animate);
    for(const p of parts) p.obj.position.lerp(p.target,.085);
    controls.update();
    renderer.render(scene,camera);
  })();
}
