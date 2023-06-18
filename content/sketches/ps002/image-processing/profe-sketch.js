'use strict';

let maskShader;
let src;
let img_src;
let video_src;
let video_on;
let mask;

function preload() {
  video_src = createVideo(['/sketches/shaders/wagon.webm']);
  video_src.hide(); // by default video shows up in separate dom
  maskShader = readShader('/sketches/shaders/mask.frag', { varyings: Tree.texcoords2 });
  img_src = loadImage('/sketches/shaders/lupin.jpeg');
  src = img_src;
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(650, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  video_on = createCheckbox('video', false);
  video_on.style('color', 'white');
  video_on.changed(() => {
    src = video_on.checked() ? video_src : img_src;
    video_on.checked() ? video_src.loop() : video_src.pause();
  });
  video_on.position(10, 30);
  mask = createCheckbox('ridges', false);
  mask.changed(() => {
    mask.checked() ? maskShader.setUniform('mask', [-1, -1, -1, -1, 8, -1, -1, -1, -1]) : maskShader.setUniform('mask', [0, 0, 0, 0, 1, 0, 0, 0, 0]);
  });
  mask.position(10, 10);
  mask.style('color', 'white');
  shader(maskShader);
  maskShader.setUniform('mask', [0, 0, 0, 0, 1, 0, 0, 0, 0]);
}

function draw() {
  background(0);
  maskShader.setUniform('texture', src);
  emitTexOffset(maskShader, src, 'texOffset');
  beginShape();
  // format is: vertex(x, y, z, u, v)
  vertex(-1, -1, 0, 0, 1);
  vertex(1, -1, 0, 1, 1);
  vertex(1, 1, 0, 1, 0);
  vertex(-1, 1, 0, 0, 0);
  endShape();
}