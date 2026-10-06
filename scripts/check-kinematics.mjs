import fs from 'node:fs';
import assert from 'node:assert/strict';
import {motion,peaks} from '../kinematics-math.js';
const reference=JSON.parse(fs.readFileSync('scripts/kinematics-reference.json','utf8'));
for(const row of reference){const actual=motion(row.angle,3000);for(const key of ['displacement','velocity','acceleration'])assert(Math.abs(actual[key]-row[key])<1e-8,`${row.angle}° ${key}`);assert(Math.abs(Math.hypot(actual.crankX,actual.position-actual.crankY)-250)<1e-10);}
for(const rpm of [1000,3000,6000,8000]){
 const p=peaks(rpm),base=peaks(3000);assert(Math.abs(p.speed/base.speed-rpm/3000)<1e-10);assert(Math.abs(p.acceleration/base.acceleration-(rpm/3000)**2)<1e-10);
 for(const angle of [15,45,90,135,180,270,345]){
  const dt=1e-7,delta=rpm*6*dt,center=motion(angle,rpm),before=motion(angle-delta,rpm),after=motion(angle+delta,rpm);
  assert(Math.abs((after.displacement-before.displacement)/1000/(2*dt)-center.velocity)<1e-5);
  assert(Math.abs((after.velocity-before.velocity)/(2*dt)-center.acceleration)<1e-4);
 }
}
assert.equal(motion(0,3000).displacement,0);assert.equal(motion(180,3000).displacement,80);
const page=fs.readFileSync('projects/project-v8.html','utf8');assert(page.includes('id="kinematics"'));assert(page.includes('src="/kinematics-view.js"'));assert(!page.includes('{{'));assert(!fs.existsSync('projects/project-python.html'));
console.log(`PASS: ${reference.length} Python samples match to 1e-8, fixed rod length, TDC/BDC, independent numerical derivatives and RPM scaling at 1,000–8,000 RPM.`);
