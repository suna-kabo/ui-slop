const records = [
  ['RW-201','Jun 3 07:42','Mill Weir','16.8',294,'Review','Storm runoff.','L-18','Intact seal.','RW-205'],
  ['RW-202','Jun 3 07:55','Market Bridge','7.2',318,'Accepted','','L-19','Clear duplicate.'],
  ['RW-203','Jun 3 08:10','North Ferry','2.6',410,'Review','Bottle-label mismatch.','L-20','Requests chain-of-custody check.','RW-206'],
  ['RW-204','Jun 3 08:22','Birch Cut','3.2',360,'Accepted','','L-21','Intact seal.'],
  ['RW-205','Jun 4 07:40','Mill Weir','5.1',298,'Review','Repeat for RW-201.','L-22','Runoff receded overnight.','RW-201'],
  ['RW-206','Jun 4 08:12','North Ferry','2.5',408,'Hold','Repeat for RW-203.','L-23','Second bottle identifier verified.','RW-203'],
  ['RW-207','Jun 4 08:50','Birch Cut','4.1',365,'Review','Field meter recalibrated.','L-24','Reports fresh check standard.'],
  ['RW-208','Jun 4 09:10','Market Bridge','6.9',321,'Review','','L-25','Reports late transport and intact seal.']
].map(([id,time,station,turb,cond,status,context,lab,note,related])=>({id,time,station,turb,cond,status,context,lab,note,related}));
const $ = selector => document.querySelector(selector);
const compact = matchMedia('(max-width: 740px)');
const key = 'riverwatch-sample-review-v1';
const defaults = {q:'',station:'',status:'',id:records[0].id,view:'queue',origin:null,edits:{},undo:[],pins:[],expanded:false,drafts:{}};
let state = {...defaults};
try { state = {...defaults,...JSON.parse(localStorage.getItem(key))}; } catch {}
let holdOpen = false;
let error = '';
let message = '';
let storageFailed = false;
const get = id => {
  const record = records.find(item=>item.id===id);
  return record && {...record,...state.edits[id]};
};
const escape = text => String(text ?? '').replace(/[&<>"']/g, char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const badge = status => '<span class="badge '+status.toLowerCase()+'">'+status+'</span>';
function save() {
  try { localStorage.setItem(key,JSON.stringify(state)); storageFailed=false; }
  catch { storageFailed=true; $('#announce').textContent='Browser storage is unavailable. Changes may be lost on reload.'; }
}
function filtered() {
  const term=state.q.trim().toLowerCase();
  return records.map(record=>get(record.id)).filter(record=>
    (!state.station || record.station===state.station) &&
    (!state.status || record.status===state.status) &&
    (!term || [record.id,record.lab,record.note].join(' ').toLowerCase().includes(term)));
}
function render() {
  const matches=filtered();
  const record=get(state.id);
  $('#desk').dataset.view=state.view;
  $('#count').textContent=matches.length+' of '+records.length+' samples';
  $('#summary').innerHTML=['Review','Hold','Accepted'].map(status=>'<div><strong>'+records.filter(r=>get(r.id).status===status).length+'</strong><span>'+status+'</span></div>').join('');
  $('#queue').innerHTML=matches.length ? '<div class="column-head" aria-hidden="true"><span>Sample / collected</span><span>Station</span><span>Disposition</span></div>'+
    matches.map(r=>'<button class="sample" data-open="'+r.id+'" aria-current="'+(r.id===state.id)+'"><span><span class="identifier">'+r.id+'</span><span class="timestamp">'+r.time+'</span></span><span class="station">'+r.station+'</span>'+badge(r.status)+'<span class="chevron" aria-hidden="true">›</span></button>').join('')
    : '<div class="empty"><h3>No matching samples</h3><p>Clear the filters to see the full queue.</p><button data-act="reset">Clear filters</button></div>';
  const undo=[...state.undo].reverse().find(entry=>entry.id===record.id);
  const excluded=!matches.some(r=>r.id===record.id);
  const next=matches.find(r=>r.id>record.id) || matches.find(r=>r.id!==record.id);
  const notice=message || excluded || storageFailed || undo;
  const pinned=state.pins.includes(record.id);
  const pinLabel=pinned?'Remove from comparison':state.pins.length===2?'Replace second pin':'Pin for comparison';
  $('#detail').innerHTML=
    '<div class="detail-top">'+(state.origin?'<button class="link-btn" data-act="origin">← Back to '+state.origin+'</button>':'<button class="link-btn compact-back" data-act="queue">← Sample queue</button><span class="kicker">Sample detail</span>')+'<button class="link-btn pin" data-act="pin" aria-pressed="'+pinned+'">'+pinLabel+'</button></div>'+
    '<div class="detail-title"><h2 id="detail-title" tabindex="-1">'+record.id+'</h2>'+badge(record.status)+'</div>'+
    '<p class="identity"><strong>'+record.station+'</strong> · '+record.time+'</p>'+
    '<div class="metrics"><div class="metric"><span>Turbidity</span><b>'+record.turb+'</b><small>NTU</small></div><div class="metric"><span>Conductivity</span><b>'+record.cond+'</b><small>µS/cm</small></div></div>'+
    (record.context?'<p class="context">'+record.context+'</p>':'')+
    '<section class="lab"><h3>Lab note · '+record.lab+'</h3><p>'+record.note+'</p></section>'+
    (record.related?'<button class="repeat" data-related="'+record.related+'"><span><small>'+(record.id<record.related?'Linked repeat':'Original sample')+'</small> · '+record.related+'</span><span aria-hidden="true">→</span></button>':'')+
    '<section class="actions"><h3>Set disposition</h3><div class="action-row"><button class="primary" data-set="Accepted">Accept</button><button data-act="hold" aria-expanded="'+holdOpen+'">Hold</button><button data-set="Review">Review</button></div>'+
    (holdOpen?'<form class="form" id="hold-form"><label class="field-label" for="hold-note">Hold note (required)</label><textarea id="hold-note" required '+(error?'aria-invalid="true" aria-describedby="hold-error"':'')+'>'+escape(state.drafts[record.id] ?? record.dispositionNote)+'</textarea>'+(error?'<p class="error" id="hold-error" role="alert">'+error+'</p>':'')+'<div class="form-buttons"><button class="primary" type="submit">Save hold</button><button type="button" data-act="cancel">Cancel</button></div></form>':'')+
    (record.dispositionNote?'<p class="context saved-note"><strong>Disposition note</strong> · '+escape(record.dispositionNote)+'</p>':'')+
    (notice?'<div class="notice" id="result" tabindex="-1" style="margin-top:10px">'+(message?'<p><strong>'+message+'</strong></p>':'')+(excluded?'<p>'+record.id+' is outside the current filters.</p>':'')+(storageFailed?'<p>Browser storage is unavailable. Changes may be lost on reload.</p>':'')+(undo?'<button class="link-btn" data-act="undo">Undo disposition</button>':'')+(excluded&&next?'<button class="link-btn" data-open="'+next.id+'">Next match · '+next.id+'</button>':'')+'</div>':'')+'</section>';
  renderComparison();
}
function renderComparison() {
  const slots=state.pins.map(get);
  const field=(label,value)=>'<div class="compare-item"><dt>'+label+'</dt><dd>'+value+'</dd></div>';
  $('#comparison').innerHTML=slots.length ?
    '<section class="comparison" aria-labelledby="compare-title"><div class="compare-head"><div><h2 id="compare-title" tabindex="-1">Sample comparison</h2><p>'+slots.map(r=>r.id).join(' · ')+(slots.length===1?' · Pin one more sample':'')+'</p></div><div class="compare-tools">'+
    (slots.length===2?'<button data-act="compare" aria-expanded="'+state.expanded+'">'+(state.expanded?'Collapse comparison':'Compare samples')+'</button>':'')+
    '<button data-act="clear-pins">Clear pins</button></div></div>'+
    (state.expanded&&slots.length===2?'<div class="compare-grid">'+slots.map(r=>
      '<article class="compare-cell"><h3>'+r.id+'</h3><p>'+r.station+'</p><dl>'+
      field('Collected',r.time)+field('Disposition',badge(r.status))+
      field('Turbidity',r.turb+' NTU')+field('Conductivity',r.cond+' µS/cm')+
      field('Lab note · '+r.lab,r.note)+(r.dispositionNote?field('Disposition note',escape(r.dispositionNote)):'')+
      '</dl><button class="link-btn" data-open="'+r.id+'">Open '+r.id+'</button><button class="link-btn remove" data-unpin="'+r.id+'">Remove pin<span class="sr"> for '+r.id+'</span></button></article>').join('')+
      '</div>':'')+'</section>' : '';
}
function focus(selector, scroll=true) {
  const element=$(selector);
  if(element) element.focus({preventScroll:!scroll});
}
function navigate(id,origin=null,view='detail',push=true) {
  const previous={id:state.id,view:state.view};
  state.id=id; state.origin=origin; state.view=view;
  holdOpen=false; error=''; message='';
  if(push) history.pushState({river:true,id,origin,view,previous},'');
  save();render();
  if(view==='detail') focus('#detail-title',compact.matches);
  else focus($('.sample[data-open="'+id+'"]')?'.sample[data-open="'+id+'"]':'#search');
}
function returnTo(id,view) {
  const previous=history.state?.previous;
  if(previous?.id===id && previous.view===view) history.back();
  else {
    const target={river:true,id,origin:null,view,previous};
    navigate(id,null,view,false);
    history.replaceState(target,'');
  }
}
window.addEventListener('popstate',event=>{
  const target=event.state;
  if(target?.river && get(target.id)) navigate(target.id,target.origin,target.view,false);
});
function change(status,note='') {
  const record=get(state.id);
  if(record.status!==status || (record.dispositionNote || '')!==note) {
    state.undo.push({id:record.id,previous:state.edits[record.id] ?? null});
    state.edits[record.id]={status,dispositionNote:note};
    message=record.id+' saved as '+status+'.';
  } else message=record.id+' is already '+status+'.';
  delete state.drafts[record.id];
  holdOpen=false;error='';save();render();
  $('#announce').textContent=message;
  focus('#result');
}
$('#station').insertAdjacentHTML('beforeend',[...new Set(records.map(r=>r.station))].sort().map(station=>'<option>'+station+'</option>').join(''));
function syncFilters() { $('#search').value=state.q; $('#station').value=state.station; $('#status').value=state.status; }
syncFilters();
$('#search').addEventListener('input',event=>{state.q=event.target.value;save();render();});
$('#station').addEventListener('change',event=>{state.station=event.target.value;save();render();});
$('#status').addEventListener('change',event=>{state.status=event.target.value;save();render();});
document.addEventListener('input',event=>{
  if(event.target.id==='hold-note'){state.drafts[state.id]=event.target.value;save();}
});
document.addEventListener('submit',event=>{
  if(event.target.id!=='hold-form') return;
  event.preventDefault();
  const note=$('#hold-note').value.trim();
  if(note) change('Hold',note);
  else {error='Enter a note before saving Hold.';render();focus('#hold-note');}
});
document.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button) return;
  const {open,related,set,act}=button.dataset;
  if(open) navigate(open);
  if(button.dataset.unpin){
    state.pins=state.pins.filter(id=>id!==button.dataset.unpin);
    state.expanded=false;save();render();
    focus('#compare-title');
  }
  if(act==='pin'){
    const id=state.id;
    const removing=state.pins.includes(id);
    if(removing) state.pins=state.pins.filter(pin=>pin!==id);
    else state.pins=[...state.pins.slice(0,1),id];
    if(state.pins.length<2) state.expanded=false;
    save();render();
    $('#announce').textContent=id+(removing?' removed from comparison.':' pinned for comparison.');
    focus('[data-act=pin]');
  }
  if(act==='compare'){
    state.expanded=!state.expanded;save();renderComparison();
    focus(state.expanded?'#compare-title':'[data-act=compare]');
  }
  if(act==='clear-pins'){
    state.pins=[];state.expanded=false;save();render();
    focus(compact.matches&&state.view==='queue'?'#search':'[data-act=pin]');
  }
  if(related) navigate(related,state.id);
  if(set) change(set);
  if(act==='reset'){ state.q='';state.station='';state.status='';syncFilters();save();render();focus('#search'); }
  if(act==='queue') returnTo(state.id,'queue');
  if(act==='origin') returnTo(state.origin,'detail');
  if(act==='hold'){holdOpen=!holdOpen;error='';render();focus(holdOpen?'#hold-note':'[data-act=hold]');}
  if(act==='cancel'){delete state.drafts[state.id];holdOpen=false;error='';save();render();focus('[data-act=hold]');}
  if(act==='undo'){
    const index=state.undo.findLastIndex(item=>item.id===state.id);
    const entry=state.undo[index];
    if(!entry) return;
    state.undo.splice(index,1);
    if(entry.previous) state.edits[entry.id]=entry.previous;
    else delete state.edits[entry.id];
    message=entry.id+' restored to '+get(entry.id).status+'.';
    save();render();$('#announce').textContent=message;focus('#result');
  }
});
history.replaceState({...history.state,river:true,id:state.id,origin:state.origin,view:state.view},'');
render();

const canvas=$('#contours');
function contours() {
  const width=canvas.clientWidth,height=canvas.clientHeight;
  canvas.width=width;canvas.height=height;
  const pen=canvas.getContext('2d');
  const start=width>700?width*.59:width*.64;
  for(let line=0;line<23;line++){
    pen.beginPath();
    for(let x=start-70;x<width+2;x+=3){
      const distance=x-start;
      const y=height*.2+line*8-30*Math.sin(distance*.012+line*.09)+17*Math.sin(distance*.023+line*.105)-distance*.17;
      if(x===start-70) pen.moveTo(x,y);else pen.lineTo(x,y);
    }
    const ink=pen.createLinearGradient(start-70,0,width,0);
    ink.addColorStop(0,'rgba(42,111,99,0)');ink.addColorStop(.45,'rgba(42,111,99,.18)');ink.addColorStop(1,'rgba(42,111,99,.28)');
    pen.strokeStyle=ink;pen.lineWidth=line%5===0?1.3:.7;pen.stroke();
  }
}
new ResizeObserver(contours).observe(canvas);