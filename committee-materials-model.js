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
 const base=rows,weekGroups=new Map();
 for(const r of base){const day=(r.date||'').slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(day))continue;const date=new Date(day+'T00:00:00Z');if(Number.isNaN(date.getTime()))continue;date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);const start=date.toISOString().slice(0,10);if(!weekGroups.has(start))weekGroups.set(start,[]);weekGroups.get(start).push(r);}
 const weeks=[...weekGroups].sort(([a],[b])=>b.localeCompare(a)).map(([start,records])=>{const end=new Date(start+'T00:00:00Z');end.setUTCDate(end.getUTCDate()+6);return {start,end:end.toISOString().slice(0,10),total:records.length,highlights:[...records].sort((a,b)=>(b.date||'').localeCompare(a.date||'')||b.id.localeCompare(a.id)).slice(0,6).map(r=>({id:r.id,title:r.title,kind:r.kind}))};});
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
root.HouwaiCommitteeMaterialsModel={catalog};if(typeof module!=='undefined'&&module.exports)module.exports={catalog};
})(typeof window==='undefined'?globalThis:window);
