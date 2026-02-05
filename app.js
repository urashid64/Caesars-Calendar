// =======================
// CONSTANTS
// =======================
const CELL = 60;
const ROWS = 8;
const COLS = 7;
const TRAY_SIZE = 4 * CELL;
const TAP_TIME = 250;
const DRAG_DIST = 6;

// =======================
// BOARD
// =======================
const boardLayout = [
  ["JAN","FEB","MAR","APR","MAY","JUN",null],
  ["JUL","AUG","SEP","OCT","NOV","DEC",null],
  ["1","2","3","4","5","6","7"],
  ["8","9","10","11","12","13","14"],
  ["15","16","17","18","19","20","21"],
  ["22","23","24","25","26","27","28"],
  ["29","30","31","SUN","MON","TUE","WED"],
  [null,null,null,null,"THU","FRI","SAT"]
];

const boardState = boardLayout.map(r =>
  r.map(c => c === null ? null : { label:c, covered:false })
);

// =======================
// PIECES
// =======================
const pieces = [
  {id:"1", base:[[0,0],[1,0],[2,0],[3,0]]},
  {id:"2", base:[[0,0],[1,0],[2,0],[0,1]]},
  {id:"3", base:[[0,0],[1,0],[2,0],[3,0],[0,1]]},
  {id:"4", base:[[0,0],[1,0],[2,0],[0,1],[0,2]]},
  {id:"5", base:[[0,0],[1,0],[2,0],[1,1],[1,2]]},
  {id:"6", base:[[0,0],[1,0],[0,1],[1,1],[0,2]]},
  {id:"7", base:[[0,0],[1,0],[0,1],[0,2],[1,2]]},
  {id:"8", base:[[0,0],[1,0],[1,1],[2,1]]},
  {id:"9", base:[[0,0],[1,0],[1,1],[1,2],[2,2]]},
  {id:"10",base:[[0,0],[1,0],[1,1],[2,1],[3,1]]}
].map(p => ({
  ...p,
  rotation:0,
  flipped:false,
  cells:[],
  pos:null,
  el:null
}));

// =======================
// DOM
// =======================
const board = document.getElementById("board");
const tray  = document.getElementById("tray");

// =======================
// GEOMETRY
// =======================
function normalize(c){
  const minX=Math.min(...c.map(p=>p[0]));
  const minY=Math.min(...c.map(p=>p[1]));
  return c.map(p=>[p[0]-minX,p[1]-minY]);
}
function rotate(c){ return normalize(c.map(p=>[p[1],-p[0]])); }
function flip(c){ return normalize(c.map(p=>[-p[0],p[1]])); }
function apply(p){
  let c=[...p.base];
  if(p.flipped) c=flip(c);
  for(let i=0;i<p.rotation;i++) c=rotate(c);
  p.cells=c;
}

// =======================
// RENDER BOARD
// =======================
board.style.gridTemplateColumns=`repeat(${COLS},${CELL}px)`;
board.innerHTML="";
boardLayout.flat().forEach(c=>{
  const d=document.createElement("div");
  d.className="cell";
  if(c===null) d.classList.add("locked");
  else d.textContent=c;
  board.appendChild(d);
});

// =======================
// TRAY (FIXED 4×4 CELLS)
// =======================
tray.style.display="grid";
tray.style.gridTemplateColumns="repeat(4, auto)";
tray.style.gap="12px";

const slots=[];
for(let i=0;i<12;i++){
  const s=document.createElement("div");
  s.className="tray-slot";
  s.style.width  = TRAY_SIZE + "px";
  s.style.height = TRAY_SIZE + "px";
  s.style.position="relative";
  s.style.boxSizing="border-box";
  s.style.border="1px dashed #aaa";
  slots.push(s);
  tray.appendChild(s);
}

// =======================
// RENDER PIECE
// =======================
function renderPiece(p,slot){
  apply(p);
  const el=document.createElement("div");
  el.className="piece";
  el.dataset.id=p.id;
  el.style.position="absolute";

  p.cells.forEach(c=>{
    const b=document.createElement("div");
    b.style.width=CELL+"px";
    b.style.height=CELL+"px";
    b.style.position="absolute";
    b.style.left=c[0]*CELL+"px";
    b.style.top =c[1]*CELL+"px";
    b.style.background="#c19a6b";
    b.style.border="1px solid #8b6b4f";
    el.appendChild(b);
  });

  const w=(Math.max(...p.cells.map(c=>c[0]))+1)*CELL;
  const h=(Math.max(...p.cells.map(c=>c[1]))+1)*CELL;
  el.style.left=(TRAY_SIZE-w)/2+"px";
  el.style.top =(TRAY_SIZE-h)/2+"px";

  slots[slot].appendChild(el);
  p.el=el;
}

// =======================
// INTERACTION (UNCHANGED)
// =======================
// (drag + tap logic remains exactly the same as previous version)

// =======================
// INIT
// =======================
pieces.forEach((p,i)=>renderPiece(p,i));
