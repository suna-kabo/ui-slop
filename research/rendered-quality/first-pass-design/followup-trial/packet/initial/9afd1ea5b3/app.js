const zines = [
  {id:'night-windows', title:'Night Windows', topic:'Photography', price:12, table:'B4', description:'24 black-and-white photographs of lit windows on the last tram route.', mat:'#b8b5a9', angle:-7},
  {id:'bus-stop-botany', title:'Bus Stop Botany', topic:'Field notes', price:8, table:'C7', description:'Fold-out guide to five plants found at the Crosstown terminus.', mat:'#b9c1a4', angle:6},
  {id:'three-ways', title:'Three Ways to Set a Table', topic:'Comics', price:9, table:'A2', description:'Three wordless comics about dinner with neighbors.', mat:'#d6a582', angle:-5},
  {id:'wet-asphalt', title:'Wet Asphalt', topic:'Photography', price:16, table:'B9', description:'Large-format reflections captured after a summer storm.', mat:'#a6b6c2', angle:5},
  {id:'free-shelves', title:'Free Shelves', topic:'Field notes', price:6, table:'C3', description:'Annotated map of street libraries and a page for new entries.', mat:'#cfb4a9', angle:-6},
  {id:'antenna-club', title:'Antenna Club', topic:'Comics', price:11, table:'A5', description:'Short comic about a radio club losing its rooftop access.', mat:'#b8adc4', angle:6}
];

const art = [
  {paper:'#171719', ink:'#ebe4d8', title:['NIGHT','WINDOWS'], note:'THE LAST TRAM ROUTE', serif:true},
  {paper:'#e9e6bd', ink:'#293c2d', title:['Bus Stop','Botany'], note:'CROSSTOWN TERMINUS', serif:true},
  {paper:'#c3462f', ink:'#fae2b3', title:['THREE WAYS','TO SET','A TABLE'], note:'THREE WORDLESS COMICS'},
  {paper:'#17273d', ink:'#c6d8ed', title:['WET','ASPHALT'], note:'AFTER THE SUMMER STORM'},
  {paper:'#eebfb4', ink:'#482f58', title:['Free','Shelves'], note:'A MAP OF STREET LIBRARIES', serif:true},
  {paper:'#d7c8ed', ink:'#34224e', title:['ANTENNA','CLUB'], note:'A ROOFTOP COMIC'}
];

function drawCover(canvas, index) {
  const c = canvas.getContext('2d');
  const cover = art[index];
  let seed = 909 + index;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  }
  function rect(x,y,w,h,fill) {
    c.fillStyle = fill;
    c.fillRect(x,y,w,h);
  }
  function line(points, color, width = 1) {
    c.beginPath();
    c.moveTo(...points[0]);
    points.slice(1).forEach(point => c.lineTo(...point));
    c.strokeStyle = color;
    c.lineWidth = width;
    c.stroke();
  }
  function ellipse(x,y,rx,ry,r,fill) {
    c.beginPath();
    c.ellipse(x,y,rx,ry,r,0,2*Math.PI);
    c.fillStyle = fill;
    c.fill();
  }
  rect(0,0,300,412,cover.paper);
  if (index === 0) {
    rect(17,134,266,234,'#29292a');
    for (let i=0;i<350;i++) {
      const grey = Math.floor(24+random()*44);
      rect(18+random()*262,135+random()*228,3+random()*26,1+random()*7,'rgb('+grey+','+grey+','+grey+')');
    }
    for (let col=0;col<5;col++) {
      for (let row=0;row<4;row++) {
        const x=30+col*50+random()*7, y=151+row*51+random()*8;
        const glow = random()>.44;
        rect(x-4,y-4,33,39,'#131313');
        rect(x,y,25,31,glow?'#d3d0c4':'#454546');
        if(glow) rect(x+2,y+3,10+random()*10,20,'#f4efe0');
        line([[x+12,y],[x+12,y+31]],'#343434',2);
        line([[x,y+11],[x+25,y+11]],'#343434',2);
      }
    }
  }
  if (index === 1) {
    c.strokeStyle='#66775c';
    c.strokeRect(11,11,278,390);
    for(let stem=0;stem<6;stem++){
      const x=56+stem*35, tip=145+random()*83;
      line([[150,360],[x,tip+52],[x-7,tip]],'#526d48',2);
      for(let leaf=0;leaf<4;leaf++){
        const y=tip+16+leaf*21, side=leaf%2===0?-1:1;
        const leafX=x+(150-x)*leaf*.095;
        ellipse(leafX+side*11,y,19,6,side*-.65,leaf%2===0?'#577251':'#83956c');
        line([[leafX,y+8],[leafX+side*22,y-6]],'#3f6247');
      }
      ellipse(x-7,tip,5,8,.3,'#a76736');
    }
    line([[104,360],[196,360]],'#526d48');
  }
  if (index === 2) {
    for(let panel=0;panel<3;panel++){
      const y=166+panel*65;
      rect(17,y,266,56,cover.ink);
      for(let seat=0;seat<3;seat++){
        const x=61+seat*88;
        ellipse(x,y+28,22,21,0,'#a64433');
        ellipse(x,y+28,18,17,0,cover.ink);
        ellipse(x,y+28,14,13,0,panel===seat?'#d7844f':'#e7b779');
        line([[x-28,y+12],[x-28,y+44]],'#863425',2);
        line([[x+29,y+12],[x+29,y+44]],'#863425',2);
        for(let i=0;i<5;i++) ellipse(x-10+random()*20,y+18+random()*20,2,3,.3,'#863425');
      }
    }
  }
  if (index === 3) {
    for(let i=0;i<140;i++){
      const x=random()*280,y=138+random()*228;
      rect(x,y,4+random()*60,1+random()*4,['#32486c','#617ea2','#adbbcd','#b55b53','#1e324c'][i%5]);
    }
    line([[0,325],[130,194],[148,153]],'#aab6c3',3);
    line([[300,348],[188,211],[171,154]],'#aab6c3',3);
  }
  if (index === 4) {
    for(let i=0;i<9;i++){
      const x=15+i*32;
      line([[x-18,136],[x,232],[x+20,270],[x-4,371]],'#805a7c',2);
    }
    for(let i=0;i<7;i++){
      const y=155+i*33;
      line([[0,y],[68,y+16],[162,y-9],[300,y+7]],'#805a7c',2);
    }
    [[48,197],[143,250],[219,173],[105,323],[245,309]].forEach(([x,y])=>{
      rect(x-10,y-6,20,16,cover.ink);
      line([[x-13,y-5],[x,y-15],[x+13,y-5]],cover.ink,3);
      rect(x-4,y-2,8,8,cover.paper);
    });
  }
  if (index === 5) {
    for(let i=0;i<16;i++){
      const x=i*21,y=276+random()*73;
      rect(x,y,18,369-y,i%2?'#77588c':'#4a335e');
    }
    line([[62,337],[152,154],[242,337],[62,337]],cover.ink,4);
    line([[131,196],[174,196],[108,241],[197,241],[83,294],[220,294]],cover.ink,3);
    for(let i=0;i<4;i++){
      c.beginPath();
      c.arc(152,156,25+i*15,Math.PI*1.14,Math.PI*1.86);
      c.strokeStyle='#76568f';
      c.lineWidth=2;
      c.stroke();
    }
  }
  for(let i=0;i<10500;i++){
    rect(random()*300,random()*412,1+random()*2,1,random()>.5?'#ffffff13':'#00000015');
  }
  c.fillStyle=cover.ink;
  c.font=cover.serif?'bold 55px Georgia':'900 46px Arial';
  cover.title.forEach((part,i)=>c.fillText(part,18,52+i*(cover.title.length===3?43:50),264));
  c.font='bold 11px monospace';
  c.fillText(cover.note,19,389,257);
}

const byId = id => document.getElementById(id);
const browse = byId('browse');
const hero = byId('hero');
const detail = byId('detail');
const saved = byId('saved');
const shortlist = byId('shortlist');
const bookmark = '<span class="bookmark" aria-hidden="true"></span>';
const stored = localStorage.getItem('fold-fair-shortlist');
const selection = new Set(stored ? JSON.parse(stored) : []);
let topic = 'All zines';
let screen = 'browse';
let current;
let origin = 'browse';
let browseY = 0;
let previousItem;

function stage(zine) {
  return '<span class="stage" style="background:'+zine.mat+';--angle:'+zine.angle+'deg"><canvas width="300" height="412" data-cover="'+zines.indexOf(zine)+'" aria-hidden="true"></canvas></span>';
}
function paint(container) {
  container.querySelectorAll('canvas').forEach(canvas=>drawCover(canvas, Number(canvas.dataset.cover)));
}
function cards(items, removable = false) {
  return items.map(zine=>'<article class="card"><button class="item" data-open="'+zine.id+'">'+stage(zine)
    +'<span class="card-copy"><span class="meta"><span>'+zine.topic+'</span><span>Table '+zine.table+'</span></span>'
    +'<span class="card-title">'+zine.title+'<span class="arrow" aria-hidden="true">↗</span></span>'
    +'<span class="price">$'+zine.price+'</span></span></button>'
    +(removable?'<button class="list-remove" data-toggle="'+zine.id+'" aria-label="Remove '+zine.title+'">Remove</button>':'')+'</article>').join('');
}
function renderBrowse() {
  byId('filters').innerHTML=['All zines','Photography','Field notes','Comics'].map(name=>
    '<button class="filter" data-topic="'+name+'" aria-pressed="'+(topic===name)+'">'+name+'</button>').join('');
  const items = zines.filter(zine=>topic==='All zines'||zine.topic===topic);
  byId('results').textContent=items.length+' zines';
  byId('grid').innerHTML=cards(items);
  paint(browse);
}
function renderShortlistCount() {
  shortlist.innerHTML=bookmark+' Shortlist <span class="num">'+selection.size+'</span>';
  shortlist.setAttribute('aria-label','Shortlist, '+selection.size+' saved');
}
function renderDetail() {
  const zine=current;
  detail.className='detail-view';
  detail.innerHTML='<button class="back" data-back="'+origin+'">← '+(origin==='saved'?'Back to shortlist':'Back to the tables')+'</button>'
    +'<div class="detail-layout">'+stage(zine)+'<div class="detail-copy"><div class="kicker">'+zine.topic+'</div>'
    +'<h1 class="page-title" tabindex="-1">'+zine.title+'</h1><p>'+zine.description+'</p>'
    +'<div class="pickup"><span>$'+zine.price+'</span><span>Pick up at Table '+zine.table+'</span></div>'
    +'<button class="save" data-toggle="'+zine.id+'"></button></div></div>';
  paint(detail);
  updateSaveButton();
}
function updateSaveButton() {
  const button=detail.querySelector('.save');
  const isSaved=selection.has(current.id);
  button.setAttribute('aria-pressed', isSaved);
  button.innerHTML=bookmark+(isSaved?' Remove from shortlist':' Save to shortlist');
}
function renderSaved() {
  saved.className='saved-view';
  saved.innerHTML='<button class="back" data-back="browse">← Back to the tables</button>'
    +'<h1 class="page-title" tabindex="-1">Your shortlist</h1>'
    +(selection.size?'<div class="grid">'+cards(zines.filter(zine=>selection.has(zine.id)),true)+'</div>':'<p>Your shortlist is empty. Save a zine to keep its table handy.</p>');
  paint(saved);
}
function navigate(next, item) {
  if (screen==='browse' && next!=='browse') browseY=scrollY;
  if (next==='detail') {
    origin=screen;
    current=item;
    if(origin==='browse') previousItem=item.id;
    renderDetail();
  }
  if(next==='saved') renderSaved();
  screen=next;
  hero.hidden=browse.hidden=next!=='browse';
  detail.hidden=next!=='detail';
  saved.hidden=next!=='saved';
  if(next==='browse') {
    const trigger=previousItem && browse.querySelector('[data-open="'+previousItem+'"]');
    (trigger || browse.querySelector('[aria-pressed=true]')).focus({preventScroll:true});
    window.scrollTo(0,browseY);
  }else{
    (next==='detail'?detail:saved).querySelector('h1').focus({preventScroll:true});
    window.scrollTo(0,0);
  }
}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(event.target.closest('.brand')){
    event.preventDefault();
    previousItem=null;
    browseY=0;
    if(screen==='browse') window.scrollTo(0,0);
    else navigate('browse');
    return;
  }
  if(!button) return;
  if(button===shortlist) navigate('saved');
  else if(button.dataset.topic){
    topic=button.dataset.topic;
    previousItem=null;
    renderBrowse();
    browse.querySelector('[aria-pressed=true]').focus({preventScroll:true});
    byId('announce').textContent=byId('results').textContent+' shown';
  }else if(button.dataset.open) navigate('detail',zines.find(zine=>zine.id===button.dataset.open));
  else if(button.dataset.back) navigate(button.dataset.back);
  else if(button.dataset.toggle){
    const id=button.dataset.toggle;
    const removing=selection.has(id);
    if(removing) selection.delete(id);
    else selection.add(id);
    localStorage.setItem('fold-fair-shortlist',JSON.stringify([...selection]));
    renderShortlistCount();
    if(screen==='detail') updateSaveButton();
    else {
      renderSaved();
      (saved.querySelector('.list-remove')||saved.querySelector('h1')).focus();
    }
    byId('announce').textContent=zines.find(zine=>zine.id===id).title+(removing?' removed from shortlist':' saved to shortlist');
  }
});
renderBrowse();
renderShortlistCount();
