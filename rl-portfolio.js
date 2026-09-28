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
    <div class="project-copy"><div class="project-topline"><span class="eyebrow">PYTHON / REINFORCEMENT LEARNING</span><span>ONGOING SERIES</span></div>
      <h3><a href="#project-rl">Reinforcement Learning<br>Agents</a></h3>
      <p>A seven-project learning progression that increases environment complexity from tabular control and stochastic decisions to self-play and autonomous racing.</p>
      <div class="tags"><span>Python</span><span>Q-Learning</span><span>Monte Carlo RL</span></div>
      <a class="text-link" href="#project-rl">Inside the project <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;

  const rlDetail = `<div class="detail-inner"><div class="detail-kicker"><span>07 / REINFORCEMENT LEARNING</span><span>ONGOING SERIES</span></div><h2 id="detail-title">Reinforcement Learning Agents</h2><p class="detail-lead">A sequence of projects I’m using to learn reinforcement learning by progressively increasing the complexity of the environment—from tabular control and stochastic decision-making to adversarial learning and autonomous racing.</p><dl class="detail-meta"><div><dt>CONTEXT</dt><dd>Personal learning series</dd></div><div><dt>TOOLS</dt><dd>Python · Gymnasium · Q-Learning · Monte Carlo RL</dd></div><div><dt>FOCUS</dt><dd>Control · decision-making · self-play · autonomous systems</dd></div><div><dt>DEVELOPMENT</dt><dd>AI-assisted Python implementation · experiment design · training · evaluation · iteration</dd></div></dl><div class="rl-detail-flow"><div><strong>01</strong><span>CartPole</span></div><i>→</i><div><strong>02</strong><span>LunarLander</span></div><i>→</i><div><strong>03</strong><span>Maze</span></div><i>→</i><div><strong>04</strong><span>Blackjack</span></div><i>→</i><div><strong>05</strong><span>Tic-Tac-Toe</span></div><i>→</i><div><strong>06</strong><span>Blackjack 2.0</span></div><i>→</i><div class="featured"><strong>07</strong><span>Racer</span></div></div><div class="detail-grid"><div><h3>Foundations & decisions</h3><div class="rl-stage-list"><div><strong>01 · CartPole</strong><span>COMPLETED</span><p>Used tabular Q-learning with a discretized continuous state space to learn the fundamentals of state representation, exploration, training, and policy evaluation. Across 10 evaluation runs, the trained policy averaged <b>461/500 steps</b>, with a best of 500 and worst of 260.</p></div><div><strong>02 · LunarLander</strong><span>EXPLORATION</span><p>Introduced a larger continuous observation space, four discrete actions, and more complex reward signals as a step beyond tabular control.</p></div><div><strong>03 · Maze Navigation</strong><span>EXPLORATION</span><p>Explored navigation and reward-driven movement where the agent must learn useful routes through an environment rather than simply stabilize a system.</p></div><div><strong>04 · Blackjack</strong><span>COMPLETED</span><p>Trained and evaluated a Q-learning agent to learn hit-or-stand blackjack strategy. Over <b>1,000,000 evaluation hands</b>, the learned policy achieved an average reward of <b>−0.0515</b>, compared with <b>−0.0481</b> for the optimal reference policy, capturing <b>99.0% of the improvement from random to optimal play</b>.</p></div></div></div><div><h3>Adversarial & expanded decision-making</h3><div class="rl-stage-list"><div><strong>05 · Tic-Tac-Toe</strong><span>COMPLETED</span><p>Trained and evaluated separate Q-learning agents for both sides before experimenting with self-play. Exhaustive policy audits found <b>no legal sequence of opponent moves capable of defeating either final agent</b>; the X policy’s encountered decisions were <b>100% minimax-optimal</b>.</p></div><div><strong>06 · Blackjack 2.0</strong><span>COMPLETED</span><p>Expanded the environment to include <b>hit, stand, double down, and split</b>, substantially increasing the action and state space. Experimented with Q-learning and Monte Carlo learning, including training across <b>10 million simulated rounds</b> and learning a policy across <b>620 represented states</b> without hard-coding a basic-strategy chart.</p></div><div class="rl-stage-feature"><strong>07 · Autonomous Racing Agent</strong><span>IN DEVELOPMENT</span><p>The capstone of the series. I’m applying lessons from the smaller environments to vehicle sensing, steering, throttle and braking, reward design, exploration, and generalization. The long-term goal is an agent capable of learning increasingly realistic racing behavior rather than following a hard-coded racing line.</p></div></div></div></div><div class="detail-note"><h3>WHY ONE PROJECT SERIES?</h3><p>Each environment introduces a different reinforcement-learning challenge: <b>state discretization, stochastic outcomes, navigation, adversarial decisions, expanded action spaces, self-play, and continuous vehicle control.</b> I use the smaller agents to isolate and understand these concepts before applying them to the larger autonomous-racing project.</p><p><strong>Development note:</strong> I use AI heavily for Python implementation and syntax while I focus on understanding the reinforcement-learning concepts, deciding what to test, running and evaluating training, diagnosing agent behavior, and iterating on the approach. This series is a learning project, not a claim that I independently authored every algorithm from scratch.</p></div><div class="detail-nav"><a href="#work">← All selected work</a><a href="#about">Background & contact →</a></div></div>`;

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
