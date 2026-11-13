const PUBLIC_DEMO_VERSION = '20261114-performance-v22';
'use strict';
/* Public Pages adapter: read-only, fresh synthetic snapshots, no live backend. */
state.actor = 'group-all';
if (!location.hash || location.hash === '#') history.replaceState(null, '', '#group');
const publicVersion = typeof PUBLIC_DEMO_VERSION === 'undefined' ? '20261102-evidence-v2' : PUBLIC_DEMO_VERSION;
const publicJSONCache=new Map(),publicSectionPending=new Map(),publicResponseCache=new Map(),publicLegacyModels=new Map();
const publicPerf={jsonFetches:0,jsonCacheHits:0,requestCacheHits:0,legacyModelsBuilt:0};
function publicJSON(url){if(publicJSONCache.has(url)){publicPerf.jsonCacheHits++;return publicJSONCache.get(url);}publicPerf.jsonFetches++;const promise=fetch(url).then(r=>{if(!r.ok){const e=new Error('资料暂未读取，请重试。');e.status=r.status;throw e;}return r.json();}).catch(e=>{publicJSONCache.delete(url);throw e;});publicJSONCache.set(url,promise);if(publicJSONCache.size>48)publicJSONCache.delete(publicJSONCache.keys().next().value);return promise;}
const publicData=publicJSON('data/runtime/core.json?v='+encodeURIComponent(publicVersion)).catch(e=>{if(e.status===404)return publicJSON('data/index.json?v='+encodeURIComponent(publicVersion));throw e;});
async function publicDataSections(keys){const d=await publicData;await Promise.all(keys.map(async key=>{if(d[key]!==undefined)return;if(key==='platform_light'&&d.platform_source){d[key]=d.platform_source;return;}if(!publicSectionPending.has(key)){const url=d.__slices?.sections?.[key];if(!url)throw Error('该部分资料尚未收录。');publicSectionPending.set(key,publicJSON(url).then(v=>{d[key]=v;}).finally(()=>publicSectionPending.delete(key)));}await publicSectionPending.get(key);}));return d;}
const publicProfiles=new Map();
let publicCommitteePromise=null;
function publicCommitteeSource(){if(!publicCommitteePromise)publicCommitteePromise=publicJSON('data/committee-materials.json?v='+encodeURIComponent(publicVersion)).catch(e=>{publicCommitteePromise=null;throw e;});return publicCommitteePromise;}
const publicCopy=value=>JSON.parse(JSON.stringify(value));
window.HouwaiPerformance={stats:publicPerf,clear(){publicResponseCache.clear();publicProfiles.clear();publicLegacyModels.clear();}};
let publicStudentLearningPromise=null;
function publicStudentLearning(){
  if(!publicStudentLearningPromise)publicStudentLearningPromise=fetch('data/student-learning-demo.json?v='+encodeURIComponent(publicVersion)).then(r=>{
    if(!r.ok)throw new Error('学生学情样板暂未读取，请刷新重试。');
    return r.json();
  }).then(config=>{
    if(!window.HouwaiStudentLearningModel)throw new Error('学生学情模块暂未准备好。');
    return window.HouwaiStudentLearningModel.create(config);
  }).catch(error=>{publicStudentLearningPromise=null;throw error;});
  return publicStudentLearningPromise;
}
async function publicPersonSource(id){
 if(!/^(teacher-\d{3}|staff-\d{4})$/.test(id))throw Error('未找到该人员。');
 if(!publicProfiles.has(id))publicProfiles.set(id,publicJSON(`data/people/${id}.json?v=${encodeURIComponent(publicVersion)}`).catch(e=>{publicProfiles.delete(id);throw e;}));
 if(publicProfiles.size>24)publicProfiles.delete(publicProfiles.keys().next().value);return publicProfiles.get(id);
}
async function publicPerson(id){return publicCopy(await publicPersonSource(id));}
function publicRows(data, q) {
  const basis=q.get('education_basis')||'highest';
  if (!['highest','undergraduate'].includes(basis)) throw new Error('学历口径无效。');
  let rows=data.people.filter(p=>(!q.get('campus')||p.campus===q.get('campus'))&&(!q.get('department')||(p.department||'待分学部')===q.get('department')));
  if (q.get('new_development')) rows=rows.filter(p=>p.new_development===(q.get('new_development')==='true'));
  if (q.get('category')) rows=rows.filter(p=>p.category===q.get('category'));
  if (q.get('q')) {const word=q.get('q').toLocaleLowerCase();rows=rows.filter(p=>(p.name+p.id+p.subject+p.position).toLocaleLowerCase().includes(word));}
  const facet=q.get('facet'), value=q.get('value');
  if (facet) rows=rows.filter(p=>facet==='new_development'?p.new_development===(value==='true'):facet==='service_group'?p.service_group===value:facet==='teaching'?p.teaching===(value==='true'):facet==='bachelor_plus'?['本科','硕士','博士'].includes(p[basis].education):facet==='university_985'?p[basis].tier==='985':facet==='university_211'?['985','211非985'].includes(p[basis].tier):(p.facets[basis][facet]||[]).includes(value));
  return rows.map(p=>({...p,education:p[basis].education,university:p[basis].university,university_tier:p[basis].tier}));
}
request = async function(path, options={}) {
  if ((options.method||'GET').toUpperCase()!=='GET') throw new Error('公开演示仅供浏览，新增与修改请使用本地完整版。');
  const data=await publicData, url=new URL(path,'https://public.invalid'), route=url.pathname,q=url.searchParams;
  if(route==='/organization/personnel')await publicDataSections(['people']);
  if(route.startsWith('/organization/talent-structure')){
    let referenceDefault=true;try{const ref=q.has('reference')?JSON.parse(q.get('reference')):{};const defaults={mentor_min:1,backup_min:1,mentor_capacity:3,new_teacher_years:3};referenceDefault=ref&&typeof ref==='object'&&!Array.isArray(ref)&&Object.entries({...ref,...Object.fromEntries([...q].filter(([k])=>k in defaults))}).every(([k,v])=>k in defaults&&Number(v)===defaults[k]);}catch{referenceDefault=false;}
    const key=[q.get('campus')||'',q.get('department')||'',q.get('population')||'teaching',q.get('education_basis')||'highest'].join('|');
    if(route==='/organization/talent-structure'&&referenceDefault&&data.__slices?.talent_defaults?.[key])return publicCopy(await publicJSON(data.__slices.talent_defaults[key]));
    await publicDataSections(['talent_structure_source']);
  }
  if(route.startsWith('/classroom-review/')){
    const parts=route.split('/'),kind=parts[2],id=decodeURIComponent(parts[3]||'');
    if(parts.length!==4||!['teachers','lessons','students'].includes(kind))throw new Error('课堂学生入口不存在。');
    const teacherId=kind==='teachers'?id:q.get('teacher_id');
    if(!teacherId)throw new Error('请从对应教师的课堂进入。');
    const profile=await publicPersonSource(teacherId);
    if(!profile.person?.teaching)throw new Error('当前人员没有任教课堂。');
    const config=await publicStudentLearning();
    if(!window.HouwaiLegacyLearningModel)throw new Error('课堂学生模块暂未准备好。');
    if(!publicLegacyModels.has(teacherId)){publicLegacyModels.set(teacherId,window.HouwaiLegacyLearningModel.create({person:profile.person,lessons:profile.workspace.lessons,name_pool:config.catalog().students.map(s=>s.name)}));publicPerf.legacyModelsBuilt++;if(publicLegacyModels.size>12)publicLegacyModels.delete(publicLegacyModels.keys().next().value);}const model=publicLegacyModels.get(teacherId);
    return publicCopy(kind==='teachers'?model.catalog():kind==='lessons'?model.lesson(id,q.get('stage')||'first'):model.student(id));
  }
  if(route.startsWith('/student-learning/')||route.startsWith('/students/')){
    const engine=await publicStudentLearning();
    return publicCopy(engine.resolve(route,Object.fromEntries(q)));
  }
  if(route==='/committee-materials/catalog')return publicCopy(window.HouwaiCommitteeMaterialsModel.catalog(await publicCommitteeSource(),Object.fromEntries(q)));
  if(route==='/committee-projects/catalog'||route==='/committee-materials/projects')return publicCopy(window.HouwaiCommitteeMaterialsModel.projects(await publicCommitteeSource(),Object.fromEntries(q)));
  if (route==='/management-diagnostics') {
    if(!window.HouwaiDiagnostics||!data.management_diagnostics_source)throw new Error('学科进展与培养重点暂未读取。');
    return publicCopy(window.HouwaiDiagnostics.analyze(data.management_diagnostics_source,Object.fromEntries(q)));
  }
  if (route==='/future-exam/catalog') {
    if(!window.HouwaiFutureExam||!data.future_exam_source)throw new Error('未来考试作业资料规划暂未读取。');
    return publicCopy(window.HouwaiFutureExam.catalog(data.future_exam_source,Object.fromEntries(q)));
  }
  if (route==='/learning-sources/catalog') {
    if(!window.HouwaiLearningSources||!data.learning_sources_source)throw new Error('系统接入准备资料暂未读取。');
    return publicCopy(window.HouwaiLearningSources.catalog(data.learning_sources_source,Object.fromEntries(q)));
  }
  if(route.startsWith('/learning-sources/')) {
    if(!window.HouwaiLearningSources||!data.learning_sources_source)throw new Error('系统接入准备资料暂未读取。');
    const parts=route.split('/');
    if(parts.length===4&&parts[3]==='capabilities')return publicCopy(window.HouwaiLearningSources.capabilities(data.learning_sources_source,parts[2]));
    if(parts.length===5&&parts[3]==='data')return window.HouwaiLearningSources.fetch(data.learning_sources_source,parts[2],parts[4]);
    throw new Error('数据接入接口不存在。');
  }
  if (route==='/research-hub/catalog'||route==='/research-hub/works') {
    if(!window.HouwaiResearchHub||!data.research_hub_source)throw new Error('学科作品库暂未读取，请刷新重试。');
    return publicCopy(window.HouwaiResearchHub[route.endsWith('/catalog')?'catalog':'works'](data.research_hub_source,Object.fromEntries(q)));
  }
  if (route.startsWith('/platform/')) {
    const method={'/platform/overview':'overview','/platform/teaching':'teaching','/platform/research':'research','/platform/salary':'salary','/platform/data-center':'data_center'}[route];
    if(!method||!window.HouwaiPlatform)throw new Error('当前管理专题尚未读取，请刷新重试。');
    const scopeKey=[q.get('campus')||'',q.get('department')||'',q.get('period')||'2026-fall'].join('|');
    if(method==='overview'&&![...q].some(([k,v])=>v&&!['campus','department','period'].includes(k))&&data.__slices?.platform_overviews?.[scopeKey])return publicCopy(await publicJSON(data.__slices.platform_overviews[scopeKey]));
    const section=method==='teaching'||method==='overview'?'platform_source':'platform_light';await publicDataSections([section]);
    return publicCopy(window.HouwaiPlatform[method](data[section],Object.fromEntries(q)));
  }
  if (route==='/organization/talent-structure'||route==='/organization/talent-structure/personnel') {
    if(!window.HouwaiTalent||!data.talent_structure_source)throw new Error('当前队伍结构资料尚未读取。');
    return publicCopy(window.HouwaiTalent[route.endsWith('/personnel')?'personnel':'analyze'](data.talent_structure_source,Object.fromEntries(q)));
  }
  if (route==='/organization/management') {
    const campus=q.get('campus')||'',department=q.get('department')||'',period=q.get('period')||'2026-fall';
    const view=q.get('view')||'all';
    if(!['all','overview','appraisal','development','teams','roster'].includes(view))throw new Error('管理专题无效。');
    const key=[campus,department,period].join('|'),summary=data.management_v8_scopes?.[key];
    if(!summary)throw new Error('当前组织或学期未收录管理概况，请重新选择。');
    if(view==='overview')return publicCopy({...summary,view,teachers:[],teams:[],positions:[]});
    if(data.__slices?.management?.[key])return publicCopy({...await publicJSON(data.__slices.management[key]),view});
    const full=data.management_v8;if(!full)throw new Error('当前组织管理资料暂未读取。');
    const inScope=row=>(!campus||row.campus===campus)&&(!department||(row.department||'待分学部')===department);
    return publicCopy({...summary,view,teachers:full.teachers.filter(inScope),teams:full.teams.filter(inScope),positions:full.positions.filter(inScope)});
  }
  if(route.startsWith('/management/')) {
    const p=await publicPerson(decodeURIComponent(route.split('/').pop()));
    if(!p.management_v8)throw new Error('本人员尚未收录管理概况。');
    return publicCopy(p.management_v8);
  }
  if (route==='/organization/tree') return publicCopy(data.tree);
  if (route==='/organization/summary'||route==='/organization/group') {
    const key=[q.get('campus')||'',q.get('department')||'',q.get('education_basis')||'highest'].join('|');
    if (!data.summaries[key]) throw new Error('当前组织范围没有收录，请先选择校区。');
    return publicCopy(data.summaries[key]);
  }
  if (route==='/organization/workspace'||route==='/bootstrap') return q.get('teacher_id')?(await publicPerson(q.get('teacher_id'))).workspace:publicCopy(data.workspace);
  if (route==='/organization/personnel') {
    const rows=publicRows(data,q),page=Math.max(1,Number(q.get('page')||1)),size=Math.max(1,Math.min(100,Number(q.get('page_size')||25)));
    return {items:rows.slice((page-1)*size,page*size),total:rows.length,page,page_size:size,pages:Math.ceil(rows.length/size),scope:data.tree.scope};
  }
  if (route.startsWith('/organization/personnel/')) return publicPerson(decodeURIComponent(route.split('/').pop()));
  if (route.startsWith('/development/')) {
    const p=await publicPerson(route.split('/').pop());
    if(!p.development) throw new Error('本岗位未收录教师个人目标。');
    return publicCopy(p.development);
  }
  if (route==='/human-reviews/dashboard') {
    const key=[q.get('campus')||'',q.get('department')||'',q.get('period_type')||'month',q.get('period')||'2026-10'].join('|');
    if(data.__slices?.human_dashboards?.[key])return publicCopy(await publicJSON(data.__slices.human_dashboards[key]));
    if(!data.human_dashboards?.[key]) throw new Error('当前范围或周期未收录人工评价演示，请选择已展示的校区与学部。');
    return publicCopy(data.human_dashboards[key]);
  }
  if (route.startsWith('/human-reviews/')) {
    const p=await publicPerson(route.split('/').pop()),key=(q.get('period_type')||'month')+'|'+(q.get('period')||'2026-10');
    if(!p.human_reviews?.[key]) throw new Error('本岗位或周期未收录人工评价；公开演示展示2026年10月短评与春季综合。');
    return publicCopy(p.human_reviews[key]);
  }
  if (route==='/appraisals/dashboard') return publicCopy(data.appraisal_dashboard);
  if (route.startsWith('/appraisals/')) {
    const p=await publicPerson(route.split('/').pop()),key=(q.get('period_type')||'month')+'|'+(q.get('period')||'2026-10');
    if (!p.public_appraisals[key]) throw new Error('公开演示展示2026年10月月评及2026年春、秋学期；其他周期尚未收录。');
    return p.public_appraisals[key];
  }
  if (route.startsWith('/reports/')) {
    const p=await publicPerson(route.split('/')[2]),period=q.get('period')||'4weeks';
    if (!p.public_reports[period]) throw new Error('该岗位不适用教学阶段报告。');
    return p.public_reports[period];
  }
  if (route==='/classroom-lab') return publicCopy(data.lab);
  throw new Error('此功能未收录在公开浏览版，请使用本地完整版。');
};
const publicReadRequest=request;
request=function(path,options={}){
 if((options.method||'GET').toUpperCase()!=='GET')return publicReadRequest(path,options);
 const u=new URL(path,'https://public.invalid');u.searchParams.sort();const key=state.actor+'|'+publicVersion+'|'+u.pathname+'?'+u.searchParams;
 if(publicResponseCache.has(key)){publicPerf.requestCacheHits++;return publicResponseCache.get(key).then(publicCopy);}
 const promise=publicReadRequest(path,options).catch(e=>{publicResponseCache.delete(key);throw e;});
 publicResponseCache.set(key,promise);if(publicResponseCache.size>96)publicResponseCache.delete(publicResponseCache.keys().next().value);
 return promise.then(publicCopy);
};
const publicOriginalLayout=layout;
layout=function(content) {
  const box=document.createElement('div');box.innerHTML=publicOriginalLayout(content);
  const control=box.querySelector('.actor-control');
  if(control)control.innerHTML='<span class="tag blue">集团视角 · 公开演示</span>';
  const notice=box.querySelector('.demo-notice span:not(.demo-dot)');
  if(notice)notice.textContent='公开只读展示 · 教师档案与评价为演示数据 · 教研资料按页面来源说明';
  const brand=box.querySelector('.brand');if(brand)brand.setAttribute('href','#group');
  const month=box.querySelector('#appraisalMonth');if(month){month.min='2026-10';month.max='2026-10';month.title='本演示收录2026年10月';}
  return box.innerHTML;
};
