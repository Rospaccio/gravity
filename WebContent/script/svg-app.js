/**
 * 
 */

var CIRCLE_ID = "testShape";
var running = false;

var MAX_X = 1000;
var MAX_Y = 500
var X_STEP = 2;
var Y_STEP = 2;

var shape = new Array();

function start(){
	if(running){
		return;
	}
	running = true;
	animateFrame();
}

function stop(){
	running = false;
}

function getTestShape(){
	svgShape = document.getElementById(CIRCLE_ID);
	svgShape.moveXStep = moveXStep;
	svgShape.moveYStep = moveYStep;
	return svgShape;
}

function animateFrame(){
	
	svgShape = getTestShape();
	var currentX = parseInt(svgShape.getAttribute("cx"), 10);
	var currentY = parseInt(svgShape.getAttribute("cy"), 10);
	var radius = 10; // parseInt(svgShape.getAttribute("r"), 10);
	
	if(currentX >= MAX_X - radius || currentX <= 0 + radius){
		X_STEP = -1 * X_STEP;
	}
	
	if(currentY + radius >= MAX_Y || currentY - radius <= 0){
		Y_STEP = -1 * Y_STEP;
	}
	
	svgShape.moveXStep(X_STEP);
	svgShape.moveYStep(Y_STEP);
	
	if(running){
		setTimeout(animateFrame, 2.4);
	}
}

function moveXStep(stepLength){
	var currentX = parseInt(this.getAttribute("cx"));
	var nextX = currentX + stepLength;
	this.setAttribute("cx", nextX);
}

function moveYStep(stepLength){
	var currentY = parseInt(this.getAttribute("cy"));
	var nextY = currentY + stepLength;
	this.setAttribute("cy", nextY);
}