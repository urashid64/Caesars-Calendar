// =======================
// CONSTANTS
// =======================
const CELL_SIZE = 60;
const ROWS = 8;
const COLS = 7;

// =======================
// BOARD LAYOUT (LOCKED)
// null = non-droppable cell
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

const boardState = boardLayout.map(row =>
  row.map(label =>
    label === null
      ? null
      : { label, covered: false }
  )
);

// =======================
// PIECES (REAL PUZZLE)
// =======================
const pieces = [
  { id: "1", name: "Long Bar", cells: [{0:0}] }
];

// Replace placeholder with real pieces
const realPieces = [
  {
    id: "1",
    name: "Long Bar",
    cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}]
  },
  {
    id: "2",
    name: "Short L",
    cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:0,y:1}]
  },
  {
    id: "3",
    name: "Long L",
    cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:0,y:1}]
  },
  {
    id: "4",
    name: "Medium L",
    cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:0,y:1},{x:0,y:2}]
  },
  {
    id: "5",
    name: "T",
    cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:1,y:1},{x:1,y:2}]
  },
  {
    id: "6",
    name: "Blocky",
    cells: [{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:1,y:1},{x:0,y:2}]
  },
  {
    id: "7",
    name: "C Shape",
    cells: [{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:2}]
  },
  {
    id: "8",
    name: "Small S",
    cells: [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:2,y:1}]
  },
  {
    id: "9",
    name: "Medium S",
    cells: [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:2,y:2}]
  },
  {
    id: "10",
    name: "Long S",
    cells: [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:2,y:1},{x:3,y:1}]
  }
];

// runtime state
realPieces.forEach(p => {
  p.position = null;
  p.el = null;
});

// =======================
// DOM
// =======================
const boardEl = document.getElementById("board");
const trayEl = document.getElementById("tray");

let activePiece = null;
let selectedPiece = null;
let offsetX = 0;
let offsetY = 0;

// =======================
// BOARD RENDER
// =======================
function renderBoard() {
  boardEl.style.gridTemplateColumns = `repeat(${COLS}, ${CELL_SIZE}px)`;
  boardEl.innerHTML = "";

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cellData = boardState[y][x];
      const div = document.createElement("div");
      div.className = "cell";

      if (cellData === null) {
        div.classList.add("locked");
        div.textContent = "";
      } else {
        div.textContent = cellData.label;
      }

      boardEl.appendChild(div);
    }
  }
}

// =======================
// GEOMETRY HELPERS
// =======================
function normalize(cells) {
  const minX = Math.min(...cells.map(c => c.x));
  const minY = Math.min(...cells.map(c => c.y));
  return cells.map(c => ({ x: c.x - minX, y: c.y - minY }));
}

function rotate(cells) {
  return normalize(cells.map(c => ({ x: c.y, y: -c.x })));
}

function flip(cells) {
  return normalize(cells.map(c => ({ x: -c.x, y: c.y })));
}

// =======================
// PIECE RENDER
// =======================
function renderPiece(piece, px, py) {
  const el = document.createElement("div");
  el.className = "piece";
  el.dataset.id = piece.id;
  el.style.left = px + "px";
  el.style.top = py + "px";

  piece.cells.forEach(c => {
    const block = document.createElement("div");
    block.style.position = "absolute";
    block.style.width = CELL_SIZE + "px";
    block.style.height = CELL_SIZE + "px";
    block.style.left = c.x * CELL_SIZE + "px";
    block.style.top = c.y * CELL_SIZE + "px";
    el.appendChild(block);
  });

  piece.el = el;
  trayEl.appendChild(el);
}

// =======================
// BOARD LOGIC
// =======================
function canPlace(piece, gx, gy) {
  for (const c of piece.cells) {
    const x = gx + c.x;
    const y = gy + c.y;

    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false;
    if (boardState[y][x] === null) return false;
    if (boardState[y][x].covered) return false;
  }
  return true;
}

function placePiece(piece, gx, gy) {
  piece.position = { x: gx, y: gy };
  piece.cells.forEach(c => {
    boardState[gy + c.y][gx + c.x].covered = true;
  });

  piece.el.style.left = boardEl.offsetLeft + gx * CELL_SIZE + "px";
  piece.el.style.top = boardEl.offsetTop + gy * CELL_SIZE + "px";
}

function removePiece(piece) {
  if (!piece.position) return;
  piece.cells.forEach(c => {
    boardState[piece.position.y + c.y][piece.position.x + c.x].covered = false;
  });
  piece.position = null;
}

// =======================
// POINTER EVENTS
// =======================
document.addEventListener("pointerdown", e => {
  const el = e.target.closest(".piece");
  if (!el) return;

  activePiece = realPieces.find(p => p.id === el.dataset.id);
  selectedPiece = activePiece;

  removePiece(activePiece);

  offsetX = e.clientX - el.offsetLeft;
  offsetY = e.clientY - el.offsetTop;
});

document.addEventListener("pointermove", e => {
  if (!activePiece) return;
  activePiece.el.style.left = e.clientX - offsetX + "px";
  activePiece.el.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("pointerup", e => {
  if (!activePiece) return;

  const rect = boardEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const gx = Math.floor(x / CELL_SIZE);
  const gy = Math.floor(y / CELL_SIZE);

  if (canPlace(activePiece, gx, gy)) {
    placePiece(activePiece, gx, gy);
  } else {
    trayEl.appendChild(activePiece.el);
  }

  activePiece = null;
});

// =======================
// CONTROLS
// =======================
document.getElementById("rotate").onclick = () => {
  if (!selectedPiece) return;
  selectedPiece.cells = rotate(selectedPiece.cells);
  selectedPiece.el.remove();
  renderPiece(selectedPiece, selectedPiece.el.offsetLeft, selectedPiece.el.offsetTop);
};

document.getElementById("flip").onclick = () => {
  if (!selectedPiece) return;
  selectedPiece.cells = flip(selectedPiece.cells);
  selectedPiece.el.remove();
  renderPiece(selectedPiece, selectedPiece.el.offsetLeft, selectedPiece.el.offsetTop);
};

document.getElementById("reset").onclick = () => location.reload();

// =======================
// INIT
// =======================
renderBoard();
realPieces.forEach((p, i) => renderPiece(p, 20, 20 + i * 80));