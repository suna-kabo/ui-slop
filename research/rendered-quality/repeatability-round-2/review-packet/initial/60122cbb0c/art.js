const icons={
bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
brand:'<path d="M2 10c3-4 6-4 10-1s7 3 10-1M2 16c3-4 6-4 10-1s7 3 10-1"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
trail:'<path d="M3 19h18L13 5l-4 7-2-3z"/><path d="m11 9 2 2 2-2"/>'
};
function icon(name){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>'}
function artwork(id,label){
const i=['breakwater','salt','lark','pilot','dune','dovetail','gull','ebb','hero'].indexOf(id);
const p=[
['#b4c4ae','#5e8783','#326768','#303f3c','#ad9a73','#debd8a'],
['#e1cd9b','#94aaa0','#477d79','#385a47','#9a8f54','#eac686'],
['#bfcab8','#6c9d92','#45817b','#4f6252','#b39774','#ecd49b'],
['#ddbf94','#8caca3','#4d7f7e','#4c6159','#9a865f','#e9ce9b'],
['#ded1a7','#7da69b','#56928b','#657756','#b8a477','#f2d59d'],
['#cad0ac','#7c9d90','#568781','#344f43','#877c4a','#f0ce8d'],
['#c4c6aa','#6c9a94','#397a79','#3d5753','#8e8968','#f0d29b'],
['#d7bda1','#8faaa0','#4e8584','#464c47','#a38d6b','#eec48e'],
['#557a70','#3e6b68','#275553','#274e48','#728470','#e5bb81']][i];
const [sky,water,deep,land,sand,sun]=p;
const hero=i===8;
let seed=87+i*129;
const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
const path=(d,f)=>'<path d="'+d+'" fill="'+f+'"/>';
const stroke=(d,c,w=2,o=1)=>'<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+w+'" opacity="'+o+'" stroke-linecap="round"/>';
let shapes='';
shapes+=path('M0 0H800V400H0Z',sky);
shapes+='<circle cx="'+(hero?610:535+(i%3)*34)+'" cy="'+(hero?111:79)+'" r="'+(hero?55:34)+'" fill="'+sun+'"/>';
for(let b=0;b<11;b++){let y=42+rand()*112,x=rand()*780;shapes+=stroke('M'+x+' '+y+'h'+(15+rand()*77),hero?'#b4b6a0':'#fcf1ca',1.4,.35)}
shapes+=path(hero?'M0 203Q120 147 240 208Q340 175 445 205Q578 222 800 179V400H0Z':'M0 179Q136 143 254 170T502 171Q655 139 800 163V400H0Z',hero?'#37615a':'#889e86');
shapes+=path('M0 207Q245 195 458 205T800 193V400H0Z',water);
shapes+=path('M0 263Q120 244 256 258T530 251T800 244V400H0Z',deep);
for(let b=0;b<75;b++){let y=210+rand()*185,x=rand()*800;shapes+=stroke('M'+x+' '+y+'q'+(8+rand()*36)+' -3 '+(14+rand()*63)+' -2',b%3===0?sun:sky,1+rand()*2,.16+rand()*.34)}
if(i===1||i===5){
shapes+=path('M0 309Q130 255 274 284Q422 339 550 274Q660 240 800 297V400H0Z',sand);
shapes+=path('M0 332Q118 290 281 330T568 319T800 307V400H0Z',land);
for(let b=0;b<80;b++){const x=rand()*800,y=318+rand()*90,h=12+rand()*45;shapes+=stroke('M'+x+' '+y+'q-4 -'+h/2+' '+(rand()*15-8)+' -'+h,[sand,sun,deep][b%3],1+rand()*2,.8)}
if(i===1){shapes+=path('M144 400L443 292L518 278L490 294L279 400Z','#cdab76');for(let b=0;b<8;b++){let x=160+24*b,y=395-12*b;shapes+=stroke('M'+x+' '+y+'l'+(105-b*7)+' 0','#695e43',2,.6)}}
else{shapes+=path('M475 289L468 226L565 221L570 289Z','#715e44')+path('M455 229L505 200L581 223L565 231Z','#3c4b3c')+path('M483 240h66v9h-66Z','#223b38')}
}else if(i===2||i===4||i===7){
shapes+=path('M800 209L739 218L665 203L592 220L536 255L441 284L361 335L235 400H800Z',land);
shapes+=path('M800 259Q703 253 625 269Q541 291 470 328L363 400H800Z',sand);
shapes+=stroke('M800 247Q715 238 624 258Q534 278 465 312L320 400','#e7d8b0',5,.8);
if(i===4){shapes+=path('M800 300Q670 275 567 320L490 400H800Z','#d4ba83');shapes+=stroke('M675 400Q577 377 666 338T761 291','#f5dfae',13,.67)}
for(let b=0;b<75;b++){const x=480+rand()*340,y=279+rand()*122,z=3+rand()*11;shapes+=i===4?stroke('M'+x+' '+y+'l3 -'+z,land,1.7,.56):path('M'+x+' '+y+'l'+z+' -'+(z*.55)+' '+(z*1.3)+' '+(z*.3)+' -'+z+' '+(z*.5)+'Z',b%2===0?land:sun)}
if(i===7)shapes+=path('M525 363l31 -33 64 -7 41 16 -22 32 -55 17Z',deep)+path('M690 301l24 -13 42 4 19 15 -37 13Z',deep)+stroke('M559 358q30 -16 69 -9',sky,2,.7);
}else{
const base=hero?'M800 269L735 251L699 221L632 217L596 226L555 245L521 249L469 281L407 294L353 322L288 343L197 400H800Z':'M800 255L714 236L653 243L608 263L517 277L453 298L394 317L242 400H800Z';
shapes+=path(base,land);
shapes+=path('M800 309L724 304L672 292L619 314L540 313L487 337L406 354L345 400H800Z',sand);
for(let b=0;b<49;b++){const x=390+rand()*430,y=317+rand()*83;shapes+=stroke('M'+x+' '+y+'l'+(4+rand()*18)+' -2',b%3?land:sun,1.8,.43)}
if(hero||i===6){
const x=hero?610:661,y=hero?127:158;
shapes+='<g transform="translate('+x+' '+y+')">'+path('M-14 100L-8 23H8L15 100Z','#f0d6a7')+path('M0 24H8L15 100H5Z','#b49c74')+path('M-12 24V7H12V24Z','#233f3b')+path('M-8 10H8V20H-8Z',sun)+path('M-16 7L0 -6L16 7Z','#233f3b')+path('M-3 100V83H4V100Z','#2b473e')+'</g>';
}else if(i===0){
shapes+=path('M0 366L294 302L385 265H486L476 292L367 327L232 400H0Z','#6c7061');
shapes+=path('M0 366L300 300L387 265H485L361 303L148 400H0Z','#c7b68d');
for(let b=0;b<9;b++){let x=227+b*21,y=353-b*9;shapes+=stroke('M'+x+' '+y+'h'+(59-b*3),'#555f53',3,.75)}
}else{
shapes+=path('M574 266V211H680V266Z','#e5c893')+path('M563 214L625 181L691 214Z','#654e43')+path('M591 225h15v15h-15Zm56 0h15v15h-15Zm-22 41v-28h13v28Z','#476158')+path('M660 202v-25h11v31Z','#725745');
}
}
for(let b=0;b<4;b++){let x=(hero?420:185)+rand()*196,y=86+rand()*61;shapes+=stroke('M'+x+' '+y+'q6 -6 12 1q6 -6 12 -2',land,2,.8)}
let flecks='';for(let b=0;b<680;b++){let x=Math.floor(rand()*800),y=Math.floor(rand()*400);flecks+='M'+x+' '+y+'h'+(rand()*2+.5).toFixed(1)}
return '<svg role="img" aria-label="'+label+'" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">'+shapes+stroke(flecks,'#fff6d9',1,.27)+'</svg>';
}
