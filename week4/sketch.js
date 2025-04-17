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

function drawFigure(pose) {}

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
  if (!myPose) return;
  console.log(myPose);
  for (let j = 0; j < myPose.keypoints.length; j++) {
    let keypoint = myPose.keypoints[j];
    // Only draw a circle if the keypoint's confidence is bigger than 0.1
    if (keypoint.confidence > 0.1) {
      fill(0, 255, 0);
      noStroke();
      circle(
        keypoint.x * (windowWidth / CAPTURE_WIDTH),
        keypoint.y * (windowHeight / CAPTURE_HEIGHT),
        10
      );
    }
  }
}

/**
 * {
    "keypoints": [
        {
            "y": 499.73887510268054,
            "x": 1031.9730308049598,
            "name": "nose",
            "confidence": 0.6599700450897217
        },
        {
            "y": 452.9184771661732,
            "x": 1132.1747074070272,
            "name": "left_eye",
            "confidence": 0.6581242084503174
        },
        {
            "y": 457.4505654406326,
            "x": 937.3551627955007,
            "name": "right_eye",
            "confidence": 0.8827003240585327
        },
        {
            "y": 542.0405065082836,
            "x": 1247.6505993910819,
            "name": "left_ear",
            "confidence": 0.6810915470123291
        },
        {
            "y": 559.4442612595617,
            "x": 846.6300227024024,
            "name": "right_ear",
            "confidence": 0.5719391703605652
        },
        {
            "y": 899.2328748940789,
            "x": 1514.0731081235144,
            "name": "left_shoulder",
            "confidence": 0.6136206388473511
        },
        {
            "y": 935.436228836924,
            "x": 612.104855295063,
            "name": "right_shoulder",
            "confidence": 0.6544756293296814
        },
        {
            "y": 1113.1129970580303,
            "x": 1656.4287868155247,
            "name": "left_elbow",
            "confidence": 0.008039183914661407
        },
        {
            "y": 1045.9713737856666,
            "x": 390.65547026720634,
            "name": "right_elbow",
            "confidence": 0.012945531867444515
        },
        {
            "y": 1018.3695341751005,
            "x": 1428.209464698174,
            "name": "left_wrist",
            "confidence": 0.042226482182741165
        },
        {
            "y": 1016.8480015737043,
            "x": 543.5097751943067,
            "name": "right_wrist",
            "confidence": 0.022174270823597908
        },
        {
            "y": 1065.8390178447667,
            "x": 1328.2200692787612,
            "name": "left_hip",
            "confidence": 0.0007632247870787978
        },
        {
            "y": 1031.0255858787116,
            "x": 799.4474315762119,
            "name": "right_hip",
            "confidence": 0.000016831136235850863
        },
        {
            "y": 974.6976645780737,
            "x": 1496.721762471026,
            "name": "left_knee",
            "confidence": 0.011571737006306648
        },
        {
            "y": 1024.0899682749803,
            "x": 480.9816884567173,
            "name": "right_knee",
            "confidence": 0.0365912988781929
        },
        {
            "y": 501.8306797717776,
            "x": 1201.599526478578,
            "name": "left_ankle",
            "confidence": 0.000012735952623188496
        },
        {
            "y": 432.90919841045445,
            "x": 1163.787542445606,
            "name": "right_ankle",
            "confidence": 0.00043377341353334486
        }
    ],
    "box": {
        "yMin": 255.55340766906738,
        "xMin": 316.77555084228516,
        "yMax": 1076.0271549224854,
        "xMax": 1747.211036682129,
        "width": 1430.4354858398438,
        "height": 820.473747253418
    },
    "id": 1,
    "confidence": 0.6485053300857544,
    "nose": {
        "x": 1031.9730308049598,
        "y": 499.73887510268054,
        "confidence": 0.6599700450897217
    },
    "left_eye": {
        "x": 1132.1747074070272,
        "y": 452.9184771661732,
        "confidence": 0.6581242084503174
    },
    "right_eye": {
        "x": 937.3551627955007,
        "y": 457.4505654406326,
        "confidence": 0.8827003240585327
    },
    "left_ear": {
        "x": 1247.6505993910819,
        "y": 542.0405065082836,
        "confidence": 0.6810915470123291
    },
    "right_ear": {
        "x": 846.6300227024024,
        "y": 559.4442612595617,
        "confidence": 0.5719391703605652
    },
    "left_shoulder": {
        "x": 1514.0731081235144,
        "y": 899.2328748940789,
        "confidence": 0.6136206388473511
    },
    "right_shoulder": {
        "x": 612.104855295063,
        "y": 935.436228836924,
        "confidence": 0.6544756293296814
    },
    "left_elbow": {
        "x": 1656.4287868155247,
        "y": 1113.1129970580303,
        "confidence": 0.008039183914661407
    },
    "right_elbow": {
        "x": 390.65547026720634,
        "y": 1045.9713737856666,
        "confidence": 0.012945531867444515
    },
    "left_wrist": {
        "x": 1428.209464698174,
        "y": 1018.3695341751005,
        "confidence": 0.042226482182741165
    },
    "right_wrist": {
        "x": 543.5097751943067,
        "y": 1016.8480015737043,
        "confidence": 0.022174270823597908
    },
    "left_hip": {
        "x": 1328.2200692787612,
        "y": 1065.8390178447667,
        "confidence": 0.0007632247870787978
    },
    "right_hip": {
        "x": 799.4474315762119,
        "y": 1031.0255858787116,
        "confidence": 0.000016831136235850863
    },
    "left_knee": {
        "x": 1496.721762471026,
        "y": 974.6976645780737,
        "confidence": 0.011571737006306648
    },
    "right_knee": {
        "x": 480.9816884567173,
        "y": 1024.0899682749803,
        "confidence": 0.0365912988781929
    },
    "left_ankle": {
        "x": 1201.599526478578,
        "y": 501.8306797717776,
        "confidence": 0.000012735952623188496
    },
    "right_ankle": {
        "x": 1163.787542445606,
        "y": 432.90919841045445,
        "confidence": 0.00043377341353334486
    }
}
 */
