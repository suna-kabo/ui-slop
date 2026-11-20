const places=[
{ id:'breakwater', name:'Breakwater Steps', setting:'Harbor', minutes:35, terrain:'Stairs', days:'Open daily', travel:'Bus 4 to Pier Road', note:'Best at slack tide', image:'Stone steps on a breakwater above blue-green harbor water' },
{ id:'salt', name:'Salt Reed Loop', setting:'Wetland', minutes:55, terrain:'Step-free boardwalk', free:true, days:'Open daily', travel:'Bus 6 to Marsh Gate', note:'Bring binoculars', image:'A boardwalk crossing tall reeds beside the marsh' },
{ id:'lark', name:'Lark Cove', setting:'Beach', minutes:80, terrain:'Loose shingle', days:'Weekends only', travel:'Limited parking', note:'Reach only at low tide', caution:true, image:'A curving shingle cove below a quiet headland' },
{ id:'pilot', name:'Old Pilot House', setting:'Harbor', minutes:45, terrain:'Steep approach', days:'Thu–Sun', travel:'Bus 4 to Pilot Lane', note:'Staffed exhibit', image:'A former pilot house with a pitched roof on the harbor shore' },
{ id:'dune', name:'Dune Glass Trail', setting:'Beach', minutes:70, terrain:'Sandy grades', days:'Open daily', travel:'Bus 11 to Dune Road', note:'Dogs on lead', image:'A sandy trail winding among low grassy dunes beside the sea' },
{ id:'dovetail', name:'Dovetail Hide', setting:'Wetland', minutes:25, terrain:'Step-free path', free:true, days:'Tue–Sun', travel:'No bus', note:'Closes at dusk', image:'A wooden bird hide among tall wetland reeds' },
{ id:'gull', name:'Gull Point', setting:'Harbor', minutes:60, terrain:'Level pavement', free:true, days:'Open daily', travel:'Bus 6 to Ferry Yard', note:'Exposed to wind', image:'A beacon overlooking the sea from a rocky harbor point' },
{ id:'ebb', name:'Ebb Pools', setting:'Beach', minutes:50, terrain:'Slippery rocks', days:'Open daily', travel:'No bus', note:'Check tide before setting out', caution:true, image:'Small tidal pools scattered across flat rocks on the shore' }
];const main=document.querySelector('#main');
const announce=document.querySelector('#announcement');
const navCount=document.querySelector('#saved-count');
let saved=new Set();
try { saved=new Set(JSON.parse(localStorage.getItem('coast-shortlist'))||[]); } catch {}
const defaults=()=>({setting:'All settings',step:false,sort:'guide'});
let filters=defaults();
let route;
document.querySelector('.brand-icon').innerHTML=icon('brand');
document.querySelector('.nav-icon').innerHTML=icon('bookmark');
history.scrollRestoration='manual';

const readRoute=()=>{
 const key=location.hash.slice(1);
 return {kind:key==='shortlist'?'shortlist':places.some(p=>p.id===key)?'detail':'browse', id:key};
};
function syncNav(){
 navCount.textContent=saved.size;
 for(const name of ['browse','shortlist']){
  const a=document.getElementById(name+'-nav');
  if(route.kind===name) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
 }
}
const countText=(n,kind)=>n+' '+(kind==='shortlist'?'saved '+(n===1?'place':'places'):(n===1?'place':'places')+' found');
function saveButton(p,detail=false){
 const on=saved.has(p.id);
 if(detail){
  return '<button type="button" class="primary detail-save" data-save="'+p.id+'" data-saved="'+on+'">'+icon('bookmark')+
   '<span>'+(on?'Remove from shortlist':'Save to shortlist')+'</span></button>';
 }
 return '<button type="button" class="bookmark" data-save="'+p.id+'" aria-pressed="'+on+'" aria-label="Save '+p.name+
  '" title="'+(on?'Remove from shortlist':'Save to shortlist')+'">'+icon('bookmark')+'</button>';
}
function card(p){
 return '<article class="card"><a class="card-link" id="open-'+p.id+'" href="#'+p.id+'" data-open="'+p.id+'" aria-labelledby="name-'+p.id+'"><div class="card-art">'+artwork(p.id,p.image)+'</div><div class="card-body"><div class="card-meta"><span class="setting">'+p.setting+'</span><span class="duration">'+icon('clock')+p.minutes+' min</span></div><h3 id="name-'+p.id+'">'+p.name+'</h3><div class="terrain">'+icon('trail')+p.terrain+'</div></div></a>'+saveButton(p)+'</article>';
}
function results(){
 let list=places.filter(p=>route.kind==='shortlist'?saved.has(p.id):
  (filters.setting==='All settings'||p.setting===filters.setting)&&(!filters.step||p.free));
 if(route.kind==='browse'){
  if(filters.sort==='duration') list.sort((a,b)=>a.minutes-b.minutes);
  if(filters.sort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
 }
 document.querySelector('#result-count').textContent=countText(list.length,route.kind);
 const target=document.querySelector('#results');
 target.className=list.length?'grid':'';
 target.innerHTML=list.length?list.map(card).join(''):route.kind==='shortlist'
 ? '<div class="empty"><h3>Your shortlist is empty</h3><p>Save a place while exploring to find it here later.</p><a href="#browse">Explore outings</a></div>'
 : '<div class="empty"><h3>No outings match</h3><p>Try all settings or clear the step-free filter.</p><button type="button" class="plain" data-reset>Clear filters</button></div>';
}
function toolsMarkup(){
 return '<div class="tools"><div class="settings" role="group" aria-label="Setting">'+['All settings','Harbor','Wetland','Beach'].map(s=>'<button type="button" data-setting="'+s+'" aria-pressed="'+(s===filters.setting)+'">'+s+'</button>').join('')+'</div><div class="options"><label class="check"><input id="step-free" type="checkbox" '+(filters.step?'checked':'')+'>Step-free only</label><label class="sort">Sort by <select id="sort"><option value="guide">Guide order</option><option value="duration">Duration</option><option value="name">Name</option></select></label></div></div>';
}
function render(){
 document.title=(route.kind==='detail'?places.find(p=>p.id===route.id).name+' · ':route.kind==='shortlist'?'Shortlist · ':'')+'Coast & Current';
 syncNav();
 if(route.kind==='detail'){
  const p=places.find(x=>x.id===route.id);
  const origin=history.state?.origin?.kind==='shortlist'?'shortlist':'browse';
  main.innerHTML='<div class="frame detail"><a class="back" href="#'+origin+'" id="return-link">← Back to '+(origin==='shortlist'?'shortlist':'outings')+'</a><div class="detail-layout"><div class="detail-art">'+artwork(p.id,p.image,true)+'</div><section class="detail-content"><span class="setting">'+p.setting+'</span><h1 tabindex="-1" id="page-heading">'+p.name+'</h1><dl class="facts">'+[['Duration',p.minutes+' min'],['Terrain',p.terrain],['Opening',p.days],['Getting there',p.travel]].map(([k,v])=>'<div><dt>'+k+'</dt><dd>'+v+'</dd></div>').join('')+'</dl><div class="visit-note'+(p.caution?' tide-note':'')+'"><strong>'+(p.caution?'Tide access':'Good to know')+'</strong>'+p.note+'</div>'+saveButton(p,true)+'</section></div></div>';
 }else{
  const browse=route.kind==='browse';
  main.innerHTML=(browse?'<section class="frame hero"><div class="hero-copy"><h1>Coast <em>&amp; Current</em></h1><p>Find a coastal outing for a morning or afternoon.</p></div><div class="hero-art">'+artwork('hero','A lighthouse on a rocky point at sunset')+'</div></section>':'')+
   '<section class="frame '+(browse?'browse':'shortlist')+'"><div class="section-head"><div>'+(browse?'<h2 id="page-heading" tabindex="-1">Explore outings</h2>':'<h1 id="page-heading" tabindex="-1">Your shortlist</h1><p>Outings saved on this device.</p>')+'</div></div>'+(browse?toolsMarkup():'')+'<p id="result-count" class="count" role="status"></p><div id="results"></div></section>';
  if(browse) document.querySelector('#sort').value=filters.sort;
  results();
 }
}
function restore(origin){
 if(origin?.kind===route.kind){
  const original=document.getElementById(origin.focus);
  const cards=document.querySelectorAll('#results .card-link');
  const target=original||cards[Math.min(origin.index,cards.length-1)]||document.querySelector('.empty a')||document.querySelector('#page-heading');
  target.focus({preventScroll:true});
  window.scrollTo(0,origin.y);
  if(!original) target.scrollIntoView({block:'nearest'});
 }else{
  window.scrollTo(0,0);
  const next=route.kind==='detail'&&matchMedia('(max-width:565px)').matches?document.querySelector('#return-link'):document.querySelector('#page-heading');
  next?.focus({preventScroll:true});
 }
}
function navigate(key,origin){
 if(location.hash==='#'+key)return;
 const entry=history.state?.entry||(String(Date.now())+'-'+Math.random());
 history.replaceState({...history.state,entry,filters:{...filters}},'');
 if(origin) origin.entry=entry;
 history.pushState({entry:String(Date.now())+'-'+Math.random(),origin,filters:{...filters}},'','#'+key);
 route=readRoute();
 render();
 restore();
}
addEventListener('popstate',()=>{
 const origin=route.kind==='detail'?currentOrigin:null;
 route=readRoute();
 if(history.state?.filters) filters={...history.state.filters};
 render();
 restore(origin?.entry===history.state?.entry?origin:null);
 currentOrigin=history.state?.origin;
});
let currentOrigin=history.state?.origin;
if(history.state?.filters) filters={...history.state.filters};
route=readRoute();
render();
function patchSave(button,p){
 const on=saved.has(p.id);
 if(button.matches('.detail-save')){
  button.dataset.saved=on;
  button.querySelector('span').textContent=on?'Remove from shortlist':'Save to shortlist';
 }else{
  button.setAttribute('aria-pressed',on);
  button.title=on?'Remove from shortlist':'Save to shortlist';
 }
}
document.addEventListener('click',event=>{
 const button=event.target.closest('button');
 if(button?.dataset.save){
  const p=places.find(x=>x.id===button.dataset.save);
  const on=!saved.has(p.id);
  if(on)saved.add(p.id);else saved.delete(p.id);
  let stored=true;
  try { localStorage.setItem('coast-shortlist',JSON.stringify([...saved])); } catch { stored=false; }
  syncNav();
  if(route.kind==='shortlist'){
   const next=button.closest('.card').nextElementSibling?.querySelector('.bookmark')||button.closest('.card').previousElementSibling?.querySelector('.bookmark');
   const id=next?.dataset.save;
   results();
   (document.querySelector('[data-save="'+id+'"]')||document.querySelector('.empty a'))?.focus({preventScroll:true});
  }else patchSave(button,p);
  announce.textContent=p.name+(on?' saved to shortlist.':' removed from shortlist.')+(stored?'':' Changes are available for this visit only.');
  return;
 }
 if(button?.dataset.setting){
  filters.setting=button.dataset.setting;
  document.querySelectorAll('[data-setting]').forEach(x=>x.setAttribute('aria-pressed',String(x===button)));
  results();return;
 }
 if(button?.hasAttribute('data-reset')){
  filters.setting='All settings';filters.step=false;
  document.querySelector('#step-free').checked=false;
  document.querySelectorAll('[data-setting]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.setting===filters.setting)));
  results();document.querySelector('[data-setting="All settings"]').focus();return;
 }
 const link=event.target.closest('a[href^="#"]');
 if(!link||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 event.preventDefault();
 if(link.classList.contains('skip')){document.querySelector('#page-heading').focus();return;}
 if(link.id==='return-link'&&history.state?.origin){history.back();return;}
 const origin=link.dataset.open?{
  kind:route.kind,focus:link.id,y:window.scrollY,
  index:[...document.querySelectorAll('#results .card-link')].indexOf(link)
 }:null;
 navigate(link.hash.slice(1),origin);
 currentOrigin=history.state?.origin;
});
main.addEventListener('change',event=>{
 if(event.target.id==='step-free')filters.step=event.target.checked;
 else if(event.target.id==='sort')filters.sort=event.target.value;
 else return;
 results();
});
