let xPositions = []; // arreglo para almacenar las posiciones x de las barras
let barWidth = 6; // ancho de cada barra
let barHeight = 1000; // altura de cada barra
let speed = 0.3; // velocidad de movimiento de las barras

function preload() {
  bg = loadImage("/visualcomputing/sketches/ps001/kinegrama.png");
}

function setup() {
  createCanvas(windowWidth - 15, windowHeight - 25);

  // inicializar las posiciones x de las barras
  for (let i = 0; i < width / barWidth; i += 2) {
    xPositions.push(i * 6.3);
  }
}

function draw() {
  background(bg);
  fill(0);

  // mover cada barra hacia la izquierda
  for (let i = 0; i < xPositions.length; i++) {
    xPositions[i] -= speed;

    // si una barra se sale del canvas, volver a colocarla al final
    if (xPositions[i] < -10) {
      xPositions[i] = width;
    }

    // dibujar la barra en su posición actual
    rect(xPositions[i], height / 2 - barHeight / 2, barWidth, barHeight);
  }
}
