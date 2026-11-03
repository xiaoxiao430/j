/* Read-only project-progress model. Facts come from the scoped source ledger. */
(function(root){
'use strict';
const PERIOD='2026-fall',NOTICE='演示研判·按示例项目进度生成',CAMPUSES=['兴国路','香江路','九里峰山'];
const PRINCIPLES=[{"title":"先看教学，再看家长反馈","text":"教育教学质量与家长满意度是两项核心；教研贡献单独记录，不用作品数量替代教学效果。"},{"title":"保留原有达标条件","text":"首次独立作业按90%学生答对90%有效题目判断；考试对照年级组事先确定的目标。优秀需教学达标且学期满意度≥98%，良好需教学达标且满意度≥95%。"},{"title":"人工确认后形成评价","text":"教研组与年级组先提意见，学部校长综合确认；资料不足单列，教师可以说明或申请复核。项目建议不自动改档次、调薪或安排岗位。"}];
const copy=x=>JSON.parse(JSON.stringify(x)),arr=x=>Array.isArray(x)?x:[];
const inside=(x,s)=>(!s.campus||x.campus===s.campus)&&(!s.department||x.department===s.department);
function fail(code,message){const e=new Error(message);e.code=code;throw e;}
function scopeFor(source,q){
 const base=source.scope||{},campus=q.campus||base.campus||'',department=q.department||base.department||'';
 if(base.campus&&campus!==base.campus||base.department&&department!==base.department)fail('outside_scope','组织不在当前授权范围。');
 const scope={campus,department,level:department?'department':campus?'campus':'group',label:[campus,department].filter(Boolean).join(' · ')||base.label||'集团'};
 if((campus||department)&&!arr(source.organizations).some(x=>inside(x,scope)))fail('outside_scope','组织不在当前授权范围。');return scope;
}
function validProject(p){return ['planned_units','delivered_units','trial_target','trial_actual','task_target','task_actual'].every(k=>Number.isInteger(p[k])&&p[k]>=0)&&[['delivered_units','planned_units'],['trial_actual','trial_target'],['task_actual','task_target']].every(([a,b])=>p[a]<=p[b])&&['id','campus','department','subject','title','focus','deliverables','owner_role','due_date','review_metric','target','report_id'].every(k=>!!p[k]);}
function insight(p,catalog){
 const remaining=p.planned_units-p.delivered_units,headline=remaining?`${p.subject}教研：${p.planned_units}个课例完成${p.delivered_units}个`:p.trial_actual<p.trial_target?`${p.subject}资源已齐，${p.trial_target}班仅${p.trial_actual}班试教`:`${p.subject}重点学习任务完成${p.task_actual}/${p.task_target}份`;
 const facts=[{label:'课例完成',value:p.delivered_units,target:p.planned_units,unit:'个',text:`${p.delivered_units}/${p.planned_units}个`},{label:'试教覆盖',value:p.trial_actual,target:p.trial_target,unit:'班',text:`${p.trial_actual}/${p.trial_target}班`},{label:'重点学习任务',value:p.task_actual,target:p.task_target,unit:'份',text:`${p.task_actual}/${p.task_target}份`}];
 const refs=[{id:p.report_id,title:p.title+'·项目进度记录'},...arr(p.source_refs).filter(k=>catalog[k]).map(k=>copy(catalog[k]))];
 return {id:p.id,kind:'research',scope:{level:'department',campus:p.campus,department:p.department},campus:p.campus,department:p.department,subject:p.subject,headline,facts,why:p.focus,action:{title:'推进'+p.title,remaining:{units:p.planned_units-p.delivered_units,tasks:p.task_target-p.task_actual,trial_classes:p.trial_target-p.trial_actual},deliverables:p.deliverables,target:p.target,owner_role:p.owner_role,due_date:p.due_date,support:p.support||[],review_metric:p.review_metric},source_refs:refs,priority:p.priority||0};
}
function cultivationInsights(source,scope){
 const groups=new Map();for(const row of arr(source.cultivation))if(inside(row,scope)){const key=JSON.stringify([row.campus,row.department]);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(row);}
 const out=[];
 for(const key of [...groups.keys()].sort()){const [campus,department]=JSON.parse(key),rows=groups.get(key),known=rows.filter(x=>Number.isInteger(x.protected_time_minutes_per_week)&&Number.isInteger(x.planned_time_minutes_per_week)),missing=known.filter(x=>x.protected_time_minutes_per_week<x.planned_time_minutes_per_week);if(!missing.length)continue;
 const assigned=rows.filter(x=>x.mentor_assigned).length,arranged=known.length-missing.length,minutes=[...new Set(missing.map(x=>x.planned_time_minutes_per_week))].sort((a,b)=>a-b),timeText=minutes.length===1?`每周${minutes[0]}分钟共同备课时段`:'各自计划中的每周共同备课时段',due=missing.map(x=>x.support_due_date).filter(Boolean).sort()[0]||null;
 out.push({id:'cultivation-'+campus+'-'+department,kind:'cultivation',scope:{level:'department',campus,department},campus,department,subject:'新培养教师',headline:`${rows.length}名新培养教师中，${missing.length}人共备时间未排齐`,facts:[{label:'本学期新培养',value:rows.length,target:rows.length,unit:'人',text:`${rows.length}人`},{label:'已有具名导师',value:assigned,target:rows.length,unit:'人',text:`${assigned}/${rows.length}人`},{label:'共备时间已排齐',value:arranged,target:rows.length,unit:'人',text:`${arranged}/${rows.length}人`}],why:`导师已经安排，但${missing.length}位教师尚未排齐培养计划中的共同备课时段；这是学校排课事项，不计作教师教学问题。`,action:{title:'把培养时间排入课表',deliverables:[`为${missing.length}位教师补齐${timeText}`,'导师与教师完成1次课堂反馈，并记录下一次改进'],target:`${rows.length}位教师均有具名导师与每周共备时段`,owner_role:department+'校长＋教务负责人',due_date:due,support:['调整冲突课务，保留共同备课时间'],review_metric:'复评看课表是否落实、共备是否开展及课堂反馈是否改进'},teacher_ids:missing.map(x=>x.teacher_id),source_refs:missing.map(x=>({id:x.schedule_record_id||'management-plan-'+x.teacher_id,title:'本学期培养计划与共备排课记录'})),priority:98});}
 return out;
}
function analyze(source,q={}){
 if((q.period||PERIOD)!==PERIOD)fail('invalid_diagnostic_period','请选择2026年秋季学期。');
 const scope=scopeFor(source,q),local=arr(source.projects).filter(p=>inside(p,scope)),valid=local.filter(validProject),catalog=Object.fromEntries(arr(source.source_catalog).map(x=>[x.id,x]));
 const candidates=valid.filter(p=>p.delivered_units<p.planned_units||p.trial_actual<p.trial_target||p.task_actual<p.task_target).map(p=>insight(p,catalog)).concat(cultivationInsights(source,scope));candidates.sort((a,b)=>b.priority-a.priority||(a.id<b.id?-1:a.id>b.id?1:0));
 const insights=scope.level==='group'?CAMPUSES.map(c=>candidates.find(x=>x.campus===c)).filter(Boolean).slice(0,3):candidates.slice(0,3);
 const summary=insights.length?insights.map(x=>`${x.campus}${x.department}${x.headline}`).join('；')+'。':valid.length?'当前已填项目没有未完成项。':'本范围尚无完整项目进度记录，暂不判断哪个学科推进较慢。';
 const projects=valid.map(p=>({...copy(p),source_refs:insight(p,catalog).source_refs,status:p.delivered_units===p.planned_units&&p.trial_actual===p.trial_target&&p.task_actual===p.task_target?'已完成试教':'推进中'}));
 return {schema_version:'management-diagnostics-v1',notice:source.notice||NOTICE,period:PERIOD,scope,summary,insights,projects,principles:copy(source.criteria||PRINCIPLES),coverage:{project_records:local.length,usable_records:valid.length,incomplete_records:local.length-valid.length},curriculum_note:'课程文件用于设计任务的参考，不按关键词数量判断学校或教师是否符合政策。'};
}
const api={analyze};root.HouwaiDiagnostics=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
