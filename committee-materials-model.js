/* Public, scoped summary reading. No original messages or attachment paths. */
(function(root){'use strict';
const clone=x=>JSON.parse(JSON.stringify(x)),kinds={directive:'重点布置',feedback:'教师反馈',material:'方案资料',activity:'推进活动',outcome:'实践成果'};
function error(code,message){const e=new Error(message);e.code=code;throw e;}
function catalog(data,q={}){
 const track=q.track_id||'',kind=q.kind||'',month=q.month||'',topic=q.topic||'',word=String(q.q||'').trim().toLocaleLowerCase();
 if(track&&!(data.tracks||[]).some(t=>t.id===track))error('invalid_material_track','请选择有效的专项委员会。');
 if(kind&&!kinds[kind])error('invalid_material_kind','请选择有效的资料类型。');
 let rows=clone(data.items||[]);
 if(track)rows=rows.filter(x=>x.track_id===track);
 if(q.campus)rows=rows.filter(x=>!x.campus||x.campus===q.campus);
 if(q.department)rows=rows.filter(x=>!x.department||x.department===q.department);
 if(q.project_id||q.subject){const allowed=sourceIdsForQuery(data,q);rows=rows.filter(x=>allowed.has(x.id));}
 const focused=new Set((data.project_highlights||[]).flatMap(h=>h.source_ids||[]));
 const base=rows,weekGroups=new Map();
 for(const r of base){const day=(r.date||'').slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(day))continue;const date=new Date(day+'T00:00:00Z');if(Number.isNaN(date.getTime()))continue;date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);const start=date.toISOString().slice(0,10);if(!weekGroups.has(start))weekGroups.set(start,[]);weekGroups.get(start).push(r);}
 const weeks=[...weekGroups].sort(([a],[b])=>b.localeCompare(a)).map(([start,records])=>{const end=new Date(start+'T00:00:00Z');end.setUTCDate(end.getUTCDate()+6);return {start,end:end.toISOString().slice(0,10),total:records.length,highlights:records.filter(r=>focused.has(r.id)).sort((a,b)=>(b.date||'').localeCompare(a.date||'')||b.id.localeCompare(a.id)).slice(0,6).map(r=>({id:r.id,title:r.title,kind:r.kind}))};});
 if(q.week){const end=new Date(q.week+'T00:00:00Z');if(Number.isNaN(end.getTime()))error('invalid_material_week','请选择有效的周报日期。');end.setUTCDate(end.getUTCDate()+6);const limit=end.toISOString().slice(0,10);rows=rows.filter(r=>q.week<=(r.date||'').slice(0,10)&&(r.date||'').slice(0,10)<=limit);}
 const counts=Object.fromEntries(Object.keys(kinds).map(k=>[k,base.filter(x=>x.kind===k).length])),months=[...new Set(base.filter(x=>x.date).map(x=>x.date.slice(0,7)))].sort().reverse(),topics=[...new Set(base.flatMap(x=>x.topics||[]))].sort();
 if(kind)rows=rows.filter(x=>x.kind===kind);
 if(month)rows=rows.filter(x=>(x.date||'').startsWith(month));
 if(topic)rows=rows.filter(x=>(x.topics||[]).includes(topic));
 if(word)rows=rows.filter(x=>['title','summary','author_label','date'].map(k=>x[k]||'').join(' ').toLocaleLowerCase().includes(word)||(x.topics||[]).some(t=>t.toLocaleLowerCase().includes(word)));
 rows.sort((a,b)=>(b.date||'').localeCompare(a.date||'')||b.id.localeCompare(a.id));
 let page=Number(q.page||1),size=Number(q.page_size||18);if(!Number.isInteger(page)||page<1||!Number.isInteger(size)||size<1||size>100)error('invalid_material_page','页码须大于0，每页最多100条。');
 const pages=Math.max(1,Math.ceil(rows.length/size));page=Math.min(page,pages);
 const tracks=clone(data.tracks||[]).map(t=>{const records=(data.items||[]).filter(x=>x.track_id===t.id);return {...t,counts:{total:records.length,...Object.fromEntries(Object.keys(kinds).map(k=>[k,records.filter(x=>x.kind===k).length]))}};});
 return {enabled:!!data.enabled,visibility:'public_summary',as_of:data.as_of??null,notice:data.notice??null,coverage:clone(data.coverage||{}),tracks,items:rows.slice((page-1)*size,page*size),total:rows.length,scope_total:base.length,counts:{all:base.length,...counts},page,page_size:size,pages,months,weeks,topics,kind_labels:kinds,scope_note:'专项群跨校区推进；未注明校区或学部的资料按集团共享呈现，不算作某校区独立成果。',read_only:true};
}
const stages={planned:'计划开展',in_progress:'正在推进',produced:'已经产出',applied:'已经应用',observed:'观察到变化'};
function sourceIdsForQuery(data,q){
 let rows=data.projects||[];
 if(q.project_id){if(!rows.some(p=>p.id===q.project_id))error('invalid_project','请选择有效项目。');rows=rows.filter(p=>p.id===q.project_id);}
 if(q.subject)rows=rows.filter(p=>(p.subjects||[]).includes(q.subject));
 return new Set(rows.flatMap(p=>p.source_ids||[]));
}
function projectBounds(q,asOf){
 let start=q.start||'',end=q.end||'',period=q.period||'all';
 if(!['all','week','month'].includes(period))error('invalid_project_period','请选择全部、近7天或近30天。');
 if(period!=='all'&&!start&&asOf){end=end||asOf.slice(0,10);const date=new Date(end+'T00:00:00Z');if(Number.isNaN(date.getTime()))error('invalid_project_date','日期请使用年-月-日。');date.setUTCDate(date.getUTCDate()-(period==='week'?6:29));start=date.toISOString().slice(0,10);}
 for(const value of [start,end])if(value){const date=new Date(value+'T00:00:00Z');if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||Number.isNaN(date.getTime())||date.toISOString().slice(0,10)!==value)error('invalid_project_date','日期请使用年-月-日。');}
 if(start&&end&&start>end)error('invalid_project_date','开始日期不能晚于结束日期。');
 return [start,end];
}
function compare(a,b){return a<b?-1:a>b?1:0;}
function byFocus(a,b){return compare(b.date,a.date)||b.priority-a.priority||compare(b.id,a.id);}
function projects(data,q={}){
 const view=q.view||'focus',track=q.track_id||'';
 if(!['focus','overview','projects'].includes(view))error('invalid_project_view','请选择重点、汇总或项目分类。');
 if(track&&!(data.tracks||[]).some(t=>t.id===track))error('invalid_material_track','请选择有效的专项委员会。');
 if(q.project_id)sourceIdsForQuery(data,q);
 const [start,end]=projectBounds(q,data.as_of),word=String(q.q||'').trim().toLocaleLowerCase(),items=new Map((data.items||[]).map(i=>[i.id,i])),outputs=new Map([...(data.tracks||[]).flatMap(t=>(t.results_brief?.outputs||[]).map(o=>[o.id,o])),...(data.project_outputs||[]).map(o=>[o.id,o])]);
 const dayMatches=day=>(!start||day.slice(0,10)>=start)&&(!end||day.slice(0,10)<=end);
 const orgMatches=(campus,department)=>(!q.campus||!campus||campus===q.campus)&&(!q.department||!department||department===q.department);
 const rows=[],focus=[];
 for(const original of data.projects||[]){
  if(track&&original.track_id!==track)continue;
  if(q.project_id&&original.id!==q.project_id)continue;
  if(q.subject&&!(original.subjects||[]).includes(q.subject))continue;
  if(!orgMatches(original.campus,original.department))continue;
  const refs=original.source_ids.filter(ref=>dayMatches(items.get(ref).date)&&orgMatches(items.get(ref).campus,items.get(ref).department));if(!refs.length)continue;
  const p=clone(original),allowed=new Set(refs);p.source_ids=refs;
  p.progress=p.progress.filter(e=>dayMatches(e.date)&&e.source_ids.every(ref=>allowed.has(ref)));
  p.outputs=p.output_ids.map(k=>outputs.get(k)).filter(o=>o&&o.source_ids.every(ref=>allowed.has(ref))&&orgMatches(o.campus,o.department)).map(clone);
  p.material_count=refs.length;p.stage_label=stages[p.status];if((start||end)&&p.progress.length){p.summary=p.progress[0].text;p.stage_label=p.progress[0].stage;p.status='period_record';}p.latest_update=refs.map(ref=>items.get(ref).date.slice(0,10)).sort().at(-1);
  p.scope_kind=p.campus?'campus':'shared';p.scope_label=(p.campus||'集团共享')+(p.department?' · '+p.department:'');
  p.highlights=(data.project_highlights||[]).filter(h=>h.project_id===p.id&&dayMatches(h.date)&&h.source_ids.every(ref=>allowed.has(ref))).map(h=>({...clone(h),project_title:p.title,output:clone(p.outputs.find(o=>o.id===h.output_id)||null)})).sort(byFocus).slice(0,2);
  const search=[p.title,p.summary,...p.subjects,...p.progress.map(e=>e.title+' '+e.text)].join(' ').toLocaleLowerCase();if(word&&!search.includes(word))continue;
  focus.push(...p.highlights);rows.push(p);
 }
 focus.sort(byFocus);const selected=[],seen=new Set();for(const h of focus)if(!seen.has(h.project_id)){selected.push(h);seen.add(h.project_id);}
 rows.sort((a,b)=>compare(b.highlights.map(h=>h.date).sort().at(-1)||'',a.highlights.map(h=>h.date).sort().at(-1)||'')||Math.max(0,...b.highlights.map(h=>h.priority))-Math.max(0,...a.highlights.map(h=>h.priority))||compare(b.latest_update,a.latest_update)||compare(b.id,a.id));
 const tracks=[];for(const t of data.tracks||[]){
  if(track&&t.id!==track)continue;const scoped=rows.filter(p=>p.track_id===t.id),brief=t.leadership_brief||{},filtered=['campus','department','subject','project_id','start','end','q'].some(k=>!!q[k])||![undefined,null,'','all'].includes(q.period),highlights=focus.filter(h=>h.track_id===t.id).slice(0,3);
  tracks.push({id:t.id,label:t.label,leader:t.leader??null,summary:filtered?`当前范围有${scoped.length}个项目的相关记录。`:(brief.summary||t.brief||null),changes:filtered?highlights.map(h=>({title:h.title,text:h.change,source_ids:clone(h.source_ids)})):clone(brief.progress||[]),next_steps:filtered?highlights.map(h=>({title:h.title,text:h.next_step,source_ids:clone(h.source_ids)})):clone(brief.next_steps||[]),highlights,project_count:scoped.length,output_count:new Set(scoped.flatMap(p=>p.outputs.map(o=>o.id))).size,scope_filtered:filtered});
 }
 return {enabled:!!data.enabled,visibility:'public_summary',view,as_of:data.as_of??null,published_at:data.published_at??null,highlights:selected.slice(0,5),tracks,projects:rows,total_projects:rows.length,output_count:new Set(rows.flatMap(p=>p.outputs.map(o=>o.id))).size,filters:{subjects:[...new Set((data.projects||[]).flatMap(p=>p.subjects||[]))].sort(),periods:[{id:'all',label:'全部已发布资料'},{id:'week',label:'近7天'},{id:'month',label:'近30天'}],start,end},grouping_note:data.project_grouping_note??null,scope_note:'未明确校区的资料按集团共享呈现；推进建议不等于已下达任务，未见新反馈不代表没有开展。',read_only:true};
}

root.HouwaiCommitteeMaterialsModel={catalog,projects};if(typeof module!=='undefined'&&module.exports)module.exports={catalog,projects};
})(typeof window==='undefined'?globalThis:window);
