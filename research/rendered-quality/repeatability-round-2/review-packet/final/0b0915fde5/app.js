
const q = (selector) => document.querySelector(selector);
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const format = value => value.toLocaleString('en-US', {maximumFractionDigits: 2});
const programs = ['Cone 06 bisque', 'Cone 6 glaze'];
const kilns = {Alder: {area:3000,height:28}, Ash:{area:2400,height:23}};
const stages = ['Queued','Firing','Cooling','Pickup'];
const first = '2027-05-12T00:00', last = '2027-05-16T00:00';
const seeds = {
  role:'member', load:'MC-14', open:false, piece:'tray', origin:'row-MC-14',
  loads:[
    {id:'MC-14', kiln:'Alder', program:0, start:'2027-05-12T16:00', end:'2027-05-14T09:00', stage:0},
    {id:'MC-15', kiln:'Ash', program:1, start:'2027-05-13T08:00', end:'2027-05-14T16:00', stage:0},
    {id:'MC-16', kiln:'Alder', program:1, start:'2027-05-14T12:00', end:'2027-05-15T18:00', stage:0}
  ],
  pieces:[
    {id:'cups', name:'Slip cups', owner:'Bea', program:0, area:1650, height:null, load:'MC-14'},
    {id:'bowls', name:'Blue bowls', owner:'Suri', program:1, area:2100, height:null, load:'MC-15'},
    {id:'tray', name:'Bisque tray', owner:'Jules', program:0, area:800, height:8, load:null},
    {id:'pitcher', name:'Glaze pitcher', owner:'Jules', program:1, area:500, height:24, load:null}
  ]
};
const storage = 'mill-creek-final-v1';
let state = JSON.parse(localStorage.getItem(storage) || 'null') || structuredClone(seeds);
let notice = '';
const save = () => localStorage.setItem(storage, JSON.stringify(state));
const loadById = id => state.loads.find(load => load.id === id);
const members = () => state.pieces.filter(piece => piece.owner === 'Jules');
const assigned = load => state.pieces.filter(piece => piece.load === load.id);
const used = load => assigned(load).reduce((total, piece) => total + piece.area, 0);
const free = load => Math.round((kilns[load.kiln].area - used(load))*100)/100;
const current = () => loadById(state.load);
const selectedPiece = () => members().find(piece => piece.id === state.piece);
function time(value){
  const [date, clock] = value.split('T');
  return new Date(date+'T12:00').toLocaleDateString('en-US',{month:'short',day:'numeric',...(date.startsWith('2027')?{}:{year:'numeric'})})+' '+clock;
}
const windowText = load => time(load.start)+' – '+time(load.end);
const slot = value => (Date.UTC(+value.slice(0,4),+value.slice(5,7)-1,+value.slice(8,10),+value.slice(11,13),+value.slice(14,16))-Date.UTC(2027,4,12))/3456000;
const icon = (path,size=17) => '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>';
const flame = icon('<path d="M12 3c1 5-5 6-5 11a5 5 0 0 0 10 0c0-2-1-4-3-5 0 2-1 3-2 3 1-3 2-6 0-9Z"/><path d="M4 21h16"/>',23);
const calendar = icon('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>');
const memberIcon = icon('<circle cx="12" cy="7" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/>');
const leadIcon = icon('<path d="M5 4h14v16H5zM8 8h8m-8 4h8m-8 4h5"/>');
const kilnArt = '<svg class="kiln-art" viewBox="0 0 190 113" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><ellipse cx="82" cy="40" rx="52" ry="18"/><ellipse cx="82" cy="40" rx="42" ry="12"/><path d="M30 40v35c0 10 24 18 52 18s52-8 52-18V40M30 55c0 10 24 18 52 18s52-8 52-18M30 66c0 10 24 18 52 18s52-8 52-18M40 86v12h9l3-8m56 0 3 8h9V86M132 58l24-6 13 8v14l-35 9m22-31v13l13 9m-33-6 20-4M72 15c-5-5 5-7 0-12m13 13c-5-5 5-7 0-12m13 13c-5-5 5-7 0-12M18 101h151"/><circle cx="145" cy="71" r="2"/></svg>';
function shell(){
  return '<div class="shell"><aside class="rail"><div class="brand"><span class="mark">'+flame+'</span><div><strong>Mill Creek</strong><small>Ceramics Studio</small></div></div><nav aria-label="Studio role"><div class="over">Workspace</div>'+[['member','Member',memberIcon],['lead','Shift lead',leadIcon]].map(([id,name,image])=>'<button id="role-'+id+'" data-role="'+id+'" aria-pressed="'+(state.role===id)+'">'+image+name+'</button>').join('')+'</nav><div class="rail-bottom">'+kilnArt+'<div class="local">Studio local time</div></div></aside><main><header class="mast"><div><h1>Firing desk</h1></div><div class="dated">'+calendar+' Wed, May 12, 2027</div></header><div class="workspace '+(state.open?'has-detail':'')+'"><div class="base">'+board()+piecesPanel()+'</div>'+((state.open||current())?detail(current()):'')+'</div></main></div>';
}
function board(){
  const visible = state.loads.filter(load => load.start < last && load.end > first);
  const ordered = [...state.loads].sort((a,b)=>a.start.localeCompare(b.start));
  return '<section class="board panel" aria-labelledby="schedule"><header class="board-title"><div><h2 id="schedule" tabindex="-1">Kiln schedule</h2><p class="muted">May 12–15 · Studio local time</p></div>'+boardAction()+'</header><div class="grid"><div class="days"><span class="grid-label">Kiln</span><div class="dates">'+['Wed','Thu','Fri','Sat'].map((day,i)=>'<div class="day '+(!i?'today':'')+'">'+day+'<b>May '+(12+i)+'</b></div>').join('')+'</div></div>'+Object.entries(kilns).map(([name,kiln])=>'<div class="lane"><div class="lane-name">'+name+'<small>'+format(kiln.area)+' cm²</small></div><div class="track">'+ '<div class="tick"></div>'.repeat(4)+visible.filter(load=>load.kiln===name).map(booking).join('')+'</div></div>').join('')+'</div><div class="legend"><span><i></i>Cone 06 bisque</span><span><i></i>Cone 6 glaze</span></div><div class="ledger"><h3>Firing windows</h3>'+ordered.map(loadRow).join('')+'</div></section>';
}
function booking(load){
  const left = Math.max(0,slot(load.start)), width = Math.min(100,slot(load.end))-left;
  return '<button id="slot-'+load.id+'" data-open="'+load.id+'" aria-label="'+load.kiln+' '+load.id+', '+programs[load.program]+', '+windowText(load)+'" aria-pressed="'+(state.load===load.id && state.open)+'" class="booking '+(load.program?'glaze':'')+'" style="left:'+left+'%;width:'+width+'%"><b>'+load.id+'</b><span>'+programs[load.program]+'</span></button>';
}
function loadRow(load){
  return '<button id="row-'+load.id+'" data-open="'+load.id+'" aria-pressed="'+(state.load===load.id && state.open)+'" class="load-row"><span><b>'+load.kiln+' <small> / '+load.id+'</small></b><small class="time">'+windowText(load)+'</small></span><span class="row-area">'+format(free(load))+' cm²<small>free · '+stages[load.stage]+'</small></span><span class="row-arrow" aria-hidden="true">›</span></button>';
}
function detail(load){
  if (!load) return '';
  if (!state.open) return '<aside class="detail panel preview"><div class="detail-top"><div><h2>'+load.kiln+' / '+load.id+'</h2><p>'+programs[load.program]+'</p></div></div><div class="detail-body">'+capacity(load)+'<div class="detail-block"><button id="preview" data-open="'+load.id+'">Inspect load</button></div></div></aside>';
  return '<div class="detail-view"><button class="mobile-back" data-close>‹ Kiln schedule</button><aside class="detail panel" aria-labelledby="detail-heading"><div class="detail-top"><div><h2 id="detail-heading" tabindex="-1">'+load.kiln+' / '+load.id+'</h2><p>'+programs[load.program]+'</p><small class="window">'+windowText(load)+'</small></div><button class="close-wide" data-close aria-label="Close load">×</button></div><div class="detail-body"><span class="status dot">'+(load.stage===3?'Ready for pickup':stages[load.stage])+'</span>'+capacity(load)+'<section class="detail-block"><h3>Manifest · '+assigned(load).length+'</h3>'+(assigned(load).map(piece=>manifestRow(piece,load)).join('')||'<p class="muted">No pieces assigned.</p>')+'</section>'+detailActions(load)+'</div></aside></div>';
}
function capacity(load){
  const kiln=kilns[load.kiln];
  return '<div class="capacity"><strong>'+format(free(load))+' <span>cm² free</span></strong><small>'+kiln.height+' cm max height</small></div><div class="meter" aria-hidden="true"><b style="width:'+100*used(load)/kiln.area+'%"></b></div><small>'+format(used(load))+' / '+format(kiln.area)+' cm² occupied</small>';
}
function manifestRow(piece,load){
  return '<div class="manifest-row"><div><b>'+escape(piece.name)+'</b><small>'+piece.owner+' · '+format(piece.area)+' cm²'+(piece.height===null?'':' · '+format(piece.height)+' cm tall')+'</small></div>'+((load.stage===0 && (state.role==='lead'||piece.owner==='Jules'))?'<button id="remove-'+piece.id+'" data-remove="'+piece.id+'" aria-label="'+(state.role==='lead'?'Remove ':'Withdraw ')+escape(piece.name)+'">'+(state.role==='lead'?'Remove':'Withdraw')+'</button>':'')+'</div>';
}
function fit(piece,load){
  if (!piece) return 'Choose a piece to check the fit.';
  if (piece.load) return piece.load === load.id ? 'Already assigned to '+load.id+'.' : 'Already assigned to '+piece.load+'.';
  if (load.stage !== 0) return 'This load is '+stages[load.stage].toLowerCase()+' and cannot accept pieces.';
  const reasons=[];
  if (piece.program !== load.program) reasons.push('Requires '+programs[piece.program]+'.');
  if (piece.height > kilns[load.kiln].height) reasons.push(format(piece.height)+' cm tall exceeds the '+kilns[load.kiln].height+' cm limit.');
  if (piece.area > free(load)) reasons.push('Needs '+format(piece.area)+' cm². Only '+format(free(load))+' cm² free.');
  return reasons.join(' ');
}
function trySubmit(load){
  const piece=selectedPiece();
  const reason=fit(piece,load);
  if (state.role!=='member' || reason) return;
  piece.load=load.id;
  notice=piece.name+' added to '+load.id+'.';
  refresh('piece-select');
  announce(notice);
}
function detailActions(load){
  if (state.role==='lead') return leadActions(load);
  const reason=fit(selectedPiece(),load);
  const alreadyHere=selectedPiece()?.load===load.id;
  return '<section class="detail-block action-stack"><h3>Reserve shelf space</h3><label class="sr" for="piece-select">Choose your piece</label><select id="piece-select">'+members().map(piece=>'<option value="'+piece.id+'" '+(piece.id===state.piece?'selected':'')+'>'+escape(piece.name)+' · '+format(piece.area)+' cm² × '+format(piece.height)+' cm</option>').join('')+'</select><p class="feedback '+(reason&&!alreadyHere?'error':'')+'" id="fit-note">'+escape(reason)+'</p><button id="submit-piece" class="primary" aria-describedby="fit-note" '+(reason?'disabled':'')+'>Add to '+load.id+'</button>'+(notice&&!alreadyHere?'<p class="feedback">'+escape(notice)+'</p>':'')+'</section>';
}

function boardAction(){
  return state.role==='lead' ? '<button id="new-load" class="primary" data-editor="load">+ Firing window</button>' : '';
}
function leadActions(load){
  return '<section class="detail-block action-stack"><h3>Load progress</h3><ol class="stages">'+stages.map((stage,index)=>'<li class="'+(index<load.stage?'done':'')+'" '+(index===load.stage?'aria-current="step"':'')+'>'+stage+'</li>').join('')+'</ol>'+(load.stage<3?'<button class="primary" id="advance-load">Mark '+stages[load.stage+1].toLowerCase()+'</button>':'<p class="muted" tabindex="-1" id="pickup-status">Ready for member pickup.</p>')+'<p class="feedback" role="status">'+escape(notice)+'</p></section>';
}
function piecesPanel(){
  if (state.role!=='member') return '';
  return '<section class="pieces panel" aria-labelledby="pieces-title"><div class="pieces-head"><h2 id="pieces-title">My pieces</h2><button id="new-piece" data-editor="piece">+ Register piece</button></div><div class="piece-list">'+members().map(piece=>{
    const load = loadById(piece.load);
    const status = load ? (load.stage===3?'Ready for pickup':stages[load.stage]) : 'Unassigned';
    return '<div class="piece-row"><div><b>'+escape(piece.name)+'</b><small>'+programs[piece.program]+' · '+format(piece.area)+' cm² × '+format(piece.height)+' cm</small></div><div class="piece-actions">'+(load?'<button id="piece-'+piece.id+'" data-open="'+load.id+'" data-piece="'+piece.id+'">'+load.id+' <span aria-hidden="true">›</span></button>':'')+'<small>'+status+'</small></div></div>';
  }).join('')+'</div></section>';
}
const editor = q('#editor');
function edit(kind, opener){
  const isLoad=kind==='load';
  const programField='<label>Program<select name="program">'+programs.map((program,index)=>'<option value="'+index+'">'+program+'</option>').join('')+'</select></label>';
  editor.dataset.kind=kind;
  editor.dataset.opener=opener;
  editor.innerHTML='<form id="editor-form"><h2 id="editor-title">'+(isLoad?'Add firing window':'Register a piece')+'</h2>'+(isLoad?
    '<div class="form-grid"><label>Kiln<select name="kiln"><option>Alder</option><option>Ash</option></select></label>'+programField+'</div><label>Start (local time)<input type="datetime-local" name="start" value="2027-05-15T18:00" required></label><label>End (local time)<input type="datetime-local" name="end" value="2027-05-15T23:00" required></label>':
    '<label>Piece name<input name="name" maxlength="80" required></label>'+programField+'<div class="form-grid"><label>Shelf area (cm²)<input name="area" type="number" step=".01" min=".01" required></label><label>Height (cm)<input name="height" type="number" step=".01" min=".01" required></label></div>')+
    '<p id="form-error" class="feedback error" role="alert"></p><div class="form-actions"><button type="button" id="cancel-editor">Cancel</button><button type="submit" class="primary">'+(isLoad?'Add firing window':'Register piece')+'</button></div></form>';
  editor.setAttribute('aria-labelledby','editor-title');
  editor.returnValue='';
  editor.showModal();
}
editor.addEventListener('click',event=>{
  if (event.target.id==='cancel-editor') editor.close();
});
editor.addEventListener('close',()=>{
  if (!editor.returnValue) document.getElementById(editor.dataset.opener)?.focus();
});
editor.addEventListener('submit',event=>{
  event.preventDefault();
  const data = new FormData(event.target);
  const program=Number(data.get('program'));
  const error=message=>q('#form-error').textContent=message;
  if (editor.dataset.kind==='load' && state.role==='lead'){
    const kiln=data.get('kiln'), start=data.get('start'), end=data.get('end');
    if (end<=start) return error('End time must be after the start time.');
    const conflict=state.loads.find(load=>load.kiln===kiln && start<load.end && end>load.start);
    if (conflict) return error(kiln+' is booked for '+conflict.id+' ('+windowText(conflict)+'). Choose another time or kiln.');
    const id='MC-'+(1+Math.max(...state.loads.map(load=>Number(load.id.slice(3)))));
    state.loads.push({id,kiln,program,start,end,stage:0});
    editor.close('saved');
    openLoad(id,'row-'+id);
    notice=id+' scheduled.';
    refresh('detail-heading');
    announce(notice);
  } else if (editor.dataset.kind==='piece' && state.role==='member'){
    const name=data.get('name').trim(), area=Number(data.get('area')), height=Number(data.get('height'));
    if (!name) return error('Enter a piece name.');
    if (!(area>0 && height>0 && Number.isFinite(area) && Number.isFinite(height))) return error('Enter a positive area and height.');
    const id='piece-'+Date.now()+'-'+state.pieces.length;
    state.pieces.push({id,name,owner:'Jules',program,area,height,load:null});
    state.piece=id;
    notice='';
    editor.close('saved');
    refresh('new-piece');
    announce(name+' registered.');
  }
});
function removePiece(id){
  const piece=state.pieces.find(item=>item.id===id);
  const load=loadById(piece?.load);
  if (!load || load.stage!==0 || (state.role!=='lead' && piece.owner!=='Jules')) return;
  piece.load=null;
  notice=piece.name+(state.role==='lead'?' removed from ':' withdrawn from ')+load.id+'.';
  refresh(state.role==='lead'?'advance-load':'piece-select');
  announce(notice);
}
function advanceLoad(){
  const load=current();
  if (state.role!=='lead' || load.stage>=3) return;
  load.stage++;
  notice=load.id+' moved to '+stages[load.stage].toLowerCase()+'.';
  refresh(load.stage===3?'pickup-status':'advance-load');
  announce(notice);
}

const app=q('#app');
function announce(message){q('#announcer').textContent=message;}
document.addEventListener('keydown',event=>{
  if (event.key==='Escape' && state.open && !editor.open && !event.defaultPrevented) {
    event.preventDefault();
    closeLoad();
  }
});
function render(){app.innerHTML=shell();}
function refresh(target){
  save();
  render();
  if (target) q('#'+target)?.focus({preventScroll:true});
}
function openLoad(id,origin){
  if (!state.open) history.pushState({detail:true},'');
  Object.assign(state,{load:id,origin,open:true});
  notice='';
  refresh('detail-heading');
  if (matchMedia('(max-width:650px)').matches) window.scrollTo(0,0);
}
function restoreBoard(){
  state.open=false;
  notice='';
  refresh();
  const origin=document.getElementById(state.origin)||document.getElementById('row-'+state.load)||q('#schedule');
  origin.focus();
}
function closeLoad(){
  if (history.state?.detail) history.back();
  else restoreBoard();
}
window.addEventListener('popstate',event=>{
  if (event.state?.detail){state.open=true;refresh('detail-heading');}
  else if (state.open) restoreBoard();
});
app.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if (!button) return;
  if (button.dataset.piece) state.piece=button.dataset.piece;
  if (button.dataset.open) openLoad(button.dataset.open,button.id);
  if (button.dataset.editor) edit(button.dataset.editor,button.id);
  if (button.dataset.remove) removePiece(button.dataset.remove);
  if (button.id==='advance-load') advanceLoad();
  if ('close' in button.dataset) closeLoad();
  if (button.dataset.role) {state.role=button.dataset.role;notice='';refresh(button.id);}
  if (button.id==='submit-piece') trySubmit(current());
});
app.addEventListener('change',event=>{
  if (event.target.id==='piece-select') {
    state.piece=event.target.value;
    notice='';
    refresh('piece-select');
    announce(fit(selectedPiece(),current()) || 'This piece fits '+current().id+'.');
  }
});
render();
