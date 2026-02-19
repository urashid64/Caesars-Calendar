// =======================
// CONSTANTS
// =======================
const CELL = 60;
const ROWS = 8;
const COLS = 7;
const TRAY_SIZE = 4 * CELL + 20;

const TARGET = {
  month: "FEB",
  date: "14",
  day: "SAT"
};

// =======================
// BOARD
// =======================
const boardLayout = [
  ["JAN","FEB","MAR","APR","MAY","JUN",null],
  ["JUL","AUG","SEP","OCT","NOV","DEC",null],
  ["1",  "2",  "3",  "4",  "5",  "6",  "7" ],
  ["8",  "9",  "10", "11", "12", "13", "14"],
  ["15", "16", "17", "18", "19", "20", "21"],
  ["22", "23", "24", "25", "26", "27", "28"],
  ["29", "30", "31","SUN","MON","TUE","WED"],
  [null, null, null, null,"THU","FRI","SAT"]
];

const boardState = boardLayout.map(r =>
  r.map(c => c === null ? null : { label:c, covered:false })
);

// =======================
// PIECES
// =======================
const pieces = [
  {id:"1", bg:"#c19a6b", base:[[0,0],[1,0],[2,0],[3,0]]},
  {id:"2", bg:"#c19a6b", base:[[0,0],[1,0],[2,0],[0,1]]},
  {id:"3", bg:"#c19a6b", base:[[0,0],[1,0],[2,0],[3,0],[0,1]]},
  {id:"4", bg:"#c19a6b", base:[[0,0],[1,0],[2,0],[0,1],[0,2]]},
  {id:"5", bg:"#c19a6b", base:[[0,0],[1,0],[2,0],[1,1],[1,2]]},
  {id:"6", bg:"#c19a6b", base:[[0,0],[1,0],[0,1],[1,1],[0,2]]},
  {id:"7", bg:"#c19a6b", base:[[0,0],[1,0],[0,1],[0,2],[1,2]]},
  {id:"8", bg:"#c19a6b", base:[[0,0],[1,0],[1,1],[2,1]]},
  {id:"9", bg:"#c19a6b", base:[[0,0],[1,0],[1,1],[1,2],[2,2]]},
  {id:"10",bg:"#c19a6b", base:[[0,0],[1,0],[1,1],[2,1],[3,1]]}
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
// BOARD
// =======================
function renderBoard() {
  board.style.gridTemplateColumns=`repeat(${COLS},${CELL}px)`;
  board.style.gridTemplateRows=`repeat(${ROWS},${CELL}px)`;
  board.innerHTML="";
  boardLayout.flat().forEach(c=>{
    const d=document.createElement("div");
    d.className="cell";
    if(c===null) d.classList.add("locked");
    else d.textContent=c;
    if (c === TARGET.month || c === TARGET.date || c === TARGET.day) {
      d.classList.add("target");
    }
    board.appendChild(d);
  });
}
// =======================
// TRAY
// =======================
const slots=[];
function renderTray(){
  tray.style.display="grid";
  tray.style.gridTemplateColumns="repeat(4, auto)";
  tray.style.gap="12px";

  for(let i=0;i<10;i++){
    const s=document.createElement("div");
    s.className="tray-slot";
    s.style.width=TRAY_SIZE+"px";
    s.style.height=TRAY_SIZE+"px";
    s.style.position="relative";
    s.style.boxSizing="border-box";

    // controls
    const rotateBtn = document.createElement("button");
    rotateBtn.textContent = "⟳";
    rotateBtn.className = "tray-btn rotate-btn";
    
    const flipBtn = document.createElement("button");
    flipBtn.textContent = "⇋";
    flipBtn.className = "tray-btn flip-btn";
    
    // prevent drag start
    rotateBtn.onpointerdown = e => e.stopPropagation();
    flipBtn.onpointerdown   = e => e.stopPropagation();

    s.appendChild(rotateBtn);
    s.appendChild(flipBtn);

    slots.push(s);
    tray.appendChild(s);
  }
}

// =======================
// PIECES
// =======================
function renderPiece(p,slot){
  apply(p);
  const el=document.createElement("div");
  el.className="piece";
  el.dataset.id=p.id;
  el.style.position="absolute";

  p.cells.forEach(c=>{
    const b=document.createElement("div");
    b.style.width=CELL-2+"px";
    b.style.height=CELL-2+"px";
    b.style.position="absolute";
    b.style.left=c[0]*(CELL+2)+"px";
    b.style.top =c[1]*(CELL+2)+"px";
  //  b.style.background="#c19a6b";
    b.style.background=p.bg;
    b.style.border="1px solid #8b6b4f";
  //  b.style.border="1px solid #c19a6b";
    b.style.textAlign="center";
    b.style.alignContent="center";
    b.textContent = p.id;
    el.appendChild(b);
  });

  const w=(Math.max(...p.cells.map(c=>c[0]))+1)*(CELL+2);
  const h=(Math.max(...p.cells.map(c=>c[1]))+1)*(CELL+2);
  el.style.left=(TRAY_SIZE-w)/2+"px";
  el.style.top =(TRAY_SIZE-h)/2+"px";

  slots[slot].appendChild(el);
  p.el=el;

  // hook controls
  const [rotateBtn,flipBtn]=slots[slot].querySelectorAll("button");
  rotateBtn.onclick=()=>{ p.rotation=(p.rotation+1)%4; rerender(p,slot); };
  flipBtn.onclick=()=>{ p.flipped=!p.flipped; rerender(p,slot); };

  updateTrayButtons(p);
}

function rerender(p,slot){
  p.el.remove();
  renderPiece(p,slot);
}

// =======================
// GHOST PREVIEW
// =======================
let ghost=null;

function showGhost(p,x,y,valid){
  clearGhost();
  ghost=document.createElement("div");
  ghost.className="ghost";
  ghost.style.position="absolute";
  ghost.style.pointerEvents="none";

  p.cells.forEach(c=>{
    const g=document.createElement("div");
    g.style.width=CELL+"px";
    g.style.height=CELL+"px";
    g.style.position="absolute";
    g.style.left=c[0]*(CELL+2)+"px";
    g.style.top =c[1]*(CELL+2)+"px";
    g.style.background=valid?"rgba(0,200,0,.3)":"rgba(200,0,0,.3)";
    ghost.appendChild(g);
  });

  const origin = boardOrigin();
  ghost.style.left = origin.x + x * (CELL+2) + "px";
  ghost.style.top  = origin.y + y * (CELL+2) + "px";
  document.body.appendChild(ghost);
}

function clearGhost(){
  if(ghost){ ghost.remove(); ghost=null; }
}

function updateTrayButtons(p) {
  const slot = slots[pieces.indexOf(p)];
  if (!slot) return;

  const buttons = slot.querySelectorAll(".tray-btn");
  buttons.forEach(btn => {
    btn.disabled = !!p.pos;
    btn.style.opacity = p.pos ? "0.3" : "1";
    btn.style.pointerEvents = p.pos ? "none" : "auto";
  });
}

// =======================
// DRAG
// =======================
let active=null, ox=0, oy=0;

document.addEventListener("pointerdown", e => {
  const el = e.target.closest(".piece");
  if (!el) return;

  active = pieces.find(p => p.id === el.dataset.id);

  removeFromBoard(active);
  updateTrayButtons(active);

  const r = el.getBoundingClientRect();
  ox = e.clientX - r.left;
  oy = e.clientY - r.top;

  active.el.style.left=e.clientX-ox+"px";
  active.el.style.top =e.clientY-oy+"px";
  el.style.position = "absolute";

  document.body.appendChild(el);
});

document.addEventListener("pointermove",e=>{
  if(!active) return;
  active.el.style.left=e.clientX-ox+"px";
  active.el.style.top =e.clientY-oy+"px";

  const origin = boardOrigin();
  const r = active.el.getBoundingClientRect();
  const x = Math.floor((e.clientX - origin.x) / CELL);
  const y = Math.floor((e.clientY - origin.y) / CELL);
  if(x>=0&&y>=0&&x<COLS&&y<ROWS){
    showGhost(active,x,y,canPlace(active,x,y));
  } else clearGhost();
});

document.addEventListener("pointerup",e=>{
  if(!active) return;
  clearGhost();

  const origin = boardOrigin();
  const x = Math.floor((e.clientX - origin.x) / CELL);
  const y = Math.floor((e.clientY - origin.y) / CELL);

  if(canPlace(active,x,y)) place(active,x,y);
  else rerender(active,pieces.indexOf(active));

  active=null;
});

// =======================
// TIMER LOGIC
// =======================
let startTime = Date.now();
let timerInterval = null;
let pausedTime = null;

function startTimer() {
  clearInterval(timerInterval);
  startTime = Date.now();
  document.getElementById("timerBtn").textContent = "||";
  document.getElementById("timer").textContent = "00:00";
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  document.getElementById("timer").textContent = `${m}:${s}`;
}

function pauseTimer() {
  var t = document.getElementById("timer").textContent.split(":");
  pausedTime = (t[0]*60 + t[1])*1000; // Millisecs
  clearInterval(timerInterval);
  document.getElementById("timerBtn").onclick = resumeTimer;
  document.getElementById("timerBtn").textContent = ">";
}

function resumeTimer() {
  startTime = Math.floor(Date.now()-pausedTime);
  pausedTime = null;
  document.getElementById("timerBtn").onclick = pauseTimer;
  document.getElementById("timerBtn").textContent = "||";
  timerInterval = setInterval(updateTimer, 1000);
}

// =======================
// BOARD LOGIC
// =======================
function boardOrigin() {
  const rect = board.getBoundingClientRect();
  return {
    x: rect.left+6,
    y: rect.top+6
  };
}
function canPlace(p,x,y){
  for(const c of p.cells){
    const X=x+c[0], Y=y+c[1];
    if(X<0||Y<0||X>=COLS||Y>=ROWS) return false;
    if(boardState[Y][X]===null||boardState[Y][X].covered) return false;
  }
  return true;
}
function place(p, x, y) {
  p.cells.forEach(c => {
    boardState[y + c[1]][x + c[0]].covered = true;
  });

  p.pos = { x, y };

  const origin = boardOrigin();
  p.el.style.left = origin.x + x * (CELL+2) + "px";
  p.el.style.top  = origin.y + y * (CELL+2) + "px";

  updateTrayButtons(p);
}
function removeFromBoard(p) {
  if (!p.pos) return;
  p.cells.forEach(c => {
    boardState[p.pos.y + c[1]][p.pos.x + c[0]].covered = false;
  });
  p.pos = null;
}

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
function setTargetDate(d)
{
  TARGET.day = days[d.getDay()];
  TARGET.date = d.getDate().toString();
  TARGET.month = months[d.getMonth()];
}
// reset pieces
function resetPieces() {
  pieces.forEach((p, i) => {
    p.rotation = 0;
    p.flipped = false;
    p.pos = null;
    if (p.el) p.el.remove();
    renderPiece(p, i);
  });
}

// clear board coverage
function clearBoard() {
  boardState.flat().forEach(c => {
    if (c) c.covered = false;
  });
}

// Reset Game
function resetGame() {
  var c_input=document.getElementById("calendar-input")
  c_input.value = getCurrentDateStr()
  setTargetDate(new Date());
  renderBoard();
  clearBoard();
  // clear board coverage
//  boardState.flat().forEach(c => {
//    if (c) c.covered = false;
//  });

  resetPieces();
  clearGhost();
  startTimer();
}

// =======================
// INIT
// =======================
document.getElementById("resetBtn").onclick = resetGame;
document.getElementById("timerBtn").onclick = pauseTimer;

var c_input=document.getElementById("calendar-input");
//c_input.hidden = true;
c_input.placeholder = getCurrentDateStr();
var calendar = c_input.parentElement;
calendar.addEventListener('click', (e) => {
//    if(e.target.classList.contains("cal-img"))
        constructPicker(e, "01-01-1901", "N/A", "")
});

setTargetDate(new Date());
renderBoard();
renderTray();
resetPieces();
//pieces.forEach((p,i)=>renderPiece(p,i));
startTimer();
