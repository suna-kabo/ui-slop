const records = [[201,"Jun 3 07:42","Mill Weir","16.8",294,"Review","Storm runoff.",18,"Logged intact seal.",205],[202,"Jun 3 07:55","Market Bridge","7.2",318,"Accepted","",19,"Logged clear duplicate."],[203,"Jun 3 08:10","North Ferry","2.6",410,"Review","Bottle-label mismatch.",20,"Requests chain-of-custody check.",206],[204,"Jun 3 08:22","Birch Cut","3.2",360,"Accepted","",21,"Logged intact seal."],[205,"Jun 4 07:40","Mill Weir","5.1",298,"Review","Repeat for RW-201.",22,"Runoff receded overnight.",201],[206,"Jun 4 08:12","North Ferry","2.5",408,"Hold","Repeat for RW-203.",23,"Second bottle identifier verified.",203],[207,"Jun 4 08:50","Birch Cut","4.1",365,"Review","Field meter recalibrated.",24,"Reports fresh check standard."],[208,"Jun 4 09:10","Market Bridge","6.9",321,"Review","",25,"Reports late transport and intact seal."]].map(([id,time,station,ntu,conductivity,status,assessment,lab,labNote,link]) => ({id,time,station,ntu,conductivity,status,assessment,lab,labNote,link}));

const $ = id => document.getElementById(id);
const key = 'riverwatch.v1';
const defaults = {edits:{},undo:{},query:'',station:'',filter:'',active:201,screen:'queue',trail:[],pair:[201,205],comparing:false};
let state = {...defaults};
try { state = {...defaults,...JSON.parse(localStorage.getItem(key))}; } catch {}
const byId = id => records.find(record => record.id === Number(id));
const current = record => state.edits[record.id] || {status:record.status,note:''};
const idOf = id => 'RW-'+id;
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const badge = status => '<span class="badge '+status.toLowerCase()+'">'+status+'</span>';
const date = record => record.time.replace(/ (\d\d:)/,' · $1');
const items = () => records.filter(record => {
  const query = state.query.trim().toLowerCase();
  const searchable = [idOf(record.id),record.id,'L-'+record.lab,record.labNote].join(' ').toLowerCase();
  return (!query || searchable.includes(query)) && (!state.station || record.station===state.station) && (!state.filter || current(record).status===state.filter);
});
function persist() {
  try { localStorage.setItem(key,JSON.stringify(state)); }
  catch { $('live').textContent='Browser storage is unavailable. Changes are kept until this page closes.'; }
}
function clearFilters() {
  Object.assign(state,{query:'',station:'',filter:''});
  syncControls();
  refresh();
}
function syncControls() {
  $('query').value=state.query;
  $('station').value=state.station;
  $('filter').value=state.filter;
}
function renderRegister() {
  const visible = items();
  $('count').textContent=visible.length+' of '+records.length+' samples';
  $('summary').innerHTML=['Review','Accepted','Hold'].map(status => '<div class="stat"><strong>'+records.filter(record=>current(record).status===status).length+'</strong><span>'+ (status==='Review'?'In review':status==='Hold'?'On hold':status)+'</span></div>').join('');
  $('rows').innerHTML=visible.length ? '<table class="table"><thead><tr><th scope="col">Sample</th><th scope="col">Station</th><th scope="col">Turbidity</th><th scope="col">Disposition</th></tr></thead><tbody>'+
    visible.map(record=>'<tr class="'+(record.id===state.active?'active':'')+'"><td><button class="row-button" data-open="'+record.id+'"'+(record.id===state.active?' aria-current="true"':'')+'><strong>'+idOf(record.id)+'</strong><small>'+date(record)+'</small></button></td><td>'+record.station+'</td><td>'+record.ntu+' <small>NTU</small></td><td>'+badge(current(record).status)+'</td></tr>').join('')+'</tbody></table>' :
    '<div class="empty"><h3>No matching samples</h3><p>Clear filters to see the full sample register.</p><button data-action="clear">Clear filters</button></div>';
}
function renderDetail() {
  const record=byId(state.active);
  const {status,note}=current(record);
  const visible=items();
  const excluded=!visible.includes(record);
  const next=visible.find(item=>item.id>record.id) || visible.find(item=>item.id!==record.id);
  const prior=state.trail.at(-1);
  $('detail').innerHTML=
    '<div class="detail-top"><div class="detail-kicker"><button class="queue-back text-button" data-action="queue">← Sample register</button><span class="detail-caption">Sample detail</span>'+
    (prior?'<button class="text-button" data-action="return">← '+idOf(prior)+'</button>':'')+'</div>'+
    '<div class="detail-title"><h2 tabindex="-1" id="sample-heading">'+idOf(record.id)+'</h2>'+badge(status)+'</div><div class="identity-line"><p class="identity">'+record.station+' &nbsp;·&nbsp; '+date(record)+'</p><button type="button" id="compare-detail" class="text-button" aria-label="Compare samples">⇄ Compare</button></div></div>'+
    '<div id="exclusion">'+(excluded?'<div class="notice"><strong>'+idOf(record.id)+' is outside the current filters.</strong><div class="notice-actions">'+
    (next?'<button data-open="'+next.id+'">Open '+idOf(next.id)+'</button>':'')+'<button data-action="clear">Clear filters</button></div></div>':'')+'</div>'+
    '<div class="body"><div class="metrics"><div><span>Turbidity</span><strong>'+record.ntu+'</strong> <small>NTU</small></div><div><span>Conductivity</span><strong>'+record.conductivity+'</strong> <small>µS/cm</small></div></div>'+
    '<section class="context"><h3>Lab &amp; field context</h3>'+(record.assessment?'<p class="assessment">'+record.assessment+'</p>':'')+
    '<div class="lab"><strong>LAB NOTE L-'+record.lab+'</strong><p>'+record.labNote+'</p></div>'+
    (record.link?'<div class="linked"><span>'+(record.id<record.link?'Repeat sample':'Original sample')+'</span><button data-link="'+record.link+'">'+idOf(record.link)+' →</button></div>':'')+'</section>'+
    '<form class="disposition" id="disposition"><h3>Disposition</h3>'+
    (state.undo[record.id]?'<div class="saved"><span>Saved as '+status.toLowerCase()+'.</span><button type="button" data-action="undo">Undo</button></div>':'')+
    (note?'<p class="saved-note"><strong>Hold note</strong> · '+esc(note)+'</p>':'')+
    '<label for="new-status">Set disposition</label><div class="form-line"><select id="new-status"><option value="">Choose disposition</option><option value="Accepted">Accept</option><option>Hold</option><option>Review</option></select><button class="primary" type="submit">Save disposition</button></div>'+
    '<div id="note-field"></div><p class="error" id="form-error" role="alert"></p></form></div>';
  $('new-status').addEventListener('change',event=>{
    $('form-error').textContent='';
    $('note-field').innerHTML=event.target.value==='Hold'?'<label class="note-label">Hold note (required)<textarea id="hold-note" rows="2"></textarea></label>':'';
  });
  $('disposition').addEventListener('submit',event=>{
    event.preventDefault();
    const nextStatus=$('new-status').value;
    const nextNote=$('hold-note')?.value.trim() || '';
    if (!nextStatus || (nextStatus==='Hold' && !nextNote)) {
      $('form-error').textContent=nextStatus?'Enter a note to place this sample on hold.':'Choose a disposition before saving.';
      ($(nextStatus?'hold-note':'new-status')).focus();
      return;
    }
    if (nextStatus===status && nextNote===note) {
      $('form-error').textContent='This disposition is already recorded.';
      return;
    }
    state.undo[record.id]={status,note};
    state.edits[record.id]={status:nextStatus,note:nextNote};
    refresh();
    $('detail').querySelector('[data-action="undo"]').focus();
    $('live').textContent=idOf(record.id)+' saved as '+nextStatus.toLowerCase()+(items().includes(record)?'.':'. Outside the current filters.');
  });
}
function applyScreen() { document.body.classList.toggle('inspecting',state.screen==='detail'); }
function refresh() { applyScreen(); renderRegister(); renderDetail(); persist(); }
function lastRoute() { return {id:state.active,screen:state.screen,trail:[...state.trail]}; }
function setRoute(route) { Object.assign(state,{active:route.id,screen:route.screen,trail:route.trail}); }
function openRecord(id,linked=false) {
  if (!byId(id)) return;
  const previous=lastRoute();
  if (state.active===id && state.screen==='detail') { $('sample-heading').focus(); return; }
  state.trail=linked?[...state.trail,state.active]:[];
  state.active=id;
  state.screen='detail';
  history.pushState({riverwatch:true,route:lastRoute(),previous},'');
  refresh();
  $('sample-heading').focus();
}
function focusOrigin() {
  const candidate=state.screen==='detail'?$('detail').querySelector('[data-link]') : $('rows').querySelector('[data-open="'+state.active+'"]');
  (candidate || (state.screen==='detail'?$('sample-heading'):$('query'))).focus();
}
window.addEventListener('popstate',event=>{
  if (!event.state?.riverwatch) return;
  setRoute(event.state.route);
  refresh();
  focusOrigin();
});
function returnLinked() {
  const prior=state.trail.at(-1);
  if (history.state?.previous?.id===prior) history.back();
  else {
    setRoute({id:prior,screen:'detail',trail:state.trail.slice(0,-1)});
    history.replaceState({riverwatch:true,route:lastRoute()},'');
    refresh();
    focusOrigin();
  }
}
function returnQueue() {
  state.trail=[];
  state.screen='queue';
  history.replaceState({riverwatch:true,route:lastRoute()},'');
  refresh();
  focusOrigin();
}
document.querySelector('.work').addEventListener('click',event=>{
  const control=event.target.closest('button');
  if (!control) return;
  if (control.dataset.open) openRecord(Number(control.dataset.open));
  if (control.dataset.link) openRecord(Number(control.dataset.link),true);
  switch (control.dataset.action) {
    case 'clear': {
      const fromDetail=$('detail').contains(control);
      clearFilters();
      (fromDetail?$('sample-heading'):$('query')).focus();
      break;
    }
    case 'queue': returnQueue(); break;
    case 'return': returnLinked(); break;
    case 'undo': {
      const id=state.active;
      state.edits[id]=state.undo[id];
      delete state.undo[id];
      refresh();
      $('new-status').focus();
      $('live').textContent='Restored '+idOf(id)+' to '+current(byId(id)).status.toLowerCase()+'.';
      break;
    }
  }
});
$('station').insertAdjacentHTML('beforeend',[...new Set(records.map(record=>record.station))].sort().map(station=>'<option>'+station+'</option>').join(''));
for (const [id,event] of [['query','input'],['station','change'],['filter','change']]) {
  $(id).addEventListener(event,()=>{state[id]=$(id).value;refresh();});
}
syncControls();
history.replaceState({riverwatch:true,route:lastRoute(),previous:history.state?.previous},'');
refresh();

const dialog=$('comparison');
let compareInvoker;
function renderComparison() {
  const pair=state.pair.map(byId);
  const cards=pair.map(record=>{
    const {status,note}=current(record);
    return '<article><h3>'+idOf(record.id)+'</h3><p>'+record.station+'<br>'+date(record)+'</p>'+badge(status)+
      '<dl><dt>Turbidity</dt><dd><span class="key">'+record.ntu+'</span> NTU</dd><dt>Conductivity</dt><dd><span class="key">'+record.conductivity+'</span> µS/cm</dd></dl>'+
      (record.assessment?'<p>'+record.assessment+'</p>':'')+
      '<div class="lab"><strong>LAB NOTE L-'+record.lab+'</strong><p>'+record.labNote+'</p></div>'+
      (note?'<p class="saved-note"><strong>Hold note</strong> · '+esc(note)+'</p>':'')+'</article>';
  }).join('');
  dialog.innerHTML='<header class="section-head compare-top"><h2 id="comparison-title">Compare samples</h2><button id="compare-close" autofocus>Close</button></header>'+
    '<div class="compare-body"><div class="compare-grid">'+pair.map((record,slot)=>
      '<label for="pair-'+slot+'">Sample '+(slot+1)+'<select id="pair-'+slot+'">'+records.map(option=>
        '<option value="'+option.id+'"'+(option===record?' selected':'')+'>'+idOf(option.id)+' · '+option.station+'</option>').join('')+'</select></label>').join('')+
    cards+'</div><p class="compare-alert">Your selected pair stays available as you review the register.</p></div>';
}
function showComparison(invoker) {
  compareInvoker=invoker?.id;
  state.comparing=true;
  persist();
  renderComparison();
  dialog.showModal();
}
$('compare-open').addEventListener('click',event=>showComparison(event.currentTarget));
$('detail').addEventListener('click',event=>{
  const trigger=event.target.closest('#compare-detail');
  if(trigger) showComparison(trigger);
});
dialog.addEventListener('click',event=>{
  if(event.target.closest('#compare-close')) dialog.close();
});
dialog.addEventListener('change',event=>{
  if(!event.target.id.startsWith('pair-')) return;
  const slot=Number(event.target.id.at(-1));
  const chosen=Number(event.target.value);
  if (chosen===state.pair[1-slot]) state.pair[1-slot]=state.pair[slot];
  state.pair[slot]=chosen;
  persist();
  renderComparison();
  $('pair-'+slot).focus();
});
dialog.addEventListener('close',()=>{
  state.comparing=false;
  persist();
  const fallback=state.screen==='detail' && matchMedia('(max-width:720px)').matches?'compare-detail':'compare-open';
  ($(compareInvoker) || $(fallback)).focus();
});
if(state.comparing) showComparison();
