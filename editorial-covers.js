'use strict';
/* Presentation assets only. Reviewed project facts and original media remain unchanged. */
(() => {
  const base='assets/briefs/editorial-v17/';
  const topics=Object.freeze({painting:'美术作品与写生训练',chinese:'阅读与写作训练',geography:'地理空间与实践探索',physics:'物理实验与观察',sports:'体育活动与课程安排',music:'音乐与排练空间',film:'影像课程与表达',history:'历史材料与问题探究',organizer:'整理课程与生活实践',papercut:'剪纸文化与创作',cooking:'劳动课程与生活实践'});
  const projectKeys=Object.freeze({'ai-chinese-transfer':'chinese','ai-physics-experiment':'physics','ai-geography-course':'geography','arts-space-schedule':'music','arts-music-learning':'music','moral-film-course':'film','moral-sports-followup':'sports'});
  const coverKeys=Object.freeze({'cover-ai-history':'history','cover-arts-review':'painting','cover-moral-organizer':'organizer','cover-arts-paper':'papercut','cover-moral-trial':'cooking'});
  const subjectKeys=Object.freeze({'地理':'geography','历史':'history','语文':'chinese','物理':'physics','音乐':'music','美术':'painting','体育':'sports','劳动教育':'organizer'});
  const theme=key=>topics[key]?Object.freeze({key,url:base+key+'.webp',label:'AI主题配图',alt:topics[key]+' · AI主题配图，非现场照片',theme:true}):null;
  function pick(value){
    const item=typeof value==='string'?{id:value}:value||{};
    const file=String(item.cover_url||'').split('/').pop().replace(/\.(?:png|jpe?g|webp)$/i,'');
    const key=coverKeys[file]||projectKeys[item.project_id||item.id];
    return theme(key);
  }
  function project(item={}){
    return pick(item)||theme(item.track_id==='arts'?'painting':item.track_id==='moral'?'organizer':'chinese');
  }
  function subject(name){
    if(name==='英语')return Object.freeze({key:'english',url:'assets/programs/english-poster.jpg',label:'课程样片',alt:'英语校本互动课堂现有课程样片',theme:false});
    return theme(subjectKeys[name]);
  }
  window.HouwaiEditorialCovers=Object.freeze({pick,project,subject,keys:Object.freeze(Object.keys(topics))});
})();
