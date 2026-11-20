
'use strict';
const $ = selector => document.querySelector(selector);
const prefix = 'mill-creek-desk-final-v1';
const programs = {'bisque':'Cone 06 bisque','glaze':'Cone 6 glaze'};
const kilns = {Alder:{area:3000,height:28},Ash:{area:2400,height:23}};
const stages = ['Queued','Firing','Cooling','Pickup'];
const seed = {
  loads:[
    {id:'MC-14',kiln:'Alder',program:'bisque',start:'2027-05-12T16:00',end:'2027-05-14T09:00',stage:0},
    {id:'MC-15',kiln:'Ash',program:'glaze',start:'2027-05-13T08:00',end:'2027-05-14T16:00',stage:0},
    {id:'MC-16',kiln:'Alder',program:'glaze',start:'2027-05-14T12:00',end:'2027-05-15T18:00',stage:0}
  ],
  pieces:[
    {id:'bea',name:'Slip cups',owner:'Bea',area:1650,program:'bisque',load:'MC-14'},
    {id:'suri',name:'Blue bowls',owner:'Suri',area:2100,program:'glaze',load:'MC-15'},
    {id:'tray',name:'Bisque tray',owner:'Jules',area:800,height:8,program:'bisque',load:null},
    {id:'pitcher',name:'Glaze pitcher',owner:'Jules',area:500,height:24,program:'glaze',load:null}
  ]
};
function read(key,fallback){
  try{return JSON.parse(localStorage.getItem(key)) ?? fallback;}catch{return fallback;}
}
let ledger = read(prefix,seed);
let context = read(prefix+'-view',{role:'member',load:'MC-14',piece:'tray',open:true});
let notice = '', error = false;
let origin = history.state?.desk?.origin || '';
const compact = matchMedia('(max-width:900px)');
const escape = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const number = value => new Intl.NumberFormat('en-US',{maximumFractionDigits:3}).format(value);
const getLoad = id => ledger.loads.find(load=>load.id===id);
const manifest = id => ledger.pieces.filter(piece=>piece.load===id);
const used = id => manifest(id).reduce((total,piece)=>total+piece.area,0);
const remaining = load => Math.round((kilns[load.kiln].area-used(load.id))*1000)/1000;
const memberPieces = () => ledger.pieces.filter(piece=>piece.owner==='Jules');
const stamp = value => new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric'}).format(new Date(value))+' '+value.slice(11);
const windowText = load => stamp(load.start)+' – '+stamp(load.end);
function save(data){
  localStorage.setItem(prefix,JSON.stringify(data));
  ledger = data;
}
function view(){
  localStorage.setItem(prefix+'-view',JSON.stringify(context));
}
function focus(selector,scroll=false){
  const node = Array.from(document.querySelectorAll(selector)).find(el=>el.getClientRects().length);
  node?.focus({preventScroll:!scroll});
}
function loadButton(load,placement=''){
  const space = load.stage===0 ? number(remaining(load))+' cm² available' : 'Closed to submissions';
  return '<button class="load '+load.program+'" data-load="'+load.id+'" aria-current="'+(context.open&&context.load===load.id)+'" aria-label="'+load.kiln+' '+load.id+', '+programs[load.program]+', '+windowText(load)+', '+stages[load.stage]+', '+space+'" '+placement+'><b>'+load.kiln+' · '+load.id+'</b><span class="program">'+programs[load.program]+' · '+stages[load.stage]+'</span><span class="window">'+windowText(load)+'</span><span class="availability">'+space+'</span></button>';
}
const chartStart = Date.UTC(2027,4,12);
function hour(value){return (Date.parse(value+'Z')-chartStart)/3600000;}
function schedule(){
  const ordered = [...ledger.loads].sort((a,b)=>a.start.localeCompare(b.start));
  const inRange = ordered.filter(load=>hour(load.start)<96 && hour(load.end)>0);
  const shortWindow = load => Math.min(96,hour(load.end))-Math.max(0,hour(load.start)) < 28;
  const alternate = ordered.filter(load=>!inRange.includes(load)||shortWindow(load));
  const labels = ['Wed 12','Thu 13','Fri 14','Sat 15'];
  function track(kiln){
    const rowEnds=[];
    return inRange.filter(load=>load.kiln===kiln).map(load=>{
      const start=Math.max(0,hour(load.start));
      const end=Math.min(96,hour(load.end));
      let row=rowEnds.findIndex(last=>last<=start);
      if(row<0)row=rowEnds.length;
      rowEnds[row]=end;
      const left=start/96*100, right=(96-end)/96*100;
      if(shortWindow(load))return '<span aria-hidden="true" class="brief-window '+load.program+'" style="grid-row:'+(row+1)+';grid-column:1/-1;margin-left:'+left+'%;margin-right:'+right+'%"></span>';
      return loadButton(load,'style="grid-row:'+(row+1)+';grid-column:1/-1;margin-left:calc('+left+'% + 2px);margin-right:calc('+right+'% + 2px)"');
    }).join('');
  }
  $('#schedule').innerHTML = '<div class="timeline"><div class="timeline-head"><span>Kiln</span><div class="days">'+labels.map((label,i)=>'<span>'+label+(i===0?' <small>Today</small>':'')+'</span>').join('')+'</div></div>'+Object.keys(kilns).map(kiln=>'<div class="lane"><div class="lane-label">'+kiln+'</div><div class="track">'+track(kiln)+'</div></div>').join('')+'</div><div class="agenda">'+ordered.map(load=>loadButton(load)).join('')+'</div><div class="outside">'+(alternate.length?'<h3>Additional firing windows</h3><div class="outside-list">'+alternate.map(load=>loadButton(load)).join('')+'</div>':'')+'</div><div class="schedule-key"><span><i class="key"></i>Bisque</span><span><i class="key glaze"></i>Glaze</span></div>';
}
function render(){
  $('#roles').innerHTML='<div class="roles" role="group" aria-label="Desk role"><button data-role="member" aria-pressed="'+(context.role==='member')+'">Member</button><button data-role="lead" aria-pressed="'+(context.role==='lead')+'">Shift lead</button></div>';
  const lead=context.role==='lead';
  $('#board-action').innerHTML=lead?'<button class="button primary" data-form="window">+ Firing window</button>':'';
  schedule();
  $('#work').hidden=lead;
  $('#work').innerHTML=lead?'':'<div class="section-head"><h2>My pieces</h2><button class="button" data-form="piece">+ Register piece</button></div><div class="work-list">'+memberPieces().map(piece=>{
    const load=getLoad(piece.load);
    return '<div class="work-row"><div><strong>'+escape(piece.name)+'</strong><p>'+programs[piece.program]+' · '+number(piece.area)+' cm² · '+number(piece.height)+' cm high</p></div>'+(load?'<button class="button" data-load="'+load.id+'" data-origin="'+piece.id+'">'+(load.stage===3?'Ready for pickup':stages[load.stage])+' · '+load.id+'</button>':'<span class="state">Unassigned</span>')+'</div>';
  }).join('')+'</div>';
  placeWork();
  renderDetail();
}
function placeWork(){
  const work=$('#work'), host=compact.matches?$('.workspace'):$('.board');
  if(work.parentElement!==host)host.append(work);
}
compact.addEventListener('change',()=>{placeWork();renderDetail();});
function renderDetail(){
  const load = context.open && getLoad(context.load);
  if(!load){
    $('#detail').innerHTML=compact.matches?'':'<p class="detail-empty">Select a firing to see its available space and manifest.</p>';
    return;
  }
  const lead=context.role==='lead', kiln=kilns[load.kiln];
  const pieces=manifest(load.id);
  const feedback='<p class="feedback '+(error?'error':'')+'" id="feedback">'+escape(notice)+'</p>';
  const options=memberPieces().map(piece=>'<option value="'+piece.id+'"'+(piece.id===context.piece?' selected':'')+'>'+escape(piece.name)+(piece.load?' · '+piece.load:'')+'</option>').join('');
  $('#detail').innerHTML='<article class="detail-card"><div class="detail-top"><div class="line"><span class="state">'+stages[load.stage]+'</span><button data-close class="link">Back to schedule</button></div><h2 tabindex="-1" id="detail-title">'+load.kiln+' · '+load.id+'</h2><p>'+programs[load.program]+'<br>'+windowText(load)+'</p></div><div class="detail-body"><div class="capacity"><div class="line"><strong>'+number(remaining(load))+' cm²</strong><span>remaining shelf area</span></div><div class="meter" aria-hidden="true"><span style="width:'+used(load.id)/kiln.area*100+'%"></span></div><p>'+number(used(load.id))+' / '+number(kiln.area)+' cm² used · '+kiln.height+' cm max height</p></div><section class="manifest"><h3>Load manifest</h3>'+(pieces.length?'<ul>'+pieces.map(piece=>'<li><span><strong>'+escape(piece.name)+'</strong> · '+piece.owner+'</span><span>'+number(piece.area)+' cm²</span>'+((lead||piece.owner==='Jules')&&load.stage===0?'<button class="link" data-remove="'+piece.id+'" aria-label="'+(lead?'Remove ':'Withdraw ')+escape(piece.name)+'">'+(lead?'Remove':'Withdraw')+'</button>':'')+'</li>').join('')+'</ul>':'<p class="empty">No pieces assigned.</p>')+'</section>'+
  (lead||load.stage>0?'<section class="progress"><h3>Firing progress</h3><ol class="steps">'+stages.map((stage,i)=>'<li '+(i===load.stage?'aria-current="step"':'')+'>'+stage+'</li>').join('')+'</ol>'+(lead&&load.stage<3?'<button class="button primary" data-advance>Mark '+stages[load.stage+1].toLowerCase()+'</button>':'')+feedback+'</section>':'<form class="booking" id="booking"><label for="piece">Piece to submit</label><div class="line"><select id="piece" name="piece">'+options+'</select><button class="button primary" type="submit">Submit piece</button></div>'+feedback+'</form>')+'</div></article>';
}
function clear(){notice='';error=false;$('#desk-feedback').hidden=true;$('#announce').textContent='';}
function report(message,failed=false){
  notice=message;
  error=failed;
  $('#announce').textContent=message;
}
function detailState(){return {load:context.load,open:context.open,origin};}
function recordHistory(method, entry=false){
  history[method]({desk:detailState(),entry},'');
}
recordHistory('replaceState',Boolean(history.state?.entry));
function openLoad(id, source=''){
  if(!getLoad(id))return;
  clear();
  context.load=id;
  context.open=true;
  origin=source;
  view();
  recordHistory('pushState',true);
  render();
  focus('#detail-title',compact.matches);
}
function returnFocus(id,source){
  if(source&&context.role==='member'){
    const node=$('[data-origin="'+source+'"]');
    if(node){focus('[data-origin="'+source+'"]',compact.matches);return;}
  }
  focus('#schedule [data-load="'+id+'"]',compact.matches);
}
function closeLoad(){
  const id=context.load, source=origin;
  context.open=false;
  clear();
  view();
  recordHistory('replaceState');
  render();
  returnFocus(id,source);
}
window.addEventListener('popstate',event=>{
  const state=event.state?.desk;
  if(!state)return;
  const previous=context.load, source=origin;
  Object.assign(context,{load:state.load,open:state.open});
  origin=state.origin;
  clear();
  view();
  render();
  if(context.open)focus('#detail-title',compact.matches);
  else returnFocus(previous,source);
});
function changeLedger(mutator){
  const next=structuredClone(read(prefix,ledger));
  mutator(next);
  save(next);
}
function submitPiece(id){
  let failure='';
  const loadId=context.load;
  changeLedger(next=>{
    const piece=next.pieces.find(item=>item.id===id&&item.owner==='Jules');
    const load=next.loads.find(item=>item.id===loadId);
    if(!piece||!load){failure='Choose an available piece and firing.';return;}
    const kiln=kilns[load.kiln];
    const free=Math.round((kiln.area-next.pieces.filter(item=>item.load===loadId).reduce((sum,item)=>sum+item.area,0))*1000)/1000;
    const reasons=[];
    if(piece.load)reasons.push(piece.name+' is already assigned to '+piece.load+'.');
    if(load.stage!==0)reasons.push('This firing is closed to submissions.');
    if(piece.program!==load.program)reasons.push(piece.name+' needs '+programs[piece.program]+'.');
    if(piece.height>kiln.height)reasons.push(number(piece.height)+' cm high exceeds the '+kiln.height+' cm limit.');
    if(!piece.load&&piece.area>free)reasons.push(number(piece.area)+' cm² needed; only '+number(free)+' cm² remains.');
    if(reasons.length){failure=reasons.join(' ');return;}
    piece.load=loadId;
  });
  report(failure||'Piece submitted to '+loadId+'.',Boolean(failure));
  render();
  focus('#booking button');
}
function removePiece(id){
  let removed=false;
  changeLedger(next=>{
    const item=next.pieces.find(piece=>piece.id===id&&piece.load===context.load);
    const load=next.loads.find(item=>item.id===context.load);
    if(item&&load?.stage===0&&(context.role==='lead'||item.owner==='Jules')){
      item.load=null;
      removed=true;
    }
  });
  report(removed?'Piece removed. Shelf space restored.':'Only queued pieces can be removed.',!removed);
  render();
  focus(context.role==='lead'?'#detail-title':'#piece');
}
document.addEventListener('click',event=>{
  const trigger=event.target.closest('button');
  if(!trigger)return;
  if(trigger.dataset.role){
    clear();
    context.role=trigger.dataset.role;
    view();
    render();
    focus('[data-role="'+context.role+'"]');
  }
  else if(trigger.dataset.form)showForm(trigger.dataset.form);
  else if(trigger.hasAttribute('data-cancel'))$('#dialog').close();
  else if(trigger.hasAttribute('data-advance'))advance();
  else if(trigger.dataset.load)openLoad(trigger.dataset.load,trigger.dataset.origin);
  else if(trigger.hasAttribute('data-close'))closeLoad();
  else if(trigger.dataset.remove)removePiece(trigger.dataset.remove);
});
document.addEventListener('submit',event=>{
  if(event.target.dataset.kind){
    event.preventDefault();
    addRecord(event.target);
  }
  else if(event.target.id==='booking'){
    event.preventDefault();
    submitPiece(new FormData(event.target).get('piece'));
  }
});
document.addEventListener('change',event=>{
  if(event.target.id==='piece'){
    context.piece=event.target.value;
    clear();
    $('#feedback').textContent='';
    view();
  }
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&context.open&&!$('#dialog').open&&$('#detail').contains(document.activeElement))closeLoad();
});
window.addEventListener('storage',event=>{
  if(event.key===prefix){
    ledger=read(prefix,seed);
    render();
  }
});
render();

const programOptions=()=>Object.entries(programs).map(([value,label])=>'<option value="'+value+'">'+label+'</option>').join('');
let formOrigin='';
function showForm(kind){
  if((kind==='window')!==(context.role==='lead'))return;
  const dialog=$('#dialog');
  formOrigin='[data-form="'+kind+'"]';
  dialog.setAttribute('aria-labelledby','form-title');
  const program='<label>Program<select name="program">'+programOptions()+'</select></label>';
  const isWindow=kind==='window';
  const fields=isWindow?
    '<p class="form-note">Times are studio local.</p><label>Kiln<select name="kiln"><option>Alder</option><option>Ash</option></select></label>'+program+'<label>Starts<input required type="datetime-local" name="start" value="2027-05-12T09:00"></label><label>Ends<input required type="datetime-local" name="end" value="2027-05-12T15:00"></label>':
    '<label>Piece name<input name="name" maxlength="70" required></label>'+program+'<div class="form-grid"><label>Shelf area (cm²)<input type="number" name="area" required min="0.001" max="999999" step="0.001"></label><label>Height (cm)<input type="number" name="height" required min="0.001" max="999999" step="0.001"></label></div>';
  dialog.innerHTML='<h2 id="form-title">'+(isWindow?'Add a firing window':'Register a piece')+'</h2><form data-kind="'+kind+'">'+fields+'<p id="form-error" class="error" role="alert" hidden></p><div class="dialog-actions"><button class="button" type="button" data-cancel>Cancel</button><button class="button primary" type="submit">'+(isWindow?'Add window':'Register piece')+'</button></div></form>';
  dialog.showModal();
}
function formError(message){
  const node=$('#form-error');
  node.hidden=false;
  node.textContent=message;
}
function addRecord(form){
  const fields=Object.fromEntries(new FormData(form));
  let id='',failure='';
  if(form.dataset.kind==='window'){
    if(fields.end<=fields.start){formError('End must be after the start.');return;}
    changeLedger(next=>{
      const conflict=next.loads.find(load=>load.kiln===fields.kiln&&load.start<fields.end&&fields.start<load.end);
      if(conflict){failure=fields.kiln+' overlaps '+conflict.id+' ('+windowText(conflict)+'). Choose another time or kiln.';return;}
      id='MC-'+(Math.max(...next.loads.map(load=>Number(load.id.slice(3))))+1);
      next.loads.push({id,kiln:fields.kiln,program:fields.program,start:fields.start,end:fields.end,stage:0});
    });
    if(failure){formError(failure);return;}
    $('#dialog').close();
    openLoad(id);
    report(id+' added to the schedule.');
    renderDetail();
    focus('#detail-title',compact.matches);
  }else{
    const name=fields.name.trim();
    if(!name){formError('Enter a piece name.');return;}
    id='piece-'+crypto.randomUUID();
    changeLedger(next=>{
      next.pieces.push({id,name,owner:'Jules',program:fields.program,area:Number(fields.area),height:Number(fields.height),load:null});
    });
    context.piece=id;
    view();
    $('#dialog').close();
    clear();
    render();
    $('#desk-feedback').textContent=name+' registered.';
    $('#desk-feedback').hidden=false;
    focus('[data-form="piece"]');
  }
}
function advance(){
  const current=getLoad(context.load);
  if(context.role!=='lead'||!current||current.stage>=3)return;
  let moved=false;
  changeLedger(next=>{
    const load=next.loads.find(item=>item.id===current.id);
    if(load?.stage===current.stage){
      load.stage++;
      moved=true;
    }
  });
  report(moved?current.id+' marked '+stages[current.stage+1].toLowerCase()+'.':'The firing has already changed. Review its current state.',!moved);
  render();
  focus('[data-advance]');
  if(!$('#detail').contains(document.activeElement))focus('#detail-title');
}
$('#dialog').addEventListener('close',()=>{
  if(document.activeElement===document.body)focus(formOrigin);
});
