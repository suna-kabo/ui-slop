const zines = [
  ['night','Night Windows','Photography',12,'B4','24 black-and-white photographs of lit windows on the last tram route.','#dcd9d1','#242527'],
  ['botany','Bus Stop Botany','Field notes',8,'C7','Fold-out guide to five plants found at the Crosstown terminus.','#dce1c7','#f2e5a5'],
  ['table','Three Ways to Set a Table','Comics',9,'A2','Three wordless comics about dinner with neighbors.','#efc8b7','#d75036'],
  ['wet','Wet Asphalt','Photography',16,'B9','Large-format reflections captured after a summer storm.','#cbd6dd','#223d57'],
  ['shelves','Free Shelves','Field notes',6,'C3','Annotated map of street libraries and a page for new entries.','#ead8bc','#ebbc62'],
  ['antenna','Antenna Club','Comics',11,'A5','Short comic about a radio club losing its rooftop access.','#dcd3e5','#9b82b8']
].map(([id,title,topic,price,table,description,mat,paper]) => ({id,title,topic,price,table,description,mat,paper}));

const type = (x,y,size,color,words,face='Georgia',weight='normal') =>
  '<text x="'+x+'" y="'+y+'" fill="'+color+'" font-family="'+face+'" font-weight="'+weight+'" font-size="'+size+'">'+words+'</text>';
const windowpanes = Array.from({length:35}, (_, i) => {
  const x = 19 + (i % 7) * 32;
  const y = 144 + Math.floor(i / 7) * 32;
  const shade = [0,5,9,13,16,21,25,30,33].includes(i) ? '#e8e4d3' : ['#444647','#323436','#555656'][i % 3];
  return '<path fill="'+shade+'" d="M'+x+' '+y+'h21v22h-21z"/><path stroke="#26282a" d="M'+(x+10)+' '+y+'v22m-10-9h21"/>';
}).join('');
const leaves = Array.from({length:7}, (_, i) => {
  const y = 252 - i*19;
  const x = 114 + i*3;
  return '<path d="M'+x+' '+y+'q-37 -4 -45 -32q29 -3 45 32m0 0q12 -30 44 -31q-8 27 -44 31"/>';
}).join('');
const placeSettings = [105,174,243].map((y,i) =>
  '<g transform="translate(0 '+y+')"><rect x="20" width="200" height="55" rx="4" fill="#f5bd91"/><ellipse cx="'+(74+i*46)+'" cy="27" rx="26" ry="17" fill="#f9dfad" stroke="#541d19" stroke-width="2"/><ellipse cx="'+(74+i*46)+'" cy="27" rx="19" ry="12" fill="none" stroke="#a33d2c"/><path d="M34 10v34m5-34v34m162-34v34M207 10l-1 20" stroke="#541d19" stroke-width="2"/><circle cx="'+(174-i*44)+'" cy="14" r="6" fill="#d75036"/></g>'
).join('');
const streaks = Array.from({length:42}, (_,i) => {
  const y=108+i*5, center=61+((i*79)%125), w=10+(i*37)%83;
  return '<path d="M'+(center-w)+' '+y+'h'+(2*w)+'" stroke="'+['#95cfea','#597d9f','#e7dad1','#315873','#d28466','#96a9c4'][i%6]+'" opacity="'+(.36+(i%4)*.15)+'" stroke-width="'+(1+i%4)+'"/>';
}).join('');
const art = {
  night: type(17,54,45,'#f7f2e4','NIGHT','Arial','bold')+type(17,92,38,'#f7f2e4','WINDOWS','Arial','bold')+
    '<path fill="#343638" d="M10 130h220v176H10z"/>'+windowpanes+'<path stroke="#aba79d" opacity=".6" d="M12 127h216M10 307h220"/>'+type(17,116,11,'#d4cfc5','Photographs from the last tram','Arial'),
  botany: '<path fill="none" stroke="#667249" d="M12 12h216v296H12z"/>'+type(26,58,37,'#283d26','Bus Stop')+type(26,101,49,'#283d26','Botany')+
    '<path fill="none" stroke="#486147" opacity=".35" stroke-dasharray="2 4" d="M30 124h180M30 174h180M30 224h180M30 274h180M62 123v154m56-154v154m56-154v154"/><path fill="none" stroke="#293f29" stroke-width="2" d="M109 280q4 -64 28 -149"/><g fill="#7f9659" stroke="#293f29" stroke-width="1.2">'+leaves+'</g>'+type(27,294,10,'#283d26','A CROSSTOWN FIELD GUIDE','Arial','bold'),
  table: type(20,40,31,'#ffe0ad','Three ways')+type(20,74,31,'#ffe0ad','to set a table')+placeSettings,
  wet: '<path fill="#192f46" d="M0 105h240v215H0z"/>'+streaks+type(17,56,49,'#e7edf2','WET','Arial','bold')+type(17,91,34,'#e7edf2','ASPHALT','Arial','bold'),
  shelves: type(20,49,43,'#462e20','Free')+type(20,91,53,'#462e20','Shelves')+
    '<g fill="none" stroke="#f8df9d" stroke-width="11"><path d="M0 139l83 53 150-54M-5 258l99-24 145 60M57 117l-9 70 43 54-21 79m92-220-6 65 60 74-20 81M0 305l146-116 94 7"/></g><g fill="#935537" stroke="#462e20" stroke-width="2"><path d="M45 171l15-10 15 10v26H45zm98-29 15-10 15 10v26h-30zm41 94 15-10 15 10v26h-30zm-110 1 15-10 15 10v26H74z"/></g>',
  antenna: type(18,51,38,'#271b37','ANTENNA','Arial','bold')+type(18,91,53,'#271b37','CLUB','Arial','bold')+
    '<circle cx="146" cy="175" r="59" fill="#e2cfde"/><g fill="none" stroke="#30263b" stroke-width="3"><path d="M122 278V139m-39 32h76m-65 15h55m-46 15h38m-52-31 33-31 31 31m-55 29 24 59 25-59"/><path d="M142 142q13 7 11 21m-6-31q22 12 21 34m-20-45q33 14 35 44"/></g><path fill="#30263b" d="M0 246h26v-23h37v48h24v-13h66v-16h36v15h30v-25h21v88H0z"/><path stroke="#bd9bc8" stroke-width="4" stroke-dasharray="5 8" d="M8 280h225m-201 14h169"/>'
};

function cover(zine) {
  return '<svg class="cover" aria-hidden="true" viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="320" fill="'+zine.paper+'"/>'+art[zine.id]+'<path d="M2 0v320" stroke="#21201f" stroke-opacity=".22" stroke-width="4"/></svg>';
}

const topics = ['All zines','Photography','Field notes','Comics'];
const $ = (selector) => document.querySelector(selector);
const detail = $('#detail-dialog');
const shortlist = $('#shortlist-dialog');
const storageKey = 'fold-fair-shortlist';
let selectedTopic = topics[0];
let saved = new Set();
try {
  const previous = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(previous)) saved = new Set(previous.filter(id => zines.some(zine => zine.id === id)));
} catch {}

function metadata(zine) {
  return '<span class="meta"><span>$'+zine.price+'</span><span class="table">Table '+zine.table+'</span></span>';
}
function renderCatalogue() {
  const visible = zines.filter(zine => selectedTopic === topics[0] || zine.topic === selectedTopic);
  $('.total').textContent = visible.length+' zines';
  $('.grid').innerHTML = visible.map(zine =>
    '<button class="card" data-zine="'+zine.id+'"><span class="mat" style="--mat:'+zine.mat+'">'+cover(zine)+'</span><span class="card-info"><span class="topic">'+zine.topic+'</span><span class="name">'+zine.title+'</span>'+metadata(zine)+'</span></button>'
  ).join('');
}
function updateCount() {
  $('#count').textContent = saved.size;
}
function toggleSave(zine) {
  if (saved.has(zine.id)) saved.delete(zine.id);
  else saved.add(zine.id);
  try { localStorage.setItem(storageKey, JSON.stringify([...saved])); } catch {}
  updateCount();
  $('#announcement').textContent = zine.title + (saved.has(zine.id) ? ' saved.' : ' removed.');
}
function openDetail(zine) {
  $('#detail-body').innerHTML = '<div class="mat" style="--mat:'+zine.mat+'">'+cover(zine)+'</div><section class="detail"><span class="topic">'+zine.topic+'</span><h2 id="detail-title">'+zine.title+'</h2><p>'+zine.description+'</p>'+metadata(zine)+'<button class="save"></button></section>';
  const button = $('.save');
  function updateSave() {
    button.textContent = saved.has(zine.id) ? '✓ Saved · Remove' : 'Save to shortlist';
    button.setAttribute('aria-pressed', saved.has(zine.id));
  }
  button.onclick = () => { toggleSave(zine); updateSave(); };
  updateSave();
  detail.showModal();
}
function renderShortlist() {
  const list = shortlist.querySelector('.list');
  list.innerHTML = saved.size ? zines.filter(zine => saved.has(zine.id)).map(zine =>
    '<div class="saved-row"><div><strong>'+zine.title+'</strong><span>Table '+zine.table+' · $'+zine.price+'</span></div><button class="remove" data-remove="'+zine.id+'" aria-label="Remove '+zine.title+'">Remove</button></div>'
  ).join('') : '<p class="empty">No zines saved yet.</p>';
}
$('.filters').innerHTML = topics.map(topic => '<button class="filter" aria-pressed="'+(topic === selectedTopic)+'">'+topic+'</button>').join('');
$('.filters').addEventListener('click', event => {
  const button = event.target.closest('.filter');
  if (!button) return;
  selectedTopic = button.textContent;
  document.querySelectorAll('.filter').forEach(item => item.setAttribute('aria-pressed', item === button));
  renderCatalogue();
});
$('.grid').addEventListener('click', event => {
  const card = event.target.closest('.card');
  if (card) openDetail(zines.find(zine => zine.id === card.dataset.zine));
});
$('#shortlist').onclick = () => { renderShortlist(); shortlist.showModal(); };
shortlist.addEventListener('click', event => {
  const button = event.target.closest('.remove');
  if (!button) return;
  const index = [...shortlist.querySelectorAll('.remove')].indexOf(button);
  toggleSave(zines.find(zine => zine.id === button.dataset.remove));
  renderShortlist();
  const remaining = shortlist.querySelectorAll('.remove');
  (remaining[Math.min(index, remaining.length - 1)] || shortlist.querySelector('.close')).focus();
});
for (const dialog of [detail, shortlist]) {
  dialog.querySelector('.close').onclick = () => dialog.close();
}
renderCatalogue();
updateCount();