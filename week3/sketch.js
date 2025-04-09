let capture;
let fullScreenButton;
let classifier;

let confettiArr = [];

let faceMesh;
let fMOpt = { maxFaces: 1, refineLandmarks: false, flipped: false };
let faces = [];

// From
// https://editor.p5js.org/jht1493/sketches/5LgILr8RF

function setup_fullScreenButton() {
  fullScreenButton = createButton("Full Screen");
  fullScreenButton.mousePressed(fullScreen_action);
  fullScreenButton.style(
    "background-color: black; color: white; border: none; /* Remove default button styling */ padding: 10px 20px; /* Adjust padding as needed */ text-align: center; text-decoration: none; display: inline-block; font-size: 16px; /* Adjust font size as needed */ cursor: pointer; position: fixed; left: 0; bottom: 0;"
  );
}

function fullScreen_action() {
  fullScreenButton.remove();
  fullscreen(1);
  let delay = 3000;
  setTimeout(ui_present_window, delay);
}

function ui_present_window() {
  resizeCanvas(windowWidth, windowHeight);
  // init_dim();
}

// Respond to window resizing event
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}

class confetti {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xSize = random(10, 20);
    this.ySize = 0.7 * this.xSize;
    this.hue = random(0, 255);
    this.time = 0;
    this.amp = random(5, 10);
    this.angReset = random(0, 2 * PI); //each confetti start rotating at a different place.
  }
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.time + this.angReset);

    noStroke();
    fill(this.hue, 75, 75);

    let cXSize = this.xSize * sin(this.time + this.angReset); //mimic confetti rotation
    let cYSize = this.ySize * cos(this.time + this.angReset);

    rect(-cXSize / 2, -cYSize / 2, cXSize, cYSize);
    pop();
    this.time += this.amp / 100;
  }
  move() {
    this.y += this.amp / 2;
    if (faces[0]) {
      this.x +=
        ((faces[0].faceOval.centerX * windowWidth) / 1920 - windowWidth / 2) *
        0.02;
    }
  }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

//
function get_url_params() {
  let query = window.location.search;
  // console.log('query |' + query + '|');
  console.log("query.length", query.length);
  if (query.length < 1) return null;
  let params = params_query(query);
  return params;
}

// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
function params_query(query) {
  // eg. query='abc=foo&def=%5Basf%5D&xyz=5'
  // params={abc: "foo", def: "[asf]", xyz: "5"}
  const urlParams = new URLSearchParams(query);
  return urlParams;
}

// Sketch Lifecycle

function preload() {
  faceMesh = ml5.faceMesh(fMOpt);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  setup_fullScreenButton();
  colorMode(HSB);
  // Create the video capture and hide the element.
  capture = createCapture(VIDEO);
  capture.size(1920, 1080);
  capture.hide();
  faceMesh.detectStart(capture, gotFaces);

  let params = get_url_params();
  let count = params?.has("count") ? params.get("count") : 200;
  console.log("count", count);
  for (let i = 0; i < count; i++) {
    confettiArr[i] = new confetti(random(width), random(height));
  }
}

function draw() {
  background(255);
  image(capture, 0, 0, width, height);

  for (let i = 0; i < confettiArr.length; i++) {
    let c = confettiArr[i];
    c.display();
    c.move();
    if (c.y > height) {
      confettiArr[i] = new confetti(random(width), 0);
    }
  }
}
