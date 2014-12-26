/**
 * 
 */

var CIRCLE_ID = "testShape";
var running = false;

var X_STEP = 2;
var Y_STEP = 2;

var shapes = new Array();

(function initSvg(){
	console.log('Client Application initialization started...');
})();

function getMaxX(){
	return getMaxDimensions()[0];
}

function getMaxY() {
	return getMaxDimensions()[1];
}

function getMaxDimensions()
{
	svgCanvas = document.getElementById('svgCanvas');
	var dimensions = new Object();
	dimensions[0] = parseInt( svgCanvas.getAttribute('width'), 10 );
	dimensions[1] = parseInt( svgCanvas.getAttribute('height'), 10 );
	return dimensions;
}

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

function getSvgCanvas(){
	return document.getElementById('svgCanvas');
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
	
	if(currentX >= getMaxX() - radius || currentX <= 0 + radius){
		X_STEP = -1 * X_STEP;
	}
	
	if(currentY + radius >= getMaxY() || currentY - radius <= 0){
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

function addCircle(circleId, centerX, centerY, radius, color)
{
	var element = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
	element.setAttribute('id', circleId);
	element.setAttribute('cx', centerX);
	element.setAttribute('cy', centerY);
	element.setAttribute('r', radius);
	element.setAttribute('fill', color);
	getSvgCanvas().appendChild(element)
	shapes.push(element);
	console.log(element);
	return element;
}

function onSvgMouseMove(mouseEvent) {
	console.log(mouseEvent);
	addCircle('circle_' + nextId(), mouseEvent.offsetX, mouseEvent.offsetY, 10, 'green');
}

function nextId(){
	return shapes.length + 1;
}