/**
 * 
 */

var G = 6.673E-11;
var EARTH_MASS = 	5.972E+24;
var MOON_MASS = 	7.348E+22
var EARTH_MOON_DISTANCE = 384400000; //384,400 Km

var EARTH_MOON_SCREEN_DISTANCE = 350;

var DISTANCE_SCALE_FACTOR = EARTH_MOON_DISTANCE / EARTH_MOON_SCREEN_DISTANCE;

var STEP_INTERVAL = 0.041; // in seconds

function MultiBrowserMouseEvent(innerEvent){
	this.innerEvent = innerEvent;
	
	this.getX = function(){
		return this.innerEvent.offsetX ? this.innerEvent.offsetX : this.innerEvent.clientX - mainCanvas.getBoundingClientRect().left;
	};
	
	this.getY = function(){
		return this.innerEvent.offsetY ? this.innerEvent.offsetY : this.innerEvent.clientY - mainCanvas.getBoundingClientRect().top;
	};
}

function wrapWithMassProperty(svgElement, mass)
{
	svgElement.mass = mass;
	svgElement.vx = 0;
	svgElement.vy = 0;
	
	svgElement.getX = function(){
		return parseFloat(this.getAttribute('cx'));
	};
	
	svgElement.getY = function(){
		return parseFloat(this.getAttribute('cy'));
	};
	
	svgElement.forceBetween = function(massiveObject)
	{
		var squareDistance = this.squareDistanceFrom(massiveObject);
		var force = G * (this.mass * massiveObject.mass) / squareDistance;
		
		return -1 * force;
	};
	
	svgElement.squareDistanceFrom = function(svgShape)
	{
		var xDiff = ( this.getX() - svgShape.getX() ) * DISTANCE_SCALE_FACTOR;
		var yDiff = ( this.getY() - svgShape.getY() ) * DISTANCE_SCALE_FACTOR;
		var squareDistance = Math.pow(xDiff, 2) + Math.pow(yDiff, 2);
		
		return squareDistance;
	};
	
	svgElement.updatePosition = function(massiveObject){
		var forceMagnitude = this.forceBetween(massiveObject);
		var squareDistance = this.squareDistanceFrom(massiveObject);
		var distance = Math.sqrt(squareDistance);
		
		var xDiff = ( this.getX() - massiveObject.getX() ) * DISTANCE_SCALE_FACTOR;
		var yDiff = ( this.getY() - massiveObject.getY() ) * DISTANCE_SCALE_FACTOR;
		
		var xRatio = xDiff / distance;
		var yRatio = yDiff / distance;
		
		var fx = forceMagnitude * xRatio;
		var fy = forceMagnitude * yRatio;
		
		var ax = fx / this.mass;
		var ay = fy / this.mass;
		
		this.vx += ax * STEP_INTERVAL;
		this.vy += ay * STEP_INTERVAL;
		
		var nextX = this.getX() + 1/2 * ax * STEP_INTERVAL;
		var nextY = this.getY() + 1/2 * ay * STEP_INTERVAL;
		
		console.log("new position: (" + nextX + ", " + nextY + ")");
		
		this.setAttribute('cx', nextX);
		this.setAttribute('cy', nextY);
	};
	
	svgElement.moveStep = function(timeInterval){
		
	};
}