
let canvas = el("out");
let ctx = canvas.getContext("2d");
let imgData = ctx.createImageData(2000, 2000);

let vals;
let idx = 0;
let time = 0;
let playing = false;
let animRef = 0;

const colors = [
  "#000000", "#00756F", "#009EAA", "#00A368", "#00CC78", "#00CCC0", "#2450A4", "#3690EA",
  "#493AC1", "#515252", "#51E9F4", "#6A5CFF", "#6D001A", "#6D482F", "#7EED56", "#811E9F",
  "#898D90", "#94B3FF", "#9C6926", "#B44AC0", "#BE0039", "#D4D7D9", "#DE107F", "#E4ABFF",
  "#FF3881", "#FF4500", "#FF99AA", "#FFA800", "#FFB470", "#FFD635", "#FFF8B8", "#FFFFFF"
];

const colorsRGB = [
  [0x00, 0x00, 0x00], [0x00, 0x75, 0x6F], [0x00, 0x9E, 0xAA], [0x00, 0xA3, 0x68], [0x00, 0xCC, 0x78], [0x00, 0xCC, 0xC0], [0x24, 0x50, 0xA4], [0x36, 0x90, 0xEA],
  [0x49, 0x3A, 0xC1], [0x51, 0x52, 0x52], [0x51, 0xE9, 0xF4], [0x6A, 0x5C, 0xFF], [0x6D, 0x00, 0x1A], [0x6D, 0x48, 0x2F], [0x7E, 0xED, 0x56], [0x81, 0x1E, 0x9F],
  [0x89, 0x8D, 0x90], [0x94, 0xB3, 0xFF], [0x9C, 0x69, 0x26], [0xB4, 0x4A, 0xC0], [0xBE, 0x00, 0x39], [0xD4, 0xD7, 0xD9], [0xDE, 0x10, 0x7F], [0xE4, 0xAB, 0xFF],
  [0xFF, 0x38, 0x81], [0xFF, 0x45, 0x00], [0xFF, 0x99, 0xAA], [0xFF, 0xA8, 0x00], [0xFF, 0xB4, 0x70], [0xFF, 0xD6, 0x35], [0xFF, 0xF8, 0xB8], [0xFF, 0xFF, 0xFF]
];

const boxes = [
  [862, 540, 868, 544],
  [862, 540, 873, 545],
  [871, 546, 878, 550],
  [23, 1523, 172, 1792],
  [44, 1652, 165, 1899],
  [51, 1691, 154, 1807],
  [297, 1750, 364, 1813],
  [1349, 1718, 1424, 1752],
  [298, 1770, 334, 1803],
  [298, 1805, 329, 1839],
  [257, 1736, 296, 1780],
  [251, 1805, 296, 1812],
  [271, 1835, 296, 1859],
  [551, 1311, 562, 1342],
  [547, 1330, 550, 1342],
  [1373, 1400, 1419, 1436],
  [1371, 1438, 1418, 1472],
  [1372, 1472, 1406, 1497],
  [1375, 1355, 1424, 1399]
];

el("in").onchange = (e) => {
  let reader = new FileReader();
  reader.onload = (r) => {
    let buffer = reader.result;
    vals = new Uint32Array(buffer);
    handleData();
  };
  reader.readAsArrayBuffer(e.target.files[0]);
};

el("playpause").onclick = (e) => {
  playing = !playing;
  e.target.textContent = playing ? "Pause" : "Play";
};

el("reset").onclick = (e) => {
  for(let i = 0; i < 2000 * 2000; i++) {
    imgData.data[i * 4 + 0] = 255;
    imgData.data[i * 4 + 1] = 255;
    imgData.data[i * 4 + 2] = 255;
    imgData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  el("time").textContent = `${getDateString(new Date(0 + 1648817050315))} - 00:00:00.000 (0)`;
  time = 0;
  // 0:  April 1, 14:44:10.315
  // 300589892: April 5, 02:14:00.207
  idx = 0;
};

el("step").onclick = (e) => {
  handleStep();
}

function handleData() {
  drawPart();
}

function drawPart() {
  if(!playing) {
    animRef = requestAnimationFrame(drawPart);
    return;
  }

  handleStep();

  animRef = requestAnimationFrame(drawPart);
}

function handleStep() {
  if(idx < vals.length) time += 300000;
  let cTime = idx >= vals.length ? 300589892 : vals[idx + 1];
  while(cTime < time) {
    if(idx >= vals.length) break;
    let c = vals[idx++];
    cTime = vals[idx++];
    let x = (c >>> 21) & 0x7ff;
    let y = (c >> 10) & 0x7ff;
    let col = (c >> 5) & 0x1f;
    if(x === 2047) {
      for(let bx = boxes[y][0]; bx <= boxes[y][2]; bx++) {
        for(let by = boxes[y][1]; by <= boxes[y][3]; by++) {
          imgData.data[(by * 2000 + bx) * 4 + 0] = colorsRGB[col][0];
          imgData.data[(by * 2000 + bx) * 4 + 1] = colorsRGB[col][1];
          imgData.data[(by * 2000 + bx) * 4 + 2] = colorsRGB[col][2];
          imgData.data[(by * 2000 + bx) * 4 + 3] = 255;
        }
      }
    } else {
      imgData.data[(y * 2000 + x) * 4 + 0] = colorsRGB[col][0];
      imgData.data[(y * 2000 + x) * 4 + 1] = colorsRGB[col][1];
      imgData.data[(y * 2000 + x) * 4 + 2] = colorsRGB[col][2];
      imgData.data[(y * 2000 + x) * 4 + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  el("time").textContent = `${getDateString(new Date(time + 1648817050315))} - ${getTimeSinceStart(time)} (${time})`;
}

function getDateString(date) {
  return `April ${date.getDate()}, ${getZeroStr(date.getHours(), 2)}:${getZeroStr(date.getMinutes(), 2)}:${getZeroStr(date.getSeconds(), 2)}.${getZeroStr(date.getMilliseconds(), 3)}`;
}

function getTimeSinceStart(time) {
  let hours = Math.floor(time / 3600000);
  time -= hours * 3600000;
  let mins = Math.floor(time / 60000);
  time -= mins * 60000;
  let secs = Math.floor(time / 1000);
  time -= secs * 1000;
  return `${getZeroStr(hours, 2)}:${getZeroStr(mins, 2)}:${getZeroStr(secs, 2)}.${getZeroStr(time, 3)}`;
}

function getZeroStr(str, length) {
  return ("00000" + str).slice(-length);
}

function el(id) {
  return document.getElementById(id);
}
