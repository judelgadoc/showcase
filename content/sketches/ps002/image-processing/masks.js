let img;
let customShader;
let shaderType = 0;

function preload() {
  img = loadImage('/visualcomputing/sketches/ps002/image-processing/image.jpg');
  
  customShader = loadShader('/visualcomputing/sketches/ps002/image-processing/shader.vert', '/visualcomputing/sketches/ps002/image-processing/shader.frag');
}

function setup() {
  createCanvas(img.width, img.height, WEBGL);
  
  shader(customShader);
  
  window.addEventListener('keydown', switchMask);
  
  // Pass the canvas resolution to the shader
  customShader.setUniform('uResolutionX', width);
  customShader.setUniform('uResolutionY', height);
}

function draw() {

  background(0);

  customShader.setUniform('maskType', shaderType);
  
  customShader.setUniform('uTexture', img);
  
  // Draw a rectangle covering the whole canvas
  rect(-width / 2, -height / 2, width, height);

}

function switchMask(event) {
  if (event.key === '1') {
    shaderType = 1; // Black and White
  } else if (event.key === '2') {
    shaderType = 2; // Blur
  } else if (event.key === '3') {
    shaderType = 3; // Brighter blur
  }else if (event.key === '4') {
    shaderType = 4; // Darker blur
  } else if (event.key === '5') {
    shaderType = 5; // Negative color
  } else if (event.key === '6') {
    shaderType = 6; // Sepia
  } else if (event.key === '0') {
    shaderType = 0; // Normal
  }
}

