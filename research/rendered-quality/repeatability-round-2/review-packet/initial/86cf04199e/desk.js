const $=id=>document.getElementById(id);
const programs=['Cone 06 bisque','Cone 6 glaze'];
const stages=['Queued','Firing','Cooling','Pickup'];
const kilns={Alder:{area:3000,height:28},Ash:{area:2400,height:23}};
const seed={role:'member',loads:[
{id:'MC-14',kiln:'Alder',start:'2027-05-12T16:00',end:'2027-05-14T09:00',program:0,stage:0},
{id:'MC-15',kiln:'Ash',start:'2027-05-13T08:00',end:'2027-05-14T16:00',program:1,stage:0},
{id:'MC-16',kiln:'Alder',start:'2027-05-14T12:00',end:'2027-05-15T18:00',program:1,stage:0}],pieces:[
{id:'bea',name:'Slip cups',owner:'Bea',area:1650,height:null,load:'MC-14'},
{id:'suri',name:'Blue bowls',owner:'Suri',area:2100,height:null,load:'MC-15'},
{id:'tray',name:'Bisque tray',owner:'Jules',area:800,height:8,program:0,load:null},
{id:'pitcher',name:'Glaze pitcher',owner:'Jules',area:500,height:24,program:1,load:null}]};
const fmt=n=>n.toLocaleString('en-US',{maximumFractionDigits:6});
const area=n=>fmt(n)+' cm²';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=s=>new Date(s).toLocaleDateString('en-US',{month:'short',day:'numeric',...(s.slice(0,4)!=='2027'?{year:'numeric'}:{})});
const time=s=>s.slice(11,16);
const range=l=>date(l.start)+' '+time(l.start)+' – '+date(l.end)+' '+time(l.end);
const mine=()=>state.pieces.filter(p=>p.owner==='Jules');
const manifest=l=>state.pieces.filter(p=>p.load===l.id);
const used=l=>manifest(l).reduce((sum,p)=>sum+Math.round(p.area*100),0)/100;
const free=l=>Math.round((kilns[l.kiln].area-used(l))*100)/100;
const lead=()=>state.role==='lead';
const meter=l=>'<div class="meter" aria-hidden="true"><i style="width:'+100*used(l)/kilns[l.kiln].area+'%"></i></div>';
const dayIndex=s=>(Date.parse(s+'Z')-Date.parse('2027-05-12T00:00Z'))/86400000;
const sorted=()=>[...state.loads].sort((a,b)=>a.start.localeCompare(b.start));
function board(){return '<div class="board"><div class="boardlabel">Kiln</div><div class="days">'+['Wed 12','Thu 13','Fri 14','Sat 15'].map(d=>'<span>'+d+'</span>').join('')+'</div>'+Object.keys(kilns).map(k=>{
 const tracks=[];const slots=sorted().filter(l=>l.kiln===k&&dayIndex(l.end)>0&&dayIndex(l.start)<4).map(l=>{
 const start=Math.max(0,dayIndex(l.start)),end=Math.min(4,dayIndex(l.end));
 let lane=tracks.findIndex(t=>t<=start);if(lane<0)lane=tracks.length;tracks[lane]=end;
 return '<button class="slot '+(l.program?'glaze':'')+'" style="top:'+(10+lane*41)+'px;left:'+(start*25)+'%;width:'+((end-start)*25)+'%" data-open="'+l.id+'" id="slot-'+l.id+'" aria-label="'+l.id+' '+l.kiln+', '+range(l)+'">'+l.id+'</button>';
 }).join('');
 return '<div class="boardlabel lane">'+k+'</div><div class="track" style="height:'+Math.max(57,16+tracks.length*41)+'px">'+slots+'</div>';
 }).join('')+'</div><div class="legend"><span><i></i>'+programs[0]+'</span><span><i></i>'+programs[1]+'</span></div>'}
function ledger(){return '<div class="ledger"><div class="sectionhead"><h2>Firing loads</h2><span class="meta">'+state.loads.length+' '+(state.loads.length===1?'load':'loads')+'</span></div>'+sorted().map(l=>'<button class="row" id="row-'+l.id+'" data-open="'+l.id+'"><span><strong class="loadid">'+l.id+' · '+l.kiln+'</strong><small>'+programs[l.program]+'</small></span><span><strong>'+date(l.start)+' '+time(l.start)+'</strong><small>to '+date(l.end)+' '+time(l.end)+' · '+stages[l.stage]+'</small></span><span class="capacity"><small>'+area(free(l))+' free</small>'+meter(l)+'</span><span class="arrow" aria-hidden="true">›</span></button>').join('')+'</div>'}
const status=l=>l?(l.stage===3?'Ready for pickup':stages[l.stage]) :'Unassigned';
function pieceCard(p){const l=state.loads.find(l=>l.id===p.load);return '<div class="piece"><strong>'+esc(p.name)+'</strong><small>'+programs[p.program]+' · '+area(p.area)+' × '+fmt(p.height)+' cm</small><span class="status '+(l?.stage===3?'pickup':'')+'">'+status(l)+'</span>'+(l?' <button class="link" data-open="'+l.id+'" id="piece-'+p.id+'">'+l.id+' '+l.kiln+'</button>':'')+'</div>'}
function reasons(p,l){const why=[];if(p.load)why.push(p.load===l.id?'This piece is already on '+l.id+'.':'This piece is assigned to '+p.load+'.');if(l.stage)why.push('This load is '+stages[l.stage].toLowerCase()+'. Only queued loads accept work.');if(p.program!==l.program)why.push('Requires '+programs[p.program]+'.');if(p.height>kilns[l.kiln].height)why.push(fmt(p.height)+' cm tall; '+l.kiln+' allows '+kilns[l.kiln].height+' cm.');if(p.area>free(l))why.push('Needs '+area(p.area)+'; '+area(free(l))+' remains.');return why}
function head(title,sub){return '<div class="dialoghead"><div><h2 id="dialogTitle" tabindex="-1">'+title+'</h2>'+(sub?'<p>'+sub+'</p>':'')+'</div><button type="button" id="close" class="btn secondary">Close</button></div>'}
function facts(l){return '<div class="facts"><div><span class="meta">Shelf area free</span><strong>'+area(free(l))+'</strong></div><div><span class="meta">Total shelf area</span><strong>'+area(kilns[l.kiln].area)+'</strong></div><div><span class="meta">Maximum height</span><strong>'+kilns[l.kiln].height+' cm</strong></div></div>'}
function list(l){return '<h3>Manifest</h3>'+(manifest(l).length?manifest(l).map(p=>'<div class="manifest"><div><strong>'+esc(p.name)+'</strong><small>'+esc(p.owner)+' · '+area(p.area)+(p.height?' · '+fmt(p.height)+' cm tall':'')+'</small></div>'+(!l.stage&&(lead()||p.owner==='Jules')?'<button class="btn secondary" data-remove="'+p.id+'">'+(lead()?'Remove':'Withdraw')+'</button>':'')+'</div>').join(''):'<p class="meta">No pieces assigned.</p>')}
function choices(l){return '<h3>Queue a piece</h3><div class="actions">'+mine().filter(p=>p.load!==l.id).map(p=>'<button class="btn '+(reasons(p,l).length?'secondary':'')+'" data-queue="'+p.id+'">'+esc(p.name)+'</button>').join('')+'</div>'}
const key='mill-creek-firing-desk-v1';
const dialog=$('detail');
let state=structuredClone(seed),storageError='';
function stored(){
 const raw=localStorage.getItem(key);
 return raw?JSON.parse(raw):structuredClone(seed);
}
try{state=stored()}catch{storageError='Saved studio data could not be read in this browser.'}
let page=history.state?.millDesk || null;
function refresh(change){
 try{
  const next=stored();
  const problem=change(next);
  if(problem){state=next;return problem}
  localStorage.setItem(key,JSON.stringify(next));
  state=next;
  storageError='';
  return '';
 }catch{return 'The browser could not save this change. Your previous data is unchanged.'}
}
function save(change,done){
 const apply=()=>{
  const problem=refresh(change);
  if(problem){message(problem);return}
  draw();
  done();
 };
 // Where available, serialize read-modify-write across tabs.
 if(navigator.locks)navigator.locks.request(key,apply).catch(()=>message('Could not save this change.'));
 else apply();
}
const options=(entries)=>entries.map(([value,label])=>'<option value="'+value+'">'+label+'</option>').join('');
const programOptions=options(programs.map((p,i)=>[i,p]));
const kilnOptions=options(Object.keys(kilns).map(k=>[k,k]));
const active=()=>sorted().filter(l=>l.stage>0);
function aside(){
 if(!lead())return '<aside class="panel pieces"><div class="sectionhead"><h2>Jules’s pieces</h2></div>'+mine().map(pieceCard).join('')+'<button id="register" class="btn secondary" data-form="piece">+ Register piece</button></aside>';
 return '<aside class="panel pieces"><div class="sectionhead"><h2>Shift handoff</h2></div>'+ (active().length?active().map(l=>'<div class="piece"><strong>'+l.kiln+' · '+l.id+'</strong><small>'+programs[l.program]+'</small><span class="status '+(l.stage===3?'pickup':'')+'">'+status(l)+'</span> <button class="link" id="handoff-'+l.id+'" data-open="'+l.id+'">View load</button></div>').join(''):'<p class="meta">All loads are queued.</p>')+'</aside>';
}
function draw(){
 const focus=document.activeElement?.id;
 $('roles').innerHTML='<button id="member" data-role="member" aria-pressed="'+!lead()+'">Member</button><button id="lead" data-role="lead" aria-pressed="'+lead()+'">Shift lead</button>';
 $('intro').textContent=lead()?'Manage firing windows and handoffs.':'Schedule, share and track studio firings.';
 $('desk').innerHTML='<p class="toast" id="toast" role="status">'+esc(storageError)+'</p><div class="desk"><section class="panel"><div class="pad"><div class="sectionhead"><h2>Kiln schedule</h2>'+(lead()?'<button id="new-window" class="btn" data-form="window">+ Add firing window</button>':'<span class="meta">May 12–15</span>')+'</div>'+board()+'</div>'+ledger()+'</section>'+aside()+'</div>';
 if(!dialog.open&&focus)$(focus)?.focus({preventScroll:true});
}
function message(text){const out=$('notice')||$('toast');if(out)out.textContent=text}
function progress(l){return '<div class="progress" aria-label="Firing progress">'+stages.map((s,i)=>'<span '+(i===l.stage?'aria-current="step"':'')+'>'+s+'</span>').join('')+'</div>'}
function loadDetail(l){
 const next=stages[l.stage+1];
 return head(l.id+' · '+l.kiln,programs[l.program]+' · '+range(l))+'<div class="dialogbody">'+facts(l)+progress(l)+list(l)+(lead()?(next?'<p><button class="btn" id="advance" data-advance="'+l.stage+'">'+['Start firing','Start cooling','Mark ready for pickup'][l.stage]+'</button></p>':'<p class="status pickup">Ready for pickup</p>'):choices(l))+'<p class="notice" id="notice" role="status"></p></div>';
}
function form(type){
 const piece=type==='piece';
 return head(piece?'Register piece':'Add firing window',piece?'Add work to Jules’s piece list.':'Enter the service window in studio local time.')+'<div class="dialogbody"><form id="form" class="form">'+(piece?'<label class="full">Piece name<input name="name" required maxlength="80"></label><label class="full">Program<select name="program">'+programOptions+'</select></label><label>Shelf area (cm²)<input name="area" type="number" min="0.01" max="999999" step="0.01" required></label><label>Height (cm)<input name="height" type="number" min="0.01" max="999999" step="0.01" required></label>':'<label>Kiln<select name="kiln">'+kilnOptions+'</select></label><label>Program<select name="program">'+programOptions+'</select></label><label class="full">Start<input type="datetime-local" name="start" required value="2027-05-12T16:00"></label><label class="full">End<input type="datetime-local" name="end" required value="2027-05-12T20:00"></label>')+'<p class="notice full" id="notice" role="status"></p><div class="full"><button class="btn" type="submit">'+(piece?'Register piece':'Add firing window')+'</button></div></form></div>';
}
function paintDetail(target='dialogTitle',notice=''){
 if(!page||(!page.load&&!page.form)){if(dialog.open)dialog.close();return}
 const l=state.loads.find(x=>x.id===page.load);
 if(!l&&!page.form)return;
 dialog.innerHTML=l?loadDetail(l):form(page.form);
 if(!dialog.open)dialog.showModal();
 ($(target)||$('dialogTitle')).focus({preventScroll:true});
 if(notice)message(notice);
}
function openPage(data,b){
 page={...data,origin:b.id};
 history.pushState({millDesk:page},'');
 paintDetail();
}
function closePage(){if(page)history.back()}
function fallback(p){return p?.load?$('row-'+p.load):p?.form==='window'?$('new-window'):$('register')}
window.addEventListener('popstate',()=>{
 const previous=page;
 page=history.state?.millDesk||null;
 if(page)paintDetail();
 else if(dialog.open){
  dialog.close();
  const target=$(previous?.origin)||fallback(previous);
  target?.focus();
 }
});
dialog.addEventListener('cancel',e=>{e.preventDefault();closePage()});
window.addEventListener('storage',e=>{
 if(e.key!==key)return;
 try{
  state=stored();draw();
  if(page?.load)paintDetail();
 }catch{message('Saved studio data could not be read.')}
});
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 const {open,role,form:type,queue,remove,advance}=b.dataset;
 if(role&&state.role!==role){save(s=>{s.role=role},()=>$(role)?.focus({preventScroll:true}));return}
 if(open){openPage({load:open},b);return}
 if(type){openPage({form:type},b);return}
 if(b.id==='close'){closePage();return}
 const id=page?.load;
 if(!id||(!queue&&!remove&&advance===undefined))return;
 let note='',target='dialogTitle';
 save(s=>{
  state=s;
  const l=s.loads.find(x=>x.id===id);
  if(!l)return 'This load could not be found.';
  if(queue){
   const p=mine().find(x=>x.id===queue);
   if(!p||lead())return 'Switch to Member to queue your work.';
   const why=reasons(p,l);if(why.length)return why.join(' ');
   p.load=l.id;note=p.name+' queued on '+l.id+'.';
  }
  if(remove){
   const p=s.pieces.find(x=>x.id===remove);
   if(!p||p.load!==l.id||l.stage||(!lead()&&p.owner!=='Jules'))return 'Only queued work on this load can be removed.';
   p.load=null;note=p.name+(lead()?' removed.':' withdrawn.');
  }
  if(advance!==undefined){
   if(!lead()||l.stage!==Number(advance)||l.stage>=3)return 'This load’s stage has changed. Reopen the load to continue.';
   l.stage++;target=l.stage<3?'advance':'dialogTitle';note=l.id+' · '+status(l)+'.';
  }
 },()=>{if(page?.load===id)paintDetail(target,note)});
});
document.addEventListener('submit',e=>{
 if(e.target.id!=='form')return;
 e.preventDefault();
 const values=Object.fromEntries(new FormData(e.target));
 const kind=page?.form;
 const program=Number(values.program);
 const completed=()=>{closePage();$('toast').textContent=kind==='piece'?values.name.trim()+' registered.':'Firing window added.'};
 if(kind==='piece'){
  const name=values.name.trim(),a=Number(values.area),h=Number(values.height);
  if(!name){message('Enter a piece name.');e.target.elements.name.focus();return}
  save(s=>{
   if(s.role!=='member')return 'Switch to Member to register a piece.';
   s.pieces.push({id:'piece-'+(s.pieces.length+1),owner:'Jules',name,program,area:a,height:h,load:null});
  },completed);
 }
 if(kind==='window'){
  const {kiln,start,end}=values;
  if(Date.parse(start)>=Date.parse(end)){message('Set an end time after the start.');e.target.elements.end.focus();return}
  save(s=>{
   if(s.role!=='lead')return 'Switch to Shift lead to add a window.';
   const collision=s.loads.find(l=>l.kiln===kiln&&Date.parse(l.start)<Date.parse(end)&&Date.parse(start)<Date.parse(l.end));
   if(collision)return kiln+' is booked for '+collision.id+' ('+range(collision)+'). Choose another time or kiln.';
   const id='MC-'+(Math.max(...s.loads.map(l=>Number(l.id.slice(3))))+1);
   s.loads.push({id,kiln,program,start,end,stage:0});
  },completed);
 }
});
draw();if(page)paintDetail();
