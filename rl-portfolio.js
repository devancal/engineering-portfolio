(() => {
  const rlCard = `
  <article class="project-card" data-category="code" data-added-project="rl">
    <a class="project-visual code-visual rl-visual" href="#project-rl" aria-label="Reinforcement learning agents project">
      <span class="visual-id">07 / REINFORCEMENT LEARNING</span>
      <div class="rl-art" aria-hidden="true"><div class="rl-path">
        <span><b>01</b> CONTROL<small>CartPole</small></span>
        <span><b>02</b> LANDING<small>LunarLander</small></span>
        <span><b>03</b> NAVIGATION<small>Maze</small></span>
        <span><b>04</b> DECISIONS<small>Blackjack</small></span>
        <span><b>05</b> ADVERSARIAL<small>Tic-Tac-Toe</small></span>
        <span><b>06</b> EXPANDED<small>Blackjack 2.0</small></span>
        <span class="rl-racer"><b>07</b> RACING<small>Racer</small></span>
      </div></div>
      <span class="placeholder-label"><span aria-hidden="true">◈</span> Seven-project RL learning progression</span>
    </a>
    <div class="project-copy"><div class="project-topline"><span class="eyebrow">PYTHON / REINFORCEMENT LEARNING</span><span>IN PROGRESS</span></div>
      <h3><a href="#project-rl">Reinforcement Learning<br>Agents</a></h3>
      <p>A seven-project learning progression spanning control, navigation, decision-making, adversarial play, and increasingly complex autonomous racing.</p>
      <div class="tags"><span>Python</span><span>Q-Learning</span><span>Reinforcement Learning</span></div>
      <a class="text-link" href="#project-rl">Inside the project <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;

  const rlDetail = `<div class="detail-inner"><div class="detail-kicker"><span>07 / REINFORCEMENT LEARNING</span><span>IN PROGRESS</span></div><h2 id="detail-title">Reinforcement Learning Agents</h2><p class="detail-lead">A sequence of projects I’m using to learn reinforcement learning through progressively different problems, from basic control and navigation to game decisions and autonomous racing.</p><dl class="detail-meta"><div><dt>CONTEXT</dt><dd>Personal learning series</dd></div><div><dt>TOOLS</dt><dd>Python · Gymnasium · Q-Learning · RL</dd></div><div><dt>FOCUS</dt><dd>Control · decisions · learning · iteration</dd></div></dl><div class="rl-detail-flow"><div><strong>01</strong><span>CartPole</span></div><i>→</i><div><strong>02</strong><span>LunarLander</span></div><i>→</i><div><strong>03</strong><span>Maze</span></div><i>→</i><div><strong>04</strong><span>Blackjack</span></div><i>→</i><div><strong>05</strong><span>Tic-Tac-Toe</span></div><i>→</i><div><strong>06</strong><span>Blackjack 2.0</span></div><i>→</i><div class="featured"><strong>07</strong><span>Racer</span></div></div><div class="detail-grid"><div><h3>Foundations & decisions</h3><div class="rl-stage-list"><div><strong>01 · CartPole</strong><span>COMPLETED</span><p>Tabular Q-learning with a discretized state space. Across 10 evaluation runs, the trained policy averaged <b>461.0 steps</b>, with a best of 500 and worst of 260.</p></div><div><strong>02 · LunarLander</strong><span>LEARNING SERIES</span><p>A more involved control environment used to work with a larger observation space, multiple actions, and reward-driven landing behavior.</p></div><div><strong>03 · Maze Navigation</strong><span>LEARNING SERIES</span><p>Navigation and exploration: learning useful movement through an environment where route selection and progress matter.</p></div><div><strong>04 · Blackjack</strong><span>COMPLETED / ITERATING</span><p>A decision-making agent for hit-or-stand blackjack. Evaluation against an optimal-policy reference gives a measurable way to inspect disagreements instead of judging the policy only by reward.</p></div></div></div><div><h3>Expanding the problems</h3><div class="rl-stage-list"><div><strong>05 · Tic-Tac-Toe</strong><span>UP NEXT</span><p>Adds an adversarial environment where the quality of an action depends on another agent’s response rather than only the environment itself.</p></div><div><strong>06 · Blackjack 2.0</strong><span>PLANNED</span><p>Expands the blackjack problem beyond hit and stand by adding actions and rules such as splitting and doubling down, creating a larger decision space.</p></div><div class="rl-stage-feature"><strong>07 · Autonomous Racing Agent</strong><span>LONG-TERM PROJECT</span><p>The capstone of the progression. The goal is to apply what I learn from the smaller agents to vehicle sensing, steering, throttle and braking behavior, reward design, training stability, and eventually more capable autonomous racing.</p></div></div></div></div><div class="detail-note"><h3>WHY ONE PROJECT SERIES?</h3><p>These are intentionally presented together rather than as seven separate portfolio projects. The smaller environments document the learning path; the racing agent is the larger application I’m building toward. As each stage is completed, I’ll replace status text with actual evaluation results, training visuals, and agent footage.</p></div><div class="detail-nav"><a href="#work">← All selected work</a><a href="#about">Background & contact →</a></div></div>`;

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
