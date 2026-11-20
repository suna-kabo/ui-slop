const $ = s => document.querySelector(s);
const programs = ['Cone 06 bisque', 'Cone 6 glaze'];
const stages = ['Queued','Firing','Cooling','Pickup'];
const kilns = {Alder:{area:3000,height:28},Ash:{area:2400,height:23}};
const seed = {role:'member',selected:'MC-14',choice:'tray',loads:[
{id:'MC-14',kiln:'Alder',program:0,start:'2027-05-12T16:00',end:'2027-05-14T09:00',stage:0},
{id:'MC-15',kiln:'Ash',program:1,start:'2027-05-13T08:00',end:'2027-05-14T16:00',stage:0},
{id:'MC-16',kiln:'Alder',program:1,start:'2027-05-14T12:00',end:'2027-05-15T18:00',stage:0}],
pieces:[
{id:'cups',name:'Slip cups',owner:'Bea',program:0,area:1650,load:'MC-14'},
{id:'bowls',name:'Blue bowls',owner:'Suri',program:1,area:2100,load:'MC-15'},
{id:'tray',name:'Bisque tray',owner:'Jules',program:0,area:800,height:8},
{id:'pitcher',name:'Glaze pitcher',owner:'Jules',program:1,area:500,height:24}]};
const key='mill-creek-desk-v1';
let data=JSON.parse(localStorage.getItem(key)||'null') || seed;
let open=Boolean(history.state?.load), origin=history.state?.origin || data.origin || 'row', message='';
const save=()=>localStorage.setItem(key,JSON.stringify(data));
const num=n=>n.toLocaleString('en-US');
const local=value=>new Date(value);
const short=value=>local(value).toLocaleDateString('en-US',{month:'short',day:'numeric'})+' '+value.slice(11,16);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const manifest=l=>data.pieces.filter(p=>p.load===l.id);
const used=l=>manifest(l).reduce((total,p)=>total+p.area,0);
const free=l=>kilns[l.kiln].area-used(l);
const load=()=>data.loads.find(l=>l.id===data.selected);
const piece=id=>data.pieces.find(p=>p.id===id);
const start=local('2027-05-12T00:00'), end=local('2027-05-16T00:00');
const pos=value=>Math.min(100,Math.max(0,(local(value)-start)/(end-start)*100));
const pressed=l=>String(data.selected===l.id);
const own=()=>data.pieces.filter(p=>p.owner==='Jules');
function reason(p,l){
 if(!p)return 'Choose a piece.';
 if(p.load)return 'This piece is already assigned to '+p.load+'.';
 if(l.stage)return 'This load is no longer queued.';
 if(p.program!==l.program)return 'This piece needs '+programs[p.program]+'.';
 if(p.height>kilns[l.kiln].height)return p.height+' cm exceeds the '+kilns[l.kiln].height+' cm height limit.';
 if(p.area>free(l))return num(p.area)+' cm² needed · '+num(free(l))+' cm² available.';
 return '';
}
function board(){
 return '<section class="board"><div class="sectionhead"><h2>Kiln schedule</h2><div class="key"><span>Bisque</span><span>Glaze</span></div></div><div class="axis"><span>Local time</span><div class="days">'+['Wed 12','Thu 13','Fri 14','Sat 15'].map(d=>'<span>'+d+'</span>').join('')+'</div></div>'+Object.keys(kilns).map(k=>'<div class="lane"><strong class="kiln">'+k+'</strong><div class="track">'+data.loads.filter(l=>l.kiln===k&&pos(l.end)>pos(l.start)).map(l=>'<button class="bar '+(!l.program?'bisque':'')+'" data-load="'+l.id+'" data-origin="bar" aria-pressed="'+pressed(l)+'" aria-label="'+k+' '+l.id+', '+programs[l.program]+', '+short(l.start)+' to '+short(l.end)+'" style="left:'+pos(l.start)+'%;width:'+(pos(l.end)-pos(l.start))+'%"><strong>'+l.id+'</strong><span>'+programs[l.program]+'</span></button>').join('')+'</div></div>').join('')+'</section>';
}
function ledger(){
 return '<section class="ledger"><div class="sectionhead"><h2>Firing loads</h2>'+ (data.role==='lead'?'<button class="primary" id="new-load">+ Add firing window</button>':'') +'</div>'+[...data.loads].sort((a,b)=>a.start.localeCompare(b.start)).map(l=>'<button class="row" data-load="'+l.id+'" data-origin="row" aria-pressed="'+pressed(l)+'"><span><strong>'+l.id+'</strong><small>'+l.kiln+'</small><small class="rowtime">'+short(l.start)+' – '+short(l.end)+'</small></span><span>'+programs[l.program]+'<small>'+stages[l.stage]+'</small></span><span><strong>'+num(free(l))+' cm²</strong><small>available</small></span><span aria-hidden="true">›</span></button>').join('')+'</section>';
}
function detail(l){
 const k=kilns[l.kiln], items=manifest(l);
 return '<button class="return" id="return">← Back to schedule</button><div class="split"><h2 id="detail-title" tabindex="-1">'+l.id+'</h2><span class="badge">'+stages[l.stage]+'</span></div><p>'+l.kiln+' kiln · '+programs[l.program]+'</p><p class="quiet">'+short(l.start)+' – '+short(l.end)+'</p><hr><h3>Shelf capacity</h3><div class="capacity">'+num(free(l))+' cm² free</div><div class="meter" role="meter" aria-label="Occupied shelf area" aria-valuenow="'+used(l)+'" aria-valuemin="0" aria-valuemax="'+k.area+'"><span style="width:'+used(l)/k.area*100+'%"></span></div><p class="quiet">'+num(used(l))+' of '+num(k.area)+' cm² used · '+k.height+' cm max height</p><hr><h3>Load manifest</h3><ul class="manifest">'+(items.length?items.map(p=>'<li class="split"><span><strong>'+esc(p.name)+'</strong><small>'+p.owner+' · '+num(p.area)+' cm²</small></span>'+(!l.stage&&(data.role==='lead'||p.owner==='Jules')?'<button class="secondary" data-remove="'+p.id+'">'+(data.role==='lead'?'Remove':'Withdraw')+'</button>':'')+'</li>').join(''):'<li><p>No pieces assigned.</p></li>')+'</ul>'+actions(l)+'<p class="message" role="status" id="message">'+esc(message)+'</p>';
}
function actions(l){
 const progress='<div class="progress" aria-label="Load progress">'+stages.map((stage,i)=>'<span '+(i===l.stage?'class="current" aria-current="step"':'')+'>'+stage+'</span>').join('')+'</div>';
 if(data.role==='lead'){
   return '<hr><h3>Firing progress</h3>'+progress+(l.stage<3?'<button class="primary" id="advance">'+['Start firing','Move to cooling','Mark for pickup'][l.stage]+'</button>':'<p class="quiet pickup">Ready for pickup.</p>');
 }
 if(l.stage)return '<hr><h3>Firing progress</h3>'+progress+(l.stage===3?'<p class="quiet pickup">Ready for pickup.</p>':'');
 return '<label for="choice">Piece to submit</label><select id="choice">'+own().map(p=>'<option value="'+p.id+'" '+(p.id===data.choice?'selected':'')+'>'+esc(p.name)+' · '+num(p.area)+' cm² × '+p.height+' cm'+(p.load?' · '+p.load:'')+'</option>').join('')+'</select><button class="primary" id="submit">Submit piece</button>';
}
function pieces(){
 return '<section class="pieces"><div class="sectionhead"><h2>My pieces <span class="owner">· Jules</span></h2><button id="register" class="secondary">Add piece</button></div>'+own().map(p=>{
   const assigned=data.loads.find(l=>l.id===p.load);
   const status=assigned?(assigned.stage===3?'Ready for pickup':stages[assigned.stage])+' · '+assigned.id:'Unassigned';
   return '<div class="piece"><span><strong>'+esc(p.name)+'</strong><small>'+programs[p.program]+' · '+num(p.area)+' cm² × '+p.height+' cm</small></span>'+(assigned?'<button class="secondary" data-load="'+assigned.id+'" data-origin="piece" data-piece="'+p.id+'">'+status+' <span aria-hidden="true">›</span></button>':'<span class="badge">Unassigned</span>')+'</div>';
 }).join('')+'</section>';
}
function setRole(role){
 if(data.role===role)return;
 data.role=role;message='';save();render();
}
for(const role of ['member','lead']) $('#'+role).addEventListener('click',()=>setRole(role));
const editor=$('#editor');
let editorOrigin='';
const programOptions=programs.map((p,i)=>'<option value="'+i+'">'+p+'</option>').join('');
function showEditor(kind){
 editorOrigin=kind==='piece'?'register':'new-load';
 editor.innerHTML='<form id="edit-form"><h2 id="editor-title">'+(kind==='piece'?'Register a piece':'Add firing window')+'</h2>'+
 (kind==='piece'?'<label>Piece name<input name="name" required maxlength="80" autofocus></label>':'<label>Kiln<select name="kiln" autofocus><option>Alder</option><option>Ash</option></select></label>')+
 '<label>Program<select name="program">'+programOptions+'</select></label>'+
 (kind==='piece'?'<label>Shelf area (cm²)<input name="area" type="number" min="0.01" step="any" required></label><label>Height (cm)<input name="height" type="number" min="0.01" step="any" required></label>':'<div class="schedule-fields"><label>Start (local)<input type="datetime-local" name="start" min="2027-05-12T00:00" max="9999-12-31T23:59" required></label><label>End (local)<input type="datetime-local" name="end" max="9999-12-31T23:59" required></label></div>')+
 '<p class="message" role="alert" id="editor-error"></p><footer><button type="button" class="secondary" id="cancel-edit">Cancel</button><button type="submit" class="primary">'+(kind==='piece'?'Register piece':'Add firing window')+'</button></footer></form>';
 editor.setAttribute('aria-labelledby','editor-title');
 $('#cancel-edit').onclick=()=>editor.close();
 $('#edit-form').onsubmit=e=>{
   e.preventDefault();
   const values=Object.fromEntries(new FormData(e.target));
   const error=$('#editor-error');
   if(kind==='piece'){
     const name=values.name.trim();
     if(!name){error.textContent='Enter a piece name.';return}
     const id='piece-'+Date.now()+'-'+data.pieces.length;
     data.pieces.push({id,name,owner:'Jules',program:Number(values.program),area:Number(values.area),height:Number(values.height)});
     data.choice=id;save();editor.close();render();$('#register')?.focus();announce(name+' registered.');return;
   }
   const {kiln,start,end}=values;
   if(start>=end){error.textContent='End must be after the start.';return}
   const conflict=data.loads.find(l=>l.kiln===kiln&&start<l.end&&end>l.start);
   if(conflict){error.textContent=kiln+' overlaps '+conflict.id+' ('+short(conflict.start)+' – '+short(conflict.end)+').';return}
   const id='MC-'+(Math.max(...data.loads.map(l=>Number(l.id.split('-')[1])))+1);
   data.loads.push({id,kiln,start,end,program:Number(values.program),stage:0});
   editor.close();selectLoad(id,'row');announce(id+' added.');
 };
 editor.showModal();
}
editor.addEventListener('close',()=>{if(!editor.open && !document.activeElement?.closest('#app')) $('#'+editorOrigin)?.focus()});
function announce(text){$('#live').textContent=text}
function render(){
 const l=load();
 $('#subtitle').textContent=data.role==='lead'?'Manage firing windows and manifests':'Kiln reservations and pickup';
 $('#app').innerHTML='<div class="desk '+(open?'open':'')+'"><div class="overview">'+board()+ledger()+(data.role==='member'?pieces():'')+'</div><aside class="detail" aria-label="Selected firing load">'+detail(l)+'</aside></div>';
 for(const role of ['member','lead']) $('#'+role).setAttribute('aria-pressed',role===data.role);
}
function selectLoad(id,from){
 data.selected=id;origin=from;data.origin=from;message='';
 if(!open) history.pushState({load:id,origin:from},'','#'+id);
 else history.replaceState({load:id,origin:from},'','#'+id);
 open=true;save();render();$('#detail-title').focus();
}
function returnFocus(){
 render();($(`[data-origin="${origin}"][data-load="${data.selected}"]`)||$(`.row[data-load="${data.selected}"]`))?.focus();
}
window.addEventListener('popstate',()=>{open=Boolean(history.state?.load);if(open){data.selected=history.state.load;origin=history.state.origin||'row'}message='';save();if(open){render();$('#detail-title').focus()}else returnFocus()});
$('#app').addEventListener('change',e=>{if(e.target.id==='choice'){data.choice=e.target.value;save()}});
$('#app').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.id==='register'){showEditor('piece');return}
 if(b.id==='new-load'){showEditor('load');return}
 if(b.id==='advance'&&data.role==='lead'&&load().stage<3){
  const l=load();l.stage++;message=l.id+' moved to '+stages[l.stage].toLowerCase()+'.';save();render();($('#advance')||$('#detail-title')).focus({preventScroll:true});return;
 }
 if(b.dataset.load){selectLoad(b.dataset.load,b.dataset.origin);return}
 if(b.id==='return'){if(open)history.back();else returnFocus();return}
 if(b.id==='submit'){
  const p=piece(data.choice),l=load();message=reason(p,l);
  if(!message){p.load=l.id;message=p.name+' queued in '+l.id+'.';save()}
  render();$('#submit').focus({preventScroll:true});
 }
 if(b.dataset.remove){
  const p=piece(b.dataset.remove);
  if(load().stage===0&&p.load===load().id&&(data.role==='lead'||p.owner==='Jules')){
   delete p.load;message=p.name+(data.role==='lead'?' removed.':' withdrawn.');save();render();($('#submit')||$('#detail-title')).focus({preventScroll:true});
  }
 }
});
render();
