let fingers;

function setup() {
  createCanvas(windowWidth-24, windowHeight-24);
  // specify multiple formats for different browsers
  fingers = createVideo(['/visualcomputing/sketches/members/member01/cute_little_moo.mp4']);
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
