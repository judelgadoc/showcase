/* 
automatically pixelizes either a video or image
only supports .mp4 videos
Controls
press: 
  p or P to pause / unpause
  m or M to mute / unmute
  , to decrease pixel size
  . to increase pixel size
  t to switch original, spatial coherence and average
simply change the string in load to get to the file


[1]: Based on https://github.com/mfmyip/Pixelator
*/
p5.disableFriendlyErrors = true;

let obj;
let pixelSize = 5;
let toggle = 0; // 0: original, 1: spatial coherence, 2: average
const modeText = ["Original", "Spatial C.", "Average"]
let vW = 0; // video height and width, automatically set
let vH = 0;
let load = "/visualcomputing/sketches/members/member01/cute_little_moo.mp4"
let isMute = false;
let isPause = false;

function preload() {
    obj = createVideo(load);
}

function setup() {
    createCanvas(720 - 24, 740 - 40);
    vW = 720 - 24;
    vH = 740 - 40;
    obj.size(vW, vH)
    noStroke();
    background(0);
    frameRate(10000);
    obj.loop();
    obj.hide();
}

function reset() {
    createCanvas(vW, vH);
    obj.loop();
    obj.hide();
}


function draw() {
    if (toggle === 0) {
        image(obj, 0, 0);
        textSize(50)
        fill(255, 0, 0)
        text(modeText[toggle], 10, 50)
        text(round(frameRate()), 630, 50)
    } else
        Pixelate(0, 0, vW, vH, pixelSize);
    textSize(50)
    fill(255, 0, 0)
    text(modeText[toggle], 10, 50)
    text(round(frameRate()), 630, 50)
}

function keyPressed() {
    if (key === 't' || key === 'T') {
        toggle = (toggle + 1) % 3
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
            let offset = ((y * vW) + x) * 4;
            //const average = (array) => array.reduce((a, b) => a + b) / array.length;
            if (toggle === 1) {
                fill(obj.pixels[offset], obj.pixels[offset + 1], obj.pixels[offset + 2]);
            } else if (toggle === 2) {
                fill(average([obj.pixels[offset - vW * 4 - 4], obj.pixels[offset - vW * 4], obj.pixels[offset - vW * 4 + 4],
                        obj.pixels[offset - 4], obj.pixels[offset], obj.pixels[offset + 4],
                        obj.pixels[offset + vW * 4 - 4], obj.pixels[offset + vW * 4], obj.pixels[offset + vW * 4 + 4]
                    ]),
                    average([obj.pixels[offset - vW * 4 - 4 + 1], obj.pixels[offset - vW * 4 + 1], obj.pixels[offset - vW * 4 + 4 + 1],
                        obj.pixels[offset - 4 + 1], obj.pixels[offset + 1], obj.pixels[offset + 4 + 1],
                        obj.pixels[offset + vW * 4 - 4 + 1], obj.pixels[offset + vW * 4 + 1], obj.pixels[offset + vW * 4 + 4 + 1]
                    ]),
                    average([obj.pixels[offset - vW * 4 - 4 + 2], obj.pixels[offset - vW * 4 + 2], obj.pixels[offset - vW * 4 + 4 + 2],
                        obj.pixels[offset - 4 + 2], obj.pixels[offset + 2], obj.pixels[offset + 4 + 2],
                        obj.pixels[offset + vW * 4 - 4 + 2], obj.pixels[offset + vW * 4 + 2], obj.pixels[offset + vW * 4 + 4 + 2]
                    ])
                );
            }
            rect(x, y, pSize, pSize);
        }
    }
}

function average(arr) {
    let ans = 0;
    let n = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] != null) {
            ans += arr[i];
            n += 1;
        }
    }
    return ans/n;
}
