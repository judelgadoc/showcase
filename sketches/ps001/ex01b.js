let x = 50; // Posición inicial en x del personaje
let y = 50; // Posición inicial en y del personaje
let speed = 5; // Velocidad de movimiento del personaje

function setup() {
  createCanvas(windowWidth - 15, windowHeight - 25);
}

function draw() {
  background(220);
  // Dibujar el personaje como un círculo
  circle(x, y, 50);

  // Movimiento horizontal del personaje con las teclas de flechas
  if (keyIsDown(LEFT_ARROW)) {
    x -= speed;
  } else if (keyIsDown(RIGHT_ARROW)) {
    x += speed;
  }

  // Movimiento vertical del personaje con las teclas de flechas
  if (keyIsDown(UP_ARROW)) {
    y -= speed;
  } else if (keyIsDown(DOWN_ARROW)) {
    y += speed;
  }
}
