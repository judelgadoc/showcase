let moveSpeed = 10;

function preload() {
  wallTexture = loadImage('https://previews.123rf.com/images/artissp/artissp1706/artissp170600037/80908497-fondo-azul-claro-de-la-textura-de-la-pared-del-azulejo-del-modelo-incons%C3%BAtil-para-el-hogar-interior.jpg'); // 
  floorTexture = loadImage('https://c0.wallpaperflare.com/preview/655/865/100/wood-wooden-floor-texture.jpg');
  mesaTexture = loadImage('https://dbdzm869oupei.cloudfront.net/img/mantels/preview/22362.png');
  camaTexture = loadImage('https://media.istockphoto.com/id/695999386/es/foto/fondo-blanco-de-tela-textura-patr%C3%B3n-abstracto.jpg?s=612x612&w=0&k=20&c=lZFZBBFz7Q7QJQUNArbJCkuvHGlVHdlWIikg9XPlyVc=');
  muebleTexture = loadImage('https://media.istockphoto.com/id/1257255113/es/foto/puertas-de-armario-de-lujo-blanco-dise%C3%B1o-moderno-puertas-de-armario-retro-textura-de-fondo.jpg?s=612x612&w=0&k=20&c=_kH_05ziCV170_cHTx6xnccpca-KnwKpjXsqTdkFLIw=');
  plantaTexture = loadImage('https://static.vecteezy.com/system/resources/previews/007/773/339/non_2x/closeup-evergreen-hedge-plants-small-green-leaves-in-hedge-wall-texture-background-eco-evergreen-hedge-wall-ornamental-plant-in-backyard-garden-many-leaves-reduce-dust-in-air-natural-backdrop-photo.jpg');
}

function setup() {
  createCanvas(730, 420, WEBGL);

  // Inicializar la cámara
  cam = createCamera();
  cam.setPosition(-250, -300, 900); // Ajustar la posición inicial de la cámara

  // Crear un marco para los sliders de posición de los objetos
  let slidersFrame = createDiv();
  slidersFrame.position(5, 5);
  slidersFrame.style('padding', '10px');
  slidersFrame.style('background-color', 'white');
  slidersFrame.style('border', '1px solid black');

  // Crear etiqueta para el slider de posición de la mesa
  let mesaLabel = createP('Mesa');
  mesaLabel.parent(slidersFrame);

  // Crear sliders para controlar la posición de la mesa
  mesaXSlider = createSlider(-349, 349, 0);
  mesaXSlider.parent(slidersFrame);
  mesaZSlider = createSlider(-274, 274, -274);
  mesaZSlider.parent(slidersFrame);

  // Crear etiqueta para el slider de posición de la mueble
  let muebleLabel = createP('mueble');
  muebleLabel.parent(slidersFrame);

  // Crear sliders para controlar la posición de la mueble
  muebleXSlider = createSlider(-374, 374, -374);
  muebleXSlider.parent(slidersFrame);
  muebleZSlider = createSlider(-199, 199, 199);
  muebleZSlider.parent(slidersFrame);

  // Crear etiqueta para el slider de posición de la cama
  let camaLabel = createP('Cama');
  camaLabel.parent(slidersFrame);

  // Crear sliders para controlar la posición de la cama
  camaXSlider = createSlider(-324, 324, 200);
  camaXSlider.parent(slidersFrame);
  camaZSlider = createSlider(-199, 199, -199);
  camaZSlider.parent(slidersFrame);

  // Crear etiqueta para el slider de posición de la planta
  let plantaLabel = createP('Planta');
  plantaLabel.parent(slidersFrame);

  // Crear slider para controlar la posición de la planta en el eje X respecto a la mesa
  plantaXSlider = createSlider(-35, 35, 0);
  plantaXSlider.parent(slidersFrame);

  // Crear un marco para los sliders de iluminación
  let lightSlidersFrame = createDiv();
  lightSlidersFrame.position(295, 5);
  lightSlidersFrame.style('padding', '10px');
  lightSlidersFrame.style('background-color', 'white');
  lightSlidersFrame.style('border', '1px solid black');

  // Crear etiqueta para el slider de posición de la luz
  let lightLabel = createP('Luz');
  lightLabel.parent(lightSlidersFrame);

  // Crear sliders para controlar la posición de la fuente de luz
  lightXSlider = createSlider(-400, 400, 0);
  lightXSlider.parent(lightSlidersFrame);
  lightYSlider = createSlider(0, 300, 300);
  lightYSlider.parent(lightSlidersFrame);
  lightZSlider = createSlider(-300, 300, 0);
  lightZSlider.parent(lightSlidersFrame);

  // Inicializar posiciones de los objetos
  mesaPos = createVector(mesaXSlider.value(), -25, mesaZSlider.value());
  mueblePos = createVector(muebleXSlider.value(), -50, muebleZSlider.value());
  camaPos = createVector(camaXSlider.value(), -25, camaZSlider.value());
  plantaPos = createVector(mesaPos.x + plantaXSlider.value(), mesaPos.y, mesaPos.z);
  lightPosition = createVector(lightXSlider.value(), lightYSlider.value(), lightZSlider.value());
}


function draw() {
  background(220);

  //Movimiento de la camara con teclas
  if (keyIsDown('65')) {
    cam.move(-moveSpeed, 0, 0);
  }

  if (keyIsDown('68')) {
    cam.move(moveSpeed, 0, 0);
  }

  if (keyIsDown('87')) {
    cam.move(0, 0, -moveSpeed);
  }

  if (keyIsDown('83')) {
    cam.move(0, 0, moveSpeed);
  }
  // Mover la cámara con el mouse solo si no se está interactuando con los sliders
  if (
    !mesaXSlider.elt.active &&
    !mesaZSlider.elt.active &&
    !muebleXSlider.elt.active &&
    !muebleZSlider.elt.active &&
    !camaXSlider.elt.active &&
    !camaZSlider.elt.active &&
    !plantaXSlider.elt.active &&
    !lightXSlider.elt.active &&
    !lightYSlider.elt.active &&
    !lightZSlider.elt.active
  ) {
    orbitControl();
  }

  // Obtener los valores de los sliders de la fuente de luz
  let lightX = lightXSlider.value();
  let lightY = -lightYSlider.value();
  let lightZ = -lightZSlider.value();

  // Configurar la dirección de la luz
  lightPosition.set(lightX, lightY, lightZ);
  pointLight(255, 255, 255, lightPosition);

  // Paredes
  push();
  noStroke();
  texture(wallTexture);
  translate(0, -149, -300);
  plane(800, 300);
  translate(0, 300, 150);
  rotateX(-HALF_PI);
  translate(-400, -150, -299);
  rotateY(HALF_PI);
  plane(300, 600);
  pop();

  // Suelo
  push();
  noStroke();
  texture(floorTexture);
  translate(0, 1, 0);
  rotateX(HALF_PI);
  plane(800, 600);
  pop();

  // Obtener los valores de los sliders de la mesa
  let mesaX = mesaXSlider.value();
  let mesaZ = mesaZSlider.value();

  // Actualizar posiciones de la mesa
  mesaPos.set(mesaX, -25, mesaZ);

  // Mesa
  push();
  translate(mesaPos.x, mesaPos.y, mesaPos.z);
  texture(mesaTexture);
  box(100, 50, 50);
  pop();

  // Obtener los valores de los sliders de la mueble
  let muebleX = muebleXSlider.value();
  let muebleZ = muebleZSlider.value();

  // Actualizar posiciones de la mueble
  mueblePos.set(muebleX, -50, muebleZ);

  // mueble
  push();
  translate(mueblePos.x, mueblePos.y, mueblePos.z);
  texture(muebleTexture);
  box(50, 100, 200);
  pop();

  // Obtener los valores de los sliders de la cama
  let camaX = camaXSlider.value();
  let camaZ = camaZSlider.value();

  // Actualizar posiciones de la cama
  camaPos.set(camaX, -25, camaZ);

  // Cama
  push();
  translate(camaPos.x, camaPos.y, camaPos.z);
  texture(camaTexture);
  box(150, 50, 200);
  pop();

  // Obtener el valor del slider de la planta
  let plantaX = plantaXSlider.value();

  // Actualizar posición de la planta
  plantaPos.set(mesaPos.x + plantaX, mesaPos.y, mesaPos.z);

  // Planta
  push();
  translate(plantaPos.x, plantaPos.y - 20, plantaPos.z);
  texture(plantaTexture);
  cone(30, 50);
  pop();

  // Mostrar la posición de la luz
  push();
  noStroke();
  fill(255, 255, 0);
  translate(lightPosition.x, lightPosition.y, lightPosition.z);
  sphere(10);
  pop();

}