
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
  const previous = replace ? null : savedRoute();
  leaveHold();
  Object.assign(state, {view, id, origin});
  const url = view === 'detail' ? '#' + id : view === 'compare' ? '#compare' : location.pathname + location.search;
  history[replace ? 'replaceState' : 'pushState']({...savedRoute(), previous}, '', url);
  render();
  orient();
}
function announce(text) { $('#announcements').textContent = text; }
function leaveHold() { hold = false; draft = ''; }
function restoreRoute() {
  leaveHold();
  const hash = location.hash.slice(1);
  const wasComparing = state.view === 'compare';
  const repeatOrigin = state.view === 'detail' ? state.origin : null;
  message = '';
  if (history.state?.view) {
    const {view, id, origin} = history.state;
    Object.assign(state, {view, id: view === 'register' ? state.id : id, origin});
  }
  else if (byId[hash]) Object.assign(state, {view:'detail', id:hash, origin:null});
  else if (full && hash === 'compare') state.view = 'compare';
  else state.view = 'register';
  render();
  orient();
  if (wasComparing && state.view !== 'compare') restoreCompareFocus();
  if (repeatOrigin && state.view === 'detail' && state.id === repeatOrigin) {
    $('[data-act=repeat]')?.focus({preventScroll:true});
  }
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
    '<h2 id="detail-title" tabindex="-1"><span class="sr">' + s.id + ' · </span>' + s.station + '</h2>' +
    '<div class="detail-meta"><p class="detail-date">Collected ' + stamp(s) + '</p><button class="ghost compare-sample" data-act="compare-sample" data-id="' + s.id + '">Compare this sample</button></div></div>' +
    '<div class="details">' +
    '<div class="metrics"><div class="metric"><span>Turbidity</span><strong>' + s.turbidity + '</strong><small>NTU</small></div>' +
    '<div class="metric"><span>Conductivity</span><strong>' + s.conductivity + '</strong><small>µS/cm</small></div></div>' +
    '<div class="section"><h3>Lab note · ' + s.labId + '</h3><p class="lab">' + s.lab + '</p>' +
    (s.context && !s.context.startsWith('Repeat for') ? '<p class="muted small">Field context · ' + s.context + '</p>' : '') + '</div>' +
    (linked ? '<div class="section"><button class="relation" data-act="repeat" data-id="' + linked.id + '">' +
      '<span>' + (Number(s.id.slice(3)) < Number(linked.id.slice(3)) ? 'Repeat' : 'Original') + ' · <strong>' + linked.id + '</strong> <span class="muted small">' + stamp(linked) + '</span></span><span aria-hidden="true">→</span></button></div>' : '') +
    '<div class="section"><h3>Set disposition</h3>' +
    (note(s) ? '<p class="lab"><strong>Hold note</strong> · ' + escape(note(s)) + '</p>' : '') +
    '<div class="actions"><button data-act="accept">Accept</button><button data-act="hold" aria-expanded="' + hold + '">Hold</button><button data-act="review">Review</button></div>' +
    (hold ? '<form class="hold-form"><label for="hold-note"><strong>Hold note</strong> (required)</label><textarea id="hold-note" rows="2" required>' + escape(draft) + '</textarea><button class="primary" type="submit">Save hold</button> <button type="button" data-act="cancel">Cancel</button></form>' : '') +
    ((message || last) ? '<div class="feedback"><p class="message">' + escape(message) + '</p>' +
      (last ? '<button class="ghost" data-act="undo">Undo change to ' + last.id + '</button>' : '') + '</div>' : '') +
    (excluded ? '<div class="notice"><p><strong>' + s.id + ' is outside the current filters.</strong></p><div class="notice-actions">' +
      (next ? '<button data-act="open" data-id="' + next.id + '">Open ' + next.id + ' →</button>' : '') +
      '<button class="ghost" data-act="clear">Clear filters</button></div></div>' : '') +
    '</div></div>';
}


function comparison() {
  $('#compare').hidden = state.view !== 'compare';
  $('#open-compare').hidden = state.view === 'compare';
  if (state.view !== 'compare') return;
  const choices = samples.map(s => [s.id, s.id]);
  const cols = state.pair.map(id => byId[id]);
  const compareRow = (heading, cell) => '<tr><th scope="row">' + heading +
    '</th>' + cols.map(s => '<td>' + cell(s) + '</td>').join('') + '</tr>';
  $('#compare').innerHTML =
    '<div class="register-head"><div class="backbar"><button class="ghost" data-act="close-compare">← ' +
    (state.compareReturn?.view === 'detail' ? 'Back to ' + state.compareReturn.id : 'Sample register') +
    '</button></div><h2 id="compare-title" tabindex="-1">Compare samples</h2></div>' +
    '<table class="comparison-table"><colgroup><col class="field"><col><col></colgroup><thead><tr><th scope="col"><span class="sr">Field</span></th>' +
    cols.map((s, i) => '<th scope="col"><label for="pick-' + i + '" class="sr">' + (i === 0 ? 'First sample' : 'Second sample') +
    '</label><select id="pick-' + i + '">' + options(choices, s.id) + '</select></th>').join('') + '</tr></thead><tbody>' +
    compareRow('Station', s => s.station) + compareRow('Collected', stamp) +
    compareRow('Disposition', s => badge(disposition(s))) +
    compareRow('Turbidity', s => s.turbidity + ' NTU') +
    compareRow('Conductivity', s => s.conductivity + ' µS/cm') +
    compareRow('Lab note', s => '<strong>' + s.labId + '</strong><div>' + s.lab + '</div>') +
    (cols.some(note) ? compareRow('Hold note', s => note(s) ? escape(note(s)) : '—') : '') +
    '</tbody></table>';
}
function enterCompare(id) {
  if (id && !state.pair.includes(id)) state.pair = [id, state.pair[0]];
  state.compareReturn = {...savedRoute(), fromDetail: Boolean(id)};
  route('compare');
}
function exitCompare() {
  const target = state.compareReturn || {view:'register',id:state.id,origin:null};
  if (history.state?.previous?.view === target.view) history.back();
  else {
    route(target.view,target.id,target.origin,true);
    restoreCompareFocus();
  }
}
function restoreCompareFocus() {
  const target = state.compareReturn?.fromDetail ? $('.compare-sample') : $('#open-compare');
  target?.focus({preventScroll:true});
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
  announce(message);
  document.querySelector('[data-act="' + ({Accepted:'accept',Hold:'hold',Review:'review'}[status]) + '"]').focus({preventScroll:true});
}
$('#station').insertAdjacentHTML('beforeend', options([...new Set(samples.map(s=>s.station))].sort().map(s=>[s,s])));
const hash = location.hash.slice(1);
if (byId[hash] && (state.id !== hash || state.view !== 'detail')) Object.assign(state, {view:'detail',id:hash,origin:null});
if (full && hash === 'compare') state.view = 'compare';
const initialUrl = state.view === 'detail' ? '#' + state.id : state.view === 'compare' ? '#compare' : location.pathname + location.search;
history.replaceState({...savedRoute(), previous: history.state?.previous || null}, '', initialUrl);
window.addEventListener('popstate', restoreRoute);
$('#search').addEventListener('input', event => { state.search = event.target.value; render(); });
for (const id of ['station','status']) $('#' + id).addEventListener('change', event => { state[id] = event.target.value; render(); });
document.addEventListener('input', event => {
  if (event.target.id === 'hold-note') { draft = event.target.value; event.target.setCustomValidity(''); }
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !hold || !event.target.closest('#detail')) return;
  event.preventDefault();
  leaveHold();
  render();
  $('[data-act=hold]').focus();
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
    case 'origin':
      message = '';
      if (history.state?.previous?.id === state.origin && history.state.previous.view === 'detail') history.back();
      else route('detail',state.origin,null,true);
      break;
    case 'register':
      message = '';
      if (history.state?.previous?.view === 'register') history.back();
      else route('register',state.id,null,true);
      break;
    case 'clear': {
      const fromDetail = control.closest('#detail');
      Object.assign(state, {search:'', station:'', status:''});
      render();
      (fromDetail ? $('#detail-title') : $('#search')).focus({preventScroll:true});
      break;
    }
    case 'accept': commit('Accepted'); break;
    case 'review': commit('Review'); break;
    case 'hold':
      if (hold) { leaveHold(); render(); $('[data-act=hold]').focus(); break; }
      hold = true; draft = note(byId[state.id]) || ''; render(); $('#hold-note').focus(); break;
    case 'cancel': leaveHold(); render(); $('[data-act=hold]').focus(); break;
    case 'undo': {
      const last = state.undo.pop();
      if (last.previous) state.changes[last.id] = last.previous;
      else delete state.changes[last.id];
      message = last.id + ' restored to ' + disposition(byId[last.id]) + '.';
      render();
      announce(message);
      ($('[data-act=undo]') || $('[data-act=hold]')).focus({preventScroll:true});
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
