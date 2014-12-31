/**
 * 
 */

var CIRCLE_ID = "testShape";
var running = false;

var X_STEP = 2;
var Y_STEP = 2;

var SPEED_SCALE_FACTOR = 1 / 200;

var selectedMass = MOON_MASS;
var selectedColor = 'grey';

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

function reset(){
	$(shapes).each(
			function(){
				getSvgCanvas().removeChild(this);
			}
		);
	shapes = new Array();
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
	/* checks for shapes to remove */
	for(i = 0; i < shapes.length; i++){
		if(shapes[i].toBeRemoved){
			getSvgCanvas().removeChild(shapes[i]);
			shapes.splice(i, 1);
		}
	}
	/* end check*/
	
	$(shapes).each(
			function()
			{
				animateShapeFrame(this);
			}
		);
	$(shapes).each(
			function(){
				this.updatePosition();
			}
	);
	
	if(running){
		setTimeout(gameLoop, STEP_INTERVAL);
	}
}

function animateShapeFrame(svgShape) {
	if(svgShape.toBeRemoved){
		return;
	}
	for (i = 0; i < shapes.length; i++) {
		if (shapes[i].id != svgShape.id) {
			if (svgShape.overlaps(shapes[i])) {
				svgShape.mass += shapes[i].mass;
//				svgShape.vx += shapes[i].vx;
//				svgShape.vy += shapes[i].vy;
				/* marks the overlapping shape for removal */
				shapes[i].toBeRemoved = true;
				continue;
			}
			
			svgShape.addForce(shapes[i]);
		}
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

function createCircle(circleId, centerX, centerY, radius, color)
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
	wrapWithMassProperty(element, selectedMass);
	getSvgCanvas().appendChild(element)
//	console.log(shapes);
	return element;
}

function addCircle(circleId, centerX, centerY, radius, color){
	var element = createCircle(circleId, centerX, centerY, radius, color);
	shapes.push(element);
	return element;
}

//function onSvgMouseDown(mouseEvent) {
//	mouseEvent = mouseEvent || window.event;
//	console.log(mouseEvent);
//	
//	var x = mouseEvent.offsetX ? mouseEvent.offsetX : mouseEvent.clientX - getSvgCanvas().getBoundingClientRect().left;
//	var y = mouseEvent.offsetY ? mouseEvent.offsetY : mouseEvent.clientY - getSvgCanvas().getBoundingClientRect().top;
//	
//	addCircle('circle_' + nextId(), x, y, 10, 'grey');
//}

function onSvgMouseDown(mouseEvent) {
	
	var x = mouseEvent.getX();
	var y = mouseEvent.getY();
	
	var circle = createCircle('circle_' + nextId(), x, y, 10, selectedColor);
	
	getSvgCanvas().onmousemove = function(event){ drawSpeedVector(new MultiBrowserMouseEvent(event)) };
	
	// creates a line
	lastVectorLine = document.createElementNS("http://www.w3.org/2000/svg", 'line');
	lastVectorLine.setAttribute('x1', mouseEvent.getX());
	lastVectorLine.setAttribute('y1', mouseEvent.getY());
	lastVectorLine.setAttribute('x2', mouseEvent.getX());
	lastVectorLine.setAttribute('y2', mouseEvent.getY());
	lastVectorLine.setAttribute('style', "stroke:rgb(255,0,0);stroke-width:1");
	getSvgCanvas().appendChild(lastVectorLine);
	//
	
	getSvgCanvas().onmouseup = function(event){ onMouseUpAdd(circle) };
}

function drawSpeedVector(mouseEvent){
	lastVectorLine.setAttribute('x2', mouseEvent.getX());
	lastVectorLine.setAttribute('y2', mouseEvent.getY());
}

function onMouseUpAdd(circle){
	
	// gets the length of the graphic vector and computer the corresponding speed:
	
	var graphicXDiff = parseFloat(lastVectorLine.getAttribute("x2")) - parseFloat(lastVectorLine.getAttribute("x1"));
	var graphicYDiff = parseFloat(lastVectorLine.getAttribute("y2")) - parseFloat(lastVectorLine.getAttribute("y1"));
	
	// the speed components are proportional to the graphic components
	circle.vx = graphicXDiff * SPEED_SCALE_FACTOR;
	circle.vy = graphicYDiff * SPEED_SCALE_FACTOR;
	
	shapes.push(circle);
	getSvgCanvas().removeChild(lastVectorLine);
	getSvgCanvas().onmousemove = function(e){};
	console.log('END')
}

function setMoonMode(){
	selectedColor = 'grey';
	selectedMass = MOON_MASS;
}

function setEarthMode(){
	selectedColor = 'blue';
	selectedMass = EARTH_MASS;
}

function nextId(){
	return shapes.length + 1;
}

function calculateOffsetX(){
	
}