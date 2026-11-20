
const samples = [["201","Jun 3","07:42","Mill Weir","16.8","294","Review","Storm runoff.","Intact seal.","205"],["202","Jun 3","07:55","Market Bridge","7.2","318","Accepted","","Clear duplicate."],["203","Jun 3","08:10","North Ferry","2.6","410","Review","Bottle-label mismatch.","Requests chain-of-custody check.","206"],["204","Jun 3","08:22","Birch Cut","3.2","360","Accepted","","Intact seal."],["205","Jun 4","07:40","Mill Weir","5.1","298","Review","Repeat for RW-201.","Runoff receded overnight.","201"],["206","Jun 4","08:12","North Ferry","2.5","408","Hold","Repeat for RW-203.","Second bottle identifier verified.","203"],["207","Jun 4","08:50","Birch Cut","4.1","365","Review","Field meter recalibrated.","Fresh check standard."],["208","Jun 4","09:10","Market Bridge","6.9","321","Review","","Late transport and intact seal."]].map(([number, date, time, station, turbidity, conductivity, original, context, lab, repeat]) => ({
  id: 'RW-' + number, date, time, station, turbidity, conductivity, original, context, lab,
  labId: 'L-' + (Number(number) - 183), repeat: repeat && 'RW-' + repeat
}));
const full = true;
const byId = Object.fromEntries(samples.map(sample => [sample.id, sample]));
const key = 'riverwatch-v1:' + location.pathname;
const $ = selector => document.querySelector(selector);
const defaults = { search:'', station:'', status:'', id:samples[0].id, view:'register', origin:null,
  changes:{}, undo:[], pair:[samples[0].id, samples.find(s => s.id === 'RW-205')?.id || samples[1].id] };
let state;
try { state = {...defaults, ...JSON.parse(localStorage.getItem(key))}; } catch { state = {...defaults}; }
let hold = false;
let draft = '';
let message = '';
let storageFailed = false;
const compact = matchMedia('(max-width:820px)');
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const disposition = sample => state.changes[sample.id]?.status || sample.original;
const note = sample => state.changes[sample.id]?.note;
const badge = status => '<span class="status ' + status + '">' + status + '</span>';
const stamp = sample => sample.date + ' · ' + sample.time;
const options = (values, selected) => values.map(([value,label]) => '<option value="' + escape(value) + '"' + (selected === value ? ' selected' : '') + '>' + escape(label) + '</option>').join('');
const savedRoute = () => ({id: state.id, view: state.view, origin: state.origin});
function persist() {
  try { localStorage.setItem(key, JSON.stringify(state)); storageFailed = false; } catch { storageFailed = true; }
}
function route(view, id = state.id, origin = null, replace = false) {
  leaveHold();
  Object.assign(state, {view, id, origin});
  const url = view === 'detail' ? '#' + id : view === 'compare' ? '#compare' : location.pathname + location.search;
  history[replace ? 'replaceState' : 'pushState'](savedRoute(), '', url);
  render();
  orient();
}
function leaveHold() { hold = false; draft = ''; }
function restoreRoute() {
  leaveHold();
  const hash = location.hash.slice(1);
  if (history.state?.view) Object.assign(state, history.state);
  else if (byId[hash]) Object.assign(state, {view:'detail', id:hash, origin:null});
  else if (full && hash === 'compare') state.view = 'compare';
  else state.view = 'register';
  render();
  orient();
}
function orient() {
  if (state.view === 'detail') {
    $('#detail-title')?.focus({preventScroll:true});
    if (compact.matches) window.scrollTo(0,0);
  } else if (state.view === 'compare') {
    $('#compare-title')?.focus({preventScroll:true});
    window.scrollTo(0,0);
  } else {
    const row = document.querySelector('[data-id="' + state.id + '"]');
    (row || $('#search')).focus();
  }
}
function matching() {
  const term = state.search.trim().toLowerCase();
  return samples.filter(s =>
    (!term || (s.id + ' ' + s.labId + ' ' + s.lab).toLowerCase().includes(term)) &&
    (!state.station || s.station === state.station) &&
    (!state.status || disposition(s) === state.status));
}
function rows(list) {
  $('#count').textContent = list.length + ' of ' + samples.length + ' samples';
  $('#rows').innerHTML = list.length ? list.map(s =>
    '<button type="button" class="sample" data-act="open" data-id="' + s.id + '" aria-current="' + (state.id === s.id) + '">' +
    '<span><strong>' + s.id + '</strong><span class="time">' + stamp(s) + '</span></span>' +
    '<span>' + s.station + '<span class="compact-measures">' + s.turbidity + ' NTU</span></span>' +
    '<span class="measure">' + s.turbidity + ' NTU</span><span class="measure">' + s.conductivity + ' µS/cm</span>' +
    '<span>' + badge(disposition(s)) + '</span></button>').join('') :
    '<div class="empty"><h3>No samples match</h3><p class="muted">Try a different search or clear the filters.</p><button data-act="clear">Clear filters</button></div>';
}
function detail(s, list) {
  const linked = byId[s.repeat];
  const excluded = !list.includes(s);
  const next = list.find(item => Number(item.id.slice(3)) > Number(s.id.slice(3))) || list.find(item => item !== s);
  const last = state.undo.at(-1);
  const back = state.origin ? '<button class="ghost" data-act="origin">← Back to ' + state.origin + '</button>' : '';
  $('#detail').innerHTML =
    '<div class="detail-head"><div class="backbar"><button class="ghost mobile-back" data-act="register">← Sample register</button>' + back + '</div>' +
    '<div class="spread"><span class="detail-id">' + s.id + '</span>' + badge(disposition(s)) + '</div>' +
    '<h2 id="detail-title" tabindex="-1">' + s.station + '</h2><p class="detail-date">Collected ' + stamp(s) + '</p><button class="ghost compare-sample" data-act="compare-sample" data-id="' + s.id + '">Compare this sample</button></div>' +
    '<div class="details">' +
    (excluded ? '<div class="notice"><p><strong>' + s.id + ' is outside the current filters.</strong></p><button class="ghost" data-act="clear">Clear filters</button>' +
      (next ? '<button class="ghost" data-act="open" data-id="' + next.id + '">Open ' + next.id + ' →</button>' : '') + '</div>' : '') +
    '<div class="metrics"><div class="metric"><span>Turbidity</span><strong>' + s.turbidity + '</strong><small>NTU</small></div>' +
    '<div class="metric"><span>Conductivity</span><strong>' + s.conductivity + '</strong><small>µS/cm</small></div></div>' +
    '<div class="section"><h3>Lab note · ' + s.labId + '</h3><p class="lab">' + s.lab + '</p>' +
    (s.context ? '<p class="muted small">Field context · ' + s.context + '</p>' : '') + '</div>' +
    (linked ? '<div class="section"><h3>Linked sample</h3><button class="relation" data-act="repeat" data-id="' + linked.id + '">' +
      '<span>' + (Number(s.id.slice(3)) < Number(linked.id.slice(3)) ? 'Repeat' : 'Original') + ' · <strong>' + linked.id + '</strong> <span class="muted small">' + stamp(linked) + '</span></span><span aria-hidden="true">→</span></button></div>' : '') +
    '<div class="section"><h3>Set disposition</h3>' +
    (note(s) ? '<p class="lab"><strong>Hold note</strong> · ' + escape(note(s)) + '</p>' : '') +
    '<div class="actions"><button class="primary" data-act="accept">Accept</button><button data-act="hold">Hold</button><button data-act="review">Review</button></div>' +
    (hold ? '<form class="hold-form"><label for="hold-note"><strong>Hold note</strong> (required)</label><textarea id="hold-note" rows="2" required>' + escape(draft) + '</textarea><button class="primary" type="submit">Save hold</button> <button type="button" data-act="cancel">Cancel</button></form>' : '') +
    '<p class="message" role="status">' + escape(message) + '</p>' +
    (last ? '<button class="ghost" data-act="undo">Undo change to ' + last.id + '</button>' : '') +
    '</div></div>';
}

let compareReturn = state.compareReturn || null;
function comparison() {
  $('#compare').hidden = state.view !== 'compare';
  $('#open-compare').hidden = false;
  $('#open-compare').textContent = state.view === 'compare' ? 'Return to work' : 'Compare samples';
  if (state.view !== 'compare') return;
  const choices = samples.map(s=>[s.id, s.id + ' · ' + s.station]);
  const cols = state.pair.map(id => byId[id]);
  const metricLine = (sample, field, unit) => sample[field] + ' ' + unit;
  $('#compare').innerHTML =
    '<div class="register-head"><div class="backbar"><button class="ghost" data-act="close-compare">← ' +
    (compareReturn?.view === 'detail' ? 'Back to ' + compareReturn.id : 'Sample register') +
    '</button></div><h2 id="compare-title" tabindex="-1">Compare samples</h2><p class="muted compare-help">Choose two samples from the register.</p>' +
    '<div class="pair">' + cols.map((s,i)=>'<label>' + (i === 0 ? 'First sample' : 'Second sample') +
    '<select id="pick-' + i + '">' + options(choices, s.id) + '</select></label>').join('') + '</div></div>' +
    '<div class="details">' + cols.map(s => '<article class="compare-record"><h3>' + s.station + ' · ' + s.id + '</h3><p class="muted">Collected ' + stamp(s) + '</p>' +
    badge(disposition(s)) + '<div class="section"><b>Turbidity</b><p>' + metricLine(s,'turbidity','NTU') + '</p>' +
    '<b>Conductivity</b><p>' + metricLine(s,'conductivity','µS/cm') + '</p></div>' +
    '<div class="section"><b>Lab note · ' + s.labId + '</b><p>' + s.lab + '</p>' +
    (note(s) ? '<p><b>Hold note</b> · ' + escape(note(s)) + '</p>' : '') + '</div></article>').join('') + '</div>';
}
function enterCompare(id) {
  if (state.view === 'compare') { exitCompare(); return; }
  if (id) {
    const other = state.pair.find(candidate => candidate !== id);
    state.pair = [id, other || samples.find(s => s.id !== id).id];
  }
  compareReturn = savedRoute();
  state.compareReturn = compareReturn;
  route('compare');
}
function exitCompare() {
  const target = compareReturn || {view:'register',id:state.id,origin:null};
  route(target.view,target.id,target.origin,true);
}

function render() {
  persist();
  const list = matching();
  const sample = byId[state.id] || samples[0];
  $('#workspace').classList.toggle('active', state.view === 'detail');
  $('#workspace').classList.toggle('comparing', state.view === 'compare');
  $('#search').value = state.search;
  $('#station').value = state.station;
  $('#status').value = state.status;
  rows(list);
  detail(sample, list);
  if (full) comparison();
  if (storageFailed) {
    $('.foot').textContent = 'Browser storage is unavailable. Changes are kept while this page stays open.';
    $('.foot').setAttribute('role', 'alert');
  }
}
function commit(status, holdNote = '') {
  const s = byId[state.id];
  if (disposition(s) === status && (note(s) || '') === holdNote) {
    message = s.id + ' is already ' + status.toLowerCase() + '.';
  } else {
    state.undo.push({ id:s.id, previous:state.changes[s.id] || null });
    state.changes[s.id] = {status, note:holdNote};
    message = s.id + ' updated to ' + status + '.';
  }
  leaveHold();
  render();
  document.querySelector('[data-act="' + ({Accepted:'accept',Hold:'hold',Review:'review'}[status]) + '"]').focus({preventScroll:true});
}
$('#station').insertAdjacentHTML('beforeend', options([...new Set(samples.map(s=>s.station))].sort().map(s=>[s,s])));
const hash = location.hash.slice(1);
if (byId[hash] && (state.id !== hash || state.view !== 'detail')) Object.assign(state, {view:'detail',id:hash,origin:null});
if (full && hash === 'compare') state.view = 'compare';
const initialUrl = state.view === 'detail' ? '#' + state.id : state.view === 'compare' ? '#compare' : location.pathname + location.search;
history.replaceState(savedRoute(), '', initialUrl);
window.addEventListener('popstate', restoreRoute);
$('#search').addEventListener('input', event => { state.search = event.target.value; render(); });
for (const id of ['station','status']) $('#' + id).addEventListener('change', event => { state[id] = event.target.value; render(); });
document.addEventListener('input', event => {
  if (event.target.id === 'hold-note') { draft = event.target.value; event.target.setCustomValidity(''); }
});
document.addEventListener('submit', event => {
  if (!event.target.matches('.hold-form')) return;
  event.preventDefault();
  if (!draft.trim()) {
    $('#hold-note').setCustomValidity('Enter a note to place this sample on hold.');
    $('#hold-note').reportValidity();
    return;
  }
  commit('Hold', draft.trim());
});
document.addEventListener('click', event => {
  const control = event.target.closest('[data-act]');
  if (!control) return;
  const {act, id} = control.dataset;
  switch (act) {
    case 'open': message = ''; route('detail',id); break;
    case 'repeat': message = ''; route('detail',id,state.id); break;
    case 'origin': message = ''; route('detail',state.origin,null,true); break;
    case 'register': message = ''; route('register'); break;
    case 'clear': {
      const fromDetail = control.closest('#detail');
      Object.assign(state, {search:'', station:'', status:''});
      render();
      (fromDetail ? $('#detail-title') : $('#search')).focus({preventScroll:true});
      break;
    }
    case 'accept': commit('Accepted'); break;
    case 'review': commit('Review'); break;
    case 'hold': hold = true; draft = note(byId[state.id]) || ''; render(); $('#hold-note').focus(); break;
    case 'cancel': leaveHold(); render(); $('[data-act=hold]').focus(); break;
    case 'undo': {
      const last = state.undo.pop();
      if (last.previous) state.changes[last.id] = last.previous;
      else delete state.changes[last.id];
      message = last.id + ' restored to ' + disposition(byId[last.id]) + '.';
      render();
      $('[data-act=undo]')?.focus({preventScroll:true}) || $('#detail-title').focus({preventScroll:true});
      break;
    }
    
    case 'compare': enterCompare(); break;
    case 'compare-sample': enterCompare(id); break;
    case 'close-compare': exitCompare(); break;

  }
});

$('#compare').addEventListener('change', event => {
  if (!event.target.id.startsWith('pick-')) return;
  const index = Number(event.target.id.slice(-1));
  const other = 1 - index;
  if (state.pair[other] === event.target.value) state.pair[other] = state.pair[index];
  state.pair[index] = event.target.value;
  render();
  $('#pick-' + index).focus();
});

render();
