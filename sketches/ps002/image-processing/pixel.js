let img;

function setup() {
  createCanvas(300, 300);
  img = loadImage('https://happycoding.io/images/stanley-1.jpg');
}

function draw() {
  image(img, 0, 0);

  // Get the color at the mouse position
  let c = img.get(mouseX, mouseY);

  // Change the fill to that color
  fill(c);

  // Draw a square with that color
  square(mouseX, mouseY, 50);
}