const places=[["Breakwater Steps","Harbor",35,"Stairs","Open daily","Bus 4 to Pier Road","Best at slack tide","breakwater","A stone breakwater and stairs beside a harbor beacon"],["Salt Reed Loop","Wetland",55,"Step-free boardwalk","Open daily","Bus 6 to Marsh Gate","Bring binoculars","reeds","A boardwalk through rust-colored reeds and tidal channels"],["Lark Cove","Beach",80,"Loose shingle","Weekends only","Limited parking","Reach only at low tide","cove","A shingle cove between headlands at low tide"],["Old Pilot House","Harbor",45,"Steep approach","Thu–Sun","Bus 4 to Pilot Lane","Staffed exhibit","pilot","A pale pilot house above a steep coastal path"],["Dune Glass Trail","Beach",70,"Sandy grades","Open daily","Bus 11 to Dune Road","Dogs on lead","dune","A sandy trail winding through sea grass dunes"],["Dovetail Hide","Wetland",25,"Step-free path","Tue–Sun","No bus","Closes at dusk","hide","A timber bird hide beside a still wetland"],["Gull Point","Harbor",60,"Level pavement","Open daily","Bus 6 to Ferry Yard","Exposed to wind","gull","A paved headland overlooking open water and gulls"],["Ebb Pools","Beach",50,"Slippery rocks","Open daily","No bus","Check tide before setting out","ebb","Tide pools between layered shelves of rock"]];
const $=selector=>document.querySelector(selector);
const bookmark='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/></svg>';
const storageKey='coast-current-shortlist-v1';
let saved;
try { saved=new Set(JSON.parse(localStorage.getItem(storageKey)||'[]')); } catch { saved=new Set(); }
const media=new Map();
const image=id=>{if(!media.has(id))media.set(id,art(id));return media.get(id)};
const cards=$('#cards'), collection=$('#collection'), detail=$('#detail');
let mode='', activeDetail='';
const positions={browse:0,shortlist:0};
const isStepFree=p=>p[3].startsWith('Step-free')||p[3]==='Level pavement';
const readRoute=()=>location.hash.slice(1);
const byId=id=>places.find(p=>p[7]===id);
history.scrollRestoration='manual';
$('#hero-image').src=image('hero');
function updateSaves(){
  $('#saved-count').textContent=places.filter(p=>saved.has(p[7])).length;
  document.querySelectorAll('[data-save]').forEach(button=>{
    const p=byId(button.dataset.save);
    const selected=saved.has(p[7]);
    button.setAttribute('aria-pressed',selected);
    button.setAttribute('aria-label','Save '+p[0]+' to shortlist');
    button.title=selected?'Remove from shortlist':'Save to shortlist';
    if(button.classList.contains('detail-save'))button.querySelector('span').textContent=selected?'Saved to shortlist':'Save to shortlist';
  });
}
function listing(p){
  return '<article class="card"><img src="'+image(p[7])+'" alt="'+p[8]+'" width="800" height="400"><button class="save" type="button" data-save="'+p[7]+'">'+bookmark+'</button><div class="card-body"><div class="metadata">'+p[1]+'<span class="dot" aria-hidden="true"></span>'+p[2]+' min</div><h3><a id="open-'+p[7]+'" href="#place/'+p[7]+'">'+p[0]+'</a></h3><p class="terrain">'+p[3]+'</p><p class="visit-note">'+p[6]+'</p></div></article>';
}
function renderCollection(){
  const isSaved=mode==='shortlist';
  const setting=$('input[name="setting"]:checked').value;
  const sort=$('#sort').value;
  let items=places.filter(p=>isSaved?saved.has(p[7]):(setting==='All'||setting===p[1])&&(!$('#step-free').checked||isStepFree(p)));
  if(!isSaved&&sort==='duration')items.sort((a,b)=>a[2]-b[2]);
  if(!isSaved&&sort==='name')items.sort((a,b)=>a[0].localeCompare(b[0]));
  $('#hero').hidden=isSaved;
  $('#filters').hidden=isSaved;
  $('#sort-label').hidden=isSaved;
  $('#collection-title').textContent=isSaved?'Your shortlist':'Explore places';
  document.querySelectorAll('nav a').forEach(a=>a.removeAttribute('aria-current'));
  $('#nav-'+mode).setAttribute('aria-current','page');
  $('#result-count').textContent=items.length+' '+(items.length===1?'place':'places')+(isSaved?' saved':setting==='All'&&!$('#step-free').checked?' to explore':' found');
  cards.innerHTML=items.length?items.map(listing).join(''):isSaved
    ?'<div class="empty"><h3>Your shortlist is empty</h3><p>Save places you’d like to visit using the bookmark on each place.</p><a class="solid" href="#browse">Explore places</a></div>'
    :'<div class="empty"><h3>No matching places</h3><p>Try another setting or include places with steps or uneven ground.</p><button class="solid" id="clear-filters" type="button">Clear filters</button></div>';
  updateSaves();
}
function renderDetail(p){
  const origin=history.state?.origin||'browse';
  detail.innerHTML='<a href="#'+origin+'" class="return" id="return"><span aria-hidden="true">←</span> Back to '+(origin==='shortlist'?'shortlist':'places')+'</a><div class="detail-grid"><figure class="detail-image"><img src="'+image(p[7])+'" alt="'+p[8]+'" width="800" height="400"></figure><div class="detail-body"><div class="metadata">'+p[1]+'<span class="dot" aria-hidden="true"></span>'+p[2]+' min</div><h1 id="place-title" tabindex="-1">'+p[0]+'</h1><p class="detail-note">'+p[6]+'</p><dl><div><dt>Access</dt><dd>'+p[3]+'</dd></div><div><dt>Open</dt><dd>'+p[4]+'</dd></div><div><dt>Getting there</dt><dd>'+p[5]+'</dd></div></dl><button class="solid detail-save" type="button" data-save="'+p[7]+'">'+bookmark+'<span></span></button></div></div>';
  updateSaves();
}
function renderRoute(moveFocus=false){
  const route=readRoute();
  const p=route.startsWith('place/')&&byId(route.slice(6));
  if(p){
    const origin=history.state?.origin||'browse';
    if(mode!==origin){mode=origin;renderCollection();}
    if(activeDetail===p[7])return;
    activeDetail=p[7];
    collection.hidden=true;
    detail.hidden=false;
    renderDetail(p);
    document.title=p[0]+' | Coast & Current';
    window.scrollTo(0,0);
    if(moveFocus)$('#place-title').focus({preventScroll:true});
    return;
  }
  const nextMode=route==='shortlist'?'shortlist':'browse';
  const returning=Boolean(activeDetail);
  activeDetail='';
  detail.hidden=true;
  collection.hidden=false;
  if(nextMode!==mode){mode=nextMode;renderCollection();}
  document.title=(mode==='shortlist'?'Shortlist | ':'')+'Coast & Current';
  const state=history.state;
  const target=returning&&state?.focus?document.getElementById(state.focus):null;
  const continuation=returning&&mode==='shortlist'&&!target
    ? [...cards.querySelectorAll('h3 a')][state?.index||0] || cards.querySelector('article:last-child h3 a, .empty a')
    : null;
  if(moveFocus)(target||continuation||$('#collection-title')).focus({preventScroll:!continuation});
  if(moveFocus&&!continuation)window.scrollTo(0,state?.y??positions[mode]);
}
function navigate(route){
  if(route===readRoute()||(!readRoute()&&route==='browse'))return;
  if(!activeDetail){
    positions[mode]=window.scrollY;
    const focus=route.startsWith('place/')?'open-'+route.slice(6):null;
    const index=[...cards.querySelectorAll('h3 a')].findIndex(link=>link.id===focus);
    history.replaceState({y:window.scrollY,focus,index},'');
  }
  const state=route.startsWith('place/')?{origin:mode,fromList:!activeDetail}:{y:positions[route]||0};
  history.pushState(state,'','#'+route);
  renderRoute(true);
}
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-save]');
  if(button){
    const id=button.dataset.save, p=byId(id), wasSaved=saved.has(id);
    if(wasSaved)saved.delete(id);else saved.add(id);
    let persisted=true;
    try{localStorage.setItem(storageKey,JSON.stringify([...saved]));}catch{persisted=false;}
    if(mode==='shortlist'){
      const buttons=[...cards.querySelectorAll('[data-save]')];
      const index=buttons.findIndex(b=>b.dataset.save===id);
      renderCollection();
      if(!activeDetail){
        const next=[...cards.querySelectorAll('[data-save]')];
        (next[Math.min(index,next.length-1)]||cards.querySelector('.solid'))?.focus({preventScroll:true});
      }
    }
    updateSaves();
    $('#announcement').textContent=p[0]+(wasSaved?' removed from shortlist.':' saved to shortlist.')+(persisted?'':' Browser storage is unavailable. This change lasts until the page closes.');
    return;
  }
  if(event.target.closest('#clear-filters')){
    $('input[value="All"]').checked=true;
    $('#step-free').checked=false;
    renderCollection();
    $('input[value="All"]').focus();
    return;
  }
  const link=event.target.closest('a[href^="#"]');
  if(!link||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
  event.preventDefault();
  if(link.id==='return'&&history.state?.fromList)history.back();
  else navigate(link.hash.slice(1));
});
$('#filters').addEventListener('change',renderCollection);
$('#sort').addEventListener('change',renderCollection);
window.addEventListener('popstate',()=>renderRoute(true));
renderRoute();

function art(id){
const palettes={breakwater:['#eed7a8','#39797a','#183f3a'],reeds:['#edd6aa','#689080','#546143'],cove:['#f3d8b4','#518984','#314b41'],pilot:['#ead6b6','#597f82','#344f45'],dune:['#f5ddb3','#689795','#666745'],hide:['#e7c79c','#5d8278','#3a5846'],gull:['#e1dcc2','#447c81','#426057'],ebb:['#ecd4b3','#568781','#38483f'],hero:['#f7dbad','#447b77','#2d5850']};
const [sky,sea,dark]=palettes[id];
const grass=(x,y,n=1)=>'<path d="M0 0Q-4 -15 -14 -27M0 0Q0 -21 5 -34M0 0Q7 -18 18 -23M0 0Q-10 -10 -21 -13" transform="translate('+x+' '+y+') scale('+n+')" fill="none" stroke="'+dark+'" stroke-width="1.4"/>';
const waves=Array.from({length:52},(_,i)=>{const x=(i*127)%830-15,y=153+(i*41)%230,w=12+(i*73)%105;return '<path d="M'+x+' '+y+'q'+w/2+' -3 '+w+' 0" stroke="'+(i%3?'#e4cfaa':'#214d50')+'" opacity="'+(i%3?'.46':'.27')+'" fill="none"/>'}).join('');
const bird=(x,y,s)=>'<path d="M-12 1q7-7 12 1q5-8 12-2" fill="none" stroke="#304f46" stroke-width="1.35" transform="translate('+x+' '+y+') scale('+s+')"/>';
const rocks=(warm)=>Array.from({length:66},(_,i)=>{let x=(i*179)%823,y=314+(i*53)%105,r=2+(i*7)%11;return '<path d="M'+x+' '+y+'l'+r+' -3 '+r+' 5 -'+r+' 4z" fill="'+warm[i%warm.length]+'" opacity=".65"/>'}).join('');
const cliff='<path d="M0 200L67 162 115 172 176 132 238 139 266 166 322 191 396 205 310 226 208 216 129 248 0 251Z" fill="'+dark+'"/><path d="M0 198L69 159 114 171 176 130 239 139 264 163 210 155 169 172 123 183 69 179 0 214Z" fill="#85815a"/><path d="m0 226 104-33 77 0 62-35m-218 90 121-39 80-2 55-33m-100 40 70-16 48-15" fill="none" stroke="#c8a571" opacity=".64"/>';
const beacon='<path d="M-14 1l5-53h18l5 53z" fill="#f7e7c7"/><path d="M-11-26h22l2 12h-26zM-13-53L0-66l13 13z" fill="#9c4d3c"/><path d="M-8-51h16v8H-8z" fill="#40554a"/><path d="M-5 0v-13h10V0" fill="#46514a"/>';
const house='<path d="M-62 4v-60h109V4z" fill="#f1d6a7"/><path d="M-73-55l56-44 76 44z" fill="#904d3c"/><path d="M-15-61l42-31 41 30v66h-83z" fill="#e8cc9e"/><path d="M-21-61l48-37 46 36-6 5-40-30-41 32z" fill="#aa6045"/><path d="M16 4v-29h19V4M-49-40h17v20h-17m66-38h17v16H17m27 10h14v18H44" fill="#3b5a53"/>';
const scene={
hero:cliff+'<path d="M0 278q175-90 291-53t258 2q-83 24-149 63T235 400H0z" fill="#ba9766"/><path d="M0 290q156-72 257-38t211 9q-119 48-228 139H0z" fill="#526b50"/><path d="M-10 412Q137 355 148 306T275 238l24 7Q173 267 177 309T44 412" fill="#ecd2a3"/><g transform="translate(230 144) scale(.73)">'+beacon+'</g><path d="M574 265q84-15 160-2m-192 21q80-12 145-5m-204 30q123-21 225-11m-116 30q87-15 208-11" stroke="#e6d6ae" fill="none" stroke-width="2"/>'+Array.from({length:48},(_,i)=>grass((i*61)%385,288+(i*37)%119,.3+i%5*.13)).join(''),
breakwater:'<path d="M0 390V298l514-87 73 33-447 156z" fill="#304c49"/><path d="M0 288l516-91 63 24L0 344z" fill="#bb9b72"/><path d="M0 324l579-103v22L0 366z" fill="#7d7358"/><path d="M0 350l183-36-25 13-129 40m-16-4 112-21-25 13-65 18m-21 3 63-13-23 13-41 10" fill="none" stroke="#e3c394" stroke-width="4"/><g transform="translate(514 207) scale(1.4)">'+beacon+'</g>'+rocks(['#5b6253','#a49474','#394d47']),
reeds:'<path d="M0 185Q178 154 337 204T800 187v44Q561 270 415 242T0 293z" fill="#a19563"/><path d="M0 268q171-48 326-28T800 212v72q-218-24-340 35T0 354z" fill="#7a8057"/><path d="M218 420l152-145 140-44 118-48-107 53-134 54-82 130z" fill="#4d5544"/><path d="M235 420l141-141 137-45 115-52-105 56-136 53-104 129z" fill="#deb183"/><path d="M233 400l75 2m-53-21 65 1m-43-23 54 4m-32-24 47 5m-30-23 44 6m-22-24 34 7m-17-24 26 6" stroke="#75614c"/>'+Array.from({length:85},(_,i)=>{let x=(i*91)%800,y=245+(i*41)%165;return (x<217||x>405)?grass(x,y,.35+i%6*.2):''}).join(''),
cove:cliff+'<path d="M800 146l-100 18-89 46-90 24 96 10 113-23 70 5z" fill="#41665a"/><path d="M0 260q173-74 307-19t282 36q-171 8-219 54t-28 69H0z" fill="#dec39b"/><path d="M0 279q179-58 306-30t222 31q-106 16-178 55" fill="none" stroke="#f6e8c4" stroke-width="4"/>'+rocks(['#aa8e75','#827e6a','#e9d1a5']),
pilot:'<path d="M0 209q132-29 233-56t164 43q80 48 403 70v134H0z" fill="#637151"/><path d="M0 301q140-24 293-108t151 20Q332 309 287 400H0z" fill="#465c45"/><path d="M62 400l241-94-65-18 122-56-15-17 39-17 13 8-39 18 22 14-118 47 79 25-198 90z" fill="#d6b387"/><g transform="translate(352 206) scale(1.23)">'+house+'</g>'+Array.from({length:43},(_,i)=>grass(i*79%800,288+i*43%115,.4+i%4*.17)).join(''),
dune:'<path d="M0 230Q166 143 330 222T800 207v193H0z" fill="#b8a06c"/><path d="M0 295q133-107 338-48t462-15v168H0z" fill="#debd83"/><path d="M0 344q135-54 246-55t236 33 318-23v101H0z" fill="#a38f5e"/><path d="M315 400q-78-39 95-64t-36-53q-56-10 34-49-60 39-14 42 239 31 62 65T480 400z" fill="#f3d9a4"/>'+Array.from({length:65},(_,i)=>{let x=i*93%800,y=271+i*57%142;return x<300||x>490?grass(x,y,.35+i%6*.18):''}).join(''),
hide:'<path d="M0 186q166-51 287 12t513-24v53q-251-2-410 23T0 255z" fill="#887d56"/><path d="M0 314q103-73 276-52t219 64l-22 74H0z" fill="#777955"/><path d="M0 399l231-102 110-19-86 35L91 400z" fill="#c4a879"/><g transform="translate(326 281)"><path d="M-77 6v-78l141-2v75z" fill="#9b7351"/><path d="M-91-69l132-36 40 29-143 16z" fill="#394e42"/><path d="M-65-53h114v19H-65z" fill="#293e38"/><path d="M-56-2v-24h22v23M-14-8v-19m23 20v-20m21 18v-18" fill="none" stroke="#5b5241" stroke-width="3"/></g>'+Array.from({length:58},(_,i)=>grass(i*83%800,329+i*39%80,.31+i%4*.19)).join(''),
gull:'<path d="M0 267q154-42 300-118l171 43 88 43-123 29-162 92L0 400z" fill="#466459"/><path d="M0 267q154-42 300-118l171 43 65 31-111 15-152 88L0 354z" fill="#7c845d"/><path d="M0 339l247-46 88-77 143-15 26 10-144 25-89 81L0 388z" fill="#d6c4a0"/><path d="m0 359 258-52 89-81 143-18" stroke="#a3997c" fill="none"/>'+bird(547,132,2)+bird(618,105,1.4)+bird(692,151,1.8),
ebb:'<path d="M0 249l145-48 132 37 110-12 157 39 147-27 109 39v123H0z" fill="#8f836c"/><path d="M0 273l158-47 117 36 90-16 175 45 162-32 98 36v105H0z" fill="#494e46"/>'+Array.from({length:12},(_,i)=>{let x=(i*169)%850-30,y=278+(i*77)%126;return '<path d="M'+x+' '+y+'q39-22 86-9t62 16q-27 16-88 11t-60-18z" fill="'+(i%2?'#6c9485':'#75a297')+'" stroke="#9d9377" stroke-width="4"/>'}).join('')
}[id];
const lights={hero:[625,88,45,.82],breakwater:[618,82,41,.78],reeds:[697,112,31,.46],cove:[638,71,48,.78],pilot:[174,87,37,.62],dune:[558,61,43,.78],hide:[683,119,52,.75],gull:[615,92,37,.19],ebb:[317,104,29,.32]};
const [sx,sy,sr,so]=lights[id];
const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"><defs><linearGradient id="s" x2="0" y2="1"><stop stop-color="'+sky+'"/><stop offset="1" stop-color="#f4e7c7"/></linearGradient><linearGradient id="w" x2="0" y2="1"><stop stop-color="#a0a98c"/><stop offset=".6" stop-color="'+sea+'"/><stop offset="1" stop-color="#2e6263"/></linearGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".53" numOctaves="3" stitchTiles="stitch"/></filter></defs><path fill="url(#s)" d="M0 0h800v400H0z"/><circle cx="'+sx+'" cy="'+sy+'" r="'+sr+'" fill="#fff0c9" opacity="'+so+'"/><path d="M29 99h190m-98-18h205m91 30h172m94 16h102" stroke="#fff2d3" stroke-width="2" opacity=".58"/><path d="M0 150q117-11 215 0t197 0 388 1v249H0z" fill="url(#w)"/>'+waves+bird(500,87,.85)+bird(531,70,.67)+scene+'<path d="M0 0h800v400H0z" filter="url(#grain)" opacity=".16" style="mix-blend-mode:multiply"/></svg>';
return 'data:image/svg+xml,'+encodeURIComponent(svg);
}