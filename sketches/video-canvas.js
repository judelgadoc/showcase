let fingers;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // specify multiple formats for different browsers
  fingers = createVideo(['/visualcomputing/sketches/cute_little_moo.mp4']);
  fingers.hide(); // by default video shows up in separate dom
  // element. hide it and draw it to the canvas
  // instead
}

function draw() {
  background(150);
  image(fingers, 0, 0, 0, height); // draw the video frame to canvas
}

function mousePressed() {
  fingers.loop(); // set the video to loop and start playing
}
