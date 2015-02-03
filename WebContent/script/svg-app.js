/* 
 * Copyright (C) 2015 Alberto Mercati
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var CIRCLE_ID = "testShape";
var running = false;

var X_STEP = 2;
var Y_STEP = 2;

var VX_DEFAULT = 1;
var VY_DEFAULT = VX_DEFAULT;

var STEP_INTERVAL = 1; // / 25; /* 25 frames per second */

var lastVectorLine;

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
	var currentX = parseInt(svgShape.getAttribute("cx"), 10);
	var currentY = parseInt(svgShape.getAttribute("cy"), 10);
	if(isNaN(currentY))
	{
		console.log("currentY == NaN. attribute = " + svgShape.getAttribute("cy"));
		stop();
	}
	var radius = parseInt( svgShape.getAttribute("r"), 10 );
	
	if(currentX >= getMaxX() - radius || currentX <= 0 + radius){
		svgShape.vx = -1 * svgShape.vx;
	}
	
	if(currentY + radius >= getMaxY() || currentY - radius <= 0){
		svgShape.vy = -1 * svgShape.vy;
	}
	
	xStep = svgShape.vx * STEP_INTERVAL;
	yStep = svgShape.vy * STEP_INTERVAL;
	
	svgShape.moveXStep(xStep);
	svgShape.moveYStep(yStep);
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

function wrapShape(svgShape)
{
	svgShape.moveXStep = moveXStep;
	svgShape.moveYStep = moveYStep;
	svgShape.vx = VX_DEFAULT;
	svgShape.vy = VY_DEFAULT;
}

function addCircle(circleId, centerX, centerY, radius, color)
{
	var element = createCircle(circleId, centerX, centerY, radius, color);
	shapes.push(element);
	return element;
}

function createCircle(circleId, centerX, centerY, radius, color){
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
	wrapShape(element);
	getSvgCanvas().appendChild(element)
	return element;
}

function onSvgMouseDown(mouseEvent) {
	
	var x = mouseEvent.getX();
	var y = mouseEvent.getY();
	
	var circle = createCircle('circle_' + nextId(), x, y, 10, 'green');
	
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
	shapes.push(circle);
	getSvgCanvas().removeChild(lastVectorLine);
	getSvgCanvas().onmousemove = function(e){};
	console.log('END')
}

function MultiBrowserMouseEvent(innerEvent){
	this.innerEvent = innerEvent;
	
	this.getX = function(){
		return this.innerEvent.offsetX ? this.innerEvent.offsetX : this.innerEvent.clientX - mainCanvas.getBoundingClientRect().left;
	};
	
	this.getY = function(){
		return this.innerEvent.offsetY ? this.innerEvent.offsetY : this.innerEvent.clientY - mainCanvas.getBoundingClientRect().top;
	};
}



function nextId(){
	return shapes.length + 1;
}

function calculateOffsetX(){
	
}