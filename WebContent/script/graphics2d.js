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