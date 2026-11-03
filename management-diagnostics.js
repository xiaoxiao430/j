'use strict';
/* A short management reading, followed by traceable, scoped project arrangements. */
(() => {
  const cache=new Map(),pending=new Set(),errors=new Map();
  const list=x=>Array.isArray(x)?x:[],safe=x=>esc(x==null?'':String(x));
  let source=null,sourceReady=false;
  const who=()=>state.actor||state.data?.actor?.id||'';
  const query=scope=>({campus:scope?.campus||'',department:scope?.department||'',period:'2026-fall'});
  const key=scope=>[who(),scope?.campus||'',scope?.department||''].join('|');
  function get(scope={}){
    const k=key(scope);if(cache.has(k))return cache.get(k);
    if(source&&window.HouwaiDiagnostics){try{const value=window.HouwaiDiagnostics.analyze(source,query(scope));cache.set(k,value);return value;}catch(e){errors.set(k,e.message);return null;}}
    if(typeof publicData!=='undefined'&&!sourceReady)return null;
    if(pending.has(k)||errors.has(k))return null;
    pending.add(k);const actor=who();
    request('/management-diagnostics?'+new URLSearchParams(query(scope))).then(value=>{if(actor===who())cache.set(k,value);}).catch(e=>{if(actor===who())errors.set(k,e.message);}).finally(()=>{pending.delete(k);if(actor===who())render();});return null;
  }
  function factText(f){if(typeof f==='string')return f;if(f.text)return [f.label,f.text].filter(Boolean).join(' ');return [f.label,f.value!=null?f.value:'',f.target!=null?' / '+f.target:'',f.unit||''].join('');}
  function projectTable(d){
    const insights=list(d.insights),projects=list(d.projects),rows=insights.map(i=>({i,p:projects.find(p=>p.id===i.id||list(i.project_ids).includes(p.id))||{}}));
    return `<div class="md-project-table-wrap"><table class="md-project-table"><thead><tr>${['学科与项目','当前 / 本阶段目标','要交付什么','谁负责 / 何时完成','学校给什么支持','下次看什么'].map(t=>`<th>${t}</th>`).join('')}</tr></thead><tbody>${rows.map(({i,p})=>{const a=i.action||{};return `<tr data-md-project-row="${safe(i.id)}"><td><strong>${safe(a.title||p.title||i.headline)}</strong><small>${safe([i.campus||p.campus,i.department||p.department,i.subject||p.subject].filter(Boolean).join(' · '))}</small></td><td data-label="当前 / 目标">${list(i.facts).map(f=>`<span>${safe(factText(f))}</span>`).join('')}${i.why?`<p class="md-focus">${safe(i.why)}</p>`:''}<b>${safe(a.target||'')}</b></td><td data-label="要交付什么">${list(a.deliverables).map(t=>`<span>${safe(t)}</span>`).join('')}</td><td data-label="负责人 / 完成时间"><strong>${safe(a.owner_role||p.owner_role)}</strong><time>${safe(a.due_date||p.due_date)}</time></td><td data-label="学校支持">${list(a.support).map(t=>`<span>${safe(t)}</span>`).join('')}</td><td data-label="下次看什么"><strong>${safe(a.review_metric)}</strong>${list(i.source_refs).length?`<details class="md-records"><summary>参考哪些记录</summary>${list(i.source_refs).map(r=>/^https:\/\//.test(r.url||'')?`<a href="${safe(r.url)}" target="_blank" rel="noopener noreferrer">${safe(r.title||r.id)} ↗</a>`:`<small>${safe(r.title||r.id)}</small>`).join('')}</details>`:''}</td></tr>`;}).join('')}</tbody></table></div>`;
  }
  function html(scope={},options={}){
    const d=get(scope),id='md-'+(options.context||'overview')+'-'+key(scope).replace(/[^\w\u4e00-\u9fff]/g,'-');
    if(!d)return `<section class="md-panel md-loading" data-md-scope="${safe(key(scope))}" role="status">${safe(errors.get(key(scope))||'正在整理学科进展与培养重点…')}</section>`;
    const insights=list(d.insights).slice(0,3);
    return `<section class="md-panel ${options.compact?'is-compact':''}" data-md-scope="${safe(key(scope))}"><header class="md-heading"><div><span class="md-kicker">本阶段管理重点</span><h2>学科进展与培养重点</h2></div><span class="md-demo">${safe(d.notice||'演示研判 · 按示例项目进度生成')}</span></header>${options.showSummary?`<p class="md-summary">${safe(d.summary)}</p>`:''}<div class="md-priorities">${insights.map((i,index)=>`<article class="md-priority md-tone-${index}"><div class="md-priority-meta"><b>${safe(i.subject||'培养')}</b><span>${safe([i.campus,i.department].filter(Boolean).join(' · '))}</span></div><h3>${safe(i.headline)}</h3><p class="md-gap">${safe(list(i.facts).slice(0,2).map(factText).join('；'))}</p><button type="button" data-md-open="${safe(i.id)}" data-md-target="${safe(id)}" aria-controls="${safe(id)}"><span>${safe(i.action?.title||'查看本阶段安排')}</span><b aria-hidden="true">↗</b></button></article>`).join('')}</div><details class="md-projects" id="${safe(id)}" data-v8-detail="management-projects-${safe(options.context||'overview')}"><summary><span>项目交付与培养安排</span><b>${insights.length}项重点 · 负责人、期限、成果</b></summary>${projectTable(d)}</details></section>`;
  }
  const defaultPrinciples=[
    {title:'教学看首次学会',text:'首次独立作业按“90%学生答对90%有效题目”判断；覆盖与待补课次一起看，复测另列。'},
    {title:'评价只抓两个核心',text:'教育教学质量达到目标，再结合学期家长满意度：优秀98%以上，良好95%以上。'},
    {title:'专业短评，人工确认',text:'教研组看教学，年级组看家校；学部校长确认后发布，教师可以回应或申请复核。'},
    {title:'新培养教师有具体成果',text:'本学期新纳入45人，占任教教师4.5%；逐人明确导师、共备时间与学期成果，按期复评。'}
  ];
  function principlesHTML(scope={}){const d=get(scope),rows=list(d?.principles).length?d.principles:defaultPrinciples;return `<section class="md-principles"><header><h3>评价与培养原则</h3><span>演示参考，可按试点结果调整</span></header><div>${rows.slice(0,4).map((p,i)=>`<article><b><em>${String(i+1).padStart(2,'0')}</em>${safe(p.title)}</b><p>${safe(p.text)}</p></article>`).join('')}</div></section>`;}
  document.addEventListener('click',e=>{const button=e.target.closest('[data-md-open]');if(!button)return;e.preventDefault();e.stopImmediatePropagation();const target=document.getElementById(button.dataset.mdTarget);if(!target)return;target.open=true;const rows=[...target.querySelectorAll('[data-md-project-row]')];rows.forEach(r=>r.classList.toggle('md-selected',r.dataset.mdProjectRow===button.dataset.mdOpen));requestAnimationFrame(()=>{const row=rows.find(r=>r.dataset.mdProjectRow===button.dataset.mdOpen);(row||target).scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});});},true);
  window.HouwaiDiagnosticsView={html,get,principlesHTML,cache};
  if(typeof publicData!=='undefined')Promise.resolve(publicData).then(d=>{source=d.management_diagnostics_source||null;sourceReady=true;cache.clear();errors.clear();if(state.data)render();}).catch(()=>{sourceReady=true;});
})();
