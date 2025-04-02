let confettiArr = [];
let pressTime = 0;

let fullScreenButton;
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

function setup() {
  createCanvas(windowWidth, windowHeight);
  setup_fullScreenButton();
  colorMode(HSB);

  for (let i = 0; i < random(150, 170); i++) {
    confettiArr[i] = new confetti(random(width), random(height));
  }
}

function draw() {
  background(255);
  for (let i = 0; i < confettiArr.length; i++) {
    confettiArr[i].display();
    confettiArr[i].move();
    if (confettiArr[i].y > height) {
      confettiArr[i] = new confetti(random(width), 0);
    }
  }
}

function mousePressed() {
  //press mouse button to increase the density.
  for (let i = 0; i < random(50, 70); i++) {
    confettiArr.push(new confetti(random(width), random(height)));
  }
  //press 5 times resets the array
  if (pressTime >= 5) {
    let tempArr = [];
    for (let i = 0; i < random(50, 70); i++) {
      tempArr[i] = new confetti(random(width), random(height));
    }
    confettiArr = tempArr;
    pressTime = 0;
    return;
  }
  pressTime++;
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
    this.x += ((mouseX || windowWidth / 2) - windowWidth / 2) * 0.02;
  }
}
