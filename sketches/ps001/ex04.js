// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// ode for: https://youtu.be/IKB1hWWedMkC

let cols, rows;
let scl; // = 20;
let w = 1400;
let h = 1000;

let flying = 0;
let delta;
let band;
let hint;

let terrain = [];
let color = [];

function setSize() {
  let s = scl.value();
  cols = w / s;
  rows = h / s;
  for (let x = 0; x < cols; x++) {
    terrain[x] = [];
    color[x] = [];
    for (let y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
      color[x][y] = 0;
    }
  }
}

function setup() {
  createCanvas(600, 600, WEBGL);

  scl = createSlider(4, 80, 20, 2);
  scl.position(510, 10);
  scl.style('width', '80px');
  scl.input(setSize);
  setSize();
  textSize(50);
  text("Speed", 410, 10);
  fill(255);

  delta = createSlider(0, 0.1, 0, 0.001);
  delta.position(510, 40);
  delta.style('width', '80px');

  band = createCheckbox('band', true);
  band.position(510, 70);
  band.style('color', '#1EBCC5');

  hint = createCheckbox('stroke', false);
  hint.position(510, 100);
  hint.style('color', '#B83682');
}

function draw() {
  background(0);

  flying -= delta.value();
  let yoff = flying;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let h = map(noise(xoff, yoff), 0, 1, -100, 100);
      terrain[x][y] = h;
      color[x][y] = map(h, -100, 100, 0, 255);
      xoff += 0.2;
    }
    yoff += 0.2;
  }

  translate(0, 50);
  rotateX(PI / 3);
  translate(-w / 2, -h / 2);
  if (!hint.checked()) {
    noStroke();
  } else {
    stroke(0, 255, 0);
  }
  let s = scl.value();
  if (band.checked()) {
    fill(200, 200, 200, 50);
    for (let y = 0; y < rows - 1; y++) {
      beginShape(TRIANGLES);
      for (let x = 0; x < cols - 2; x++) {
        fill((color[x][y] + color[x][y + 1] + color[x + 1][y]) / 3);
        vertex(x * s      , y * s      , terrain[x][y]);
        vertex(x * s      , (y + 1) * s, terrain[x][y + 1]);
        vertex((x + 1) * s, y * s      , terrain[x + 1][y]);
        fill((color[x + 1][y + 1] + color[x + 2][y] + color[x + 2][y + 1]) / 3);
        vertex((x + 1) * s, (y + 1) * s, terrain[x + 1][y + 1]);
        vertex((x + 2) * s, y * s      , terrain[x + 2][y]);
        vertex((x + 2) * s, (y + 1) * s, terrain[x + 2][y + 1]);
      }
      endShape();
    }
  }
  else {
    for (let y = 0; y < rows - 1; y++) {
      beginShape(TRIANGLE_STRIP);
      for (let x = 0; x < cols; x++) {
        fill(color[x][y]);
        vertex(x * s, y * s, terrain[x][y]);
        fill(color[x][y+1]);
        vertex(x * s, (y + 1) * s, terrain[x][y + 1]);
      }
      endShape();
    }
  }
}
