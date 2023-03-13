let originalImage;
let modifiedImage;
let proposedImage;
let matrixRGB_LMS;
let matrixRGB_LMSInverse;
let matrixProt;
let matrixDeut;
let matrixProtXDeut;
let ap;
let ad;

function preload() {
  originalImage = loadImage(
    "/visualcomputing/sketches/ps001/prueba.jpg",
    function () {
      originalImage.loadPixels();
      modifiedImage = originalImage.get();
      modifiedImage.loadPixels();
      proposedImage = originalImage.get();
      proposedImage.loadPixels();
    }
  );
  ap = 1;
  ad = 1;
  matrixRGB_LMS = [
    [17.8824, 43.5161, 4.1194],
    [3.4557, 27.1554, 3.8671],
    [0.03, 0.1843, 1.4671],
  ];
  matrixRGB_LMSInverse = [
    [0.0809, -0.1305, 0.1167],
    [-0.0102, 0.054, -0.1136],
    [-0.0004, -0.0041, 0.6935],
  ];
  matrixProt = [
    [1 - ap, 2.0234 * ap, -2.5258 * ap],
    [0, 1, 0],
    [0, 0, 1],
  ];
  matrixDeut = [
    [1, 0, 0],
    [0.4942 * ad, 1 - ad, 1.2483 * ad],
    [0, 0, 1],
  ];
  matrixProtXDeut = [
    [1 - ap, 2.0234 * ap, -2.5258 * ap],
    [0.4942 * ad, 1 - ad, 1.2483 * ad],
    [0, 0, 1],
  ];
}

function multiplyMatrices(a, b) {
  let rowsA = a.length;
  let colsA = a[0].length;
  let rowsB = b.length;
  let colsB = b[0].length;
  let result = new Array(rowsA);
  if (colsA != rowsB) {
    console.log("Error: Las dimensiones de las matrices no coinciden");
    return null;
  }
  for (let i = 0; i < rowsA; i++) {
    result[i] = new Array(colsB);
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function setup() {
  createCanvas(680, 1000);

  //+0: Rojo, +1: Verde, +2: Azul

  //Botón 1
  let button1 = createButton("Deuteranopia");
  button1.position(80, 40);
  button1.mousePressed(function () {
    originalImage.loadPixels();
    modifiedImage = originalImage.get();
    modifiedImage.loadPixels();

    for (let i = 0; i < modifiedImage.width * modifiedImage.height; i++) {
      let r = modifiedImage.pixels[i * 4 + 0];
      let g = modifiedImage.pixels[i * 4 + 1];
      let b = modifiedImage.pixels[i * 4 + 2];
      let matrixRGB = [[r], [g], [b]];
      let matrixLMS = multiplyMatrices(matrixRGB_LMS, matrixRGB);
      let matrixLMS_modified = multiplyMatrices(matrixDeut, matrixLMS);
      let result = multiplyMatrices(matrixRGB_LMSInverse, matrixLMS_modified);
      modifiedImage.pixels[i * 4 + 0] = result[0][0];
      modifiedImage.pixels[i * 4 + 1] = result[1][0];
      modifiedImage.pixels[i * 4 + 2] = result[2][0];
    }

    modifiedImage.updatePixels();

    proposedImage = originalImage.get();
    proposedImage.loadPixels();

    for (let i = 0; i < proposedImage.width * proposedImage.height; i++) {
      let g = proposedImage.pixels[i * 4 + 1];
      let r = g * (ad / 2) + proposedImage.pixels[i * 4 + 0] * ((2 - ad) / 2);
      let b = g * (ad / 2) + proposedImage.pixels[i * 4 + 2] * ((2 - ad) / 2);
      proposedImage.pixels[i * 4 + 0] = r;
      proposedImage.pixels[i * 4 + 2] = b;
    }

    proposedImage.updatePixels();
  });

  //Botón 2
  let button2 = createButton("Protanopia");
  button2.position(button1.x + button1.width + 10, 40);
  button2.mousePressed(function () {
    originalImage.loadPixels();
    modifiedImage = originalImage.get();
    modifiedImage.loadPixels();

    for (let i = 0; i < modifiedImage.width * modifiedImage.height; i++) {
      let r = modifiedImage.pixels[i * 4 + 0];
      let g = modifiedImage.pixels[i * 4 + 1];
      let b = modifiedImage.pixels[i * 4 + 2];
      let matrixRGB = [[r], [g], [b]];
      let matrixLMS = multiplyMatrices(matrixRGB_LMS, matrixRGB);
      let matrixLMS_modified = multiplyMatrices(matrixProt, matrixLMS);
      let result = multiplyMatrices(matrixRGB_LMSInverse, matrixLMS_modified);
      modifiedImage.pixels[i * 4 + 0] = result[0][0];
      modifiedImage.pixels[i * 4 + 1] = result[1][0];
      modifiedImage.pixels[i * 4 + 2] = result[2][0];
    }

    modifiedImage.updatePixels();

    proposedImage = originalImage.get();
    proposedImage.loadPixels();

    for (let i = 0; i < proposedImage.width * proposedImage.height; i++) {
      let r = proposedImage.pixels[i * 4 + 0];
      let g = r * (ap / 2) + proposedImage.pixels[i * 4 + 1] * ((2 - ap) / 2);
      let b = r * (ap / 2) + proposedImage.pixels[i * 4 + 2] * ((2 - ap) / 2);
      proposedImage.pixels[i * 4 + 1] = g;
      proposedImage.pixels[i * 4 + 2] = b;
    }

    proposedImage.updatePixels();
  });

  //Botón3
  let button3 = createButton("Híbrido: Deut X Prot");
  button3.position(button2.x + button2.width + 10, 40);
  button3.mousePressed(function () {
    originalImage.loadPixels();
    modifiedImage = originalImage.get();
    modifiedImage.loadPixels();

    for (let i = 0; i < modifiedImage.width * modifiedImage.height; i++) {
      let r = modifiedImage.pixels[i * 4 + 0];
      let g = modifiedImage.pixels[i * 4 + 1];
      let b = modifiedImage.pixels[i * 4 + 2];
      let matrixRGB = [[r], [g], [b]];
      let matrixLMS = multiplyMatrices(matrixRGB_LMS, matrixRGB);
      let matrixLMS_modified = multiplyMatrices(matrixProtXDeut, matrixLMS);
      let result = multiplyMatrices(matrixRGB_LMSInverse, matrixLMS_modified);
      modifiedImage.pixels[i * 4 + 0] = result[0][0];
      modifiedImage.pixels[i * 4 + 1] = result[1][0];
      modifiedImage.pixels[i * 4 + 2] = result[2][0];
    }

    modifiedImage.updatePixels();

    proposedImage = originalImage.get();
    proposedImage.loadPixels();

    for (let i = 0; i < proposedImage.width * proposedImage.height; i++) {
      let r = proposedImage.pixels[i * 4 + 0];
      let g = proposedImage.pixels[i * 4 + 1];
      let b = proposedImage.pixels[i * 4 + 2];
      let fr = g * (ad / 2) + r * ((2 - ad) / 2);
      let fg = r * (ap / 2) + g * ((2 - ap) / 2);
      let fb = r * (ap / 4) + g * (ad / 4) + b * ((4 - ap - ad) / 4);
      proposedImage.pixels[i * 4 + 0] = fr;
      proposedImage.pixels[i * 4 + 1] = fg;
      proposedImage.pixels[i * 4 + 2] = fb;
    }

    proposedImage.updatePixels();
  });

  //Botón4
  let button4 = createButton("Retornar a original");
  button4.position(button3.x + button3.width + 10, 40);
  button4.mousePressed(function () {
    originalImage.loadPixels();
    modifiedImage = originalImage.get();
    modifiedImage.loadPixels();
    proposedImage = originalImage.get();
    proposedImage.loadPixels();
  });
}

function draw() {
  background("pink");

  let maxWidth = 400;
  let maxHeight = 400;

  let oImgWidth = originalImage.width;
  let oImgHeight = originalImage.height;

  if (oImgWidth > maxWidth) {
    oImgHeight *= maxWidth / oImgWidth;
    oImgWidth = maxWidth;
  }
  if (oImgHeight > maxHeight) {
    oImgWidth *= maxHeight / oImgHeight;
    oImgHeight = maxHeight;
  }

  imageMode(CENTER)
  image(originalImage, width/2, 250, oImgWidth, oImgHeight);

  textSize(25);
  fill(0);
  textAlign(CENTER)
  text("Imagen Original", width/2, 125);

  image(modifiedImage, width/2, oImgHeight + 50 + 250, oImgWidth, oImgHeight);

  textSize(25);
  fill(0);
  text("Como vería", width/2, oImgHeight + 50 + 125);

  image(proposedImage, width/2, 2*(oImgHeight + 50) + 250, oImgWidth, oImgHeight);

  textSize(25);
  fill(0);
  text("Imagen modificada", width/2, 2*(oImgHeight + 50) + 125);
}
