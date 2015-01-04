/**
 * 
 */

var CANVAS_ID = "svgCanvas";
var TRANSFORM_ID = "canvasTranslation";
var running = false;

var X_STEP = 2;
var Y_STEP = 2;

var SPEED_SCALE_FACTOR = 1 / 200;

var SVG_CIRCLE_WIDTH = 5;

var selectedMass = MOON_MASS;
var selectedColor = 'grey';

var tracesActive = false;

var idCounter = 0;

var currentTranslation = new (
		function CanvasTranslation(){
			this.x = 0;
			this.y = 0;
		}
		)();

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
				CanvasManager.eraseShape(this);
			}
		);
	shapes = new Array();
}

function clearTraces(){
	$('[name="trace"]').each( 
			function() 
			{ 
				CanvasManager.eraseShape(this); 
			} 
	);
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
			CanvasManager.eraseShape(shapes[i]);
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
				if(tracesActive){
					this.drawTrace();
				}
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
				svgShape.vx += shapes[i].vx / (svgShape.mass - shapes[i].mass);
				svgShape.vy += shapes[i].vy / (svgShape.mass - shapes[i].mass);
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
	var element = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
	element.setAttribute('id', circleId);
	element.setAttribute('cx', centerX);
	element.setAttribute('cy', centerY);
	element.setAttribute('r', radius);
	element.setAttribute('fill', color);
	wrapWithMassProperty(element, selectedMass);
	CanvasManager.drawShape(element);
//	console.log(shapes);
	return element;
}

function onSvgMouseDown(mouseEvent) {
	
	mouseEvent.translate(currentTranslation);
	
	var x = mouseEvent.getX();
	var y = mouseEvent.getY();
	
	var circle = createCircle('circle_' + nextId(), x, y, SVG_CIRCLE_WIDTH, selectedColor);
	
	getSvgCanvas().onmousemove = function(event){ drawSpeedVector(new MultiBrowserMouseEvent(event)) };
	
	// creates a line
	lastVectorLine = document.createElementNS("http://www.w3.org/2000/svg", 'line');
	lastVectorLine.setAttribute('x1', mouseEvent.getX());
	lastVectorLine.setAttribute('y1', mouseEvent.getY());
	lastVectorLine.setAttribute('x2', mouseEvent.getX());
	lastVectorLine.setAttribute('y2', mouseEvent.getY());
	lastVectorLine.setAttribute('style', "stroke:rgb(255,0,0);stroke-width:1");
	CanvasManager.drawShape(lastVectorLine);
	//
	
	getSvgCanvas().onmouseup = function(event){ onMouseUpAdd(circle) };
}

function drawSpeedVector(mouseEvent){
	mouseEvent.translate(currentTranslation);
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
	CanvasManager.eraseShape(lastVectorLine);
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

function setJupiterMode(){
	selectedColor = 'maroon';
	selectedMass = JUPITER_MASS;
}

function toggleTraces(){
	tracesActive = !tracesActive;
}

function nextId(){
	idCounter++;
	return idCounter;
}

function CanvasManager(){
}

CanvasManager.drawShape = function(shape){
	document.getElementById(TRANSFORM_ID).appendChild(shape);
}

CanvasManager.eraseShape = function(shape){
	document.getElementById(TRANSFORM_ID).removeChild(shape);
}

CanvasManager.translate = function(xAdditionalShift, yAdditionalShift){
	currentTranslation.x += xAdditionalShift;
	currentTranslation.y += yAdditionalShift;
	var transform = document.getElementById(TRANSFORM_ID);
	transform.setAttribute("transform", "translate(" + currentTranslation.x + ", " + currentTranslation.y + ")");
}

CanvasManager.resetTranslation = function(){
	currentTranslation.x = 0;
	currentTranslation.y = 0;
	var transform = document.getElementById(TRANSFORM_ID);
	transform.setAttribute("transform", "translate(0, 0)");
}