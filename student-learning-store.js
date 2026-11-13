/* Browser-only fictional support plans. Never posts, notifies or changes first results. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.HouwaiStudentLearningStore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
 const KEY='houwai-student-learning-v1',copy=v=>JSON.parse(JSON.stringify(v));
 function create(engine,providedStorage){
  let storage=providedStorage;try{if(!storage&&typeof localStorage!=='undefined')storage=localStorage;}catch{}
  const students=new Map(engine.catalog().students.map(s=>[s.id,s]));
  let plans=[],persistenceError='';
  const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
  const validTime=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(s)&&validDate(s.slice(0,10))&&Number.isFinite(Date.parse(s));
  function checkedAnswers(answers,questions,label){
   const allowed=new Set(questions.map(q=>q.id));
   if(!Array.isArray(answers)||answers.some(a=>!a||!allowed.has(a.question_id)||typeof a.correct!=='boolean'||!['answered','missing','incomplete'].includes(a.status||'answered')))throw Error(label+'须逐题记录正误，题目须来自当前安排。');
   const ids=answers.map(a=>a.question_id);if(new Set(ids).size!==ids.length)throw Error('同一道题不能重复录入。');
   return answers;
  }
  function restorePlan(p){
   if(!p||typeof p.id!=='string'||p.id.length>160||!students.has(p.student_id)||!Array.isArray(p.knowledge_point_ids)||!p.knowledge_point_ids.length||!Array.isArray(p.questions)||!Array.isArray(p.history)||!validDate(p.due_date)||!validTime(p.created_at)||!String(p.owner||'').trim())throw Error('invalid plan');
   const l=engine.lesson(p.lesson_id),allowed=new Set(l.knowledge_points.map(k=>k.id)),kps=[...new Set(p.knowledge_point_ids)];
   if(!l.first.rows.some(r=>r.student_id===p.student_id)||p.class_id!==l.class.id||p.subject_id!==l.lesson.subject_id||kps.length!==p.knowledge_point_ids.length||kps.some(k=>!allowed.has(k)))throw Error('invalid relationship');
   const questions=engine.practiceQuestions(p.lesson_id,kps,120),practice=engine.practiceQuestions(p.lesson_id,kps,80);
   if(p.questions.length!==questions.length||p.questions.some((q,i)=>!q||['id','knowledge_point_id','prompt','answer','wrong'].some(k=>q[k]!==questions[i][k])))throw Error('invalid questions');
   const v={...copy(p),student_name:students.get(p.student_id).name,class_name:l.class.name,subject_name:l.lesson.subject_name,lesson_title:l.lesson.title,knowledge_points:l.knowledge_points.filter(k=>kps.includes(k.id)),questions,practice_questions:practice};
   if(v.practice_answers)checkedAnswers(v.practice_answers,practice,'补学');
   if(v.retest){if(!validTime(v.retest.at)||Date.parse(v.retest.at)<Date.parse(v.created_at))throw Error('invalid retest time');checkedAnswers(v.retest.answers,questions,'复测');const r=engine.assessAnswers(students.get(p.student_id),questions,v.retest.answers);v.retest={...v.retest,answers:copy(r.answers),result:copy(r),questions:copy(questions)};v.result=copy(r);v.status=r.status==='mastered'?'completed':r.status==='pending'?'incomplete':'needs_support';v.status_label=r.status==='mastered'?'复测已达标':r.status==='pending'?'复测资料待补':'继续巩固';}
   return v;
  }
  try{const raw=storage?.getItem(KEY),data=raw?JSON.parse(raw):[];if(!Array.isArray(data))throw Error('invalid storage');const ids=new Set();for(const p of data){try{const v=restorePlan(p);if(ids.has(v.id))throw Error('duplicate plan');ids.add(v.id);plans.push(v);}catch{persistenceError='部分浏览器补学记录不完整，已保留其余有效安排。';}}}catch{persistenceError='浏览器补学记录未能读取，当前显示默认资料。';}
  const save=()=>{if(!storage){persistenceError='当前浏览器不支持保存；本次操作仅保留到页面关闭。';return;}try{storage.setItem(KEY,JSON.stringify(plans));persistenceError='';}catch{persistenceError='浏览器保存空间不足，请先保留当前安排。';}if(typeof window!=='undefined')window.dispatchEvent(new Event('student-learning-change'));};
  const list=(filter={})=>copy(plans.filter(p=>Object.entries(filter).every(([k,v])=>!v||k==='knowledge_point_id'?(!v||p.knowledge_point_ids.includes(v)):p[k]===v)));
  const find=id=>plans.find(p=>p.id===id)||(()=>{throw Error('这项补学安排不存在。');})();
  function createPlan(input){
   if(!input||!Array.isArray(input.student_ids)||!input.student_ids.length)throw Error('请选择需要支持的学生。');
   const l=engine.lesson(input.lesson_id),allowed=new Set(l.knowledge_points.map(k=>k.id)),kps=[...new Set(input.knowledge_point_ids||[])];
   if(!kps.length||kps.some(id=>!allowed.has(id)))throw Error('请选择本课的知识点。');
   if(!String(input.owner||'').trim()||!validDate(input.due_date))throw Error('请填写负责人和有效复测日期。');
   const owner=String(input.owner).trim().slice(0,100),note=String(input.note||'').slice(0,2000),selectedStudents=[...new Set(input.student_ids)];
   for(const sid of selectedStudents)if(!l.first.rows.some(r=>r.student_id===sid))throw Error('学生不属于本课固定名单。');
   const result=selectedStudents.map((sid,index)=>{
    const s=students.get(sid),existing=plans.find(p=>p.lesson_id===input.lesson_id&&p.student_id===sid&&p.status!=='completed'&&[...p.knowledge_point_ids].sort().join('|')===[...kps].sort().join('|'));
    if(existing)return existing;
    const id='support-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)+'-'+index;
    const p={id,student_id:sid,student_name:s.name,class_id:l.class.id,class_name:l.class.name,subject_id:l.lesson.subject_id,subject_name:l.lesson.subject_name,lesson_id:l.lesson.id,lesson_title:l.lesson.title,knowledge_point_ids:kps,knowledge_points:l.knowledge_points.filter(k=>kps.includes(k.id)),owner,due_date:input.due_date,note,status:'planned',status_label:'待补学',created_at:new Date().toISOString(),practice_note:'',practice_questions:engine.practiceQuestions(input.lesson_id,kps,80),questions:engine.practiceQuestions(input.lesson_id,kps,120),history:[{action:'created',at:new Date().toISOString(),note:'安排针对性补学'}]};plans.push(p);return p;
   });save();return copy(result);
  }
  function practice(id,data={}){const p=find(id);if(data.answers!==undefined)checkedAnswers(data.answers,p.practice_questions,'补学');p.practice_note=String(data.note||'已完成演示补学练习').slice(0,2000);p.practice_answers=copy(data.answers||[]);p.status='practiced';p.status_label='待复测';p.practiced_at=new Date().toISOString();p.history.push({action:'practiced',at:p.practiced_at,note:p.practice_note});save();return copy(p);}
  function retest(id,data={}){
   const p=find(id);checkedAnswers(data.answers,p.questions,'复测');
   const result=engine.assessAnswers(students.get(p.student_id),p.questions,data.answers);
   p.retest={at:new Date().toISOString(),answers:copy(result.answers),result:copy(result),questions:copy(p.questions),note:String(data.note||'').slice(0,2000)};p.result=copy(result);p.status=result.status==='mastered'?'completed':result.status==='pending'?'incomplete':'needs_support';p.status_label=result.status==='mastered'?'复测已达标':result.status==='pending'?'复测资料待补':'继续巩固';p.history.push({action:'retested',at:p.retest.at,note:p.retest.note||p.status_label});save();return copy(p);
  }
  function subject(studentId,subjectId,lessonId){const v=engine.subject(studentId,subjectId,lessonId),local=plans.filter(p=>p.student_id===studentId&&p.subject_id===subjectId&&p.retest).sort((a,b)=>Date.parse(a.retest.at)-Date.parse(b.retest.at));
   for(const p of local){for(const k of p.knowledge_point_ids){const current=v.records[k],currentAt=Date.parse(current?.occurred_at||current?.occurred_on||'');if(Number.isFinite(currentAt)&&Date.parse(p.retest.at)<currentAt)continue;const qs=p.questions.filter(q=>q.knowledge_point_id===k),r=engine.assessAnswers(v.student,qs,p.retest.answers);v.records[k]={...current,status:r.status==='pending'?'insufficient':r.status,correct:r.correct,total:r.total,rate:r.rate,source:'本浏览器演示复测',assessment_kind:'local_retest',plan_id:p.id,occurred_on:p.retest.at.slice(0,10),occurred_at:p.retest.at,lesson_id:p.lesson_id,question_ids:qs.map(q=>q.id),questions:qs.map(q=>{const a=r.answers.find(a=>a.question_id===q.id);return {...q,student_answer:a?.answer||'',correct:a?.correct===true,status:a?.status||'missing'};}),answers:r.answers};}}
   v.summary=engine.countRecords(v.nodes,v.records);v.support_plans=list({student_id:studentId,subject_id:subjectId});if(v.context)v.context.local_retests=local.filter(p=>p.lesson_id===lessonId);return v;
  }
  function student(id){const v=engine.student(id);v.subjects=v.subjects.map(sb=>({...sb,...subject(id,sb.id).summary}));v.support_plans=list({student_id:id});return v;}
  function lesson(id){const v=engine.lesson(id);v.support_plans=list({lesson_id:id});v.local_retests=v.support_plans.filter(p=>p.retest);return v;}
  function reset(){plans=[];try{storage?.removeItem(KEY);persistenceError='';}catch{persistenceError='未能清理浏览器保存，请稍后重试。';}if(typeof window!=='undefined')window.dispatchEvent(new Event('student-learning-change'));}
  return {list,createPlan,practice,retest,get:id=>{const p=plans.find(p=>p.id===id);return p?copy(p):null;},subject,student,lesson,reset,get persistenceError(){return persistenceError;},storage_key:KEY};
 }
 return {create,key:KEY};
});
