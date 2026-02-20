const canvas = document.getElementById('canvas');
const overlay = document.getElementById('overlay');
const line1_1 = document.getElementById('line1_1');
const line2_1 = document.getElementById('line2_1');
const line2_2 = document.getElementById('line2_2');
const line3_1 = document.getElementById('line3_1');
const line3_2 = document.getElementById('line3_2');
const line4_1 = document.getElementById('line4_1');
const line4_2 = document.getElementById('line4_2');
const line5_1 = document.getElementById('line5_1');
const line5_2 = document.getElementById('line5_2');
const line6_1 = document.getElementById('line6_1');
const line6_2 = document.getElementById('line6_2');
const line6_3 = document.getElementById('line6_3');
const line7_1 = document.getElementById('line7_1');
const line7_2 = document.getElementById('line7_2');
const line7_3 = document.getElementById('line7_3');
const line8_1 = document.getElementById('line8_1');
const line8_2 = document.getElementById('line8_2');
const line8_3 = document.getElementById('line8_3');
const line9_1 = document.getElementById('line9_1');
const line9_2 = document.getElementById('line9_2');
const line9_3 = document.getElementById('line9_3');
const line10_1 = document.getElementById('line10_1');
const line10_2 = document.getElementById('line10_2');
const line10_3 = document.getElementById('line10_3');

const containerRect = canvas.getBoundingClientRect();
overlay.setAttribute('viewBox', `0 0 ${containerRect.width} ${containerRect.height}`);


function drawLine (p, line, c1, c2) {
    const pOrig = {x:p.el.offsetLeft-containerRect.x, y:p.el.offsetTop-containerRect.y};

    A = {x:pOrig.x+p.el.childNodes[c1].offsetLeft+CELL/2, y:pOrig.y+p.el.childNodes[c1].offsetTop+CELL/2};
    B = {x:pOrig.x+p.el.childNodes[c2].offsetLeft+CELL/2, y:pOrig.y+p.el.childNodes[c2].offsetTop+CELL/2};

    // Line from A to B
    line.setAttribute('x1', A.x);
    line.setAttribute('y1', A.y);
    line.setAttribute('x2', B.x);
    line.setAttribute('y2', B.y);
}

function clearLine(line) {
    line.setAttribute('x1', 0);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', 0);
    line.setAttribute('y2', 0);
}

function showLines(p) {
    switch (p.id) {
        case "1":
            drawLine(p, line1_1, 0, 3);
            break;

        case "2":
            drawLine(p, line2_1, 0, 2);
            drawLine(p, line2_2, 0, 3);
            break;

        case "3":
            drawLine(p, line3_1, 0, 3);
            drawLine(p, line3_2, 0, 4);
            break;

        case "4":
            drawLine(p, line4_1, 0, 2);
            drawLine(p, line4_2, 0, 4);
            break;

        case "5":
            drawLine(p, line5_1, 0, 2);
            drawLine(p, line5_2, 1, 4);
            break;

        case "6":
            drawLine(p, line6_1, 0, 1);
            drawLine(p, line6_2, 0, 4);
            drawLine(p, line6_3, 1, 3);
            break;

        case "7":
            drawLine(p, line7_1, 0, 1);
            drawLine(p, line7_2, 0, 3);
            drawLine(p, line7_3, 3, 4);
            break;

        case "8":
            drawLine(p, line8_1, 0, 1);
            drawLine(p, line8_2, 1, 2);
            drawLine(p, line8_3, 2, 3);
            break;

        case "9":
            drawLine(p, line9_1, 0, 1);
            drawLine(p, line9_2, 1, 3);
            drawLine(p, line9_3, 3, 4);
            break;

        case "10":
            drawLine(p, line10_1, 0, 1);
            drawLine(p, line10_2, 1, 2);
            drawLine(p, line10_3, 2, 4);
            break;
    }
}

function clearLines(p) {
    switch (p.id){
    case "1":
        clearLine(line1_1);
        break;
 
    case "2":
        clearLine(line2_1);
        clearLine(line2_2);
        break;

    case "3":
        clearLine(line3_1);
        clearLine(line3_2);
        break;

    case "4":
        clearLine(line4_1);
        clearLine(line4_2);
        break;

    case "5":
        clearLine(line5_1);
        clearLine(line5_2);
        break;

    case "6":
        clearLine(line6_1);
        clearLine(line6_2);
        clearLine(line6_3);
        break;

    case "7":
        clearLine(line7_1);
        clearLine(line7_2);
        clearLine(line7_3);
        break;

    case "8":
        clearLine(line8_1);
        clearLine(line8_2);
        clearLine(line8_3);
        break;

    case "9":
        clearLine(line9_1);
        clearLine(line9_2);
        clearLine(line9_3);
        break;

    case "10":
        clearLine(line10_1);
        clearLine(line10_2);
        clearLine(line10_3);
        break;
    }
}
