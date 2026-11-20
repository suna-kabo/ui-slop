const shapes = {
  flame:'<path d="M12 22a7 7 0 0 0 7-7c0-4-3-7-5-10 0 4-2 5-3 6 0-3-2-5-3-6 0 4-3 6-3 10a7 7 0 0 0 7 7Z"/><path d="M12 22a3 3 0 0 0 3-3c0-2-2-3-3-5-1 2-3 3-3 5a3 3 0 0 0 3 3Z"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 15h2m4 0h2"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  box:'<path d="M4 8h16v12H4zM3 4h18v4H3zM9 12h6"/>',
  cube:'<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 9 8-4.5M12 12 4 7.5m8 4.5v9"/>',
  guide:'<path d="M12 6v15M3 4h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5v15h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  left:'<path d="m15 18-6-6 6-6"/>',
  right:'<path d="m9 18 6-6-6-6"/>',
  switch:'<path d="M4 8h15m-4-4 4 4-4 4M20 16H5m4-4-4 4 4 4"/>',
  arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  kiln:'<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M7 5V3m10 2V3M7 19v2m10-2v2M7 9h10v6H7z"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  chart:'<path d="M4 19h16M7 15v-4m5 4V5m5 10V8"/>',
};
const icon = (name, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name]}</svg>`;
const date = (key) => new Date(key + 'T12:00:00');
const offset = (key, amount) => {
  const d = date(key);
  d.setDate(d.getDate() + amount);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
const fmt = (key, options) => date(key).toLocaleDateString('en-US', options);
const shortDate = (key) => fmt(key, {month:'short',day:'numeric'});
const today = '2026-11-20';
const openingWeek = '2026-11-16';
const kilns = [
  {id:'atlas',name:'Atlas',model:'Skutt KM-1227',capacity:36,programs:['bisque','glaze']},
  {id:'juniper',name:'Juniper',model:'Skutt KM-1027',capacity:24,programs:['bisque','glaze','low']},
  {id:'pippin',name:'Pippin',model:'Olympic 1818HE',capacity:16,programs:['bisque','low']}
];
const programs = {
  bisque:{name:'Bisque',cone:'04',stage:'Bone dry',label:'Bisque · Cone 04'},
  glaze:{name:'Glaze',cone:'6',stage:'Glazed bisque',label:'Glaze · Cone 6'},
  low:{name:'Low-fire glaze',cone:'06',stage:'Glazed bisque',label:'Low-fire · Cone 06'}
};
const stages = ['Scheduled','Loading','Firing','Cooling','Ready'];
const seeded = {
  loads:[
    {id:'F-041',kiln:'atlas',program:'bisque',day:'2026-11-16',length:2,status:'Ready',base:29},
    {id:'F-046',kiln:'atlas',program:'glaze',day:'2026-11-19',length:2,status:'Cooling',base:31},
    {id:'F-044',kiln:'juniper',program:'glaze',day:'2026-11-17',length:2,status:'Ready',base:21},
    {id:'F-048',kiln:'juniper',program:'bisque',day:'2026-11-21',length:2,status:'Scheduled',base:16},
    {id:'F-043',kiln:'pippin',program:'low',day:'2026-11-16',length:2,status:'Ready',base:10},
    {id:'F-047',kiln:'pippin',program:'bisque',day:'2026-11-20',length:1,status:'Firing',base:12},
    {id:'F-049',kiln:'atlas',program:'glaze',day:'2026-11-23',length:2,status:'Scheduled',base:19},
    {id:'F-050',kiln:'juniper',program:'low',day:'2026-11-24',length:2,status:'Scheduled',base:10},
    {id:'F-051',kiln:'atlas',program:'bisque',day:'2026-11-26',length:2,status:'Scheduled',base:7}
  ],
  pieces:[
    {id:'W-085',name:'Carved breakfast bowls',member:'Nora Park',count:4,space:4,program:'bisque',clay:'Speckled stoneware',stage:'Bone dry',glaze:'',load:null},
    {id:'W-086',name:'Celadon tea cups',member:'Mina Patel',count:6,space:6,program:'glaze',clay:'White stoneware',stage:'Glazed bisque',glaze:'Studio Celadon · Cone 6',load:null},
    {id:'W-087',name:'Terracotta tiles',member:'Theo Green',count:8,space:5,program:'low',clay:'Red earthenware',stage:'Glazed bisque',glaze:'Clear Gloss · Cone 06',load:null},
    {id:'W-088',name:'Large coil planter',member:'Ruth Chen',count:1,space:10,program:'bisque',clay:'Speckled stoneware',stage:'Bone dry',glaze:'',load:null},
    {id:'W-089',name:'Porcelain bud vases',member:'Alex Morgan',count:3,space:3,program:'glaze',clay:'Studio porcelain',stage:'Glazed bisque',glaze:'Studio Celadon · Cone 6',load:'F-046'},
    {id:'W-084',name:'Faceted espresso cups',member:'Alex Morgan',count:4,space:4,program:'bisque',clay:'White stoneware',stage:'Bone dry',glaze:'',load:'F-041'}
  ]
};
const key = 'kilnroom-v1';
let state;
try { state = JSON.parse(localStorage.getItem(key)) || structuredClone(seeded); }
catch { state = structuredClone(seeded); }
let week = openingWeek;
let role = 'staff';
try { role = sessionStorage.getItem('kilnroom-role') || 'staff'; }
catch { /* The view switch still works when browser storage is unavailable. */ }
let view = navRoute();
let previousPiece;
let editingLoad;
let historyExpanded = false;
const scrollByView = {};
function navRoute(){
  const route=location.hash.slice(1);
  if(['schedule','work','kilns','guide'].includes(route)) return route;
  if(route==='queue'&&role!=='member') return route;
  return role==='member'?'work':'schedule';
}
let loadFilter = 'all';
let focusBack;
let activeLoad;
let activePiece;
let fromPiece=null;
const app = document.querySelector('#app');
const dialog = document.querySelector('#detail');
const safe = (str) => String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kilnFor = (load) => kilns.find(k => k.id === load.kiln);
const loaded = (load) => state.pieces.filter(p => p.load === load.id);
const waiting = () => state.pieces.filter(p => !p.load);
const used = (load) => load.base + loaded(load).reduce((sum,p) => sum + p.space,0);
const editable = (load) => ['Scheduled','Loading'].includes(load.status);
const stageClass = (status) => status.toLowerCase();
const badge = (status) => `<span class="badge ${stageClass(status)}"><i></i>${status}</span>`;
function save(){
  try { localStorage.setItem(key, JSON.stringify(state)); }
  catch { announce('Changes are available here until you close this tab.'); }
}
let noticeTimer;
function announce(message){
  const el = document.querySelector('#notice');
  el.textContent = message;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => el.textContent = '', 4500);
}
document.querySelector('.skip').addEventListener('click', event=>{
  event.preventDefault();
  app.querySelector('#main').focus();
});
const mobileLabels = {
  schedule:'Schedule',
  queue:'Queue',
  work:'My work',
  kilns:'Kilns',
  guide:'Guide'
};
const nav = [
  ['schedule','calendar','Firing schedule'],
  ['queue','layers','Submission queue'],
  ['work','box','My work'],
  ['kilns','kiln','Kilns & programs'],
  ['guide','guide','Firing guide']
];
function navItem([id, glyph, label]) {
  return `<button class="nav-item ${view===id?'selected':''}" data-view="${id}" ${view===id?'aria-current="page"':''}>${icon(glyph)}<span class="desktop-nav-label">${label}</span><span class="mobile-nav-label">${mobileLabels[id]}</span>${id==='queue'?'<b>'+waiting().length+'</b>':''}</button>`;
}
function navigate(dest){
  if(dest===view) return;
  scrollByView[view]=scrollY;
  location.hash=dest;
}
window.addEventListener('hashchange',()=>{
  if(dialog.open) dialog.close();
  view=navRoute();render();
  app.querySelector('#main').focus({preventScroll:true});
  window.scrollTo(0,scrollByView[view]||0);
});
function render(){
  document.body.dataset.role=role;
  app.innerHTML = `<div class="shell">
  <aside class="sidebar">
    <div class="brand"><div class="brand-icon">${icon('flame',24)}</div><div><strong>Kilnroom</strong><small>Clay Commons Studio</small></div></div>
    <nav aria-label="Workspace">${nav.slice(0,3).filter(item=>!memberMode()||item[0]!=='queue').map(navItem).join('')}<div class="nav-divider"></div>${nav.slice(3).map(navItem).join('')}</nav>
    <div class="profile"><span class="avatar">AM</span><div><strong>Alex Morgan</strong><small>${memberMode()?'Studio member':'Studio staff'}</small></div></div>
  </aside>
  <div class="workspace">
    <header class="topbar"><span class="top-date">${icon('calendar',16)} Friday, November 20</span><div class="top-actions"><button class="mode-btn" data-action="role" aria-label="${memberMode()?'Member view. Switch to staff view':'Staff view. Switch to member view'}">${memberMode()?'Member view':'Staff view'}${icon('switch',14)}</button></div><span class="mobile-brand">${icon('flame',22)} Kilnroom</span></header>
    <main id="main" tabindex="-1">${view==='schedule'?schedule():otherView()}</main>
  </div></div>`;
}
function pageTitle(title,actions=''){
  return `<div class="page-head"><h1>${title}</h1>${actions?`<div class="page-actions">${actions}</div>`:''}</div>`;
}
function loadTile(load, col, span, agendaDay){
  const p = programs[load.program];
  return `<button data-load="${load.id}" class="load-tile ${load.program}" ${col?`style="grid-column:${col}/span ${span}"`:''} ${agendaDay?`data-agenda-day="${agendaDay}"`:''} aria-label="${p.label}, ${kilnFor(load).name}, ${shortDate(agendaDay||load.day)}, ${load.status}, ${used(load)} of ${kilnFor(load).capacity} units">
    <span class="tile-program"><strong>${p.name}</strong> <span>Cone ${p.cone}</span></span>
    <span class="tile-bottom">${badge(load.status)}<span class="tile-capacity">${used(load)}/${kilnFor(load).capacity}</span></span>
  </button>`;
}
function weekLoads(){
  return state.loads.filter(l=>l.day<=offset(week,6) && offset(l.day,l.length-1)>=week && (loadFilter==='all'||l.program===loadFilter));
}
function calendar(){
  const days = Array.from({length:7},(_,i)=>offset(week,i));
  const loads = weekLoads();
  const end = days[6];
  const sameMonth = week.slice(0,7)===end.slice(0,7);
  const range = sameMonth ? `${shortDate(week)}–${date(end).getDate()}` : `${shortDate(week)} – ${shortDate(end)}`;
  return `<section class="calendar-card" aria-labelledby="week-title">
    <div class="calendar-tools">
      <h2 id="week-title">${range}, ${date(end).getFullYear()}</h2>
      <div class="week-controls"><button class="icon-btn" aria-label="Previous week" data-week="-1">${icon('left',17)}</button><button class="icon-btn" aria-label="Next week" data-week="1">${icon('right',17)}</button><button class="btn today" data-week="0">Today</button></div>
      <label class="filter"><span class="sr">Filter firing program</span><select id="program-filter"><option value="all">All programs</option>${Object.entries(programs).map(([id,p])=>`<option value="${id}" ${loadFilter===id?'selected':''}>${p.label}</option>`).join('')}</select></label>
    </div>
    <div class="grid-board">
      <div class="board-row day-row"><div class="kiln-caption">Kiln</div>${days.map(d=>`<div class="day ${d===today?'is-today':''}"><span>${fmt(d,{weekday:'short'})}</span><b ${d===today?'aria-current="date"':''}>${date(d).getDate()}</b></div>`).join('')}</div>
      ${kilns.map(k=>`<div class="board-row kiln-row"><div class="kiln-label"><span class="kiln-glyph">${icon('kiln',19)}</span><div><strong>${k.name}</strong></div></div>${days.map((d,i)=>`<div class="cell ${d===today?'is-today':''}" style="grid-column:${i+2}"></div>`).join('')}${loads.filter(l=>l.kiln===k.id).map(l=>{
        const start=days.findIndex(d=>d>=l.day);
        const span=days.filter(d=>d>=l.day&&d<=offset(l.day,l.length-1)).length;
        return loadTile(l,start+2,span);
      }).join('')}</div>`).join('')}
    </div>
    <div class="agenda">${agenda(days,loads)}</div>
    <div class="calendar-caption">${loads.length?'Capacity shown as used / total units':'No firings match this week and program.'}</div>
  </section>`;
}
function agenda(days,loads){
  const agendaDay=(day)=>{
    const daily=loads.filter(l=>l.day<=day && (offset(l.day,l.length-1)>=day ||
      (day===today&&['Firing','Cooling'].includes(l.status))));
    daily.sort((a,b)=>Number(b.status==='Firing')-Number(a.status==='Firing'));
    return `<div class="agenda-day ${day===today?'current-day':''}"><h3>${fmt(day,{weekday:'long',month:'short',day:'numeric'})}${day===today?' <span>Today</span>':''}</h3>${daily.length?daily.map(l=>`<div class="agenda-load"><div><strong>${kilnFor(l).name}</strong>${l.day<day?`<small>From ${shortDate(l.day)}</small>`:l.length>1?`<small>Through ${shortDate(offset(l.day,l.length-1))}</small>`:''}</div>${loadTile(l,null,null,day)}</div>`).join(''):'<p>No kiln reservations</p>'}</div>`;
  };
  const past=days.filter(day=>day<today);
  const current=days.filter(day=>day>=today);
  if(!past.length||!current.length) return days.map(agendaDay).join('');
  return `<details id="earlier-days" ${historyExpanded?'open':''}><summary>Earlier this week</summary>${past.map(agendaDay).join('')}</details>${current.map(agendaDay).join('')}`;
}
const submitButton = () => `<button class="btn ${memberMode()?'primary':''}" data-action="submit">${icon('plus',17)} Submit work</button>`;
function schedule(){
  return `${pageTitle('Firing schedule',`${submitButton()}${memberMode()?'':`<button class="btn primary" data-action="new">${icon('plus',17)} Schedule firing</button>`}`)}
    <div class="page-grid"><div class="plan-column">${calendar()}${memberMode()?'':demand()}</div>
    <aside class="rail">${livePanel()}${memberMode()?'':queuePanel()}</aside></div>`;
}
function livePanel(){
  const active=state.loads.filter(l=>['Firing','Cooling'].includes(l.status)).sort((a,b)=>stages.indexOf(a.status)-stages.indexOf(b.status));
  return `<section class="panel"><div class="panel-head"><span class="panel-icon heat">${icon('flame',18)}</span><h2>In the kiln</h2></div>
    ${active.length?active.map(l=>`<button class="live-row" data-load="${l.id}"><div><strong>${kilnFor(l).name}</strong><small>${programs[l.program].label}</small></div>${badge(l.status)}${icon('right',15)}</button>`).join(''):'<p class="panel-empty">No kilns firing or cooling.</p>'}</section>`;
}
function queuePanel(){
  const queue = waiting();
  return `<section class="panel queue-panel"><div class="panel-head"><span class="panel-icon stack">${icon('layers',18)}</span><h2>Waiting to fire</h2><span class="count">${queue.length}</span></div>
  ${queue.slice(0,3).map(p=>`<button class="queue-row" data-piece="${p.id}"><strong>${safe(p.name)}</strong><span>${safe(p.member)} · ${p.count} pcs</span><small><i class="${p.program}"></i>${programs[p.program].label}</small>${icon('right',15)}</button>`).join('')||'<p class="panel-empty">The queue is clear.</p>'}
  <button class="panel-link" data-view="queue">View submission queue ${icon('arrow',16)}</button></section>`;
}
function demand(){
  return `<section class="demand panel"><div class="panel-head"><span class="panel-icon stack">${icon('chart',18)}</span><h2>Upcoming demand</h2></div><div class="demand-grid">${Object.entries(programs).map(([id,p])=>{
    const units=waiting().filter(w=>w.program===id).reduce((s,w)=>s+w.space,0);
    const room=state.loads.filter(l=>l.program===id&&l.day>=today&&editable(l)&&l.day<=offset(today,7)).reduce((s,l)=>s+kilnFor(l).capacity-used(l),0);
    return `<div><strong><i class="${id}"></i>${p.label}</strong><span><b>${units}</b> units waiting</span><small>${room} units open in next 7 days</small></div>`;
  }).join('')}</div></section>`;
}
function otherView(){
  if(view==='kilns') return library();
  if(view==='guide') return guide();
  const mine=view==='work';
  return pageTitle(mine?'My work':'Submission queue',submitButton())+workList(mine);
}
function incompatibility(piece,load) {
  if (!editable(load)) return 'This firing has already started.';
  if (piece.program!==load.program) return `Needs ${programs[piece.program].label}.`;
  if (piece.space>kilnFor(load).capacity-used(load)) return `Needs ${piece.space} units; only ${kilnFor(load).capacity-used(load)} open.`;
  return '';
}
function openDialog(markup, trigger, focusId=''){
  if(trigger) focusBack = trigger;
  dialog.innerHTML = markup;
  if(!dialog.open) dialog.showModal();
  (document.getElementById(focusId) || dialog.querySelector('h2')).focus({preventScroll:true});
}
function dialogHead(title,sub=''){
  return `<div class="dialog-head"><div><h2 id="detail-title" tabindex="-1">${title}</h2>${sub?'<p>'+sub+'</p>':''}</div><button type="button" class="icon-btn close" data-action="close" aria-label="Close">${icon('close')}</button></div>`;
}
function showLoad(id,trigger,message='', feedbackType='success'){
  const keepScroll = dialog.open && activeLoad===id && Boolean(message);
  const previousScroll = keepScroll ? dialog.querySelector('.dialog-body')?.scrollTop : 0;
  activeLoad=id;
  const load=state.loads.find(l=>l.id===id), kiln=kilnFor(load), count=used(load);
  const next = memberMode()?null:['Load kiln','Start firing','Mark cooling','Mark ready'][stages.indexOf(load.status)];
  const canEdit=editable(load)&&!memberMode();
  const roster=loaded(load).filter(p=>!memberMode()||p.member===memberName);
  openDialog(`${dialogHead(`${kiln.name} · ${programs[load.program].name}`,`Cone ${programs[load.program].cone} · ${shortDate(load.day)}${load.length>1?' – '+shortDate(offset(load.day,load.length-1)):''} · ${load.id}`)}
  <div class="dialog-body"><div class="load-summary"><strong>${count}/${kiln.capacity} capacity units</strong><span>${kiln.capacity-count} open</span></div><progress aria-label="Kiln capacity" max="${kiln.capacity}" value="${count}"></progress>
  <ol class="progress-track" aria-label="Firing progress">${stages.map((step,i)=>`<li class="${i<stages.indexOf(load.status)?'complete':''}" ${step===load.status?'aria-current="step"':''}>${step}</li>`).join('')}</ol>
  <section class="dialog-section"><h3>${memberMode()?'Your work in this load':'In this load'}</h3>
  ${load.base&&!memberMode()?`<div class="record"><div><strong>Studio rack</strong></div><b>${load.base} units</b></div>`:''}
  ${roster.map(p=>`<div class="record"><div><strong>${safe(p.name)}</strong><small>${safe(p.member)} · ${p.space} units</small></div>${canEdit?`<button class="btn compact" data-remove="${p.id}">Return to queue</button>`:''}</div>`).join('')||(memberMode()?'<p class="muted">None of your work is assigned here.</p>':!load.base?'<p class="muted">This load is empty.</p>':'')}</section>
  ${canEdit?`<section class="dialog-section"><h3>Add from queue</h3>${waiting().map(p=>{
    const why=incompatibility(p,load);
    return `<div class="record ${why?'incompatible':''}"><div><strong>${safe(p.name)}</strong><small>${why||safe(p.member)+' · '+p.space+' units'}</small></div>${why?'':`<button class="btn compact" id="add-${p.id}" data-add="${p.id}" aria-label="Add ${safe(p.name)}">Add</button>`}</div>`;
  }).join('')||'<p class="muted">No submissions are waiting.</p>'}</section>`:''}
  </div><div class="dialog-foot">${message?`<div id="load-feedback" tabindex="-1" role="status" class="inline-feedback ${feedbackType}">${message}</div>`:''}${fromPiece?'<button class="btn footer-start" data-action="back-piece">Back to submission</button>':''}${!fromPiece&&!memberMode()&&load.status==='Scheduled'?'<button class="btn footer-start" data-action="reschedule">Reschedule</button>':''}<button class="btn" data-action="close">Done</button>${next?`<button class="btn primary" data-action="advance">${next}</button>`:''}</div>`,trigger,message?'load-feedback':'');
  if(keepScroll) dialog.querySelector('.dialog-body').scrollTop=previousScroll||0;
}
function showPiece(id, trigger, message=''){
  activePiece=id;
  const p=state.pieces.find(w=>w.id===id);
  const load=state.loads.find(l=>l.id===p.load);
  const estimate=estimateMap().get(p.id);
  const status=load?.status||'Queued';
  const suggested=(!memberMode()||p.member===memberName)?load||estimate:load;
  const nextDate=load?(status==='Ready'?'Ready for pickup':`${shortDate(load.day)} · ${kilnFor(load).name}`):pieceTiming(p);
  const tracking= ['Queued',...stages];
  openDialog(`${dialogHead(safe(p.name),safe(p.member)+' · '+p.count+(p.count===1?' piece':' pieces'))}
  <div class="dialog-body">${message?`<div class="inline-feedback piece-feedback" role="status">${message}</div>`:''}
  <div class="load-summary">${badge(status)}<b>${programs[p.program].label}</b></div>
  <ol class="progress-track piece-track" aria-label="Submission progress">${tracking.map((step,i)=>`<li class="${i<tracking.indexOf(status)?'complete':''}" ${step===status?'aria-current="step"':''}>${step}</li>`).join('')}</ol>
  <section class="timing">${icon(load?.status==='Ready'?'check':'calendar',20)}<div><strong>${nextDate}</strong>
  ${load?.status==='Ready'?'<small>Collect from the finished-work shelf.</small>':!load&&estimate?'<small>Staff confirm the date when they assign a load.</small>':''}</div>
  ${suggested?`<button class="btn compact" data-load="${suggested.id}" data-from-piece="${p.id}">View load</button>`:''}</section>
  <dl><dt>Clay</dt><dd>${safe(p.clay)}</dd><dt>Stage submitted</dt><dd>${safe(p.stage)}</dd>${p.glaze?`<dt>Glaze</dt><dd>${safe(p.glaze)}</dd>`:''}<dt>Capacity</dt><dd>${p.space} units</dd></dl></div>
  <div class="dialog-foot">${!p.load&&p.member===memberName?`<button class="btn footer-start" data-action="edit-piece">Edit submission</button>`:''}<button class="btn" data-action="close">Done</button></div>`,trigger);
}
function focusOrigin(){
  const target = focusBack;
  if(target?.isConnected && target.getClientRects().length){target.focus();return;}
  const matches = target ? [...app.querySelectorAll('button')].filter(button=>
    button.getClientRects().length && Object.entries(target.dataset).every(([key,value])=>button.dataset[key]===value)
  ) : [];
  const match = matches.find(button=>button.className===target.className) || matches[0];
  (match||app.querySelector('#main')).focus({preventScroll:true});
}
dialog.addEventListener('close',()=>{fromPiece=null;focusOrigin();});
document.addEventListener('toggle',e=>{
  if(e.target.id==='earlier-days') historyExpanded=e.target.open;
},true);
document.addEventListener('submit',e=>{
  if(e.target.id==='submission-form'){e.preventDefault();submitWork(e.target);}
  if(e.target.id==='firing-form'){e.preventDefault();submitLoad(e.target);}
});
document.addEventListener('change',e=>{
  if(e.target.name==='program'&&e.target.form?.id==='submission-form') updateGlaze();
  if(e.target.id==='program-filter'){loadFilter=e.target.value;render();document.querySelector('#program-filter').focus();}
});
document.addEventListener('click',e=>{
  const b=e.target.closest('button');
  if(!b) return;
  const {view:dest,week:delta,load,piece,action,add,remove}=b.dataset;
  if(dest) navigate(dest);
  if(delta!==undefined){week=delta==='0'?openingWeek:offset(week,Number(delta)*7);render();app.querySelector(`[data-week="${delta}"]`).focus();}
  if(load){
    fromPiece=b.dataset.fromPiece||null;
    showLoad(load,dialog.open?null:b);
  }
  if(piece){fromPiece=null;showPiece(piece,b);}
  if(action==='close') dialog.close();
  if(action==='cancel-form'){
    if(editingLoad && b.form.id==='firing-form'){
      showLoad(editingLoad);
      dialog.querySelector('[data-action=reschedule]')?.focus();
    } else if(previousPiece && b.form.id==='submission-form'){
      showPiece(previousPiece);
      dialog.querySelector('[data-action=edit-piece]')?.focus();
    } else dialog.close();
  }
  if(action==='back-piece'&&fromPiece){
    const id=fromPiece;
    fromPiece=null;
    showPiece(id);
    dialog.querySelector('[data-from-piece]')?.focus();
  }
  if(action==='role'){
    role=memberMode()?'staff':'member';
    try { sessionStorage.setItem('kilnroom-role',role); }
    catch { /* Keep the selected view in memory. */ }
    navigate(memberMode()?'work':'schedule');
    view=navRoute();render();
    app.querySelector('#main').focus();
  }
  if(action==='submit') submissionForm(b);
  if(action==='new'&&!memberMode()) firingForm(b);
  if(action==='edit-piece') submissionForm(null,state.pieces.find(p=>p.id===activePiece));
  if(action==='reschedule'&&!memberMode()) firingForm(null,state.loads.find(l=>l.id===activeLoad));
  if(memberMode()) return;
  if(add||remove||action==='advance'){
    const l=state.loads.find(f=>f.id===activeLoad);
    const p=state.pieces.find(w=>w.id===(add||remove));
    let message;
    if(add && !p.load && !incompatibility(p,l)){p.load=l.id; message=`${safe(p.name)} added to ${kilnFor(l).name}.`;}
    if(remove && p.load===l.id && editable(l)){p.load=null;message=`${safe(p.name)} returned to the queue.`;}
    if(action==='advance' && used(l)>0 && l.status!=='Ready'){
      if(l.day>today && l.status==='Loading'){showLoad(l.id,null,`This firing is scheduled for ${shortDate(l.day)}.`,'blocked');return;}
      if(l.status==='Loading' && state.loads.some(f=>f.id!==l.id&&f.kiln===l.kiln&&['Firing','Cooling'].includes(f.status))){
        showLoad(l.id,null,'This kiln is still firing or cooling another load.','blocked');return;
      }
      l.status=stages[stages.indexOf(l.status)+1];message=`${kilnFor(l).name} updated to ${l.status.toLowerCase()}.`;
    }
    if(message){save();render();showLoad(l.id,null,message);}
    else showLoad(l.id,null,'Add work before loading this kiln.','blocked');
  }
});
render();
