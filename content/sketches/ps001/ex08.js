/* 
automatically pixelizes either a video or image
only supports .mp4 videos
Controls
press: 
  p or P to pause / unpause
  m or M to mute / unmute
  , to decrease pixel size
  . to increase pixel size
  1 to switch between square / circular pixels
simply change the string in load to get to the file


[1]: https://github.com/mfmyip/Pixelator
*/

// playlists

p5.disableFriendlyErrors = true;

let obj;
let pixelSize = 5;
let isCircle = false;
let isVid = false;
let vW = 0; // video heigh and width, automatically set
let vH = 0;
//let load = "/visualcomputing/sketches/ps001/p23.jpg"
let load = "/visualcomputing/sketches/members/member01/cute_little_moo.mp4"
let isMute = false;
let isPause = false;

function preload() {
  obj = createVideo(load);
}

function setup() {
  print(vW, vH);
  createCanvas(vW, vH);
  print("width:", width);
  print("height:", height);
  noStroke();
  background(0);
  //gif.position(0,0);
  obj.loop();
  obj.hide();
}

getVideoDimensionsOf(load).then(({
  width,
  height
}) => {
  vW = width;
  vH = height;
  print("vd" +  " " + vW + " " +vH);
  reset();
  //setup();

});

function reset() {
  createCanvas(vW, vH);
  obj.loop();
  obj.hide();
}

/*
function reset() {
  preload();
  setc();
}
*/

function draw() {
  Pixelate(0, 0, width, height, pixelSize);
  //unPixelate();
}

function keyPressed() {
  if (key === '1') {
    isCircle = !isCircle;
  }
  if (key === ',') {
    pixelSize = max(4, pixelSize - 2);
  }
  if (key === '.') {
    pixelSize = min(50, pixelSize + 2);
  }
  if (key === 'm' || key === 'M') {
    isMute = !isMute;
    if (isMute) {
      obj.volume(0);
    } else {
      obj.volume(1);
    }
  }
  if (key === 'p' || key === 'P') {
    isPause = !isPause;
    if (isPause) {
      obj.pause();
    } else {
      obj.play();
    }
  }
  if (key === ' ') {
  	save("capture_pixel.jpg");
  }
}

function Pixelate(startX, startY, endX, endY, pSize) {
  obj.loadPixels();
  for (let x = startX; x < endX; x += pixelSize) {
    for (let y = startY; y < endY; y += pixelSize) {
      let offset = ((y * width) + x) * 4;
      if (isCircle) {
      	//math for determining the pixel density
        let dim = 80;
        fill(obj.pixels[offset] - dim, obj.pixels[offset + 1] - dim, obj.pixels[offset + 2] - dim);
        rect(x, y, pSize, pSize);
        fill(obj.pixels[offset], obj.pixels[offset + 1], obj.pixels[offset + 2]);
        ellipse(x + pSize / 2, y + pSize / 2, pSize, pSize);
      } else {
        fill(obj.pixels[offset], obj.pixels[offset + 1], obj.pixels[offset + 2]);
        rect(x, y, pSize, pSize);
      }
    }
  }
}

function unPixelate() {
  background(0);
  image(obj, width, 0);
}

/**
 Returns the dimensions of a video asynchrounsly.
 @param {String} url Url of the video to get dimensions from.
 @return {Promise} Promise which returns the dimensions of the video in 'width' and 'height' properties.
 */
function getVideoDimensionsOf(url) {
  return new Promise(function(resolve) {
    // create the video element
    let video = document.createElement('video');

    // place a listener on it
    video.addEventListener("loadedmetadata", function() {
      // retrieve dimensions
      let height = this.videoHeight;
      let width = this.videoWidth;
      // send back result
      resolve({
        height: height,
        width: width
      });
    }, false);

    // start download meta-datas
    video.src = url;
  });
}
