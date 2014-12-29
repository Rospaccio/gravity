/**
 * 
 */

var CANVAS_ID = 'canvas2d';
var canvasClear = true;

(function initGraphicsApp(){
	console.log("Initiating application...");
})();

function getCanvas(){
	var element = document.getElementById(CANVAS_ID);
	if(!element){
		console.log('Impossible to get Canvas element!');
	}
	return element;
}

function getContext(){
	return getCanvas().getContext("2d");
}

/* Draws on the canvas following the mouse movements */
function onCanvasMouseMove(mouseEvent){
	if(canvasClear)
	{
		mainContext.moveTo(mouseEvent.getX(), mouseEvent.getY());
		canvasClear = false;
	}
	
	mainContext.lineTo(mouseEvent.getX(), mouseEvent.getY());
	mainContext.stroke();
}

//function onMouseButtonDown(){
//	
//}
//
//function onMouseButtonUp(){
//	
//}

function activateDrawing(event){
	console.log(event);
	console.log(event);
//	document.onmousedown = function(){};
	document.onmouseup = function(event) { deactivateDrawing(event); };
	getCanvas().onmousemove = function(moveEvent){ onCanvasMouseMove(new MultiBrowserMouseEvent(moveEvent)) };
}

function deactivateDrawing(event){
	console.log('mouse up');
	console.log(event);
//	document.onmouseup = function() {};
//	document.onmousedown = activateDrawing();
	canvasClear = true;
	getCanvas().onmousemove = function(event){ };
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