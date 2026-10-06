import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
const pages=['index.html',...fs.readdirSync('projects').filter(n=>n.endsWith('.html')).map(n=>'projects/'+n)];
for(const file of pages){
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`${file}: one h1`);
 assert.match(html,/<meta name="description"/);assert.match(html,/<link rel="canonical"/);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,`${file}: unique ids`);
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=m[1];if(url.startsWith('#')){assert(ids.includes(url.slice(1)),`${file}: ${url}`);continue;}
  if(!url.startsWith('/'))continue;
  const [path,hash]=decodeURIComponent(url).split('#');const base=path==='/'?'index.html':path.slice(1);
  const actual=fs.existsSync(base)?base:base+'.html';assert(fs.existsSync(actual),`${file}: missing ${url}`);
  if(hash)assert(fs.readFileSync(actual,'utf8').includes(`id="${hash}"`),`${file}: missing anchor ${url}`);
 }
}
const home=fs.readFileSync('index.html','utf8');assert.equal((home.match(/<article /g)||[]).length,6);assert(!home.includes('src="/viewer-live.js"'));assert(!home.includes('src="https://ajax.googleapis.com'));
for(const file of ['app.js','viewer-live.js','scripts/build.mjs'])execFileSync(process.execPath,['--check',file]);
// Exercise actual filter and legacy routing code without fetching browser dependencies.
const buttons=['all','mechanical','code'].map(filter=>({dataset:{filter},classList:{toggle(){}},setAttribute(){},addEventListener(_,fn){this.click=fn;}}));
const cards=['mechanical','mechanical','mechanical','code','code','code'].map(category=>({dataset:{category}}));const count={};let redirected;
const document={querySelectorAll(selector){return selector==='[data-filter]'?buttons:selector==='.project-card'?cards:[];},querySelector(selector){return selector==='#filter-count'?count:null;}};
vm.runInNewContext(fs.readFileSync('app.js','utf8'),{window:{},document,location:{hash:'#project-rl',replace(url){redirected=url;}}});
assert.equal(redirected,'/projects/project-rl');buttons[1].click();assert.equal(count.textContent,'3 entries');assert.equal(cards.filter(c=>!c.hidden).length,3);buttons[2].click();assert.equal(count.textContent,'3 entries');buttons[0].click();assert.equal(count.textContent,'6 entries');
console.log(`PASS: ${pages.length} pages, local links/assets, anchors, metadata, syntax, filters, and legacy routing. Browser layout/WebGL QA remains unverified.`);

const numbers=[...home.matchAll(/class="visual-id"[^>]*>(\d+) \//g)].map(m=>m[1]);assert.deepEqual(numbers,['01','02','03','04','05','06']);assert(!home.includes('project-code'));assert(!home.includes('class="load-cad"'));
