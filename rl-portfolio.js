(() => {
  const rlCard = `
  <article class="project-card" data-category="code" data-added-project="rl">
    <a class="project-visual code-visual rl-visual" href="#project-rl" aria-label="Reinforcement learning agents project">
      <span class="visual-id">07 / REINFORCEMENT LEARNING</span>
      <div class="rl-art" aria-hidden="true"><div class="rl-path">
        <span><b>01</b> CONTROL<small>CartPole · trained</small></span><i>→</i>
        <span><b>02</b> LANDING<small>LunarLander · next</small></span><i>→</i>
        <span><b>03</b> NAVIGATION<small>Maze · planned</small></span><i>→</i>
        <span class="rl-racer"><b>04</b> RACING<small>Active development</small></span>
      </div></div>
      <span class="placeholder-label"><span aria-hidden="true">◈</span> Control → landing → navigation → racing</span>
    </a>
    <div class="project-copy"><div class="project-topline"><span class="eyebrow">PYTHON / REINFORCEMENT LEARNING</span><span>IN PROGRESS</span></div>
      <h3><a href="#project-rl">Reinforcement Learning<br>Agents</a></h3>
      <p>A progression of reinforcement-learning projects, starting with basic control and building toward an autonomous racing agent with increasingly complex observations, actions, and reward design.</p>
      <div class="tags"><span>Python</span><span>Q-Learning</span><span>Reinforcement Learning</span></div>
      <a class="text-link" href="#project-rl">Inside the project <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;

  const rlDetail = `<div class="detail-inner"><div class="detail-kicker"><span>07 / REINFORCEMENT LEARNING</span><span>IN PROGRESS</span></div><h2 id="detail-title">Reinforcement Learning Agents</h2><p class="detail-lead">A progression of reinforcement-learning projects built to learn increasingly complex control problems—from balancing a pole to developing an autonomous racing agent.</p><dl class="detail-meta"><div><dt>CONTEXT</dt><dd>Personal learning projects</dd></div><div><dt>TOOLS</dt><dd>Python · Gymnasium · Q-Learning · RL</dd></div><div><dt>FOCUS</dt><dd>Control · learning · reward design</dd></div></dl><div class="detail-grid"><div><h3>Progression</h3><p>I’m using a sequence of increasingly difficult environments to build practical reinforcement-learning experience rather than treating each exercise as an unrelated project.</p><div class="rl-stage-list"><div><strong>01 · CartPole</strong><span>TRAINED</span><p>Tabular Q-learning with a discretized state space. Across 10 evaluation runs, the trained policy averaged <b>461.0 steps</b>, reached the 500-step maximum in 7 runs, and recorded a best of 500 and worst of 260.</p></div><div><strong>02 · LunarLander</strong><span>NEXT</span><p>The next learning step: a more complex control problem with a larger observation space, multiple actions, and more involved reward shaping.</p></div></div></div><div><h3>Toward autonomous racing</h3><div class="rl-stage-list"><div><strong>03 · Maze Navigation</strong><span>PLANNED</span><p>A navigation project intended to practice exploration, route selection, and learning from sparse progress through an environment.</p></div><div class="rl-stage-feature"><strong>04 · Autonomous Racing Agent</strong><span>ACTIVE DEVELOPMENT</span><p>The long-term application project. I’m experimenting with vehicle observations and sensors, steering and throttle behavior, reward design, and training stability. The current agent is still under development, so unfinished behavior is shown as development rather than a completed result.</p></div></div></div></div><div class="detail-note"><h3>ITERATION / TAKEAWAY</h3><p>CartPole gives the series a completed baseline with measurable evaluation results. LunarLander and maze navigation are intermediate steps toward the larger racing problem, where I’m applying the same ideas to continuous movement, sensing, and more difficult reward design. I’ll replace the development states with actual results and visuals as each agent is completed.</p></div><div class="detail-nav"><a href="#work">← All selected work</a><a href="#about">Background & contact →</a></div></div>`;

  function replaceInternAI(){
    const grid=document.querySelector('.project-grid'); if(!grid)return;
    const intern=[...grid.querySelectorAll('.project-card')].find(card=>card.querySelector('a[href="#project-code"]'));
    if(intern) intern.outerHTML=rlCard;
    const codeSkill=[...document.querySelectorAll('.skill-row')].find(row=>row.querySelector('h3')?.textContent.includes('Code & analysis'));
    const small=codeSkill?.querySelector('small'); if(small) small.textContent='Engineering computation · reinforcement learning · quantitative analysis';
  }

  function updateCounts(){
    const cards=[...document.querySelectorAll('.project-card')];
    const all=document.querySelector('.filters button[data-filter="all"] span'); if(all)all.textContent=String(cards.length).padStart(2,'0');
    const count=document.querySelector('#filter-count'); if(count)count.textContent=`${cards.length} entries`;
  }

  function openRL(event){
    const link=event.target.closest('a[href="#project-rl"]'); if(!link)return;
    event.preventDefault();
    const dialog=document.querySelector('#detail-dialog'), detail=document.querySelector('#detail-content'); if(!dialog||!detail)return;
    detail.innerHTML=rlDetail; document.body.classList.add('modal-open');
    if(!dialog.open) dialog.showModal();
    history.replaceState(null,'','#project-rl');
  }

  function init(){replaceInternAI(); setTimeout(updateCounts,0); document.addEventListener('click',openRL,true);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
