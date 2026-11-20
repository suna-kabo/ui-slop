const materials = {
  'Speckled stoneware':['bisque','glaze'],
  'White stoneware':['bisque','glaze'],
  'Studio porcelain':['bisque','glaze'],
  'Red earthenware':['bisque','low']
};
const finishes = {
  'Studio Celadon · Cone 6':'glaze',
  'Satin White · Cone 6':'glaze',
  'Iron Gloss · Cone 6':'glaze',
  'Clear Gloss · Cone 06':'low',
  'Honey Amber · Cone 06':'low'
};
const memberName = 'Alex Morgan';
const option = (value,label=value,selected='') => `<option value="${safe(value)}" ${value===selected?'selected':''}>${safe(label)}</option>`;
const memberMode = () => role==='member';
const nextWeekday = (day) => offset(day,-((date(day).getDay()+6)%7));
function estimateMap() {
  const loads = state.loads.filter(l=>editable(l)&&l.day>=today).sort((a,b)=>a.day.localeCompare(b.day));
  const spare = new Map(loads.map(l=>[l.id,kilnFor(l).capacity-used(l)]));
  const estimates = new Map();
  for(const p of waiting()){
    const match = loads.find(l=>l.program===p.program && spare.get(l.id)>=p.space);
    if(match){
      estimates.set(p.id,match);
      spare.set(match.id,spare.get(match.id)-p.space);
    }
  }
  return estimates;
}
function pieceTiming(p, estimates=estimateMap()){
  const assigned = state.loads.find(l=>l.id===p.load);
  const guess = estimates.get(p.id);
  if(assigned?.status==='Ready') return 'Ready for pickup';
  if(assigned) return `${['Firing','Cooling'].includes(assigned.status)?'Started':'Scheduled'} ${shortDate(assigned.day)} · ${kilnFor(assigned).name}`;
  if(guess) return `Estimated ${shortDate(guess.day)}`;
  return 'Awaiting a compatible load';
}
function workList(mine){
  const rows = mine?state.pieces.filter(p=>p.member===memberName).slice().reverse():waiting();
  const estimates=estimateMap();
  return `<div class="records-panel panel"><div class="list-head"><h2>${mine?'Your submissions':'Waiting to fire'}</h2><span class="count">${rows.length}</span></div>
    ${rows.length?rows.map(p=>{
      const l=state.loads.find(f=>f.id===p.load);
      return `<button class="work-row" data-piece="${p.id}"><span class="work-icon ${p.program}">${icon('cube',20)}</span><span class="work-title"><strong>${safe(p.name)}</strong><small>${mine?'':safe(p.member)+' · '}${p.count} ${p.count===1?'piece':'pieces'} · ${p.space} units</small></span><span class="work-program">${programs[p.program].label}</span><span class="work-timing">${mine?badge(l?.status||'Queued'):''}<small>${pieceTiming(p,estimates)}</small></span>${icon('right',16)}</button>`;
    }).join(''):`<p class="panel-empty">${mine?'Your submitted work will appear here.':'No work is waiting for a load.'}</p>`}</div>`;
}
function programList(){
  return `<section class="panel library"><div class="list-head"><h2>Firing programs</h2></div>${Object.entries(programs).map(([id,p])=>`<div class="reference-row"><span class="work-icon ${id}">${icon('flame',21)}</span><div><h3>${p.label}</h3><p>Accepts ${p.stage.toLowerCase()} work</p><small>${Object.keys(materials).filter(m=>materials[m].includes(id)).join(' · ')}</small></div></div>`).join('')}</section>`;
}
function library(){
  return `${pageTitle('Kilns & programs')}<div class="library-grid"><section class="panel library"><div class="list-head"><h2>Studio kilns</h2></div>${kilns.map(k=>`<div class="reference-row"><span class="work-icon bisque">${icon('kiln',22)}</span><div><h3>${k.name}</h3><p>${k.model} · ${k.capacity} capacity units</p><small>${k.programs.map(p=>programs[p].label).join(' / ')}</small></div></div>`).join('')}</section>${programList()}</div>`;
}
function guide(){
  return `${pageTitle('Firing guide')}<div class="library-grid"><section class="panel library"><div class="list-head"><h2>Before you submit</h2></div>
    <div class="guide-step"><h3>Check the clay label</h3><p>Use a studio clay from the program list. Cone 06 and Cone 6 are different firing programs. Ask the technician about any unfamiliar clay or glaze.</p></div>
    <div class="guide-step"><h3>Bring work at the right stage</h3><p>Queue bone-dry greenware for bisque. For a glaze firing, start with bisqued work, use a glaze rated for your cone, and leave the foot clean.</p></div>
    <div class="guide-step"><h3>Count footprint and clearance</h3><p>One capacity unit is a small mug footprint. Allow 2–3 units for a bowl and ask staff to measure tall or wide work. Include clearance between pieces.</p></div>
    <div class="guide-step"><h3>Pick up from the finished shelf</h3><p>Check My work for the Ready status. It means the kiln has cooled and staff have unloaded the pieces.</p></div></section>${programList()}</div>`;
}
function formField(label,control,wide=false){
  return `<label class="field ${wide?'span-field':''}"><span>${label}</span>${control}</label>`;
}
function formFooter(label){
  return `<div class="dialog-foot"><button type="button" class="btn" data-action="cancel-form">Cancel</button><button class="btn primary" type="submit">${label}</button></div>`;
}
function submissionForm(trigger, piece){
  const p=piece||{};
  previousPiece=piece?.id||null;
  openDialog(`<form id="submission-form" class="dialog-form" novalidate>${dialogHead(piece?'Edit submission':'Submit work')}
  <div class="dialog-body"><div class="form-grid">
  ${formField('Piece or batch name',`<input name="name" required maxlength="70" value="${safe(p.name||'')}" autocomplete="off">`,true)}
  ${formField('Pieces',`<input name="count" type="number" value="${p.count||1}" min="1" max="99" required>`)}
  ${formField('Capacity units',`<input name="space" type="number" value="${p.space||1}" min="1" max="36" required aria-describedby="capacity-help">`)}
  <p class="field-hint span-field" id="capacity-help">One unit is a small mug footprint. Include clearance.</p>
  ${formField('Firing program',`<select name="program">${Object.entries(programs).map(([id,prog])=>option(id,prog.label,p.program)).join('')}</select>`,true)}
  ${formField('Clay body',`<select name="clay" required>${option('','Choose clay',p.clay||'')}${Object.keys(materials).map(m=>option(m,m,p.clay)).join('')}</select>`)}
  ${formField('Current stage',`<select name="stage" required>${option('','Choose stage',p.stage||'')}${['Leather hard','Bone dry','Glazed bisque'].map(m=>option(m,m,p.stage)).join('')}</select>`)}
  <div id="glaze-field" class="span-field">${formField('Glaze',`<select name="glaze">${option('','Choose glaze',p.glaze||'')}${Object.keys(finishes).map(m=>option(m,m,p.glaze)).join('')}</select>`)}</div>
  </div><div id="form-error" class="form-error" tabindex="-1" role="alert" hidden></div></div>${formFooter(piece?'Save changes':'Add to firing queue')}</form>`,trigger);
  updateGlaze();
}
function updateGlaze(){
  const form=document.querySelector('#submission-form');
  const bisque=form.elements.program.value==='bisque';
  form.querySelector('#glaze-field').hidden=bisque;
  form.elements.glaze.disabled=bisque;
}
function firingForm(trigger, existing){
  editingLoad=existing?.id||null;
  openDialog(`<form id="firing-form" class="dialog-form" novalidate>${dialogHead(existing?'Reschedule firing':'Schedule firing')}
  <div class="dialog-body"><div class="form-grid">
  ${formField('Kiln',`<select name="kiln">${kilns.map(k=>option(k.id,k.name+' · '+k.capacity+' units',existing?.kiln)).join('')}</select>`,true)}
  ${formField('Firing program',`<select name="program" ${existing?'disabled':''}>${Object.entries(programs).map(([id,p])=>option(id,p.label,existing?.program)).join('')}</select>`,true)}
  ${formField('Start date',`<input name="day" type="date" required min="${today}" value="${existing?.day||(week>today?week:today)}">`)}
  ${formField('Kiln reservation',`<select name="length">${[1,2,3].map(n=>option(n,n+(n===1?' day':' days'),existing?.length||2)).join('')}</select>`)}
  <p class="field-hint span-field">Reserve time for loading, firing and cooling.</p>
  </div><div id="form-error" class="form-error" tabindex="-1" role="alert" hidden></div></div>${formFooter(existing?'Save firing':'Create firing')}</form>`,trigger);
}
function formError(form,message,field){
  const prior=form.querySelector('[aria-invalid]');
  if(prior){
    prior.removeAttribute('aria-invalid');
    prior.setAttribute('aria-describedby', prior.name==='space'?'capacity-help':'');
  }
  if(field){
    form.elements[field].setAttribute('aria-invalid','true');
    form.elements[field].setAttribute('aria-describedby',field==='space'?'capacity-help form-error':'form-error');
  }
  const error=form.querySelector('.form-error');
  error.textContent=message;error.hidden=false;error.focus();
}
function submitWork(form){
  const data=Object.fromEntries(new FormData(form));
  const existing=state.pieces.find(w=>w.id===previousPiece && !w.load && w.member===memberName);
  const count=Number(data.count),space=Number(data.space);
  const p=programs[data.program];
  if(!data.name.trim()) return formError(form,'Enter a name for this batch.','name');
  if(!Number.isInteger(count)||count<1||count>99) return formError(form,'Enter a piece count between 1 and 99.','count');
  const maxSpace=Math.max(...kilns.filter(k=>k.programs.includes(data.program)).map(k=>k.capacity));
  if(!Number.isInteger(space)||space<1||space>maxSpace) return formError(form,`Enter 1–${maxSpace} units, or split this batch across submissions.`,'space');
  if(!data.clay) return formError(form,'Choose the clay body from its studio label.','clay');
  if(!materials[data.clay]?.includes(data.program)) return formError(form,`${data.clay} is approved for ${materials[data.clay].map(id=>programs[id].label).join(' or ')}. Choose a compatible program or clay.`,'clay');
  if(data.stage!==p.stage) return formError(form,`${p.label} requires ${p.stage.toLowerCase()} work. Check the stage before submitting.`,'stage');
  if(data.program!=='bisque'&&finishes[data.glaze]!==data.program) return formError(form,`Choose a glaze rated for Cone ${p.cone}.`,'glaze');
  const piece={id:existing?.id||newId('W',state.pieces),name:data.name.trim(),member:memberName,count,space,program:data.program,clay:data.clay,stage:data.stage,glaze:data.glaze||'',load:null};
  if(existing) Object.assign(existing,piece);
  else state.pieces.push(piece);
  save();
  render();
  showPiece(piece.id,null,existing?'Submission updated.':'Added to the firing queue.');
}
function newId(prefix,records){
  return prefix+'-'+String(1+Math.max(0,...records.map(record=>Number(record.id.split('-')[1])))).padStart(3,'0');
}
function submitLoad(form){
  const data=Object.fromEntries(new FormData(form));
  const existing=state.loads.find(l=>l.id===editingLoad&&l.status==='Scheduled');
  const kiln=kilns.find(k=>k.id===data.kiln);
  const program=existing?.program||data.program;
  const length=Number(data.length);
  if(!data.day||data.day<today) return formError(form,'Choose today or a future date.','day');
  if(!kiln.programs.includes(program)) return formError(form,`${kiln.name} does not run ${programs[program].label}. Choose another kiln or program.`,'kiln');
  if(existing&&used(existing)>kiln.capacity) return formError(form,`This load needs ${used(existing)} units. Choose a bigger kiln.`,'kiln');
  const conflict=state.loads.find(l=>l.id!==existing?.id && l.kiln===kiln.id&&l.day<=offset(data.day,length-1)&&offset(l.day,l.length-1)>=data.day);
  if(conflict) return formError(form,`${kiln.name} is booked through ${shortDate(offset(conflict.day,conflict.length-1))} for ${programs[conflict.program].label}. Choose a different kiln or date.`,'day');
  const load={id:existing?.id||newId('F',state.loads),kiln:kiln.id,program,day:data.day,length,status:'Scheduled',base:existing?.base||0};
  if(existing) Object.assign(existing,load);
  else state.loads.push(load);
  save();
  week=nextWeekday(load.day);
  loadFilter='all';
  render();
  focusBack=[...app.querySelectorAll(`[data-load="${load.id}"]`)].find(el=>el.offsetWidth);
  focusBack?.scrollIntoView({block:'nearest'});
  showLoad(load.id,null,existing?'Firing rescheduled.':'Firing scheduled. Add compatible work below.','load-feedback');
}
