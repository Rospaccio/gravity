/**
 * 
 */

var CIRCLE_ID = "testShape";
var running = false;

var X_STEP = 2;
var Y_STEP = 2;

var VX_DEFAULT = 1;
var VY_DEFAULT = VX_DEFAULT;

var STEP_INTERVAL = 1; // / 25; /* 25 frames per second */

/*
 * s = v * t;
 * v expressed in m/s
 */

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
	// animateFrame();
	gameLoop();
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

function gameLoop()
{
	$(shapes).each(
			function()
			{
				animateShapeFrame(this);
			}
		);
	
	if(running){
		setTimeout(gameLoop, STEP_INTERVAL);
	}
}

function animateShapeFrame(svgShape){
	for (i = 0; i < shapes.length; i++){
		if(shapes[i].id == svgShape.id){
			continue;
		}
		
		svgShape.updatePosition(shapes[i]);		
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

//function wrapShape(svgShape)
//{
//	svgShape.moveXStep = moveXStep;
//	svgShape.moveYStep = moveYStep;
//	svgShape.vx = VX_DEFAULT;
//	svgShape.vy = VY_DEFAULT;
//}

function addCircle(circleId, centerX, centerY, radius, color)
{
	if(centerX <= 0 + radius){
		centerX = radius + 1;
	}
	if(centerX > getMaxX() - radius){
		centerX = getMaxX() - radius;
	}
	if(centerY <= 0 + radius){
		centerY = radius + 1;
	}
	if(centerY > getMaxY() - radius){
		centerY = getMaxY() - radius;
	}
	
	var element = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
	element.setAttribute('id', circleId);
	element.setAttribute('cx', centerX);
	element.setAttribute('cy', centerY);
	element.setAttribute('r', radius);
	element.setAttribute('fill', color);
	wrapWithMassProperty(element, EARTH_MASS);
	getSvgCanvas().appendChild(element)
	shapes.push(element);
//	console.log(shapes);
	return element;
}

function onSvgMouseDown(mouseEvent) {
	mouseEvent = mouseEvent || window.event;
	console.log(mouseEvent);
	
	var x = mouseEvent.offsetX ? mouseEvent.offsetX : mouseEvent.clientX - getSvgCanvas().getBoundingClientRect().left;
	var y = mouseEvent.offsetY ? mouseEvent.offsetY : mouseEvent.clientY - getSvgCanvas().getBoundingClientRect().top;
	
	addCircle('circle_' + nextId(), x, y, 10, 'grey');
}

function nextId(){
	return shapes.length + 1;
}

function calculateOffsetX(){
	
}