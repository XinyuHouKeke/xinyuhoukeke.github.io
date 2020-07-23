/**
 * Create by Xinyu Apr 10, 2020
 */
var canvas, ctx;
var maxEdge; //get window size, not the canvas size
var canvasScale;
var toothNumber;
//other sawtooth
var outerDia; //length of canvas edge
var innerDia;
var sawDiff;
//inner random gear
var innerGearOuterDia;
var innerGearX, innerGearY;
var currentDegToPosX, lastDegToPosX;
var innerGearRotDeg;
var innerGearToothNum;
var innerCenterToCanvasCenterDis;
//inner gear color
var redY, greE, bluS, alp, bluY, redE, greS, greY, bluE, redS; 
//draw
var mouseDown;
var nextGearX, nextGearY;
var lastLineX, lastLineY, nextLineX, nextLineY;
var lineToInnerGearCenterDis;
var lastInnerGearDegToPosX, currentInnerGearDegToPosX, startLineDegToGearPosX, startLineDegToPosX;
var clockwise;
var gearFirstRound;
var roundCounter;
//mouse
var currentX, currentY;
//slider
var toothSlider, outputToothVal, settedToothVal;

window.onload = function windowOnload() {
  document.getElementById("instruction").innerHTML = "- Start by dargging the white dot which is in the right side of the white gear, and continually dragging it around the outer gear. <br> - Keep your moving mouse <b>always in the inner colorful gear</b>. (move slower if it is hard to control) <br> - If the inner gear does no longer draggable, continue your work by dragging the end point of the white line where you just stopped at.";
  document.getElementById("note").innerHTML = "Have more fun by: <br> - Clike the 'Reset Canvas' button for creating different patterns with different random inner gears. <br> - Click the 'Change Color' button at any time to change the color of the inner gear. <br> - Slide the round button on the slider bar to change outer gear's tooth number, then click 'Set Tooth Number' button to set the new outer gear for creating different patterns." ;
  document.getElementById("resetCanvas").style.color = "purple";
  document.getElementById("resetCanvas").style.padding = "5px 10px";
  document.getElementById("changeColor").style.color = "lightCoral";
  document.getElementById("changeColor").style.padding = "5px 10px";
  //slider
  document.getElementById("setToothNum").style.color = "forestGreen";
  document.getElementById("setToothNum").style.padding = "5px 10px";

  document.getElementById("toothNumber").innerHTML = "Outer Tooth Number: ";
  toothSlider = document.getElementById("toothSlider");
  outputToothVal = document.getElementById("toothNumberVal");
  loadToothSlider();
  initGameOne();
  };

function initGameOne() {
  initVars();
  canvas = document.getElementById("sketchBoard");
  ctx = canvas.getContext('2d');
  ctx.canvas.width  = outerDia;
  ctx.canvas.height = outerDia;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "white";
  outerSawtooth();
  randomInnerGear();
  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mousemove', onMouseMove, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
}

function loadToothSlider(){
  outputToothVal.innerHTML = toothSlider.value;
  toothSlider.addEventListener('input', function () {
    outputToothVal.innerHTML = toothSlider.value;
  }, false);
  settedToothVal = toothSlider.value; //init settedToothVal
}

//initiate / reset variables
function initVars() {
maxEdge = window.innerWidth < window.innerHeight? window.innerWidth:window.innerHeight;
canvasScale = 0.8;
toothNumber = settedToothVal; //15-50
//other sawtooth
outerDia = maxEdge*canvasScale; //length of canvas edge
innerDia = outerDia * 9 / 10;
sawDiff = outerDia - innerDia;
//inner random gear
currentDegToPosX = 0;
lastDegToPosX = 0;
innerGearRotDeg = 0;
innerCenterToCanvasCenterDis = 0;
//inner gear color
redY = 200;
greE = 20;
bluS = 200;
bluY = 0;
redE = 0;
greS = 0;
greY = 255;
bluE = 255;
redS = 255;
alp = 0.2; 
//draw
mouseDown = false;
lineToInnerGearCenterDis = 0;
lastInnerGearDegToPosX = 0;
currentInnerGearDegToPosX = 0;
clockwise = false;
gearFirstRound = true;
startLineDegToGearPosX = 0;
startLineDegToPosX = 0;
roundCounter = 0;
}

//outer sawtooth
function outerSawtooth(){
  drawGear (toothNumber, outerDia, innerDia, ctx.canvas.width/2, ctx.canvas.height/2, "outer");
}

//random a inner gear
function randomInnerGear(){
  //random the diameter of the inner gear between 2/3 of the "innerDia" and (outerDia/9 + sawDiff)
  innerGearOuterDia = Math.floor(Math.random() * innerDia * (2/3)) + (outerDia/9 + sawDiff);
  //initiate the random inner gear
  innerGearX = outerDia - innerGearOuterDia/2;
  innerGearY = ctx.canvas.height/2;
  //use the length of arc to calculate innerGearToothNum = (r(gear)/r(outer sawtooth)) * toothNumber
  innerGearToothNum = Math.floor((toothNumber * (innerGearOuterDia/2)) / (outerDia/2));
  //calculate the distance between inner gear center to the canvas center.
  innerCenterToCanvasCenterDis = (innerGearX - outerDia/2);
  var innerGearInnerDia = innerGearOuterDia - sawDiff;
  drawGear(innerGearToothNum, innerGearOuterDia, innerGearInnerDia, innerGearX, innerGearY, "inner");
  //random a hole on the inner gear.
  var innerSquareEdge = innerGearInnerDia / Math.sqrt(2.0);
  randomHolePoint(innerGearX, innerGearY, innerSquareEdge);
}

function randomHolePoint(gearX, gearY, gearDia){
  //don't want it locates on the center of the inner gear
  do{
  lastLineX = Math.random() * gearDia/2.0 + gearX;
  lastLineY = outerDia/2.0;
  }
  while (Math.floor(lastLineX) <= Math.floor(gearX));

  lineToInnerGearCenterDis = Math.sqrt((lastLineX - gearX) * (lastLineX - gearX) + (lastLineY - gearY) * (lastLineY - gearY));
  lastInnerGearDegToPosX = Math.atan2(innerGearY-outerDia/2, innerGearX-outerDia/2);
  startLineDegToGearPosX = Math.atan2(lastLineY-gearY, lastLineX-gearX);
  startLineDegToPosX = Math.atan2(lastLineY - outerDia/2, lastLineX - outerDia/2);

  //init first round counter
  if (gearFirstRound){
    if(startLineDegToPosX < 0){
    roundCounter = -1;
  }else{
    roundCounter = 0;
    }
  }
  //start hole point
  ctx.beginPath();
  ctx.arc(lastLineX, lastLineY, 1, 0, 2 * Math.PI);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
}

//draw a gear. (x,y) -> center coordinate of the gear.
function drawGear (toothNum, outerDi, innerDi, x, y, cond) {
  var tempDegree = 0;
  var increaseDegree = Math.PI / toothNum;
  var upDiff = 0;
  var downDiff = 0;

  if (cond == "outer"){
    upDiff = increaseDegree/5;
    downDiff = increaseDegree/8;
    innerGearRotDeg = 0;  
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
  } else if (cond == "inner") {
    upDiff = increaseDegree/3;
    downDiff = increaseDegree/8;
    innerGearRotDeg = 0;
    var r=255;
    ctx.strokeStyle = "rgba(255, 0," + bluS + "," + alp + " )";
    ctx.lineWidth = 1;
  } else { //when moving
    upDiff = increaseDegree/3;
    downDiff = increaseDegree/8;
    innerGearRotDeg = (((2.0 * Math.PI / innerGearToothNum) - (2.0 * Math.PI/ toothNumber))/(2.0 * Math.PI / toothNumber));
    var gradientRectEdge = (outerDia - outerDia/Math.sqrt(2.0))/2.0;
    var gearColor = ctx.createLinearGradient(gradientRectEdge, gradientRectEdge, outerDia - gradientRectEdge, outerDia - gradientRectEdge);
    gearColor.addColorStop("0", "rgba(" + redY + ", " + greY + "," + bluY + "," + alp + " )");
    gearColor.addColorStop("0.5" ,"rgba(" + redE + "," + greE + ", " + bluE + "," + alp + " )");
    gearColor.addColorStop("1.0", "rgba(" + redS + "," + greS + "," + bluS + "," + alp + " )");
    ctx.strokeStyle = gearColor;
    ctx.lineWidth = 1;
  }

  ctx.beginPath();
  var i = 0;
  for (i=0; i < toothNum; i++){
  ctx.arc(x, y, outerDi/2, tempDegree + upDiff - (innerGearRotDeg * currentDegToPosX), tempDegree + increaseDegree - upDiff - (innerGearRotDeg * currentDegToPosX));
  ctx.arc(x, y, innerDi/2, tempDegree + increaseDegree + downDiff - (innerGearRotDeg * currentDegToPosX), tempDegree + 2 * increaseDegree - downDiff - (innerGearRotDeg * currentDegToPosX));
  tempDegree = tempDegree + 2 * increaseDegree;
  }
  ctx.closePath();
  ctx.stroke();
}

function draw() {
  drawGear(innerGearToothNum, innerGearOuterDia, innerGearOuterDia - sawDiff, nextGearX, nextGearY, "moving"); 
  drawLine();
}

function drawLine(){
  //draw line
  ctx.beginPath();
  ctx.moveTo(lastLineX,lastLineY);
  ctx.lineTo(nextLineX, nextLineY);
  ctx.closePath();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.stroke();
  //update line var
  lastLineX = nextLineX;
  lastLineY = nextLineY;
}

function resetTransMarix(){
  // Reset transformation matrix to the identity matrix 
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function resetCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  initGameOne();
}

function changeColor(){
  redY = Math.floor(Math.random() * 200) + 20;
  greE = Math.floor(Math.random() * 200) + 20;
  bluS = Math.floor(Math.random() * 200) + 20;
  bluY = Math.floor(Math.random() * 205) + 50;
  redE = Math.floor(Math.random() * 205) + 50;
  greS = Math.floor(Math.random() * 205) + 50;
  greY = Math.floor(Math.random() * 50) + 205;;
  bluE = Math.floor(Math.random() * 50) + 205;;
  redS = Math.floor(Math.random() * 50) + 205;;
}

function setToothValue(){
  settedToothVal = toothSlider.value;
  resetCanvas();
  console.log(toothNumber);
}

//event
function onMouseDown(e) {
  var mousePos = currentMousePos(e);
  currentX = mousePos.mouseX;
  currentY = mousePos.mouseY;
  mouseDown = true;
}

function onMouseUp() {
  mouseDown = false;
}

function onMouseMove(e) {
  var mousePos = currentMousePos(e);
  currentX = mousePos.mouseX;
  currentY = mousePos.mouseY;
  var mouseInOuterSawtooth = (Math.sqrt((currentX-outerDia/2)*(currentX-outerDia/2) + (currentY-outerDia/2)*(currentY-outerDia/2)) < outerDia/2);
  var mouseInInnerGear = (Math.sqrt((currentX-innerGearX)*(currentX-innerGearX) + (currentY-innerGearY)*(currentY-innerGearY)) < innerGearOuterDia/2);
  if (mouseDown && mouseInOuterSawtooth && mouseInInnerGear) {
      getGearTransPos(mousePos);
      getLineTransPos();
      draw();
  }
}

function getGearTransPos(curMousePos){
  currentX = curMousePos.mouseX;
  currentY = curMousePos.mouseY;
  currentDegToPosX = Math.atan2(currentY-outerDia/2,currentX-outerDia/2);
  lastInnerGearDegToPosX = Math.atan2(innerGearY-outerDia/2, innerGearX-outerDia/2);
  nextGearX = outerDia/2 + Math.cos(currentDegToPosX)*(outerDia - innerGearOuterDia)/2;
  nextGearY = outerDia/2 + Math.sin(currentDegToPosX)*(outerDia - innerGearOuterDia)/2;
  innerGearX = nextGearX;
  innerGearY = nextGearY;
  currentInnerGearDegToPosX = Math.atan2(innerGearY-outerDia/2,innerGearX-outerDia/2);

console.log("lastInnerGearDegToPosX: "+lastInnerGearDegToPosX);
console.log("currentInnerGearDegToPosX: " + currentInnerGearDegToPosX);

  if ((innerGearX > outerDia/2) && (lastInnerGearDegToPosX <= 0 ) && (currentInnerGearDegToPosX > 0) && (!gearFirstRound || (gearFirstRound && roundCounter == -1))) {
    roundCounter = roundCounter + 1;
    gearFirstRound = false;
  }
  if ((innerGearX > outerDia/2) && (lastInnerGearDegToPosX >= 0 ) && (currentInnerGearDegToPosX < 0) && (!gearFirstRound || (gearFirstRound && roundCounter == 0))) {
    roundCounter = roundCounter - 1;
    gearFirstRound = false;
    }
  //update gear moving direction
  if((innerGearX > outerDia/2) && (lastInnerGearDegToPosX < currentInnerGearDegToPosX)){
    clockwise = true;
  } 
  if((innerGearX > outerDia/2) && (lastInnerGearDegToPosX > currentInnerGearDegToPosX)){
    clockwise = false;
  }
}

function getLineTransPos(){
  var posCurrentDegToPosX;

  if (gearFirstRound){
    if(startLineDegToPosX < 0){
    roundCounter = -1;
  }else{
    roundCounter = 0;
    }
  if(lastInnerGearDegToPosX != 0){
    gearFirstRound = false;
  }
  }

  console.log(roundCounter);
  var tempRoundCounter = roundCounter;
  if (clockwise && currentInnerGearDegToPosX == 0 && !gearFirstRound) {
    tempRoundCounter = tempRoundCounter + 1;
  }

  if (currentInnerGearDegToPosX < 0) {
    posCurrentDegToPosX = currentInnerGearDegToPosX + (tempRoundCounter + 1) * (2 * Math.PI);
  } else {
  posCurrentDegToPosX = currentInnerGearDegToPosX + tempRoundCounter * (2 * Math.PI);
}
  nextLineX = nextGearX + Math.cos(startLineDegToGearPosX - (innerGearRotDeg * posCurrentDegToPosX))*lineToInnerGearCenterDis;
  nextLineY = nextGearY + Math.sin(startLineDegToGearPosX - (innerGearRotDeg * posCurrentDegToPosX))*lineToInnerGearCenterDis;
}

function currentMousePos(e) {
    var res = {};
  if (e.offsetX) {
      res.mouseX = e.offsetX
      res.mouseY = e.offsetY
  }
  return res;
 }
 
