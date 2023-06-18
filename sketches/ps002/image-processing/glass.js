let img;
const portionSize = 100;

function preload() {
    img = loadImage('/visualcomputing/sketches/ps002/image-processing/image.jpg');
  }

function setup() {
    createCanvas(img.width, img.height);
}

function draw() {
  clear();

  image(img, 0, 0);

  // Calculate the coordinates of the portion to be displayed
  let portionX = mouseX - portionSize / 2;
  let portionY = mouseY - portionSize / 2;

  // Get the portion of the image based on the calculated coordinates
  let portion = img.get(portionX, portionY, portionSize, portionSize);

  let zoom = 2;
  let displaySize = portionSize * zoom;
  image(portion, mouseX - displaySize / 2, mouseY - displaySize / 2, displaySize, displaySize);

  noFill();
  stroke(255);
  square(mouseX - displaySize / 2, mouseY - displaySize / 2, displaySize);
}
