'use strict';
/* A short public results brief. Only reviewed public derivatives are rendered. */
(() => {
  const tracks=['ai','arts','moral'],cache=new Map(),pending=new Set(),errors=new Map();
  const arr=x=>Array.isArray(x)?x:[],safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const actor=()=>typeof state==='undefined'?'public':state.actor||state.data?.actor?.id||'public';
  const refresh=()=>{if(typeof render==='function')render();};
  const day=x=>String(x||'').replaceAll('-','.');
  const names={ai:'AI教科研',arts:'艺体教研',moral:'德育教研'};
  const paths={
    ai:'<rect x="6" y="6" width="20" height="20" rx="5"/><path d="M12 12h8v8h-8zM11 2v4m10-4v4M11 26v4m10-4v4M2 11h4m-4 10h4m20-10h4m-4 10h4"/>',
    arts:'<path d="M27 15A11 11 0 1 0 16 27h1a3 3 0 0 0 2-5l-.4-.5a1.8 1.8 0 0 1 1.4-3H23a4 4 0 0 0 4-3.5Z"/><circle cx="10" cy="12" r="1"/><circle cx="16" cy="8" r="1"/><circle cx="22" cy="11" r="1"/><circle cx="8" cy="18" r="1"/>',
    moral:'<path d="m16 3 11 4v8c0 6-5 10-11 14C10 25 5 21 5 15V7l11-4Z"/><path d="m16 21-5-5a3 3 0 0 1 5-4 3 3 0 0 1 5 4l-5 5Z"/>',
    image:'<rect x="3" y="4" width="26" height="24" rx="4"/><circle cx="11" cy="12" r="3"/><path d="m4 25 8-8 5 5 5-8 7 10"/>',
    video:'<rect x="3" y="6" width="26" height="20" rx="4"/><path d="m13 11 9 5-9 5z"/>',
    report:'<path d="M8 3h11l7 7v19H8zM18 3v8h8M12 17h10m-10 5h10"/>',
    arrow:'<path d="M4 16h24m-8-8 8 8-8 8"/>',
    back:'<path d="M28 16H4m8-8-8 8 8 8"/>',
    share:'<path d="M16 22V3m-7 7 7-7 7 7M6 17v12h20V17"/>',
    folder:'<path d="M3 8h10l4 5h12v15H3zM5 8V4h9l3 4h10v5"/>',
    close:'<path d="m7 7 18 18M25 7 7 25"/>',
    target:'<circle cx="15" cy="17" r="11"/><circle cx="15" cy="17" r="6"/><path d="m15 17 13-13m-6 0h6v6"/>'
  };
  const icon=name=>`<svg class="cb-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]||paths.report}</svg>`;
  function asset(value,kind='any'){
    if(typeof value!=='string'||value!==value.trim()||value.includes('..'))return '';
    const types=kind==='image'?'png|jpe?g|webp':kind==='video'?'mp4':'png|jpe?g|webp|mp4';
    return new RegExp('^assets/briefs/[A-Za-z0-9_/-]+\\.('+types+')$','i').test(value)?value:'';
  }
  function related(value){
    try{if(typeof value!=='string'||value!==value.trim()||/[\s\\\p{C}]/u.test(value))return '';const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&['jmryqyx.cn','xiaoxiao430.github.io'].includes(u.hostname)?u.href:'';}catch{return '';}
  }
  const reviewedMedia=o=>arr(o?.media).filter(m=>['image','video'].includes(m?.type)&&asset(m.url,m.type));
  const externalOutputs=new Map();
  let active={track:'',scope:{},data:null},modal=null,focusBefore=null,savedOverflow='';
  function result(){
    const who=actor();
    if(!cache.has(who)&&!pending.has(who)&&!errors.has(who)){
      pending.add(who);request('/committee-materials/catalog?page=1&page_size=1').then(d=>{if(actor()===who)cache.set(who,d);}).catch(e=>{if(actor()===who)errors.set(who,e.message);}).finally(()=>{pending.delete(who);if(actor()===who)refresh();});
    }
    return {data:cache.get(who),error:errors.get(who)};
  }
  function close(){
    const host=document.getElementById('committeeBriefOverlay');if(host){host.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load();});host.remove();}
    if(modal)document.body.style.overflow=savedOverflow;modal=null;
    if(focusBefore?.isConnected)focusBefore.focus();focusBefore=null;
  }
  function switches(track){return `<nav class="cb-switches" aria-label="三条教研线">${tracks.map(t=>`<a href="#brief/${t}" class="cb-switch ${t===track?'is-active':''} cb-tone-${t}" aria-current="${t===track?'page':'false'}" data-cb-switch="${t}">${icon(t)}<span>${safe(names[t])}</span></a>`).join('')}</nav>`;}
  function stats(b){const items=arr(b.highlights).filter(x=>x&&x.value!=null&&x.label);return items.length?`<div class="cb-stats" aria-label="有记录的阶段产出">${items.map(x=>`<article><div><b>${safe(x.value)}</b><span>${safe(x.unit)}</span></div><strong>${safe(x.label)}</strong>${x.note?`<small>${safe(x.note)}</small>`:''}</article>`).join('')}</div>`:'';}
  function outputCard(o,index){
    const media=reviewedMedia(o),images=media.filter(m=>m.type==='image'),video=media.find(m=>m.type==='video'),editorial=window.HouwaiEditorialCovers?.pick(o),cover=asset(editorial?.url,'image')||asset(o.cover_url,'image')||images[0]?.url||asset(video?.poster_url,'image'),report=o.report&&arr(o.report.sections).length,link=related(o.related_url);
    const open=video?'video':images.length?'gallery':report?'report':'',label=editorial?.label||o.cover_label||'内容封面',action=video?'看原有视频':images.length?'看原有图片':'读短报告';
    return `<article class="cb-output" data-cb-output="${safe(o.id)}" data-cb-source-ids="${safe(JSON.stringify(arr(o.source_ids)))}"><div class="cb-output-media">${cover?`<button type="button" class="cb-cover ${editorial?'is-editorial':''}" data-cb-${open||'report'}="${safe(o.id)}" aria-label="${safe(action+'：'+o.title)}"><img src="${safe(cover)}" alt="${safe(editorial?.alt||o.title+' · '+label)}" loading="${index?'lazy':'eager'}" data-cb-image><span class="cb-cover-action">${icon(video?'video':images.length?'image':'report')}<span>${action}</span></span></button>`:`<div class="cb-file-cover">${icon(report?'report':'folder')}<span>${report?'已有图文报告':'查看这项成果'}</span></div>`}<span class="cb-cover-label ${editorial?'is-editorial':''}" data-cb-cover-label>${safe(label)}</span><span class="cb-output-stage">${safe(o.stage||'阶段记录')}</span></div><div class="cb-output-copy"><div class="cb-output-meta"><span>${safe([o.campus,o.department].filter(Boolean).join(' · ')||'集团共享')}</span>${o.occurred_on?`<time>${day(o.occurred_on)}</time>`:''}</div><h3>${safe(o.title)}</h3>${o.blurb?`<p class="cb-output-blurb">${safe(o.blurb)}</p>`:''}${o.actual_change?`<p class="cb-observation"><b>目前看到</b><span>${safe(o.actual_change)}</span></p>`:''}</div><div class="cb-output-actions">${images.length?`<button type="button" data-cb-gallery="${safe(o.id)}">${icon('image')}看原有图片${images.length>1?`<small>${images.length}</small>`:''}</button>`:''}${video?`<button type="button" class="cb-video-action" data-cb-video="${safe(o.id)}">${icon('video')}看原有视频</button>`:''}${report?`<button type="button" data-cb-report="${safe(o.id)}">${icon('report')}读短报告</button>`:''}${link?`<a href="${safe(link)}" target="_blank" rel="noopener noreferrer">${icon('arrow')}进入作品</a>`:''}</div></article>`;
  }
  function html(track,scope={}){
    if(!tracks.includes(track))return `<section class="cb-state"><h1>请选择一条教研线</h1>${switches('')}</section>`;
    if(modal&&(modal.track!==track||modal.actor!==actor()))close();
    const r=result(),t=arr(r.data?.tracks).find(x=>x.id===track),b=t?.results_brief;
    active={track,scope:{campus:scope.campus||'',department:scope.department||''},data:t||null};
    if(!t)return `<section class="cb-page cb-tone-${track}" id="committeeResultsBrief" data-cb-track="${track}">${switches(track)}<div class="cb-state" role="status"><span class="cb-hero-symbol">${icon(track)}</span><h1>${r.error?'成果简报暂时没有读取成功':'正在整理这条线的成果简报'}</h1><p>${r.error?'请稍后重试，已保留的原资料不受影响。':'先看已经做出的作品和实际应用，再看下一步。'}</p>${r.error?'<button type="button" data-cb-retry>重新读取</button>':''}</div></section>`;
    if(!b)return `<section class="cb-page cb-tone-${track}" id="committeeResultsBrief" data-cb-track="${track}">${switches(track)}<div class="cb-state"><span class="cb-hero-symbol">${icon(track)}</span><h1>${safe(t.label)} · 成果简报</h1><p>这条线的代表成果正在整理，可以先查看已有资料。</p><button type="button" data-cb-archive>查看资料留存 ${icon('arrow')}</button></div></section>`;
    const outputs=arr(b.outputs).slice(0,2),share=asset(b.share_image_url,'image');
    return `<section class="cb-page cb-tone-${track}" id="committeeResultsBrief" data-cb-track="${track}" data-cb-as-of="${safe(b.as_of)}">${switches(track)}<header class="cb-page-header"><div class="cb-page-identity"><span class="cb-hero-symbol">${icon(track)}</span><div><span class="cb-kicker">厚外大教研 · ${safe(b.period_label||'阶段成果')}</span><h1>${safe(t.label)}<small>成果简报</small></h1><p>${safe(t.leader)}<span>牵头</span><i aria-hidden="true">·</i>材料截至 ${day(b.as_of||r.data.as_of)}</p></div></div><div class="cb-header-actions">${share?`<a class="cb-share-link" href="${safe(share)}" download="${safe(names[track])}成果简报.png" data-cb-share>${icon('share')}保存一页图</a>`:'<span class="cb-share-pending">分享图正在整理</span>'}<button type="button" class="cb-back" data-cb-back>${icon('back')}返回</button></div></header><section class="cb-finding"><span>先看结论</span><h2>${safe(b.headline||b.summary)}</h2>${b.summary&&b.summary!==b.headline?`<p>${safe(b.summary)}</p>`:''}</section>${stats(b)}<div class="cb-section-title"><h2>已经做出的代表成果</h2><span>点开图片、视频或短报告</span></div><div class="cb-outputs">${outputs.map(outputCard).join('')||'<p class="cb-empty">目前还没有整理出适合公开展示的代表成果。</p>'}</div>${b.decision?.title||b.decision?.text?`<aside class="cb-decision">${icon('target')}<div><span>下一步先抓</span>${b.decision.title?`<strong>${safe(b.decision.title)}</strong>`:''}${b.decision.text?`<p>${safe(b.decision.text)}</p>`:''}</div></aside>`:''}<footer class="cb-archive"><div>${icon('folder')}<span><b>需要深入看，再打开资料留存</b><small>原报告、历次记录和完整汇编保留在这里</small></span></div><button type="button" data-cb-archive>资料留存 ${icon('arrow')}</button></footer>${scope.campus||scope.department?'<p class="cb-scope-note">本页为集团共享简报，各项成果保留实际校区归属。</p>':''}</section>`;
  }
  function output(id){return arr(active.data?.results_brief?.outputs).find(x=>x.id===id)||externalOutputs.get(id)?.item;}
  function show(id,kind,index=0){
    const item=output(id);if(!item)return;
    const media=reviewedMedia(item),images=media.filter(m=>m.type==='image'),videos=media.filter(m=>m.type==='video');
    if(kind==='gallery'&&!images.length||kind==='video'&&!videos.length||kind==='report'&&!arr(item.report?.sections).length)return;
    if(!modal){focusBefore=document.activeElement;savedOverflow=document.body.style.overflow;document.body.style.overflow='hidden';}
    const external=externalOutputs.get(id);
    modal={actor:actor(),track:external?.track||active.track,scope:{...(external?.scope||active.scope)},item,kind,index:Math.max(0,Math.min(index,(kind==='video'?videos:images).length-1))};renderModal();
  }
  function modalMedia(m,kind){
    if(kind==='video')return `<div class="cb-video-frame"><video controls playsinline preload="metadata" ${asset(m.poster_url,'image')?`poster="${safe(asset(m.poster_url,'image'))}"`:''} src="${safe(asset(m.url,'video'))}" data-cb-player aria-label="${safe(m.caption||modal.item.title)}"></video><p class="cb-media-failure" hidden data-cb-media-failure>这段视频暂时无法播放，可以先阅读这项成果的短报告。</p></div>${m.caption?`<p class="cb-media-caption">${safe(m.caption)}</p>`:''}`;
    return `<div class="cb-gallery-frame"><img src="${safe(asset(m.url,'image'))}" alt="${safe(m.caption||modal.item.title)}" data-cb-image><p class="cb-media-failure" hidden data-cb-media-failure>这张图片暂时无法显示，可以先阅读这项成果的短报告。</p></div>${m.caption?`<p class="cb-media-caption">${safe(m.caption)}</p>`:''}`;
  }
  function renderModal(){
    if(!modal)return;
    let host=document.getElementById('committeeBriefOverlay');if(!host){host=document.createElement('div');host.id='committeeBriefOverlay';document.body.append(host);}else host.querySelectorAll('video').forEach(v=>v.pause());
    const {item,kind}=modal,media=reviewedMedia(item),images=media.filter(m=>m.type==='image'),videos=media.filter(m=>m.type==='video'),report=item.report;
    const tabs=[...(images.length?[['gallery','图片',images.length]]:[]),...(videos.length?[['video','视频',videos.length]]:[]),...(arr(report?.sections).length?[['report','短报告',0]]:[])];
    let content;
    if(kind==='report')content=`<article class="cb-short-report"><span class="cb-report-kicker">图文短报告</span><h3>${safe(report.headline||item.title)}</h3><p class="cb-report-meta">${safe([item.campus,item.department].filter(Boolean).join(' · ')||'集团共享')}${item.occurred_on?' · '+day(item.occurred_on):''}</p>${arr(report.sections).map(s=>`<section><h4>${safe(s.heading)}</h4><p>${safe(s.text)}</p></section>`).join('')}${report.source_label?`<footer>${safe(report.source_label)}</footer>`:''}<p class="cb-report-source-count" data-cb-report-source-ids="${safe(JSON.stringify(arr(item.source_ids)))}">对应 ${arr(item.source_ids).length} 项相关资料，完整内容保留在资料留存中。</p></article>`;
    else{const choices=kind==='video'?videos:images,m=choices[modal.index]||choices[0];content=modalMedia(m,kind)+(choices.length>1?`<div class="cb-gallery-controls"><button type="button" data-cb-step="-1" ${modal.index<=0?'disabled':''}>${icon('back')}上一${kind==='video'?'段':'张'}</button><span>${modal.index+1} / ${choices.length}</span><button type="button" data-cb-step="1" ${modal.index>=choices.length-1?'disabled':''}>下一${kind==='video'?'段':'张'}${icon('arrow')}</button></div>`:'');}
    host.innerHTML=`<div class="cb-backdrop" data-cb-close></div><section class="cb-dialog cb-tone-${modal.track}" role="dialog" aria-modal="true" aria-labelledby="committeeBriefModalTitle"><header><div><span>${safe(names[modal.track])} · ${safe(item.stage||'阶段记录')}</span><h2 id="committeeBriefModalTitle">${safe(item.title)}</h2></div><button type="button" data-cb-close aria-label="关闭成果详情">${icon('close')}</button></header><nav class="cb-dialog-tabs" aria-label="查看成果内容">${tabs.map(([k,label,count])=>`<button type="button" data-cb-modal-kind="${k}" class="${kind===k?'is-active':''}" aria-pressed="${kind===k}">${icon(k==='gallery'?'image':k==='video'?'video':'report')}${label}${count>1?`<small>${count}</small>`:''}</button>`).join('')}</nav><div class="cb-dialog-body">${content}</div><footer class="cb-dialog-footer"><span>查看实际资料，了解这项工作怎样开展</span><button type="button" data-cb-modal-archive>完整资料 ${icon('arrow')}</button></footer></section>`;
    host.querySelector('button[data-cb-close]')?.focus();
  }
  function archive(){const scope=modal?.scope||active.scope,track=modal?.track||active.track;close();if(window.HouwaiPlatformNavigation?.openCommitteeArchive)window.HouwaiPlatformNavigation.openCommitteeArchive(scope,track);else location.hash='#research';}
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-cb-gallery],[data-cb-video],[data-cb-report],[data-cb-close],[data-cb-step],[data-cb-modal-kind],[data-cb-archive],[data-cb-modal-archive],[data-cb-back],[data-cb-retry]');if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();
    if(b.hasAttribute('data-cb-close')){close();return;}
    if(b.hasAttribute('data-cb-retry')){errors.delete(actor());refresh();return;}
    if(b.hasAttribute('data-cb-back')){close();if(window.HouwaiPlatformNavigation?.returnFromBrief)window.HouwaiPlatformNavigation.returnFromBrief();else location.hash='#group';return;}
    if(b.hasAttribute('data-cb-archive')||b.hasAttribute('data-cb-modal-archive')){archive();return;}
    if(b.hasAttribute('data-cb-modal-kind')){if(modal)show(modal.item.id,b.dataset.cbModalKind);return;}
    if(b.hasAttribute('data-cb-step')){if(modal)show(modal.item.id,modal.kind,modal.index+Number(b.dataset.cbStep));return;}
    for(const [key,kind] of [['cbGallery','gallery'],['cbVideo','video'],['cbReport','report']])if(b.dataset[key]){show(b.dataset[key],kind);return;}
  },true);
  document.addEventListener('keydown',e=>{
    const host=document.getElementById('committeeBriefOverlay');if(!host)return;
    if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();return;}
    if(['ArrowLeft','ArrowRight'].includes(e.key)&&modal?.kind==='gallery'){e.preventDefault();show(modal.item.id,'gallery',modal.index+(e.key==='ArrowLeft'?-1:1));return;}
    if(e.key==='Tab'){const nodes=[...host.querySelectorAll('button:not(:disabled),a[href],video[controls],[tabindex="0"]')].filter(x=>x.getClientRects().length),first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}
  },true);
  document.addEventListener('error',e=>{
    if(e.target.matches?.('[data-cb-player]')){const f=e.target.parentElement.querySelector('[data-cb-media-failure]');if(f)f.hidden=false;}
    if(e.target.matches?.('img[data-cb-image]')){e.target.hidden=true;const f=e.target.parentElement.querySelector('[data-cb-media-failure]');if(f)f.hidden=false;else{const note=document.createElement('span');note.className='cb-cover-unavailable';note.textContent='图片暂时无法显示，仍可阅读短报告';e.target.parentElement.append(note);}}
  },true);
  let touchOrigin=null;
  document.addEventListener('touchstart',e=>{if(modal?.kind==='gallery'&&e.touches.length===1&&e.target.closest?.('.cb-gallery-frame'))touchOrigin={x:e.touches[0].clientX,y:e.touches[0].clientY};else touchOrigin=null;},{passive:true});
  document.addEventListener('touchend',e=>{if(!touchOrigin||modal?.kind!=='gallery'||e.changedTouches.length!==1)return;const dx=e.changedTouches[0].clientX-touchOrigin.x,dy=e.changedTouches[0].clientY-touchOrigin.y;touchOrigin=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)show(modal.item.id,'gallery',modal.index+(dx<0?1:-1));},{passive:true});
  window.addEventListener('hashchange',close);
  function shareHTML(t,qrDataURL=''){
    if(!t||!tracks.includes(t.id)||!t.results_brief)return '';
    const b=t.results_brief,items=arr(b.outputs).slice(0,2),decision=typeof b.share_decision==='string'?{title:b.share_decision,text:''}:b.share_decision||b.decision||{},qr=typeof qrDataURL==='string'&&/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(qrDataURL)&&qrDataURL.length<100000?qrDataURL:'',cut=(x,n)=>{const text=String(x||'');return text.length<=n?text:text.slice(0,n-1)+'…';};
    return `<article class="cb-share-sheet cb-tone-${t.id}" data-cb-share-sheet="${t.id}"><header><span class="cb-share-brand">厚</span><div><b>厚外大教研与人才发展</b><span>${safe(b.period_label||'阶段成果')} · 材料截至 ${day(b.as_of)}</span></div><span class="cb-share-category">${icon(t.id)}</span></header><div class="cb-share-heading"><span>${safe(t.leader)}牵头</span><h1>${safe(t.label)}<small>成果简报</small></h1><h2>${safe(b.headline||b.summary)}</h2></div><div class="cb-share-stats">${arr(b.highlights).slice(0,2).map(x=>`<div><b>${safe(x.value)}<small>${safe(x.unit)}</small></b><span>${safe(cut(x.label,10))}</span></div>`).join('')}</div><div class="cb-share-outputs">${items.map((o,i)=>{const media=reviewedMedia(o),editorial=window.HouwaiEditorialCovers?.pick(o),cover=asset(editorial?.url,'image')||asset(o.cover_url,'image')||media.find(m=>m.type==='image')?.url;return `<section><div class="cb-share-photo">${cover?`<img src="${safe(cover)}" alt="${safe(editorial?.alt||o.title)}">`:`<div>${icon('report')}</div>`}<span>${safe(editorial?.label||o.cover_label||o.stage)}</span></div><div class="cb-share-output-text"><span class="cb-share-index">0${i+1} <i>${safe([o.campus,o.department].filter(Boolean).join(' · ')||'集团共享')}</i></span><h3>${safe(o.title)}</h3><p>${safe(o.share_blurb||o.blurb)}</p></div></section>`;}).join('')}</div><aside class="cb-share-decision">${icon('target')}<div><span>下一步先抓</span><h3>${safe(decision.title||'')}</h3>${decision.text?`<p>${safe(decision.text)}</p>`:''}</div></aside><footer><div><strong>扫码看图、视频与短报告</strong><span>打开这条线的完整简报</span></div>${qr?`<img src="${qr}" alt="打开完整成果简报">`:`<span class="cb-share-qr-label">打开网页<br>看完整简报</span>`}</footer></article>`;
  }
  window.HouwaiCommitteeBriefs={html,shareHTML,close,outputCard,registerOutputs(outputs,track,scope={}){for(const item of arr(outputs))if(item?.id)externalOutputs.set(item.id,{item,track,scope:{...scope}});},get current(){return active;},get modal(){return modal;}};
})();
