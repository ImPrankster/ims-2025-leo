let capture;
let myPose = {
  keypoints: [],
};
let poseArr = [];
let bodyconn;

const CAPTURE_WIDTH = 1920;
const CAPTURE_HEIGHT = 1080;

function isFacePoint(point) {
  return ["nose", "left_eye", "right_eye", "left_ear", "right_ear"].includes(
    point.name
  );
}

function setPoses(data) {
  poseArr = data;
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
  bodyconn = bodyPose.getSkeleton();

  let params = get_url_params();
  setInterval(() => {
    sendJSON(myPose);
  }, 500);
}

function preload() {
  bodyPose = ml5.bodyPose();
}

function draw() {
  background(255);
  image(capture, 0, 0, width, height);
  myPose.keypoints.length > 0 && drawFigure(myPose, bodyconn);
  poseArr.forEach((v) => {
    drawFigure(v, bodyconn);
  });
}
