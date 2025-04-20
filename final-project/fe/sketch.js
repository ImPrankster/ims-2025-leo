let capture;
let fullScreenButton;
let bodyPose;
let myPose = {
  keypoints: [],
};
let connections;

const CAPTURE_WIDTH = 1920;
const CAPTURE_HEIGHT = 1080;

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

function isFacePoint(point) {
  return ["nose", "left_eye", "right_eye", "left_ear", "right_ear"].includes(
    point.name
  );
}

function drawFigure(pose, conn) {
  push();
  noFill();
  stroke(255);
  strokeWeight(4);
  scale(windowWidth / CAPTURE_WIDTH, windowHeight / CAPTURE_HEIGHT);
  let nosePoint = pose.keypoints.find((e) => e.name == "nose");
  let eyePoint = pose.keypoints.find((e) => e.name == "left_eye");
  if (nosePoint && nosePoint.confidence > 0.1) {
    circle(nosePoint.x, nosePoint.y, 400);
  }
  for (let j = 0; j < conn.length; j++) {
    let pointAIndex = conn[j][0];
    let pointBIndex = conn[j][1];
    let pointA = pose.keypoints[pointAIndex];
    let pointB = pose.keypoints[pointBIndex];
    // Only draw a line if both points are confident enough
    // Draw body
    if (isFacePoint(pointA) || isFacePoint(pointB)) continue;
    if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
      line(pointA.x, pointA.y, pointB.x, pointB.y);
    }
  }
  pop();
}

// Sketch Lifecycle

function preload() {
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  setup_fullScreenButton();
  // Create the video capture and hide the element.
  capture = createCapture(VIDEO);
  capture.size(CAPTURE_WIDTH, CAPTURE_HEIGHT);
  capture.hide();
  bodyPose.detectStart(capture, (result) => {
    myPose.keypoints = result.length > 0 ? result[0].keypoints : [];
  });
  connections = bodyPose.getSkeleton();

  let params = get_url_params();
}

function draw() {
  background(255);
  image(capture, 0, 0, width, height);
  myPose.keypoints.length > 0 && drawFigure(myPose, connections);
}
