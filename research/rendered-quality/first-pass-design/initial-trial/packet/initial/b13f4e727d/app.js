
const zines = [
  {id:'night', title:'Night Windows', topic:'Photography', price:12, table:'B4', mat:'#dcd8cf', description:'24 black-and-white photographs of lit windows on the last tram route.'},
  {id:'botany', title:'Bus Stop Botany', topic:'Field notes', price:8, table:'C7', mat:'#d9dfcb', description:'Fold-out guide to five plants found at the Crosstown terminus.'},
  {id:'table', title:'Three Ways to Set a Table', topic:'Comics', price:9, table:'A2', mat:'#ebd5c5', description:'Three wordless comics about dinner with neighbors.'},
  {id:'wet', title:'Wet Asphalt', topic:'Photography', price:16, table:'B9', mat:'#d2dbdd', description:'Large-format reflections captured after a summer storm.'},
  {id:'shelves', title:'Free Shelves', topic:'Field notes', price:6, table:'C3', mat:'#e6d9ab', description:'Annotated map of street libraries and a page for new entries.'},
  {id:'antenna', title:'Antenna Club', topic:'Comics', price:11, table:'A5', mat:'#e0d5dd', description:'Short comic about a radio club losing its rooftop access.'}
];

const coverArt = {
  night: '<rect width="160" height="218" fill="#242625"/><path d="M0 95L60 69v149H0zm52 20 43-23v126H52zm47-30 61 21v112H99z" fill="#101111"/><path d="M5 111l42-16m-42 55 42-16m-42 55 42-16m58-50 55 18m-55 29 55 18" stroke="#565651"/><path d="M14 103l8-4v22l-8 3zm13 15 10-4v17l-10 4zm-12 44 12-4v17l-12 4zm50-24 13-5v20l-13 4zm50-24 16 5v27l-16-5zm21 63 12 4v20l-12-5z" fill="#e9dec4"/><path d="M119 115v26m-4-15 16 5m-57 4v20m-52 6v16" stroke="#3a3731"/><path d="m0 213 160-22M0 216l160-15" stroke="#a9a397" opacity=".6"/><g fill="#f8efdc" font-family="Georgia" font-size="28" font-weight="bold"><text x="12" y="35">NIGHT</text><text x="12" y="63">WINDOWS</text></g>',
  botany: '<rect width="160" height="218" fill="#eae7ba"/><path d="M12 14h136v190H12z" fill="none" stroke="#34533d"/><g fill="#234430" font-family="Georgia" font-weight="bold" text-anchor="middle"><text x="80" y="45" font-size="23">BUS STOP</text><text x="80" y="72" font-size="30">BOTANY</text></g><path d="M14 85h132m-132 98h132" stroke="#34533d"/><path d="M76 178q16-53 8-88m-8 88q-4-40-40-56m40 56q19-28 54-32m-54 32q-24-15-49-9" fill="none" stroke="#33583d" stroke-width="2"/><g fill="#517647" stroke="#33583d"><path d="M86 113q5-24 22-22-5 15-22 22zm-1 21q10-24 28-24-6 20-28 24zm-2-18q-19-3-19-23 13 3 19 23zm-3 33q-22-2-22-24 15 7 22 24zm-25 0q-20 3-25-14 16-1 25 14zm-6-12q-21-4-21-22 14 3 21 22zm50 24q6-16 24-22-2 17-24 22zm-42 12q-14 9-27-2 14-7 27 2z"/></g><text x="80" y="196" text-anchor="middle" fill="#294c36" font-family="monospace" font-size="8">CROSSTOWN TERMINUS</text>',
  table: '<rect width="160" height="218" fill="#c65136"/><path d="M10 11h140v195H10z" fill="none" stroke="#f9d8ab"/><g font-family="Arial" font-weight="900" text-anchor="middle" fill="#fff0cb"><text x="80" y="45" font-size="20">THREE WAYS</text><text x="80" y="67" font-size="17">TO SET</text><text x="80" y="94" font-size="29">A TABLE</text></g><g fill="#f3c48e" stroke="#321c1b" stroke-width="2"><path d="M18 106h124v27H18zm0 31h124v27H18zm0 31h124v27H18z"/><path d="M44 121h72m-63-7 4 13m43-13 4 13m-63 21h80m-75 31h70"/><ellipse cx="79" cy="120" rx="13" ry="6"/><ellipse cx="62" cy="150" rx="11" ry="6"/><ellipse cx="100" cy="150" rx="11" ry="6"/><ellipse cx="55" cy="181" rx="9" ry="5"/><ellipse cx="80" cy="181" rx="9" ry="5"/><ellipse cx="106" cy="181" rx="9" ry="5"/></g>',
  wet: '<rect width="160" height="218" fill="#1b303d"/><path d="M0 125h160v93H0z" fill="#284c61"/><path d="M0 127h160M14 139h124M28 146h109M10 177h96m-88 12h123m-124 17h137" stroke="#799291"/><path d="M44 93h13l18 124H14zm63 18h10l37 107H92z" fill="#ccb983" opacity=".72"/><path d="m45 112 14 2m-21 20 23 1m-31 12 34 1m-36 15 39 1m-50 22 53 2m26-45 31 1m-33 20 38 1m-41 18 47 3" stroke="#284c61" stroke-width="3"/><text x="12" y="44" font-size="38" font-family="Arial" font-weight="900" fill="#e9ddbc">WET</text><text x="12" y="70" font-size="26" font-family="Arial" font-weight="900" fill="#e9ddbc">ASPHALT</text>',
  shelves: '<rect width="160" height="218" fill="#e9b84b"/><path d="m0 134 160-43M0 181l160-59M17 218l39-117m34 117 23-116m38 116-14-120" fill="none" stroke="#f9df9d" stroke-width="9"/><path d="m0 134 160-43M0 181l160-59M17 218l39-117m34 117 23-116m38 116-14-120" fill="none" stroke="#38352a" stroke-width="1" stroke-dasharray="3 4"/><g fill="#7d3529"><circle cx="45" cy="136" r="9"/><circle cx="102" cy="145" r="9"/><circle cx="145" cy="174" r="9"/></g><g fill="#282a21" font-family="Georgia" font-weight="bold"><text x="14" y="41" font-size="32">FREE</text><text x="14" y="72" font-size="28">SHELVES</text></g><path d="M16 85h127" stroke="#282a21"/><text x="17" y="102" font-size="8" font-family="monospace">A STREET LIBRARY MAP</text>',
  antenna: '<rect width="160" height="218" fill="#b49bb8"/><path d="M16 101h128v103H16z" fill="#ebe0de" stroke="#322638" stroke-width="2"/><circle cx="119" cy="122" r="13" fill="#ce725d"/><path d="M17 178h34v-17h39v26h54v17H17z" fill="#433149"/><path d="M82 184v-72m-30 18 49 8m-47 8 48 8m-47 6 42 7m-37-56-8 19m20-17-10 18m25-15-10 19" stroke="#322638" stroke-width="2" fill="none"/><path d="M103 106q12 5 13 16m-5-19q12 5 15 18" fill="none" stroke="#322638"/><g fill="#322638" font-family="Arial" font-size="28" font-weight="900"><text x="15" y="43">ANTENNA</text><text x="15" y="74">CLUB</text></g><path d="M16 87h128" stroke="#322638"/>'
};

function stage(zine) {
  const art = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="218" viewBox="0 0 160 218">' +
    coverArt[zine.id] + '<path d="M2 0v218" stroke="#211917" stroke-opacity=".35" stroke-width="3"/></svg>';
  return '<span class="stage" style="--mat:' + zine.mat + '"><img class="cover" alt="" width="160" height="218" src="data:image/svg+xml,' + encodeURIComponent(art).replaceAll("'", "%27") + '"></span>';
}

const panel = document.querySelector('#panel');
const content = document.querySelector('#panel-content');
const rack = document.querySelector('#rack');
const shortlist = document.querySelector('#shortlist');
const announcement = document.querySelector('#announcement');
let topic = 'All';
let opener;
let saved;
try {
  saved = new Set(JSON.parse(localStorage.getItem('fold-fair-shortlist') || '[]'));
} catch {
  saved = new Set();
}

function updateCount() {
  document.querySelector('#saved-count').textContent = saved.size;
}

function renderRack() {
  const visible = zines.filter(zine => topic === 'All' || zine.topic === topic);
  document.querySelector('#result-count').textContent = visible.length + ' zines';
  rack.innerHTML = visible.map(zine =>
    '<button type="button" class="card" data-open="' + zine.id + '">' + stage(zine) +
    '<span class="card-info"><span class="name">' + zine.title +
    '</span><span class="topic">' + zine.topic + ' <span class="marked"></span></span>' +
    '<span class="meta"><span>$' + zine.price + '</span><span class="table">Table ' +
    zine.table + '</span></span></span></button>'
  ).join('');
  markCards();
}
function markCards() {
  rack.querySelectorAll('[data-open]').forEach(button => {
    button.querySelector('.marked').textContent = saved.has(button.dataset.open) ? ' · Saved' : '';
  });
}
function setSaved(zine, shouldSave) {
  if (shouldSave) saved.add(zine.id);
  else saved.delete(zine.id);
  try {
    localStorage.setItem('fold-fair-shortlist', JSON.stringify([...saved]));
  } catch {
    announcement.textContent = 'Storage is unavailable. Shortlist changes last for this visit.';
    updateCount();
    markCards();
    return;
  }
  announcement.textContent = zine.title + (shouldSave ? ' saved to shortlist.' : ' removed from shortlist.');
  updateCount();
  markCards();
}
function openPanel(origin) {
  if (!panel.open) {
    opener = origin;
    panel.showModal();
  }
  content.querySelector('[data-back]').focus();
}
function backBar(label, destination) {
  return '<div class="panel-top"><button type="button" data-back="' + destination + '">← ' + label + '</button></div>';
}
function updateSaveButton(button, zine) {
  const isSaved = saved.has(zine.id);
  button.textContent = isSaved ? '✓ Remove from shortlist' : '☆ Save to shortlist';
  button.setAttribute('aria-pressed', String(isSaved));
}
function showDetail(zine, origin, fromShortlist = false) {
  content.innerHTML = backBar(fromShortlist ? 'Back to shortlist' : 'Back to zines', fromShortlist ? 'saved' : 'close') +
    '<div class="detail">' + stage(zine) +
    '<div class="detail-copy"><span class="topic">' + zine.topic + '</span><h2 id="panel-title">' + zine.title +
    '</h2><p>' + zine.description + '</p><div class="detail-meta"><span>$' + zine.price +
    '</span><span class="table">Table ' + zine.table +
    '</span></div><button type="button" class="action" data-save="' + zine.id + '"></button></div></div>';
  updateSaveButton(content.querySelector('[data-save]'), zine);
  openPanel(origin);
}
function showShortlist(origin, focusIndex) {
  const entries = zines.filter(zine => saved.has(zine.id));
  content.innerHTML = backBar('Back to zines', 'close') +
    '<section class="shortlist-view"><h2 id="panel-title">Shortlist</h2>' +
    (entries.length ? '<ul>' + entries.map(zine =>
      '<li><button type="button" class="saved-item" data-detail="' + zine.id + '"><strong>' + zine.title +
      '</strong><span>Table ' + zine.table + ' · $' + zine.price + ' · ' + zine.topic +
      '</span></button><button type="button" class="remove" data-remove="' + zine.id +
      '" aria-label="Remove ' + zine.title + '">Remove</button></li>').join('') +
      '</ul>' : '<p>Your shortlist is empty. Save zines to keep their tables handy.</p>') + '</section>';
  openPanel(origin);
  if (focusIndex !== undefined && entries.length) {
    content.querySelectorAll('[data-remove]')[Math.min(focusIndex, entries.length - 1)].focus();
  }
}
function findZine(id) {
  return zines.find(zine => zine.id === id);
}

document.querySelector('.filters').addEventListener('click', event => {
  const button = event.target.closest('[data-topic]');
  if (!button || button.dataset.topic === topic) return;
  topic = button.dataset.topic;
  document.querySelectorAll('[data-topic]').forEach(filter => {
    filter.setAttribute('aria-pressed', String(filter === button));
  });
  renderRack();
});
rack.addEventListener('click', event => {
  const button = event.target.closest('[data-open]');
  if (button) showDetail(findZine(button.dataset.open), button);
});
shortlist.addEventListener('click', () => showShortlist(shortlist));
panel.addEventListener('close', () => opener?.focus({preventScroll:true}));
content.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  const {back, detail, remove, save} = button.dataset;
  if (back === 'close') panel.close();
  if (back === 'saved') showShortlist(shortlist);
  if (detail) showDetail(findZine(detail), shortlist, true);
  if (save) {
    const zine = findZine(save);
    setSaved(zine, !saved.has(save));
    updateSaveButton(button, zine);
  }
  if (remove) {
    const index = [...content.querySelectorAll('[data-remove]')].indexOf(button);
    setSaved(findZine(remove), false);
    showShortlist(shortlist, index);
  }
});
updateCount();
renderRack();
