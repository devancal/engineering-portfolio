import fs from 'node:fs';
const origin='https://engineering-portfolio-nu.vercel.app';
const home=fs.readFileSync('content/home.html','utf8');
const projects=JSON.parse(fs.readFileSync('content/projects.json','utf8'));
const read=n=>fs.readFileSync(`content/${n}.html`,'utf8');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const plain=s=>s.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
const render=p=>`<div class="detail-inner"><div class="detail-kicker"><span>${p.k}</span><span>${p.d}</span></div><h2 id="detail-title">${p.t}</h2><p class="detail-lead">${p.lead}</p><dl class="detail-meta"><div><dt>CONTEXT</dt><dd>${p.role}</dd></div><div><dt>TOOLS</dt><dd>${p.tools}</dd></div><div><dt>FOCUS</dt><dd>${p.focus}</dd></div></dl><div class="detail-grid"><div><h3>Goal & challenge</h3>${p.left}</div><div><h3>Approach & engineering work</h3>${p.right}</div></div><div class="detail-note"><h3>ITERATION / TAKEAWAY</h3><p>${p.note}</p></div></div>`;
fs.mkdirSync('projects',{recursive:true});
fs.writeFileSync('index.html',home);
const details=Object.fromEntries(Object.entries(projects).map(([id,p])=>[id,render(p)]));details['project-rl']=read('rl-detail');details['project-code']=read('code-detail');
const assets={
 'project-v8':['/V8%20engine.glb','Download original Onshape model (23 MB)','Assembly close-up · exploded view · constraint detail'],
 'project-solidworks':['/Assem1MotionWebFixed-Final.glb','Download SolidWorks motion model (24 MB)','Motion recording · crankshaft correction · cam and gear mates'],
 'project-pump':['/Drawing%201.pdf','View the actual assembly drawing','Assembly drawing detail · mechanism layout · design decisions']
};
for(const [id,raw] of Object.entries(details)){
 const title=plain(raw.match(/<h2 id="detail-title">(.*?)<\/h2>/s)[1]);
 const description=plain(raw.match(/<p class="detail-lead">(.*?)<\/p>/s)[1]);
 let body=raw.replace('<h2 id="detail-title">','<h1 id="detail-title">').replace(title+'</h2>',title+'</h1>').replace(/href="#work"/g,'href="/#work"').replace(/href="#about"/g,'href="/#about"');
 body=body.replace(/<div class="detail-nav">[\s\S]*?<\/div>/g,'');
 if(assets[id]){const [url,label,needed]=assets[id];body=body.replace('<div class="detail-grid">',`<div class="evidence-links"><a class="button primary" href="${url}">${label} ↗</a><a class="text-link" href="/#work">Explore the interactive models →</a></div><div class="detail-grid">`);body=body.replace('<div class="detail-note">',`<div class="asset-slot"><strong>Project imagery to add</strong><p>${needed}. Actual files can be added here; no substitute renders are presented as project evidence.</p></div><div class="detail-note">`);}
 const head=home.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<title>.*?<\/title>/,`<title>${esc(title)} | Devan Calabrese</title>`).replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*"/g,`$1${esc(description)}"`).replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*"/g,`$1${esc(title)} | Devan Calabrese"`).replace(/(<link rel="canonical" href="|<meta property="og:url" content=")[^"]*"/g,`$1${origin}/projects/${id}"`);
 fs.writeFileSync(`projects/${id}.html`,`<!doctype html><html lang="en"><head>${head}</head><body class="project-page"><a class="skip-link" href="#main">Skip to content</a><header class="case-header"><a class="brand" href="/">dc / Devan Calabrese</a><nav aria-label="Project navigation"><a href="/#work">All projects</a><a href="/Calabrese_Devan_Resume.pdf">Résumé ↗</a></nav></header><main id="main">${body}<div class="case-footer"><a href="/#work">← All selected work</a><a href="mailto:Calabrese.90@osu.edu">Discuss this project ↗</a></div></main></body></html>\n`);
}
fs.writeFileSync('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['',...Object.keys(details).map(id=>'/projects/'+id)].map(path=>`<url><loc>${origin}${path||'/'}</loc></url>`).join('')}</urlset>\n`);
console.log(`Built homepage and ${Object.keys(details).length} standalone case studies.`);
// Publish only public assets; keep authoring files and tooling out of the output.
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist');
for(const file of ['index.html','app.js','styles.css','header-fix.css','rl-portfolio.css','portfolio.css','viewer-live.js','favicon.svg','engine-study.svg','pine-strategy-study.svg','e84bbd75-1098-4746-987f-7dbf7aabd58d.png','Calabrese_Devan_Resume.pdf','Drawing 1.pdf','V8 engine.glb','Assem1MotionWebFixed-Final.glb','Fully Complete Project Assembly.glb','robots.txt','sitemap.xml','google1a1b2bca8ef23566.html'])fs.copyFileSync(file,'dist/'+file);
for(const dir of ['assets','projects'])fs.cpSync(dir,'dist/'+dir,{recursive:true});
