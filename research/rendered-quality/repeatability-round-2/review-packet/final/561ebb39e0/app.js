const fixtures=[
['RW-201','Mill Weir','Jun 3','07:42','16.8','294','Review','Storm runoff.','RW-205','L-18','Logged intact seal.'],
['RW-202','Market Bridge','Jun 3','07:55','7.2','318','Accepted','','','L-19','Logged clear duplicate.'],
['RW-203','North Ferry','Jun 3','08:10','2.6','410','Review','Bottle-label mismatch.','RW-206','L-20','Requests chain-of-custody check.'],
['RW-204','Birch Cut','Jun 3','08:22','3.2','360','Accepted','','','L-21','Logged intact seal.'],
['RW-205','Mill Weir','Jun 4','07:40','5.1','298','Review','Repeat for RW-201.','RW-201','L-22','Runoff receded overnight.'],
['RW-206','North Ferry','Jun 4','08:12','2.5','408','Hold','Repeat for RW-203.','RW-203','L-23','Second bottle identifier verified.'],
['RW-207','Birch Cut','Jun 4','08:50','4.1','365','Review','Field meter recalibrated.','','L-24','Reports fresh check standard.'],
['RW-208','Market Bridge','Jun 4','09:10','6.9','321','Review','','','L-25','Reports late transport and intact seal.']
].map(([id,station,day,time,ntu,ec,status,reason,link,lab,note])=>({id,station,day,time,ntu,ec,status,reason,link,lab,note}));
const root=document.getElementById('workspace');
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const badge=status=>`<span class="badge" data-status="${status}">${status}</span>`;
const timeOf=r=>`${r.day} · ${r.time}`;
const measure=r=>`<div class="measure num"><div><small>Turbidity</small><strong>${r.ntu}</strong> <span>NTU</span></div><div><small>Conductivity</small><strong>${r.ec}</strong> <span>µS/cm</span></div></div>`;
const columns='<div class="columns" aria-hidden="true"><span>Sample</span><span>Station</span><span class="reading">NTU</span><span class="reading">µS/cm</span><span>Disposition</span></div>';
const row=(r,active)=>`<button class="row num" type="button" data-open="${r.id}" aria-current="${active===r.id}"><span><span class="id">${r.id}</span><small>${timeOf(r)}</small></span><span class="station">${r.station}</span><span class="reading">${r.ntu}<span class="visually-hidden"> NTU turbidity</span></span><span class="reading">${r.ec}<span class="visually-hidden"> µS/cm conductivity</span></span>${badge(r.status)}<span class="arrow" aria-hidden="true">›</span></button>`;
const lab=r=>`<div class="lab"><h3>Lab note <span>${r.lab}</span></h3><p>${r.note}</p></div>`;
const detailHead=r=>`<div class="heading"><div><h2 id="sample-title" tabindex="-1">${r.id}</h2><p class="station">${r.station}</p><small class="num">Collected ${timeOf(r)}</small></div>${badge(r.status)}</div>`;
const key='riverwatch-handoff-final-v1';
const find=id=>fixtures.find(r=>r.id===id);
const defaults={query:'',station:'',status:'',edits:{},undo:{},pair:['',''],id:'RW-201',view:'ledger',origin:null,draft:null,last:null,compareReturn:null};
let state={...defaults};
try{state={...defaults,...JSON.parse(localStorage.getItem(key)||'{}')}}catch{}
let storageError=false;
let returnKind=history.state?.returnKind||'';
function save(){
 try{localStorage.setItem(key,JSON.stringify(state));storageError=false}
 catch{storageError=true}
 document.getElementById('storage').hidden=!storageError;
}
function record(id){const base=find(id);return base?{...base,...state.edits[id]}:null}
function visible(){
 const q=state.query.trim().toLowerCase();
 return fixtures.map(r=>record(r.id)).filter(r=>(!q||[r.id,r.lab,r.note].join(' ').toLowerCase().includes(q))&&(!state.station||r.station===state.station)&&(!state.status||r.status===state.status));
}
const stationValues=[...new Set(fixtures.map(r=>r.station))].sort();
const options=(values,all)=>`<option value="">${all}</option>${values.map(v=>`<option value="${v}">${v}</option>`).join('')}`;
const order=['Review','Hold','Accepted'];
const locationState=()=>({rw:true,id:state.id,view:state.view,origin:state.origin,compareReturn:state.compareReturn,returnKind});
const compareButton=document.getElementById('compare');
compareButton.hidden=false;
root.innerHTML=`<div id="storage" class="notice boundary" role="alert" hidden>Browser storage is unavailable. Changes will last until this tab is reloaded.</div>
 <section class="panel ledger" aria-labelledby="register-title"><div class="ledger-head"><div class="heading"><h2 id="register-title">Sample register</h2><span class="summary" id="count" role="status"></span></div>
 <div class="filters"><label>Search<input id="search" type="search" placeholder="Sample ID or lab note" autocomplete="off"></label>
 <label>Station<select id="station">${options(stationValues,'All stations')}</select></label>
 <label>Disposition<select id="status">${options(order,'All dispositions')}</select></label></div></div><div id="results"></div>
 </section>
 <section class="panel detail" id="detail" aria-labelledby="sample-title"></section>
 <section class="panel compare" id="comparison" aria-labelledby="compare-title" hidden></section>`;
const $=selector=>document.querySelector(selector);
const ledger=$('.ledger'),detail=$('#detail'),comparison=$('#comparison');
for(const [id,prop] of [['search','query'],['station','station'],['status','status']]){
 const el=$('#'+id);el.value=state[prop];
 el.addEventListener(id==='search'?'input':'change',()=>{
   state[prop]=el.value; render(); save();
 });
}
function reset(){
 state.query=state.station=state.status='';
 for(const id of ['search','station','status'])$('#'+id).value='';
 render();save();$('#search').focus();
}
function renderLedger(list){
 $('#count').textContent=`${list.length} of ${fixtures.length} samples`;
 $('#results').innerHTML=list.length?columns+list.map(r=>row(r,state.id)).join(''):
 '<div class="empty"><h3>No matching samples</h3><p>Try another search or clear the filters.</p><button id="clear-filters">Clear filters</button></div>';
}
function notice(r,list){
 const outside=!list.some(x=>x.id===r.id);
 const changed=state.last?.id===r.id;
 const canUndo=Boolean(state.undo[r.id]?.length);
 if(!outside&&!changed&&!canUndo)return '';
 const index=fixtures.findIndex(x=>x.id===r.id);
 const next=list.find(x=>fixtures.indexOf(find(x.id))>index)||list[0];
 const message=[changed?state.last.message:'',outside&&!next?'No samples match the current filters.':outside&&changed?'Outside the current filters.':''].filter(Boolean).join(' ');
 return `<div id="feedback" class="notice ${outside?'boundary':''}" tabindex="-1">
 <p role="status">${escapeHtml(message)}</p>
 ${canUndo?'<button id="undo">Undo disposition</button>':''}
 ${outside?(next?`<button id="next" data-open="${next.id}">Next matching sample <strong>${next.id}</strong> →</button>`:'<button id="reset-detail">Clear filters</button>'):''}</div>`;
}
function renderDetail(r,list){
 const editing=state.draft?.id===r.id;
 const index=state.pair.indexOf(r.id);
 detail.innerHTML=`<div class="detail-head"><div class="return-links"><button class="mobile detail-back" id="register-back">‹ Sample register</button>${state.origin?`<button class="detail-back" id="related-back">‹ Back to ${state.origin.id}</button>`:''}</div>${detailHead(r)}${!list.some(x=>x.id===r.id)&&state.last?.id!==r.id?'<p class="outside-label">Outside the current filters</p>':''}</div>
 <div class="block">${measure(r)}</div>
 <div class="block">${lab(r)}</div>
 ${r.reason||r.link?`<div class="block relationship"><div><h3>${r.link?(r.id==='RW-205'||r.id==='RW-206'?'Original sample':'Repeat sample'):'Field assessment'}</h3>${r.reason&&!r.reason.startsWith('Repeat for')?`<p>${r.reason}</p>`:''}</div>${r.link?`<button id="related" data-related="${r.link}">Open ${r.link} →</button>`:''}</div>`:''}
 <div class="block"><h3>Set disposition</h3>
 <div class="actions"><button data-set="Accepted" aria-pressed="${r.status==='Accepted'}">Accept</button><button data-set="Hold" aria-pressed="${r.status==='Hold'}">Hold</button><button data-set="Review" aria-pressed="${r.status==='Review'}">Review</button></div>
 ${r.dispositionNote?`<div class="saved-note"><small>Hold note</small><p>${escapeHtml(r.dispositionNote)}</p></div>`:''}
 ${editing?`<form id="hold-form" class="holdform" novalidate><label for="hold-note">Hold note (required)</label><textarea id="hold-note" rows="3" required aria-describedby="hold-error">${escapeHtml(state.draft.note)}</textarea><p class="error" id="hold-error" role="alert" hidden>Enter a note before saving Hold.</p><div class="draft-actions"><button class="primary" type="submit">Save Hold</button><button type="button" id="cancel-hold">Cancel</button></div></form>`:''}
 ${notice(r,list)}</div>
 <div class="block comparison-tools"><button class="quiet" id="pin" aria-pressed="${index>=0}">${index>=0?'Remove from comparison':state.pair.every(Boolean)?'Replace sample B':'Add to comparison'}</button></div>`;
 if(editing){
  const input=$('#hold-note');
  input.addEventListener('input',()=>{state.draft.note=input.value;input.removeAttribute('aria-invalid');$('#hold-error').hidden=true;save()});
  $('#hold-form').addEventListener('submit',event=>{
   event.preventDefault();
   const note=input.value.trim();
   if(!note){$('#hold-error').hidden=false;input.setAttribute('aria-invalid','true');input.focus();return}
   commit(r,'Hold',note);
  });
 }
}
function renderComparison(){
 const pair=state.pair.map(record);
 const optional=['reason','link','dispositionNote'].filter(key=>pair.some(r=>r?.[key]));
 const labels={reason:'Assessment',link:'Linked sample',dispositionNote:'Hold note'};
 const fact=(label,value)=>`<div class="fact"><dt>${label}</dt><dd>${value}</dd></div>`;
 comparison.innerHTML=`<div class="compare-head"><button id="compare-back">‹ Back</button><h2 id="compare-title" tabindex="-1">Compare samples</h2></div>
 <div class="compare-grid" style="--fact-rows:${5+optional.length}">${pair.map((r,i)=>{
  const id=state.pair[i];
  return `<section class="slot"><div class="slot-picker"><label for="slot-${i}">Sample ${i===0?'A':'B'}</label><select id="slot-${i}" data-slot="${i}"><option value="">Choose a sample</option>
  ${fixtures.map(x=>`<option value="${x.id}" ${x.id===id?'selected':''} ${x.id===state.pair[1-i]?'disabled':''}>${x.id} · ${x.station}</option>`).join('')}</select></div>
  ${r?`<h3 class="slot-identity">${r.station}</h3><dl>
  ${fact('Disposition',badge(r.status))}
  ${fact('Collected',`<span class="num">${timeOf(r)}</span>`)}
  <div class="fact"><dt class="visually-hidden">Readings</dt><dd>${measure(r)}</dd></div>
  ${fact('Lab note · '+r.lab,r.note)}
  ${optional.map(key=>fact(labels[key],r[key]?escapeHtml(r[key]):'<span class="muted">—</span>')).join('')}</dl>`:'<div class="slot-empty" aria-hidden="true"></div>'}</section>`;
 }).join('')}</div>`;
}
function render(){
 const list=visible(),r=record(state.id);
 root.dataset.view=state.view;
 const comparing=state.view==='compare';
 ledger.hidden=detail.hidden=comparing;
 comparison.hidden=!comparing;
 const pinned=state.pair.filter(Boolean).length;
 compareButton.innerHTML=`<span aria-hidden="true">⇄</span> Compare samples${pinned?` <span class="pin-count">${pinned}</span>`:''}`;
 compareButton.hidden=comparing;
 compareButton.setAttribute('aria-expanded',String(comparing));
 compareButton.setAttribute('aria-controls','comparison');
 if(comparing){renderComparison();return}
 renderLedger(list);renderDetail(r,list);
}
function focus(selector,top=false){
 const target=$(selector);
 if(!target)return;
 if(top)window.scrollTo(0,0);
 target.focus({preventScroll:top});
 if(top&&target.getBoundingClientRect().bottom>window.innerHeight)target.scrollIntoView({block:'nearest'});
}
function setRoute(view,id=state.id,origin=null,replace=false,kind=''){
 returnKind=kind;
 state.view=view;state.id=id;state.origin=origin;
 const url=location.pathname+location.search+(view==='detail'?'#'+id:view==='compare'?'#compare':'');
 if(replace)history.replaceState(locationState(),'',url);
 else history.pushState(locationState(),'',url);
 render();save();
}
function open(id,origin=null){
 if(id!==state.id||state.view!=='detail'||state.origin!==origin)setRoute('detail',id,origin,false,origin?'related':'');
 focus('#sample-title',true);
}
function focusRegister(){
 const target=$('[data-open="'+state.id+'"]');
 if(target&&target.closest('#results'))target.focus();
 else $('#search').focus();
}
function returnFromCompare(){
 if(returnKind==='compare'){history.back();return}
 const from=state.compareReturn||{view:'ledger',id:state.id,origin:null};
 state.compareReturn=null;
 setRoute(from.view,from.id,from.origin,true);
 focus('#compare',true);
}
function toggleCompare(){
 if(state.view==='compare'){returnFromCompare();return}
 state.compareReturn={view:state.view,id:state.id,origin:state.origin};
 setRoute('compare',state.id,state.origin,false,'compare');
 focus('#compare-title',true);
}
function commit(r,status,note=''){
 if(r.status===status&&(r.dispositionNote||'')===note){
  state.draft=null;render();save();focus('[data-set="'+status+'"]');return;
 }
 (state.undo[r.id]??=[]).push({status:r.status,dispositionNote:r.dispositionNote||''});
 state.edits[r.id]={status,dispositionNote:note};
 state.draft=null;
 state.last={id:r.id,message:r.id+' set to '+status+'.'};
 render();save();focus('#feedback');
}
function undo(r){
 const past=state.undo[r.id]?.pop();
 if(!past)return;
 state.edits[r.id]=past;
 state.last={id:r.id,message:r.id+' restored to '+past.status+'.'};
 state.draft=null;render();save();focus('#feedback');
}
function pin(r){
 const index=state.pair.indexOf(r.id);
 if(index>=0)state.pair[index]='';
 else{
  const free=state.pair.indexOf('');
  state.pair[free>=0?free:1]=r.id;
 }
 render();save();focus('#pin');
}
compareButton.addEventListener('click',toggleCompare);
comparison.addEventListener('change',e=>{
 if(e.target.dataset.slot===undefined)return;
 const index=Number(e.target.dataset.slot);
 state.pair[index]=e.target.value;render();save();focus('#slot-'+index);
});
root.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 const r=record(state.id);
 if(b.dataset.open){open(b.dataset.open);return}
 if(b.dataset.related){open(b.dataset.related,{id:r.id,view:state.view,origin:state.origin});return}
 if(b.dataset.set){
  if(b.dataset.set==='Hold'){state.draft={id:r.id,note:state.draft?.id===r.id?state.draft.note:r.dispositionNote||''};render();save();focus('#hold-note')}
  else commit(r,b.dataset.set);
  return;
 }
 switch(b.id){
  case 'undo': undo(r);break;
  case 'pin': pin(r);break;
  case 'clear-filters': reset();break;
  case 'reset-detail':
   reset();
   if(matchMedia('(max-width:820px)').matches){setRoute('ledger');focusRegister()}
   else focus('#search');
   break;
  case 'cancel-hold': state.draft=null;render();save();focus('[data-set=Hold]');break;
  case 'register-back': setRoute('ledger');focusRegister();break;
  case 'compare-back': returnFromCompare();break;
  case 'related-back': {
   if(returnKind==='related'){history.back();break}
   const origin=state.origin;
   setRoute(origin.view,origin.id,origin.origin,true);
   focus('#related');break;
  }
 }
});
window.addEventListener('popstate',event=>{
 const target=event.state;
 if(!target?.rw)return;
 const fromCompare=state.view==='compare',fromRelated=state.origin?.id===target.id;
 returnKind=target.returnKind||'';
 Object.assign(state,{view:target.view,id:target.id,origin:target.origin,compareReturn:target.compareReturn});
 render();save();
 if(fromCompare)focus('#compare',true);
 else if(state.view==='compare')focus('#compare-title',true);
 else if(state.view==='ledger')focusRegister();
 else focus(fromRelated?'#related':'#sample-title',!fromRelated);
});
const hash=location.hash.slice(1);
if(find(hash)){state.id=hash;state.view='detail'}
else if(hash==='compare')state.view='compare';
if(history.state?.rw&&history.state.id===state.id&&history.state.view===state.view){
 state.origin=history.state.origin;
 state.compareReturn=history.state.compareReturn;
}
setRoute(state.view,state.id,state.origin,true,history.state?.rw?returnKind:'');
