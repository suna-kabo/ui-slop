const zines = [
  {id:"night", title:"Night Windows", topic:"Photography", price:12, table:"B4", description:"24 black-and-white photographs of lit windows on the last tram route.", stage:"#c7c6b7", angle:-5},
  {id:"bus", title:"Bus Stop Botany", topic:"Field notes", price:8, table:"C7", description:"Fold-out guide to five plants found at the Crosstown terminus.", stage:"#d1d7ab", angle:4},
  {id:"table", title:"Three Ways to Set a Table", topic:"Comics", price:9, table:"A2", description:"Three wordless comics about dinner with neighbors.", stage:"#efb5a1", angle:-4},
  {id:"wet", title:"Wet Asphalt", topic:"Photography", price:16, table:"B9", description:"Large-format reflections captured after a summer storm.", stage:"#b6bfca", angle:4},
  {id:"shelves", title:"Free Shelves", topic:"Field notes", price:6, table:"C3", description:"Annotated map of street libraries and a page for new entries.", stage:"#e8c77f", angle:-4},
  {id:"antenna", title:"Antenna Club", topic:"Comics", price:11, table:"A5", description:"Short comic about a radio club losing its rooftop access.", stage:"#cfbfd9", angle:3}
];
const main = document.querySelector("#main");
const storageKey = "fold-fair-shortlist";
let saved = new Set();
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (Array.isArray(stored)) saved = new Set(stored.filter(id => zines.some(z => z.id === id)));
} catch {}
let topic = "All zines";
let screen = "browse";
let previous = "browse";
let detailId = "";
let browseScroll = 0;

function cover(z) {
  return '<div class="stage" style="--stage:'+z.stage+';--angle:'+z.angle+'deg"><canvas width="480" height="612" data-art="'+z.id+'" aria-hidden="true"></canvas></div>';
}
function card(z) {
  return '<article class="card"><button type="button" class="cover-button" data-open="'+z.id+'">'+cover(z)+'<div class="card-body"><span class="card-title">'+z.title+'</span><span class="meta"><span>'+z.topic+'</span><strong>$'+z.price+' · Table '+z.table+'</strong></span></div></button><button type="button" class="save" data-save="'+z.id+'" aria-label="Save '+z.title+'" aria-pressed="'+saved.has(z.id)+'">'+(saved.has(z.id) ? "♥" : "♡")+'</button></article>';
}
function counter() {
  document.querySelector("#saved-count").textContent = saved.size;
}
function render(focusHeading = false) {
  counter();
  if (screen === "browse") {
    const results = zines.filter(z => topic === "All zines" || z.topic === topic);
    const filters = ["All zines", "Photography", "Field notes", "Comics"].map(label => '<button type="button" class="filter" data-topic="'+label+'" aria-pressed="'+(topic === label)+'">'+label+'</button>').join("");
    main.innerHTML = '<section class="hero"><div><p class="kicker">THE FAIR DIRECTORY</p><h1 tabindex="-1">Find your zine.</h1></div><p class="hero-aside">Browse the covers, shortlist your finds and pick them up at the fair.</p></section><div class="toolbar"><div class="filters" role="group" aria-label="Filter by topic">'+filters+'</div><span class="count" role="status">'+results.length+' '+(results.length === 1 ? 'ZINE' : 'ZINES')+'</span></div><section class="grid" aria-label="Zines">'+results.map(card).join("")+'</section>';
  } else if (screen === "shortlist") {
    const results = zines.filter(z => saved.has(z.id));
    main.innerHTML = '<button type="button" class="back" data-action="browse">← Back to browse</button><div class="short-head"><p class="kicker">'+results.length+' SAVED</p><h1 tabindex="-1">Your shortlist.</h1></div>'+(results.length ? '<section class="grid" aria-label="Saved zines">'+results.map(card).join("")+'</section>' : '<p class="empty">Your shortlist is empty. Save a zine to keep its table handy.</p>');
  } else {
    const z = zines.find(zine => zine.id === detailId);
    main.innerHTML = '<button type="button" class="back" data-action="back">← '+(previous === "shortlist" ? "Back to shortlist" : "Back to browse")+'</button><article class="detail">'+cover(z)+'<div><p class="kicker">'+z.topic.toUpperCase()+'</p><h1 tabindex="-1">'+z.title+'</h1><p class="detail-description">'+z.description+'</p><dl class="detail-meta"><div><dt>PRICE</dt><dd>$'+z.price+'</dd></div><div><dt>FAIR PICKUP</dt><dd>Table '+z.table+'</dd></div></dl><button type="button" class="primary" data-save="'+z.id+'" aria-label="Save '+z.title+'" aria-pressed="'+saved.has(z.id)+'">'+(saved.has(z.id) ? "♥ Saved to shortlist" : "♡ Save to shortlist")+'</button></div></article>';
  }
  main.querySelectorAll("canvas").forEach(draw);
  if (focusHeading) main.querySelector("h1").focus({preventScroll:true});
}
function go(next, restoreId) {
  if (screen === "browse" && next !== "browse") browseScroll = window.scrollY;
  screen = next;
  render(!restoreId);
  window.scrollTo(0, next === "browse" ? browseScroll : 0);
  if (restoreId) (main.querySelector('[data-open="'+restoreId+'"]') || main.querySelector("h1")).focus({preventScroll:true});
}
document.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  const {action, open, save} = button.dataset;
  if (button.dataset.topic) {
    topic = button.dataset.topic;
    render();
    main.querySelector('[data-topic="'+topic+'"]').focus();
  } else if (open) {
    previous = screen;
    detailId = open;
    go("detail");
  } else if (action === "back") {
    go(previous, detailId);
  } else if (action) {
    go(action);
  } else if (save) {
    const isSaved = !saved.has(save);
    if (isSaved) saved.add(save);
    else saved.delete(save);
    try { localStorage.setItem(storageKey, JSON.stringify([...saved])); } catch {}
    if (screen === "shortlist") render(true);
    else {
      counter();
      button.setAttribute("aria-pressed", isSaved);
      button.textContent = screen === "detail" ? (isSaved ? "♥ Saved to shortlist" : "♡ Save to shortlist") : (isSaved ? "♥" : "♡");
    }
    const z = zines.find(zine => zine.id === save);
    document.querySelector("#notice").textContent = z.title + (isSaved ? " saved to shortlist." : " removed from shortlist.");
  }
});

function draw(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.scale(2,2);
  const box = (x,y,w,h,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,w,h); };
  const text = (s,x,y,size,c,font="Arial",weight=900) => {
    ctx.fillStyle=c; ctx.font=weight+" "+size+"px "+font; ctx.fillText(s,x,y);
  };
  const line = (points,c,w=1) => {
    ctx.beginPath(); ctx.moveTo(...points[0]); points.slice(1).forEach(p=>ctx.lineTo(...p)); ctx.strokeStyle=c; ctx.lineWidth=w; ctx.stroke();
  };
  const oval = (x,y,rx,ry,c,rotation=0) => {
    ctx.beginPath(); ctx.ellipse(x,y,rx,ry,rotation,0,Math.PI*2); ctx.fillStyle=c; ctx.fill();
  };
  let seed = 483;
  const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  switch(canvas.dataset.art) {
    case "night":
      box(0,0,240,306,"#171918");
      text("NIGHT",15,53,49,"#f0ecdc");
      text("WINDOWS",15,90,40,"#f0ecdc");
      box(15,108,210,162,"#30312e");
      for(let row=0;row<4;row++) for(let col=0;col<6;col++){
        const x=22+col*34, y=117+row*36;
        const lit=random()>.44;
        box(x,y,23,26,lit ? "#dcd8c3" : "#141616");
        if(lit) {
          box(x+2,y+2,19,21,random()>.5?"#77786c":"#a9a893");
          line([[x+11,y],[x+11,y+24]],"#353633",2);
          line([[x+1,y+12],[x+22,y+12]],"#454640",2);
          oval(x+5+random()*12,y+16,3,6,"#42433d");
        }
      }
      text("24 FRAMES / THE LAST TRAM",15,290,10,"#f0ecdc","monospace");
      break;
    case "bus":
      box(0,0,240,306,"#edeea6");
      text("BUS STOP",14,49,39,"#193b30");
      text("BOTANY",14,90,47,"#193b30");
      line([[16,103],[224,103]],"#193b30",2);
      for(let i=0;i<5;i++){
        const x=37+i*42, y=235-(i%2)*27;
        line([[x-7,258],[x,y],[x+3,y-81]],"#254839",2);
        for(let j=0;j<5;j++){
          const side=j%2?1:-1;
          oval(x+side*10,y-j*14,14,4,"#426749",side*(j%3+1)*.3);
        }
        oval(x+3,y-83,4,7,"#c2573a");
      }
      line([[16,266],[224,266]],"#193b30",2);
      text("FIVE PLANTS / CROSSTOWN",16,286,11,"#193b30","monospace");
      break;
    case "table":
      box(0,0,240,306,"#ae321f");
      text("THREE WAYS",15,45,32,"#fff0c2");
      text("TO SET",15,77,32,"#fff0c2");
      text("A TABLE",15,109,38,"#fff0c2");
      box(15,127,210,143,"#f7dfab");
      for(let i=0;i<3;i++){
        const x=52+i*68;
        line([[x-31,132],[x-31,265]],"#ae321f");
        oval(x,193,25,25,"#ae321f"); oval(x,193,20,20,"#fff0c2"); oval(x,193,12,12,"#e88c71");
        line([[x+27,172],[x+27,216]],"#ae321f",2);
        oval(x-5,148,8,8,"#ae321f");
        oval(x+4,240,10,5,"#ae321f",i*.5);
      }
      text("THREE WORDLESS COMICS",15,291,11,"#fff0c2","monospace");
      break;
    case "wet":
      box(0,0,240,306,"#1c2840");
      text("WET",13,64,59,"#b9e0eb");
      text("ASPHALT",13,113,43,"#b9e0eb");
      for(let i=0;i<120;i++){
        const y=131+random()*144, x=random()*240;
        box(x,y,9+random()*49,1+random()*3,["#44526e","#527a94","#beddef","#cc7367"][Math.floor(random()*4)]);
      }
      text("AFTER THE SUMMER STORM",14,290,11,"#b9e0eb","monospace");
      break;
    case "shelves":
      box(0,0,240,306,"#f3a523");
      text("FREE",14,56,53,"#3e251d");
      text("SHELVES",14,99,43,"#3e251d");
      for(let i=0;i<7;i++) {
        line([[16,126+i*21],[104,114+i*23],[225,134+i*20]],"#8b4d27",2);
        line([[17+i*31,116],[13+i*34,267]],"#8b4d27",2);
      }
      for(const [x,y] of [[28,151],[95,195],[159,157],[187,222],[65,240]]){
        box(x,y,24,20,"#42281c"); box(x+4,y+4,16,11,"#ffe6a1");
        line([[x-2,y],[x+12,y-9],[x+26,y]],"#42281c",3);
      }
      text("A MAP OF STREET LIBRARIES",14,290,11,"#3e251d","monospace");
      break;
    case "antenna":
      box(0,0,240,306,"#4c3160");
      text("ANTENNA",14,56,45,"#f7d8e9");
      text("CLUB",14,108,56,"#f7d8e9");
      oval(120,192,68,68,"#ad83b8");
      for(let i=0;i<8;i++)box(i*34,249-random()*28,29,54,"#2b2337");
      line([[71,259],[144,131]],"#f7d8e9",4);
      for(let i=0;i<5;i++) line([[87+i*10,159-i*5],[157+i*4,206-i*15]],"#f7d8e9",3);
      text("A ROOFTOP RADIO COMIC",14,290,11,"#f7d8e9","monospace");
      break;
  }
  for(let i=0;i<4000;i++) box(random()*240,random()*306,1,1,i%2?"#ffffff14":"#00000017");
}
render();