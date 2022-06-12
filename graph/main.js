
let canvas = el("out");
let ctx = canvas.getContext("2d");
let imgData = ctx.createImageData(2000, 2000);

let vals;

// start: 0
// expansion 1: 99900000 (27:45)
// expansion 2: 195900000 (54:25)
// end: 300600000 (83:30)

let tempNum = 0;

const temps = [
  { // Star Wars (design 1)
    x: 573,
    y: 701,
    width: 96,
    height: 141,
    startTime: 0,
    endTime: 160800000,
    templateX: -1,
    templateY: 0,
    graphCol: 29
  },
  { // Star Wars (desing 2, logo white)
    x: 573,
    y: 701,
    width: 96,
    height: 141,
    startTime: 160800000,
    endTime: 300600000,
    templateX: -1,
    templateY: 0,
    graphCol: 29
  },
  { // MLP (design 1)
    x: 1615,
    y: 212,
    width: 74,
    height: 69,
    startTime: 99900000,
    endTime: 141000000,
    templateX: 0,
    templateY: 101,
    graphCol: 10
  },
  { // MLP (design 2, slight reconfiguration)
    x: 1615,
    y: 212,
    width: 74,
    height: 69,
    startTime: 141000000,
    endTime: 173100000,
    templateX: 0,
    templateY: 101,
    graphCol: 10
  },
  { // MLP (design 3, new colors?)
    x: 1615,
    y: 212,
    width: 74,
    height: 69,
    startTime: 173100000,
    endTime: 237300000,
    templateX: 0,
    templateY: 101,
    graphCol: 10
  },
  { // MLP (design 4, more new colors)
    x: 1615,
    y: 212,
    width: 74,
    height: 69,
    startTime: 237300000,
    endTime: 300600000,
    templateX: 0,
    templateY: 101,
    graphCol: 10
  },
  { // OSU! (design 1)
    x: 677,
    y: 677,
    width: 101,
    height: 101,
    startTime: 0,
    endTime: 91800000,
    templateX: 0,
    templateY: 0,
    graphCol: 26
  },
  { // OSU! (design 2, added modes)
    x: 677,
    y: 677,
    width: 101,
    height: 101,
    startTime: 91800000,
    endTime: 104700000,
    templateX: 0,
    templateY: 0,
    graphCol: 26
  },
  { // OSU! (design 3, new colors)
    x: 677,
    y: 677,
    width: 101,
    height: 101,
    startTime: 104700000,
    endTime: 270300000,
    templateX: 0,
    templateY: 0,
    graphCol: 26
  },
  { // OSU! (design 4, more new colors)
    x: 677,
    y: 677,
    width: 101,
    height: 101,
    startTime: 270300000,
    endTime: 300600000,
    templateX: 0,
    templateY: 0,
    graphCol: 26
  },
];

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
    for(let i = 0; i < 32; i++) {
      ctx.fillStyle = colors[i];
      ctx.fillRect(i * 20, 0, 20, 20);
    }
  };
  reader.readAsArrayBuffer(e.target.files[0]);
};

el("next").onclick = (e) => {
  if(tempNum >= temps.length) return;
  handleData(temps[tempNum]);
  tempNum++;
};

function handleData(temp) {
  ctx.clearRect(0, 20, 2000, 280);
  handleTemplate(temp);
}

function handleTemplate(temp) {
  let data = createTemplate(temp);
  for(let i = 0; i < temp.width * temp.height; i++) {
    ctx.fillStyle = colors[data[i]];
    ctx.fillRect(i % temp.width, 25 + Math.floor(i / temp.width), 1, 1);
  }
  let results = getData(temp, data);
  let barTime = 300;
  for(let i = 0; i < results.length; i += barTime) {
    let avg = 0;
    for(let j = i; j < i + barTime; j++) {
      avg += results[j];
    }
    avg /= barTime;
    ctx.fillStyle = colors[16];
    ctx.fillRect(i / barTime, tempNum * 102 + 300, 1, 100);
    ctx.fillStyle = colors[temp.graphCol];
    let val = avg * 100;
    ctx.fillRect(i / barTime, tempNum * 102 + 300 + (100 - val), 1, val);
  }
}

function getData(temp, data) {
  let idx = 0;
  let time = 0;

  let pixelCount = temp.width * temp.height;
  let alpha = [];
  if(temp.templateX >= 0) {
    [pixelCount, alpha] = getAlpha(temp);
    for(let i = 0; i < temp.width * temp.height; i++) {
      ctx.fillStyle = alpha[i] ? "#000000" : "#cccccc";
      ctx.fillRect(temp.width + 2 + (i % temp.width), 25 + Math.floor(i / temp.width), 1, 1);
    }
  }

  let pixels = [];
  for(let i = 0; i < temp.width * temp.height; i++) {
    pixels[i] = 31;
  }

  // move forward until past startTime
  while(time < temp.startTime) {
    let c = vals[idx++];
    time = vals[idx++];
    let x = (c >>> 21) & 0x7ff;
    let y = (c >> 10) & 0x7ff;
    let col = (c >> 5) & 0x1f;
    if(x === 2047) continue;
    if(x >= temp.x && x < temp.x + temp.width && y >= temp.y && y < temp.y + temp.height) {
      let rx = x - temp.x;
      let ry = y - temp.y;
      pixels[ry * temp.width + rx] = col;
    }
  }
  if(idx > 0) idx -= 2; // move back to first past startTime

  // progress through every second and compare with data
  let targetTime = time + 1000;
  let results = [];
  while(time < temp.endTime) {
    while(time < targetTime) {
      if(idx >= vals.length) {
        time = targetTime;
        break;
      }
      let c = vals[idx++];
      time = vals[idx++];
      let x = (c >>> 21) & 0x7ff;
      let y = (c >> 10) & 0x7ff;
      let col = (c >> 5) & 0x1f;
      if(x === 2047) continue;
      if(x >= temp.x && x < temp.x + temp.width && y >= temp.y && y < temp.y + temp.height) {
        let rx = x - temp.x;
        let ry = y - temp.y;
        pixels[ry * temp.width + rx] = col;
      }
    }
    targetTime += 1000;
    // calculate ratio correct pixels according to data
    let correct = 0;
    for(let i = 0; i < temp.width * temp.height; i++) {
      if(alpha[i] || temp.templateX < 0) {
        if(pixels[i] === data[i]) correct++;
      }
    }
    results.push(correct / pixelCount);
  }

  return results;
}

function getAlpha(temp) {
  let canvas = document.createElement("canvas");
  canvas.width = temp.width;
  canvas.height = temp.height;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(el("alpha"), temp.templateX, temp.templateY, temp.width, temp.height, 0, 0, temp.width, temp.height);
  let imgData = ctx.getImageData(0, 0, temp.width, temp.height);
  let final = [];
  let count = 0;
  for(let i = 0; i < temp.width * temp.height; i++) {
    final[i] = imgData.data[i * 4] < 128;
    if(final[i]) count++;
  }
  return [count, final];
}

function createTemplate(temp) {

  let idx = 0;
  let time = 0;

  let pxData = [];
  for(let i = 0; i < temp.width * temp.height; i++) {
    pxData[i] = {
      colors: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      lastColor: 31,
      lastTime: temp.startTime,
      avgCol: 0
    };
  }

  // move forward until past startTime
  while(time < temp.startTime) {
    let c = vals[idx++];
    time = vals[idx++];
    let x = (c >>> 21) & 0x7ff;
    let y = (c >> 10) & 0x7ff;
    let col = (c >> 5) & 0x1f;
    if(x === 2047) continue;
    if(x >= temp.x && x < temp.x + temp.width && y >= temp.y && y < temp.y + temp.height) {
      let rx = x - temp.x;
      let ry = y - temp.y;
      let o = pxData[ry * temp.width + rx];
      o.lastColor = col;
    }
  }
  if(idx > 0) idx -= 2; // move back to first past startTime

  while(time < temp.endTime) {
    if(idx >= vals.length) break;
    let c = vals[idx++];
    time = vals[idx++];
    let x = (c >>> 21) & 0x7ff;
    let y = (c >> 10) & 0x7ff;
    let col = (c >> 5) & 0x1f;
    if(x === 2047) continue;
    if(x >= temp.x && x < temp.x + temp.width && y >= temp.y && y < temp.y + temp.height) {
      let rx = x - temp.x;
      let ry = y - temp.y;
      let o = pxData[ry * temp.width + rx];
      if(o.lastColor !== col) {
        let placeTime = o.lastTime;
        o.colors[o.lastColor] += time - placeTime;
        o.lastTime = time;
        o.lastColor = col;
      }
    }
  }

  let finalCols = [];
  for(let i = 0; i < temp.width * temp.height; i++) {
    finalCols[i] = 0;
  }

  for(let i = 0; i < temp.width * temp.height; i++) {
    let o = pxData[i];
    let placeTime = o.lastTime;
    o.colors[o.lastColor] += temp.endTime - placeTime;
    o.lastTime = temp.endTime;
    o.lastColor = 31;
    let max = 0;
    let maxInd = 0;
    for(let j = 0; j < 32; j++) {
      if(o.colors[j] > max) {
        max = o.colors[j];
        maxInd = j;
      }
    }
    finalCols[i] = maxInd;
    // ctx.fillStyle = colors[maxInd];
    // ctx.fillRect(i % temp.width, Math.floor(i / temp.width), 1, 1);
  }

  return finalCols;
}

function el(id) {
  return document.getElementById(id);
}
