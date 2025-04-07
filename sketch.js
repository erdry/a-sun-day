let t = 0;
let sunX, sunY;
let starPositions = [];
let mountainSeed;

let speedSlider, seedSlider;
let poemLines = [];
let titleAlpha = 0;

let ambientOsc;
let reverb;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  generateStars();
  mountainSeed = random(1000);

  // Ambient soft oscillator
  ambientOsc = new p5.Oscillator('sine');
  ambientOsc.freq(220);
  ambientOsc.start();
  ambientOsc.amp(0.03, 2); // Smooth fade in

  // Reverb for softness
  reverb = new p5.Reverb();
  reverb.process(ambientOsc, 8, 4);

  // Sliders
  speedSlider = createSlider(0.0005, 0.01, 0.001, 0.0001);
  seedSlider = createSlider(0, 1000, mountainSeed, 1);
  [speedSlider, seedSlider].forEach((slider, i) => {
    slider.position(20, 20 + i * 30);
    slider.style('width', '150px');
    slider.style('appearance', 'none');
    slider.style('height', '6px');
    slider.style('border-radius', '3px');
    slider.style('background', '#ccc');
  });

  // Poem text
  poemLines = [
    "the sun whispers warmth into silence",
    "shadows stretch across sleeping hills",
    "a golden hush blankets the sky",
    "night hums in soft frequencies",
    "stars blink with memory and meaning",
    "the moon breathes light into the dark",
    "dawn returns, patient and slow"
  ];
}

function draw() {
  mountainSeed = seedSlider.value();
  let speed = speedSlider.value();
  let lerpVal = sin(t) * 0.5 + 0.5;
  let isNight = sin(t) < -0.2;

  // Sky
  let skyColor = lerpColor(color('#87CEEB'), color('#001d3d'), lerpVal);
  background(skyColor);

  if (isNight) drawStars();

  // Sun / Moon
  sunX = (t * width) % width;
  sunY = height / 2 - sin(t) * 200;
  fill(isNight ? 200 : color(255, 204, 0));
  ellipse(sunX, sunY, 80);

  drawMountains();
  drawReflection();
  drawPoemLine(lerpVal);
  drawTexture();
  drawTitle();
  drawFooter(isNight);

  // Drift ambient tone
  let baseFreq = map(lerpVal, 0, 1, 140, 280);
  ambientOsc.freq(baseFreq + sin(t * 2) * 10);

  t += speed;
  if (titleAlpha < 255) titleAlpha += 2;
}

function drawMountains() {
  let layers = 5;
  for (let l = 0; l < layers; l++) {
    fill(lerpColor(color('#4a4a4a'), color('#ffffff'), l / layers));
    beginShape();
    vertex(0, height);
    for (let x = 0; x <= width; x += 20) {
      let y = height / 2 + noise(x * 0.01 + mountainSeed, l * 50 + t * 2) * 100 + l * 30;
      vertex(x, y);
    }
    vertex(width, height);
    endShape(CLOSE);
  }
}

function drawReflection() {
  let gradientHeight = 150;
  for (let y = 0; y < gradientHeight; y++) {
    let alpha = map(y, 0, gradientHeight, 100, 0);
    stroke(255, alpha);
    line(0, height / 2 + y, width, height / 2 + y);
  }

  let reflectY = height / 2 + (height / 2 - sunY);
  fill(sin(t) < -0.2 ? color(200, 80) : color(255, 204, 0, 80));
  ellipse(sunX, reflectY, 60);
}

function generateStars() {
  for (let i = 0; i < 200; i++) {
    starPositions.push({
      x: random(width),
      y: random(height / 2),
      size: random(1, 3)
    });
  }
}

function drawStars() {
  fill(255);
  for (let s of starPositions) {
    ellipse(s.x, s.y, s.size);
  }
}

function drawPoemLine(lerpVal) {
  let index = floor(map(lerpVal, 0, 1, 0, poemLines.length));
  index = constrain(index, 0, poemLines.length - 1);
  let fade = map(sin(t), -1, 1, 50, 255);

  fill(255, fade);
  textAlign(CENTER, CENTER);
  textSize(width < 600 ? 18 : 26);
  textFont('Inter, sans-serif');
  text(poemLines[index], width / 2, height - 100);

  // Drop shadow for better visibility
  fill(0, 30);
  text(poemLines[index], width / 2 + 1, height - 99);
}

function drawTexture() {
  for (let i = 0; i < 2000; i++) {
    stroke(255, 10);
    point(random(width), random(height));
  }

  for (let i = 0; i < width; i += 5) {
    stroke(255, 4);
    line(i, 0, i, height);
  }
}

function drawTitle() {
  fill(255, titleAlpha);
  textAlign(CENTER, CENTER);
  textSize(width < 600 ? 24 : 32);
  textFont('Inter, sans-serif');
  text("A Sun Day", width / 2, 80);
}

function drawFooter(isNight) {
  let footerColor = isNight ? 255 : 40;
  fill(footerColor, 200);
  textSize(width < 600 ? 12 : 14);
  textAlign(CENTER, CENTER);
  textFont('Inter, sans-serif');
  text("© 2025 Erdy — View on GitHub", width / 2, height - 30);

  
  if (mouseIsPressed && dist(mouseX, mouseY, width / 2, height - 30) < 120) {
    window.open('https://github.com/erdry/a-sun-day', '_blank');
  }
}
