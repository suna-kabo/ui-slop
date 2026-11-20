const zines = [
  {id:"night",title:"Night Windows",topic:"Photography",price:12,table:"B4",description:"24 black-and-white photographs of lit windows on the last tram route.",mat:"#d6cdda",paper:"#1c1d22",ink:"#f5eee0"},
  {id:"botany",title:"Bus Stop Botany",topic:"Field notes",price:8,table:"C7",description:"Fold-out guide to five plants found at the Crosstown terminus.",mat:"#dbdcc2",paper:"#e4eb9e",ink:"#24482c"},
  {id:"dinner",title:"Three Ways to Set a Table",topic:"Comics",price:9,table:"A2",description:"Three wordless comics about dinner with neighbors.",mat:"#edd0c0",paper:"#e9573d",ink:"#291b25"},
  {id:"wet",title:"Wet Asphalt",topic:"Photography",price:16,table:"B9",description:"Large-format reflections captured after a summer storm.",mat:"#c5d4e1",paper:"#202e48",ink:"#c1e3ff"},
  {id:"shelves",title:"Free Shelves",topic:"Field notes",price:6,table:"C3",description:"Annotated map of street libraries and a page for new entries.",mat:"#dfd5b5",paper:"#f6cc64",ink:"#492718"},
  {id:"radio",title:"Antenna Club",topic:"Comics",price:11,table:"A5",description:"Short comic about a radio club losing its rooftop access.",mat:"#d3c6e9",paper:"#a994d8",ink:"#292342"}
];

const nightWindows = Array.from({length:24},(_,i)=>{
  const x=19+(i%4)*37, y=120+Math.floor(i/4)*23;
  const light=["#67666a","#e4e1d8","#37383e","#a4a2a0","#eee8d3"][((i*7)^(i>>1))%5];
  return `<rect x="${x}" y="${y}" width="23" height="15" fill="${light}"/><path d="M${x+10} ${y}v15m-10-7h23" stroke="#29292e"/>`;
}).join("");
const leaves = [[37,163,-31],[50,196,-46],[139,168,33],[133,205,44],[88,144,-12]].map(([x,y,a])=>
  `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0C-18-7-19-25 0-43 19-24 17-6 0 0Z" fill="#548548"/><path d="M0 2v-38m0 19-8-7m8 11 9-10" fill="none" stroke="#e4eb9e"/></g>`).join("");
const dinnerPanels = [116,163,210].map((y,i)=>
  `<g transform="translate(16 ${y})"><rect width="148" height="39" rx="1" fill="${i===1 ? "#f7b568":"#fbe2af"}" stroke="#291b25" stroke-width="2"/><ellipse cx="${47+i*19}" cy="20" rx="18" ry="13" fill="none" stroke="#291b25" stroke-width="2"/><circle cx="${47+i*19}" cy="20" r="7" fill="#e9573d"/><path d="M8 9h14v21H8Zm124 0v22m4-22v22M${86+i*9} 10l9 7-9 7-9-7Z" fill="none" stroke="#291b25" stroke-width="2"/></g>`).join("");
const rain = Array.from({length:38},(_,i)=>{
  const x=12+(i*71)%154, y=111+i*3.8;
  return `<path d="M${x} ${y}h${7+i%17}" stroke="${["#75a8ca","#e8c091","#5180ac","#e7f1ee"][i%4]}" stroke-width="${1+i%4}"/>`;
}).join("");
const art = {
  night:{lines:["NIGHT","WINDOWS"],size:29,font:"Georgia",image:`<rect x="11" y="110" width="158" height="146" fill="#313137"/>${nightWindows}<path d="M12 256 169 117M31 256 167 135" stroke="#d4d0ca" opacity=".35"/>`},
  botany:{lines:["BUS STOP","BOTANY"],size:30,font:"Georgia",image:`<path d="M85 254Q64 208 37 163m52 87Q66 218 50 196m40 57q12-51 49-85m-48 81 42-44m-44 48-1-109" fill="none" stroke="#24482c" stroke-width="2"/>${leaves}<circle cx="88" cy="244" r="14" fill="none" stroke="#24482c"/><path d="M15 113h150M15 254h150" stroke="#24482c"/>`},
  dinner:{lines:["THREE WAYS","TO SET A","TABLE"],size:23,font:"Arial",image:dinnerPanels},
  wet:{lines:["WET","ASPHALT"],size:33,font:"Arial",image:`<path d="M13 129 67 105l-11 151h-43m154-127-53-24 8 151h45" fill="#324e6c"/>${rain}`},
  shelves:{lines:["FREE","SHELVES"],size:30,font:"Georgia",image:`<path d="M16 130h145M16 168h145M16 219h145M35 116v139m33-139v139m63-139v139M16 244l144-121" stroke="#8b5639" stroke-width="2" fill="none"/><path d="m35 219 33-51h63v-38" stroke="#a22e23" stroke-width="5" fill="none" stroke-dasharray="4 5"/><g fill="#492718"><circle cx="35" cy="219" r="7"/><circle cx="68" cy="168" r="7"/><circle cx="131" cy="130" r="7"/></g>`},
  radio:{lines:["ANTENNA","CLUB"],size:31,font:"Arial",image:`<g fill="none" stroke="#292342" stroke-width="2"><path d="M91 120v113m-27 0h54m-36 0 9-43 10 43m-54-88h88m-72-11h54m-47-11h39m-49 34h62M19 250v-18h144v18M18 159q-13-27 4-49m15 43q-9-17 1-37m110 38q11-18 1-38m18 43q13-27-4-49"/></g><circle cx="91" cy="168" r="8" fill="#f3dcaa"/>`}
};

function cover(zine) {
  const design = art[zine.id];
  const lettering = design.lines.map((line,index)=>
    `<text x="14" y="${39+index*(design.size*.92)}" fill="${zine.ink}" font-family="${design.font}" font-size="${design.size}" font-weight="bold" letter-spacing="-1">${line}</text>`).join("");
  return `<span class="mat" style="--mat:${zine.mat}"><svg class="cover" aria-hidden="true" viewBox="0 0 180 266" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h180v266H0z" fill="${zine.paper}"/><path d="M2 0v266" stroke="${zine.ink}" opacity=".45"/>${lettering}${design.image}</svg></span>`;
}

let topic = "All zines";
const storageKey = "fold-fair-shortlist";
let savedIds = new Set();
try {
  const stored = JSON.parse(localStorage.getItem(storageKey));
  if (Array.isArray(stored)) savedIds = new Set(zines.filter(zine=>stored.includes(zine.id)).map(zine=>zine.id));
} catch {}
const filters = document.querySelector("#filters");
const grid = document.querySelector("#grid");
const detail = document.querySelector("#detail");
const saved = document.querySelector("#saved");
const shortlist = document.querySelector("#shortlist");

function updateCount() {
  document.querySelector("#count").textContent = savedIds.size;
}
function toggleSaved(id) {
  if (savedIds.has(id)) savedIds.delete(id);
  else savedIds.add(id);
  try { localStorage.setItem(storageKey,JSON.stringify([...savedIds])); } catch {}
  updateCount();
}
function paintGrid() {
  const visible = zines.filter(zine=>topic==="All zines" || zine.topic===topic);
  document.querySelector("#results").textContent = visible.length+" zines";
  grid.innerHTML = visible.map(zine=>`<button class="item" data-zine="${zine.id}" aria-labelledby="title-${zine.id}" aria-describedby="meta-${zine.id}">${cover(zine)}<span class="title" id="title-${zine.id}">${zine.title}</span><span class="meta" id="meta-${zine.id}"><span>${zine.topic}</span><b>$${zine.price} · Table ${zine.table}</b></span></button>`).join("");
}
function showDetail(zine, opener) {
  detail.innerHTML = `<div class="dialog-bar"><button class="close" autofocus>← Back to zines</button></div><div class="detail-body">${cover(zine)}<div class="detail-copy"><p class="facts">${zine.topic} · $${zine.price} · Table ${zine.table}</p><h2 id="detail-title">${zine.title}</h2><p>${zine.description}</p><button class="save"></button></div></div>`;
  const save = detail.querySelector(".save");
  function reflectSave() {
    const active = savedIds.has(zine.id);
    save.textContent = active ? "✓ Saved — remove" : "+ Save to shortlist";
    save.setAttribute("aria-pressed",active);
  }
  reflectSave();
  save.onclick = () => { toggleSaved(zine.id); reflectSave(); };
  detail.querySelector(".close").onclick = () => detail.close();
  detail.addEventListener("close",()=>opener.focus({preventScroll:true}),{once:true});
  detail.showModal();
}
function paintSaved() {
  const entries = zines.filter(zine=>savedIds.has(zine.id));
  saved.innerHTML = `<div class="dialog-bar"><h2 id="saved-title">Shortlist</h2><button class="close" autofocus>Close <span aria-hidden="true">×</span></button></div><div class="saved-list">${entries.length ? entries.map(zine=>`<div class="saved-row"><div><strong>${zine.title}</strong><small>Table ${zine.table} · $${zine.price} · ${zine.topic}</small></div><button data-remove="${zine.id}" aria-label="Remove ${zine.title}">Remove</button></div>`).join("") : "<p>No saved zines yet.</p>"}</div>`;
}
["All zines","Photography","Field notes","Comics"].forEach(name=>{
  const button = document.createElement("button");
  button.textContent = name;
  button.setAttribute("aria-pressed",name===topic);
  button.onclick = () => {
    topic = name;
    for (const filter of filters.children) filter.setAttribute("aria-pressed",filter===button);
    paintGrid();
  };
  filters.append(button);
});
grid.addEventListener("click",event=>{
  const opener = event.target.closest("[data-zine]");
  if (opener) showDetail(zines.find(zine=>zine.id===opener.dataset.zine),opener);
});
shortlist.onclick = () => { paintSaved(); saved.showModal(); };
saved.addEventListener("click",event=>{
  if (event.target.closest(".close")) saved.close();
  const remove = event.target.closest("[data-remove]");
  if (!remove) return;
  const index = [...saved.querySelectorAll("[data-remove]")].indexOf(remove);
  toggleSaved(remove.dataset.remove);
  paintSaved();
  const buttons = saved.querySelectorAll("[data-remove]");
  (buttons[Math.min(index,buttons.length-1)] || saved.querySelector(".close")).focus();
});
saved.addEventListener("close",()=>shortlist.focus({preventScroll:true}));
updateCount();
paintGrid();
